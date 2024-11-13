function enabledFormat(cellvalue = false) {

    if(getTypeof(cellvalue) === 'array') {
        cellvalue = cellvalue[0];
    }
    if(cellvalue === true || cellvalue === 'YES' || cellvalue === 'true') {
        return 'YES';
    } else {
        return 'NO';
    }

}

function formatInteger(cellvalue = 0) {

    if(cellvalue === 0) {
        return 0;
    }
    if(getTypeof(cellvalue) === 'array') {
        cellvalue = cellvalue[0];
    }

    if(isNaN(cellvalue)) {
        showTipModal(fillLangString(VUEAPP.lang.toNumberError, cellvalue), 'warning');
        return 0;
    }
    return  parseInt(cellvalue);
}




/**
 * 把Plist的文本内容转换成json对象返回
 * @param {string} context
 * @returns JSON Object
 */
function formatContext(context='') {
    try {
        context = context.replace(/[\t\r]/g,'');
        const arrayContext = context.split('\n');
        let result = '';

        for(let i=0,len=arrayContext.length;i<len;i++) {
            result += arrayContext[i].trim();
        }

        result = PlistParser.parse(result);
        result = PlistParser.serialize(result);

        const fillstring = (ke,va) => {
            if(getTypeof(va) === 'array' && va[1] === 'string') {
                va[0] = b64Decode(va[0]);
            }
            return va;
        };

        result = JSON.parse(result,fillstring);
        bljsonobj(result);

        return result;

    }catch(err) {
        console.log("错误：" + err);
        showTipModal(VUEAPP.lang.tip_file_format_error + "<br>" + err, 'error');
    }

}

/**
 * 遍历JSON Object 对象,把编过码的键值全部改回来
 * @param {Object} obj
 */
function bljsonobj(obj) {
    Object.entries(obj).forEach(([key, value]) => {

        const tf = getTypeof(value);

        obj[b64Decode(key)] = value;
        obj[key] = null;
        Reflect.deleteProperty(obj, key)
        //delete obj[key];

        if(tf === 'array') {
            const lenarr = value.length;
            for(let it=0;it<lenarr;it++) {

                if(getTypeof(value[it]) === 'object') {
                    bljsonobj(value[it]);
                }

            }
        } else if(tf === 'object') {
            bljsonobj(value);

        }

    });
}

/**
 * base64转16进制
 * Thanks to chatgpt
 * @param {string} strbase64
 * @returns string
 */
function base64toHex(base64Str='') {
    if(base64Str === '') {
        return '';
    }
    try {
        // 1. 使用 atob 解码 Base64 字符串为 ASCII
        const asciiStr = atob(base64Str);

        // 2. 将 ASCII 字符串转换为字节数组并转换为 16 进制字符串
        let hexStr = '';
        for (let i = 0; i < asciiStr.length; i++) {
            const hex = asciiStr.charCodeAt(i).toString(16).padStart(2, '0');
            hexStr += hex;
        }
        return hexStr.toUpperCase();
    } catch (error) {
        console.log(`Error: Invalid Base64 string - ${error.message}`);
        return '';
    }
}

/**
 * 16进制转base64
 * Thanks to chatgpt
 * @param {*} hexStr
 * @returns
 */
function hextoBase64(hexStr) {
    if(hexStr === '') return '';
    try {
        // 1. 将 16 进制字符串转换为 ASCII 字符串
        let asciiStr = '';
        for (let i = 0; i < hexStr.length; i += 2) {
            const hexByte = hexStr.substr(i, 2);
            const charCode = parseInt(hexByte, 16);
            if (isNaN(charCode)) throw new Error('Invalid hex string');
            asciiStr += String.fromCharCode(charCode);
        }

        // 2. 使用 btoa 将 ASCII 字符串转换为 Base64
        return btoa(asciiStr);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return '';
    }
}

/**
 * 当输入 ture, 'true', '1' 时转为 '<true/>' ,其他的一律转为 '<false/>'
 * @param {string} strbool
 * @returns string
 */
function toBoolString(strbool) {
    if(strbool === true || strbool === 'true' || strbool === 'YES' || strbool === '1') {
       return '<true/>';
    } else {
        return '<false/>';
    }
}

/**
 * 输入 true 转为 '<true/>' ,其他的一律转为 '<false/>'
 * @param {string} strbool
 * @returns string
 */
function toBoolStringStrict(strbool) {
    if(strbool === true) {
        return '<true/>';
    } else {
        return '<false/>';
    }
}

/**
 * jqgrid 中的formatter使用, 返回一个可以带默认值得函数
 * @param {string} defaultvalue
 * @returns function
 */
function getPlistEncodeFunction(defaultvalue) {
    return (context='') => {

        if(context === '' || context[0] === '') {
            return defaultvalue;
        }


        if(getTypeof(context) === 'array') {
            return context[1] === 'data' ? base64toHex(context[0]) : context[0]
        }

        return context;

    }
}

/**
 * 把 base64 编码的字符串格式化为 ascii 编码
 * @param {string} context 
 * @returns string
 */
function plistEncodeAscii(context='') {
    return plistEncode(context,'ASCII');
}


/**
 * jqgrid 中的formatter使用, 把正确的值解析出来
 * @param {string} context
 * @returns string
 */
function plistEncode(context='',encoding) {

    if(context === '' || context[0] === '') {
        return '';
    }


    if(getTypeof(context) === 'array') {
        switch(context[1]) {
            case 'data':
                return encoding === 'ASCII' ? atob(context[0]) : base64toHex(context[0]);
            case 'string':
                context = context[0];
                break;
            case 'bool':
                return context[0] === true ? 'YES' : 'NO';
            default:
                return context[0];
        }

    }

    return htmlEscape(context);

}

