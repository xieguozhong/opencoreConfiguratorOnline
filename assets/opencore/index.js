

jQuery(function($) {
    $('#id-input-file-2').ace_file_input({
        no_file : PAGE_TITLE.lang.no_file,
        btn_choose : PAGE_TITLE.lang.choose,
        btn_change : PAGE_TITLE.lang.change,
        droppable : false,
        onchange : null,
        allowExt : ['plist'],
        thumbnail : false,
        before_change: function(files, dropped){
            let reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function () {
            	VUEAPP['plistcontext'] = formatContext(this.result);
            	//console.log(VUEAPP['plistcontext']);
            	VUEAPP.initAllData();
        	}
            return true;
        }
        }).on('file.error.ace', function(event, info) {
            showTipModal(PAGE_TITLE.lang.alertfileerror);
    });

    
    
    initGridTableACPI();
    initGridTableBooter();
    initGridTableDeviceProperties();
    initGridTableKernel();
    initGridTableMisc();
    initGridTableNVRAM();
    initGridTableUEFI();
    

    //绑定所有的增加按钮
    $("a[id^=btnadd-]").on("click",function(){
        let ids = this.id.split('-');
        //如果是右边表格, 先检查左边有没有选中, 如果没有, 不做任何反应
        if(ids[2].substr(-5) === 'Right') {
            let gridid = '#gridtable-' + ids[1] + '-' + ids[2].replace('Right','Left');
            
            let selectedId = $(gridid).jqGrid("getGridParam", "selrow");
            if(selectedId !== null) {
                jQuery('#gridtable-' + ids[1] + '-' + ids[2]).jqGrid('addRowData', getRandom(), {pid:selectedId}, 'last');
            }
            
        } else {
            jQuery('#gridtable-' + ids[1] + '-' + ids[2]).jqGrid('addRowData', getRandom(), {}, 'last');
        }
        
                    
    });

    //绑定所有的删除按钮
    $("a[id^=btndel-]").on("click",function(){
        let ids = this.id.split('-');
        let gridid = '#gridtable-' + ids[1] + '-' + ids[2];
        let objGridTable = $(gridid);

        let selectedIds = objGridTable.jqGrid('getGridParam','selarrrow');
        let len = selectedIds.length
        for(let i=0;i<len;i++) {
			objGridTable.jqGrid('delRowData', selectedIds[0]);
        }

        //如果删除左边表格, 要隐藏右边表格
        if(gridid.substr(-4) === 'Left') {
            let rightGrid = jQuery(gridid.replace('Left', 'Right'));
            let rowIds = rightGrid.getDataIDs();
            for(let i=0;i<rowIds.length;i++) {
                rightGrid.setRowData(rowIds[i],null,{display: 'none'});
            }
        }
    });

    //绑定所有的复制按钮
    $("a[id^=btncopy-]").on("click",function(){

        //先清空剪贴板


    	let ids = this.id.split('-');
        let gridid = '#gridtable-' + ids[1] + '-' + ids[2];
        let objGrid = $(gridid);
        let selectedId = objGrid.jqGrid("getGridParam", "selarrrow");
        if(selectedId.length === 0) {            
        	showTipModal('请选择要复制的行数据');
            copyDatatoClipboard(' ');
        	return;
        }
        let rowData, strdata = '';
    	for(let i=0;i<selectedId.length;i++) {
    		rowData = objGrid.jqGrid('getRowData', selectedId[i]);
    		if(i > 0) {
    			strdata += ',';
    		}
    		strdata += JSON.stringify(rowData);
    	}
    	
    	copyDatatoClipboard('[' + strdata + ']');     
        
        
	});

    //绑定所有的粘贴按钮
	$("a[id^=btnpaste-]").on("click",function(){
		VUEAPP.current_paste_tableid = this.id;
		showTextareaModal();
	});

	// //点击tab时候设置width
	// $('.tablelia').on('click', function(){
 //    	//console.log($(this).attr('href'));
 //    	let arrHref = $(this).attr('href').split('_');
 //    	let ojbtb = jQuery('#gridtable' + '-' + arrHref[1] + '-' + arrHref[2]);
 //    	ojbtb.jqGrid( 'setGridWidth', GLOBAL_TABLE_WIDTH );
 // 	})

})

