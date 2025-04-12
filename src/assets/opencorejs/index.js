$(document).ready(function () {
  $("#id-input-file-2")
    .ace_file_input({
      no_file: VUEAPP.lang.no_file,
      btn_choose: VUEAPP.lang.choose,
      btn_change: VUEAPP.lang.change,
      droppable: false,
      onchange: null,
      icon_remove: null,
      allowExt: ["plist"],
      thumbnail: false,
      before_change: function (files) {
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function () {
          if(VUEAPP.current_run_env === 'MU' || VUEAPP.current_run_env === 'WU') {
            VUEAPP.open_file_path = files[0].path;
            $("#span_open_file_path").text(files[0].path);
          }
          VUEAPP["plistJsonObject"] = formatContext(this.result);
          VUEAPP.initAllData();
        };
        delete reader;
        return true;
      },
    })
    .on("file.error.ace", function () {
      showTipModal(VUEAPP.lang.alertfileerror, "error");
    });

  //初始化提示插件
  $.minimalTips();

  //设置弹出提示插件
  toastr.options = {
    closeButton: true,
    positionClass: "toast-top-center",
  };

  //页面加载完成后解除文件选择框的禁用属性
  $("#id-input-file-2").removeAttr("disabled");

  //初始化ACPI表格
  initGridTableACPI();

  //初始化剩余的表格
  setTimeout(() => {
    initGridTableBooter();
    initGridTableDeviceProperties();
    initGridTableKernel();
    initGridTableMisc();
    initGridTableNVRAM();
    initGridTablePlatformInfo();
    initGridTableUEFI();
  });

  //绑定保存按钮功能
  $("#button_save").click(savePlist);

  //如果是 tauri 模式下
  if(typeof window.__TAURI__ === 'object') {
    VUEAPP.current_run_env = "MT";    
    VUEAPP.tauri_file_path = VUEAPP.lang.no_file;
    VUEAPP.tauri_file_choose = VUEAPP.lang.choose;
    getEFIdiskName_MT();
    $('#button_save').off('click');
    $("#button_save").click(savePlistTauri);
    
  }

  
  //如果是在 utools 模式下
  if (typeof utools === "object" && utools.isLinux() === false) {
    //修改保存按钮功能
    $('#button_save').off('click');
    $("#button_save").click(savePlistUtools);

    if (utools.isMacOS()) {
      VUEAPP.current_run_env = "MU";
      getEFIdiskName_MU();

    } else if (utools.isWindows()) {
      VUEAPP.current_run_env = "WU";
      getEfiDiskList_windows();
    }
   

  }
  
  //显示适配版本信息, 如果本地存储了版本信息并且获取时间在 1 小时内就从本地取,否则就去 github 上取
  //localStorage.removeItem('datajson')
  const datajson = localStorage.getItem('datajson');
  //console.log(datajson)
  if(typeof datajson === "string") {

    const newdatajson = JSON.parse(datajson);
    //如果最后获取时间已经超过 1 个小时就重新从 github 上取
    const lastgetdate = new Date(newdatajson.lastgetdate);
    const now = new Date();
    const difftime = Math.round((now.getTime() - lastgetdate.getTime())/1000);      
    if(parseInt(difftime/60) > 60) {       
      getAndSetDatajson();
    } else {
      VUEAPP.supportversion = newdatajson.supportversion;
      VUEAPP.opencore_latest_version = newdatajson.latestversion;
      VUEAPP.acpi_patch_list = newdatajson.acpi_patch_list;
      VUEAPP.kernel_patch_list = newdatajson.kernel_patch_list;
    }
  } else {
    getAndSetDatajson();
  }

});

/**
 * 从 github 上获取数据并设置到本地
 */
async function getAndSetDatajson() {
  try {

    let response = await fetch(`https://gh-proxy.com/raw.githubusercontent.com/xieguozhong/opencoreConfiguratorOnline/refs/heads/main/data.json`);
    
    let data = await response.json();
  
    if(data.supportversion.length > 0) {            
      data.lastgetdate = new Date();
      localStorage.setItem('datajson',JSON.stringify(data));
      VUEAPP.supportversion = data.supportversion;
      VUEAPP.opencore_latest_version = data.latestversion;
      VUEAPP.acpi_patch_list = data.acpi_patch_list;
      VUEAPP.kernel_patch_list = data.kernel_patch_list;
    }
  }catch(e) {
    console.log(e);
  }
  
}


// ACPI Add 和 UEFI Drivers Kernel_Add处添加文件
function addFile(fileid) {
  const file = document.getElementById(fileid),
    thetablename = fileid.slice(fileid.indexOf("_") + 1);

  const thetable = getJqgridObjectbyKey(thetablename);

  let files,
    maxid = getMaxrowid(thetable);

  //依次循环处理多选的多个文件
  for (let i = 0; i < file.files.length; i++) {
    files = file.files[i];

    if (thetablename === "ACPI_Add") {
      thetable.jqGrid(
        "addRowData",
        ++maxid,
        { Comment: "", Path: files.name, Enabled: "YES" },
        "last"
      );
    } else if (thetablename === "UEFI_Drivers") {
      thetable.jqGrid(
        "addRowData",
        ++maxid,
        { Path: files.name, Arguments: "", Comment: "", Enabled: "YES" },
        "last"
      );
    } else if (thetablename === "Kernel_Add") {
      handFile(files, thetable);
    }
  }
}