/**
 * 1 检测num变量是否为数值
 * 2 如果不是弹出提示信息,返回0
 * 3 如果是根据第二个参数转换后返回, 默认为parseInt函数
 * @param {String} num
 * @param {Function} fnparse
 * @returns Number
 */
function toNumber(num, fnparse=parseInt) {
    if(isNaN(num)) {
        showTipModal(fillLangString(VUEAPP.lang.toNumberError, num), 'warning');
        return 0;
    }
    return fnparse(num);
}

/**
 * 在字符串两边加上<string>, 而且字符串中的 < > & 这3个符号会被转义
 * @param {String} context
 * @returns String
 */
function addCharstring(context='') {
    return '<string>' + htmlEscape(context) + '</string>';
}

/**
 * 复制内容到剪贴板中
 * @param {String} rowdata
 */
function copyDatatoClipboard(rowdata) {
	$("body").append('<div id="hiddendivforcopy"><button id="hiddenbuttonforcopy">Copy</button></div>');
	let clipboard  = new ClipboardJS('#hiddenbuttonforcopy', {
        text: function() {
            return rowdata;
        }
    });
	//自动点击copy
	$("#hiddenbuttonforcopy").trigger("click");
	//释放clipboard
	clipboard.destroy();

	$("#hiddendivforcopy").remove();
}

/**
 * 弹出信息窗口
 * @param {String} content 信息内容
 * @param {String} msgtype 信息类型
 */
function showTipModal(content, msgtype='success') {
    toastr.clear();
    toastr[msgtype](content);
}

/**
 * 弹出粘贴窗口
 */
function showTextareaModal() {

	VUEAPP.textarea_content = '';
	$('#inputModal').modal('show');
	$('#inputModal').on('shown.bs.modal', function () {
       $("#inputModal #textarea_plist_paste").focus();//获取焦点
  	});

}



/**
 * fillLangString('my {@1} is {@2}', 'name', 'mady')
 * @param  {...String} args
 * @returns String
 */
function fillLangString(...args) {
	for(let i=1,len=args.length;i<len;i++) {
		args[0] = args[0].replace('{@' + i + '}', args[i]);
	}
	return args[0];
}

/**
 * 把一个json字符串转换成json对象,在复制粘贴功能中使用
 * 如果转换失败返回 false
 * @param {string} str
 * @returns Object
 */
function stringToJSON(str) {
	let objreturn;
	try {
		objreturn = JSON.parse(str);
	} catch (e) {
		return false;
	}
	return objreturn;
}

/**
 * 根据表格关键字去全局变量 GLOBAL_MAP_TABLE 中取表格对象
 * @param {string} tbkey
 * @returns Object
 */
function getJqgridObjectbyKey(tbkey) {
    return GLOBAL_MAP_TABLE.get(tbkey);
}

function consolelog(msg) {
    console.log(msg);
}

/**
 * 生产UUID
 * @returns
 */
function uuid() {
  let temp_url = URL.createObjectURL(new Blob());
  let uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1).toUpperCase();
}


/**
 * 获取表格的最大id
 * @param {Object} jqgrid 表格对象
 * @returns integer
 */
function getMaxrowid(objGridTable) {
    const ids = objGridTable.jqGrid('getDataIDs');
    return ids.length === 0 ? 0 : Math.max(...ids);
}

/**
 * 浅拷贝一个对象,delList中是不要的属性
 * @param {Object} target  要拷贝的对象
 * @param {Array} delList 不需要拷贝的属性列表
 * @returns
 */
function clone(target, delList=[]) {

    const tempObj = {};
    for (const key in target) {
        if(delList.includes(key) === false && Reflect.has(target, key)) {
            tempObj[key] = target[key];
        }

    }
    return tempObj;

}

/**
 * 查找字符串第几次出现的位置
 * @param {Object} str 源字符串
 * @param {Object} cha 要查询的字符或字符串
 * @param {Object} num 第几次出现，第一次出现用1表示
 */
 function findStrAssIndex(str, cha, num=1) {
    let x = str.indexOf(cha);
    num -= 1;
    for (let i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
    }
    return x;
}


/**
 * 得到变量的真实类型
 * @param {object} obj
 * @returns string
 */
function getTypeof(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

/**
 * 转义字符串中的 & < > 3个符号, 在生产plist文本内容时使用
 * @param {string} context
 * @returns string
 */
function htmlEscape(context=''){
    return context === '' ? '' : context.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/**
 * 还原字符串中的 & < > 3个符号, 在读取plist的内容时使用
 * @param {string} context
 * @returns string
 */
function htmlReescape(str = '') {
    return str === '' ? '' : str.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
}

/**
 * 由于特殊字符串导致JSON.parse()出错,用这个函数在读取plist文件后把字符串类型数据进行base64编码
 * @param {string} str
 * @returns string
 */
function b64Encode(str='') {
    return str === '' ? '' : btoa(encodeURIComponent(str));
}

/**
 * b64Encode反编码, 在plist内容成功被JSON.parse后把字符串转回来
 * @param {strting} str
 * @returns string
 */
function b64Decode(str='') {
    return str === '' ? '' : decodeURIComponent(atob(str));
}

/**
 *  用\转义文件名中的特殊字符
 * @param {string} 文件名称 
 * @returns 
 */
function escapeFileName(fileName) {
    return fileName.replace(/([\\ :{}()|[\]^$+*?.<>])/g, '\\$1');
}