// function setTableWidth(rootname) {
// 	// $("table[id^='gridtable-" + rootname + "-']").each(function(it){

//  //    	//console.log($(this).width() + '\n' + GLOBAL_TABLE_WIDTH);
//  //    	let theid = $(this).context.id;
//  //    	//console.log(theid);
//  //    	if(theid.indexOf('Left') > 0 || theid.indexOf('Right') > 0) {
// 	// 		$(this).jqGrid( 'setGridWidth', (GLOBAL_TABLE_WIDTH - 50) / 2 );
//  //    	} else {
//  //    		$(this).jqGrid( 'setGridWidth', GLOBAL_TABLE_WIDTH );
//  //    	}
    	
//  //    });
// }
            



function getRandom(type, len) { //1-字母,2-数字,4-字符
    const str_num = "0123456789",
        str_char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        str_specchar = "~!@#$%^&()";
    let newstr = "", uuid = [];
    type = type || 3;   //默认字母+数字
    len = len || 6;     //默认长度6
    
    if(type & 0x1<<0) newstr += str_num;
    if(type & 0x1<<1) newstr += str_char;
    if(type & 0x1<<2) newstr += str_specchar;
    
    for (i = 0; i < len; i++) uuid[i] = newstr[0 | (Math.random() * newstr.length)];
    return uuid.join('');
}