//用JSzip处理kext中Plugin中的文件,单独处理Kernel_Add处添加文件
function handFile(ff, thetable) {
  const sfl = new Set(),
    sfonly = new Set();

  JSZip.loadAsync(ff).then(
    function (zip) {
      zip.forEach((relativePath) => {
        //console.log(relativePath)
        sfl.add(relativePath);

        //这里大部分都是相同的会被过滤掉
        const kextname = relativePath.substring(0, findStrAssIndex(relativePath, "/", 1));
        if(kextname.slice(-5) === ".kext") {
          sfonly.add(kextname);
        }

        const pindex = relativePath.indexOf("PlugIns");
        if (pindex > -1) {
          const p2index = findStrAssIndex(relativePath, "/", 4);
          if (p2index > -1) {
            sfonly.add(relativePath.substring(0, p2index));
          }
        }
      });

      let maxid = getMaxrowid(thetable), newData = null;
      
      sfonly.forEach((kname) => {

        let ExecutablePath = "",PlistPath = "";

        for(const it of sfl) {
          const newKname = kname + "/Contents/MacOS/";
          if(it.includes(newKname)  && it.length > newKname.length) {
            ExecutablePath = it;
            break;
          } 
        }

        if (sfl.has(kname + "/Contents/Info.plist")) {
          PlistPath = "Contents/Info.plist";
        }

        newData = {
          Arch: "",
          BundlePath: kname,
          Comment: "",
          ExecutablePath: ExecutablePath,
          PlistPath: PlistPath,
          MaxKernel: "",
          MinKernel: "",
          Enabled: "YES",
        };
        maxid = maxid + 1;

        thetable.jqGrid("addRowData", maxid, newData, "last");
      });
    },
    function (e) {
      console.log(e.message);
    }
  );
}


//查看有没有表格在被编辑中
function checkOneditTable() {
  if (GLOBAL_SET_ONEDITTABLE.size === 0) {
    return "";
  }

  const newset = new Set();
  for (let it of GLOBAL_SET_ONEDITTABLE) {
    let arrit = it.split("_");
    newset.add(arrit[1] + " | " + arrit[2]);
  }

  let newmsg =
    "-".repeat(30) +
    "<br>" +
    Array.from(newset).join("<br>") +
    "<br>" +
    "-".repeat(30);
  return fillLangString(VUEAPP.lang.editingtablemessage, newmsg);
}

//如果是在 utools 模式下就直接保存到文件
function savePlistUtools() {
  const cotstring = checkOneditTable();
  if (cotstring !== "") {
    toastr.error(cotstring);
    return;
  }
  const xmlcontext = getAllPlist();

  //保存文件
  const savefile = window.services.saveFile(
    VUEAPP.open_file_path,
    xmlcontext
  );
  savefile.then(
    function (res) {
      showTipModal(VUEAPP.lang.tip_file_save_success, "success");
    },
    function (error) {
      showTipModal(VUEAPP.lang.tip_file_save_failed, "error");
    }
  );
}

//保存按钮，如果是普通网页模式下就下载文件
function savePlist() {
  let cotstring = checkOneditTable();
  if (cotstring !== "") {
    toastr.error(cotstring);
    return;
  }
  let xmlcontext = getAllPlist();
  let blob = new Blob([xmlcontext], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "config.plist");
  showTipModal(VUEAPP.lang.downplistSuccess, "success");
}

//复制按钮
function copyPlist() {
  let cotstring = checkOneditTable();
  if (cotstring !== "") {
    toastr.error(cotstring);
    return;
  }
  let xmlcontext = getAllPlist();
  copyDatatoClipboard(xmlcontext);
  showTipModal(VUEAPP.lang.copyplistSuccess, "success");
}

//数据行粘贴
function startPaste() {
  VUEAPP.textarea_content = VUEAPP.textarea_content.trim();
  if (VUEAPP.textarea_content === "") {
    showTipModal(VUEAPP.lang.nopasteData, "error");
    return;
  }

  let rowData = stringToJSON(VUEAPP.textarea_content);

  if (rowData === false || rowData instanceof Array === false) {
    showTipModal(VUEAPP.lang.dataFormaterror, "error");
    return;
  }

  let ids = VUEAPP.current_paste_tableid.split("_");

  let objGridTable = getJqgridObjectbyKey(ids[1] + "_" + ids[2]);

  //检查数据复制源和复制的格式是否一致
  let arrayColNames = objGridTable.jqGrid("getGridParam", "colNames");
  for (let con in rowData[0]) {
    if (arrayColNames.indexOf(con) === -1) {
      showTipModal(VUEAPP.lang.dataFormaterror, "error");
      return;
    }
  }

  //如果是右边表格, 要多做几个处理,1 检查左边是否选中, 2 修改pid 3 删除id
  if (ids[2].endsWith("Right")) {
    let leftgrid = getJqgridObjectbyKey(
      ids[1] + "_" + ids[2].replace("Right", "Left")
    );
    let leftSelectedId = leftgrid.jqGrid("getGridParam", "selrow");

    if (leftSelectedId === null) {
      showTipModal(VUEAPP.lang.chooseDevices, "warning");
      return;
    }

    for (let it in rowData) {
      if (rowData[it]["pid"] !== undefined) {
        rowData[it]["pid"] = leftSelectedId;
      }
      if (rowData[it]["id"] !== undefined) {
        delete rowData[it]["id"];
      }
    }
  }
  let maxid = getMaxrowid(objGridTable);
  for (let it in rowData) {
    objGridTable.jqGrid("addRowData", ++maxid, rowData[it], "last");
  }
  $("#inputModal").modal("hide");

  showTipModal(VUEAPP.lang.pasteDataSuccess, "success");
}