var VUEAPP = new Vue({
    el: '#main-container',
    data: {
        root : 'ACPI',                  //决定当前显示哪个节点
        plistcontext : '',              //保存从config.plist中读取的内容
        title : PAGE_TITLE,             //下面都是语言变量
        textarea_content : '',          //保存粘贴页面时候textarea中的内容
        current_paste_tableid : '',     //保存点击当前粘贴按钮的table id

        ACPI : { 
            Add : [], 
            Block : [], 
            Patch : [] ,
            Quirks : {
                FadtEnableReset:false, NormalizeHeaders:false, RebaseRegions:false, ResetHwSig:false, ResetLogoStatus:false}
            },
        Booter : { 
            MmioWhitelist : [], 
            Quirks : {
                AvoidRuntimeDefrag:false, DevirtualiseMmio:false,  DisableSingleUser:false, DisableVariableWrite:false, 
                DiscardHibernateMap:false, EnableSafeModeSlide:false, EnableWriteUnprotector:false, ForceExitBootServices:false, ProtectCsmRegion:false, 
                ProvideCustomSlide:false, SetupVirtualMap:false, ShrinkMemoryMap:false
            }
        },
        DeviceProperties : {
            AddLeft:[], 
            AddRight:[],             
            BlockLeft : [],
            BlockRight : []            
        },
        Kernel : {
            Add:[], 
            Block:[],
            Patch:[],
            Emulate:{Cpuid1Data : '',Cpuid1Mask :''},
            Quirks:{
                AppleCpuPmCfgLock:false, AppleXcpmCfgLock:false, AppleXcpmExtraMsrs:false, CustomSMBIOSGuid:false,  
                DisableIoMapper:false, ExternalDiskIcons:false, LapicKernelPanic:false, PanicNoKextDump:false, 
                PowerTimeoutKernelPanic:false, ThirdPartyDrives:false, XhciPortLimit:false
            }
        },
        Misc : {
            BlessOverride:[], 
            Boot:{
                ConsoleBehaviourOs:'', ConsoleBehaviourUi:'', ConsoleMode:'', HibernateMode:'', Resolution:'', Timeout:'',
                HideSelf : false, PollAppleHotKeys: false, ShowPicker: false, UsePicker: false
            },
            Debug: {
                DisableWatchDog:false, DisplayDelay:'', DisplayLevel:'', Target:''
            },
            Security : {
                ExposeSensitiveData:'', HaltLevel:'', ScanPolicy:'',AllowNvramReset:false, RequireSignature:false, RequireVault:false
            },
            Entries:[],
            Tools : []
        },
        NVRAM : {
            root : { LegacyEnable : false},
            AddLeft:[], 
            AddRight:[], 
            BlockLeft : [],
            BlockRight : [],
            LegacySchemaLeft : [],
            LegacySchemaRight : []
        },
        PlatformInfo : {
            root : {
                Automatic:false, UpdateDataHub:false, UpdateNVRAM:false, UpdateSMBIOS:false, UpdateSMBIOSMode : ''
            },
            DataHub : {
                ARTFrequency:'', BoardProduct:'', BoardRevision:'', DevicePathsSupported:'', FSBFrequency:'',
                InitialTSC:'', PlatformName:'', SmcBranch:'', SmcPlatform:'', SmcRevision:'', StartupPowerEvents:'',
                SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            Generic : {
                MLB:'', ROM:'', SpoofVendor:false, SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            PlatformNVRAM : {
                BID:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', MLB:'', ROM:''
            },
            SMBIOS : {
                BIOSReleaseDate:'', BIOSVendor:'', BIOSVersion:'', BoardAssetTag:'', BoardLocationInChassis:'', BoardManufacturer:'',
                BoardProduct:'', BoardSerialNumber:'', BoardType:'', BoardVersion:'', ChassisAssetTag:'', ChassisManufacturer:'', 
                ChassisSerialNumber:'', ChassisType:'', ChassisVersion:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', MemoryFormFactor:'',
                PlatformFeature:'', ProcessorType:'', SmcVersion:'', SystemFamily:'', SystemManufacturer:'',
                SystemProductName:'', SystemSKUNumber:'', SystemSerialNumber:'', SystemUUID:'', SystemVersion:''
            }
        },
        UEFI : {
            root : { ConnectDrivers : false},
            Drivers : [],
            Input : {
                KeyForgetThreshold:'', KeyMergeThreshold:'', KeySupport:false, KeySupportMode:'', KeySwap:false,  PointerSupport:false, PointerSupportMode:'', TimerResolution:''
                 
            },
            Protocols : {
                AppleBootPolicy:false, AppleEvent:false, AppleImageConversion:false, AppleKeyMap:false, AppleUserInterfaceTheme:false,
                ConsoleControl:false, DataHub:false, DeviceProperties:false, FirmwareVolume:false, HashServices:false, UnicodeCollation:false
            },
            Quirks : {
                AvoidHighAlloc:false, ClearScreenOnModeSwitch:false, ExitBootServicesDelay:'', IgnoreInvalidFlexRatio:false, IgnoreTextInGraphics:false,
                ProvideConsoleGop:false, ReconnectOnResChange:false,ReleaseUsbOwnership:false, ReplaceTabWithSpace:false, RequestBootVarFallback:false,
                RequestBootVarRouting:false, SanitiseClearScreen:false ,UnblockFsConnect:false
            }
        }

    },

    created : function () {

    },

    methods: {

        setRoot : function (rootname) {
            this.root = rootname; 
        }

        // 初始化所有表格
        , initAllData : function () {
            this.initACPI();
            this.setRoot('ACPI');

            this.initBooter();
            this.initDeviceProperties();
            this.initKernel();
            this.initMisc();
            this.initNVRAM();
            this.initPlatformInfo();
            this.initUEFI();
        }

        // 获取并设置dict的值和bool值
        , getAndSetDictItem(context, vueData) {
            for(let it in vueData) {
                if(typeof(vueData[it]) === "boolean") {                    
                    Vue.set(vueData, it, partrue(getValuesByKeyname(context, it)));
                } else {                    
                    Vue.set(vueData, it, getValuesByKeyname(context, it));
                }
                
            }

        }

        , initNVRAM : function () {

            this.NVRAM.AddLeft.length = 0;
            this.NVRAM.AddRight.length = 0;
            this.NVRAM.BlockLeft.length = 0;
            this.NVRAM.BlockRight.length = 0;
            this.NVRAM.LegacySchemaLeft.length = 0;
            this.NVRAM.LegacySchemaRight.length = 0;


            let NVRAMText = getValuesByKeyname(VUEAPP.plistcontext, 'NVRAM', true);
            this.getAndSetDictItem(NVRAMText, this.NVRAM.root);            

            
            let AddText = getValuesByKeyname(NVRAMText, 'Add');
            //AddLeft
            let arrayParent = getParentKeys(AddText);
            for(let i=0;i<arrayParent.length;i++) {
                this.NVRAM.AddLeft.push({id:i, Devices:arrayParent[i]});
            }            
            //this.NVRAM.AddSub = getSubKeys(AddText);
            let subarray = getSubKeys(AddText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.AddRight.push(subarray[it]);
            }
            jQuery("#gridtable-NVRAM-AddLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-AddRight").trigger("reloadGrid");
            //选中第一条记录
            jQuery("#gridtable-NVRAM-AddLeft").jqGrid('setSelection',0, true);

            //BlockLeft
            let BlockText = getValuesByKeyname(NVRAMText, 'Block')
            let arrayParent2 = getKeyarrayZIkey(BlockText);
            
            for(let j=0;j<arrayParent2.length;j++) {
                this.NVRAM.BlockLeft.push({id:j, Devices:arrayParent2[j]});
            }    

            
            subarray = getKeyarrayZIarray(BlockText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.BlockRight.push(subarray[it]);
            }
            jQuery("#gridtable-NVRAM-BlockLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-BlockRight").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-BlockLeft").jqGrid('setSelection',0, true);

            //LegacySchemaLeft
            let LegacySchemaText = getValuesByKeyname(NVRAMText, 'LegacySchema')
            let arrayParent3 = getKeyarrayZIkey(LegacySchemaText);
            
            for(let k=0;k<arrayParent3.length;k++) {
                //console.log(arrayParent3[k]);
                this.NVRAM.LegacySchemaLeft.push({id:k, Devices:arrayParent3[k]});
            }    

            
            subarray = getKeyarrayZIarray(LegacySchemaText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.LegacySchemaRight.push(subarray[it]);
            }
            jQuery("#gridtable-NVRAM-LegacySchemaLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-LegacySchemaRight").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-LegacySchemaLeft").jqGrid('setSelection',0, true);

            
        }

        , initUEFI : function () {
            let UEFIText = getValuesByKeyname(VUEAPP.plistcontext, 'UEFI', true);
            
            //root   
            this.getAndSetDictItem(UEFIText, this.UEFI.root);

            //Drivers
            let DriversText = getValuesByKeyname(UEFIText, 'Drivers');
            this.UEFI.Drivers.length = 0;
            let arrayDrivers = parsePlistArray2stringArray(DriversText);
            for(let i=0;i<arrayDrivers.length;i++) {
                this.UEFI.Drivers.push({ FileName : arrayDrivers[i]['Volume']}) ;             
            }
            jQuery("#gridtable-UEFI-Drivers").trigger("reloadGrid");

            //Input
            let InputText = getValuesByKeyname(UEFIText, 'Input');
            this.getAndSetDictItem(InputText, this.UEFI.Input);

            //Protocols
            let ProtocolsText = getValuesByKeyname(UEFIText, 'Protocols');
            this.getAndSetDictItem(ProtocolsText, this.UEFI.Protocols);

            //Quirks
            let QuirksText = getValuesByKeyname(UEFIText, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.UEFI.Quirks);
        }

        , initPlatformInfo : function () {
            let ipiText = getValuesByKeyname(VUEAPP.plistcontext, 'PlatformInfo', true);
            //console.log(ipiText);
            //root
            this.getAndSetDictItem(ipiText, this.PlatformInfo.root);

            //DataHub
            let DataHubText = getValuesByKeyname(ipiText, 'DataHub');
            this.getAndSetDictItem(DataHubText, this.PlatformInfo.DataHub);

            //Generic
            let GenericText = getValuesByKeyname(ipiText, 'Generic');
            this.getAndSetDictItem(GenericText, this.PlatformInfo.Generic);

            //PlatformNVRAM
            let PlatformNVRAMText = getValuesByKeyname(ipiText, 'PlatformNVRAM');
            this.getAndSetDictItem(PlatformNVRAMText, this.PlatformInfo.PlatformNVRAM);

            //SMBIOS
            let SMBIOSText = getValuesByKeyname(ipiText, 'SMBIOS');
            this.getAndSetDictItem(SMBIOSText, this.PlatformInfo.SMBIOS);

        }

        , initMisc : function() {
            let MiscText = getValuesByKeyname(VUEAPP.plistcontext, 'Misc', true);

            //Entries            
            this.getPlistAndResetTableData(MiscText, 'Entries', 'gridtable-Misc-Entries', this.Misc.Entries);
            //Tools
            this.getPlistAndResetTableData(MiscText, 'Tools', 'gridtable-Misc-Tools', this.Misc.Tools);
            //Boot
            let BootText = getValuesByKeyname(MiscText, 'Boot');     
            this.getAndSetDictItem(BootText, this.Misc.Boot);         

            //Debug
            let DebugText = getValuesByKeyname(MiscText, 'Debug');   
            this.getAndSetDictItem(DebugText, this.Misc.Debug);           

            //Security
            let SecurityText = getValuesByKeyname(MiscText, 'Security');    
            this.getAndSetDictItem(SecurityText, this.Misc.Security);        

        }

        

        , initKernel : function () {
            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Kernel', true);
            this.getPlistAndResetTableData(text, 'Add', 'gridtable-Kernel-Add', this.Kernel.Add);
            this.getPlistAndResetTableData(text, 'Block', 'gridtable-Kernel-Block', this.Kernel.Block);
            this.getPlistAndResetTableData(text, 'Patch', 'gridtable-Kernel-Patch', this.Kernel.Patch);
            
            let EmulateText = getValuesByKeyname(text, 'Emulate');
            this.getAndSetDictItem(EmulateText, this.Kernel.Emulate);  

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Kernel.Quirks);          


        }

        , initDeviceProperties : function () {
            this.DeviceProperties.AddLeft.length = 0;
            this.DeviceProperties.AddRight.length = 0;
            this.DeviceProperties.BlockLeft.length = 0;
            this.DeviceProperties.BlockRight.length = 0;

            let text = getValuesByKeyname(VUEAPP.plistcontext, 'DeviceProperties', true);
            //console.log(text);
            let AddText = getValuesByKeyname(text, 'Add');
            //Add
            let arrayParent = getParentKeys(AddText);
            for(let i=0;i<arrayParent.length;i++) {
                this.DeviceProperties.AddLeft.push({id:i, Devices:arrayParent[i]});
            }            

            let subArray = getSubKeys(AddText);
            for(let it in subArray) {
                subArray[it]['id'] = it;
                //console.log(subArray[it]);
                this.DeviceProperties.AddRight.push(subArray[it]);
            }
            jQuery("#gridtable-DeviceProperties-AddLeft").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-AddRight").trigger("reloadGrid");
            //选中第一条记录
            jQuery("#gridtable-DeviceProperties-AddLeft").jqGrid('setSelection',0, true);

            //Block
            let BlockText = getValuesByKeyname(text, 'Block')
            let arrayParent2 = getKeyarrayZIkey(BlockText);
            //console.log(arrayParent2);
            for(let i=0;i<arrayParent2.length;i++) {
                this.DeviceProperties.BlockLeft.push({id:i, Devices:arrayParent2[i]});
            }    

            
            subArray = getKeyarrayZIarray(BlockText);
            for(let it in subArray) {
                subArray[it]['id']=it;
                this.DeviceProperties.BlockRight.push(subArray[it]);
            }

            jQuery("#gridtable-DeviceProperties-BlockLeft").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-BlockRight").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-BlockLeft").jqGrid('setSelection',0, true);

        }


        , initBooter : function () {
            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Booter', true);
            this.getPlistAndResetTableData(text, 'MmioWhitelist', 'gridtable-Booter-MmioWhitelist', this.Booter.MmioWhitelist);

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Booter.Quirks);  

        }

        , initACPI : function () {
            let acpiText = getValuesByKeyname(VUEAPP.plistcontext, 'ACPI', true);
            this.getPlistAndResetTableData(acpiText, 'Add', 'gridtable-ACPI-Add', this.ACPI.Add);
            this.getPlistAndResetTableData(acpiText, 'Block', 'gridtable-ACPI-Block', this.ACPI.Block);
            this.getPlistAndResetTableData(acpiText, 'Patch', 'gridtable-ACPI-Patch', this.ACPI.Patch);

            let QuirksText = getValuesByKeyname(acpiText, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.ACPI.Quirks);  
           

            //强制刷新一下, 否则 checkbox 不更新
            this.$forceUpdate();
        }

        // 获取plist中array的值并更新到table表格中
        , getPlistAndResetTableData : function (context, keyname, gridid, gridData) {
            
            let arrayAdd = parrayToJSarray(getValuesByKeyname(context, keyname));
            gridData.length = 0;
            for(let it in arrayAdd) {
                gridData.push(arrayAdd[it]);
            }       
            jQuery("#" + gridid).trigger("reloadGrid");
        }


    }
})


function savePlist() {
    let xmlcontext = getAllPlist();
    let blob = new Blob([xmlcontext], {type: "text/plain;charset=utf-8"});    
    saveAs(blob, "config.plist");
}

function copyPlist() {
	let xmlcontext = getAllPlist();
	copyDatatoClipboard(xmlcontext);
	showTipModal(PAGE_TITLE.lang.copyplistSuccess);
}

function startPaste() {
    VUEAPP.textarea_content = VUEAPP.textarea_content.trim();
	if(VUEAPP.textarea_content === '') {
		showTipModal("没有可供粘贴的数据");
		return;
	}

	let rowData = stringToJSON(VUEAPP.textarea_content);
	let isArray = rowData instanceof Array;

	if(isArray === false) {
		showTipModal("数据格式不对,无法粘贴");
		return;		
	} 
 
 	let ids = VUEAPP.current_paste_tableid.split('-');
    let objGridTable = jQuery('#gridtable-' + ids[1] + '-' + ids[2]);

    //检查数据复制源和复制的格式是否一致
    let arrayColNames = objGridTable.jqGrid('getGridParam','colNames');
    for(let con in rowData[0]) {
        if(arrayColNames.indexOf(con) === -1) {
            showTipModal("数据格式不对, 无法粘贴");
            return;
        }
        
    }

    //如果是右边表格, 要多做几个处理,1 检查左边是否选中, 2 修改pid 3 删除id
    if(ids[2].substr(-5) === 'Right') {
        let leftgridid = '#gridtable-' + ids[1] + '-' + ids[2].replace('Right','Left');            
        let leftSelectedId = $(leftgridid).jqGrid("getGridParam", "selrow");
        console.log(leftSelectedId);

        if(leftSelectedId === null) {
            showTipModal('请先在左边选择 Devices 记录');
            return;
        }

        for(let it in rowData) {
            
            if(rowData[it]['pid'] !== undefined) {
                rowData[it]['pid'] = leftSelectedId;
            }
            if(rowData[it]['id'] !== undefined) {                
                delete rowData[it]['id'];
            }
        }
        
    }

	for(let it in rowData) {
		objGridTable.jqGrid('addRowData', getRandom(), rowData[it], 'last');
	}
	$('#inputModal').modal('hide');
	

}