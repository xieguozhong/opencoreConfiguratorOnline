/**
 * 填充efi磁盘下拉列表框
 * @param {string} stdout 
 */
function add_select_efi_drives(stdout) {
  const arrayRes = stdout.split("\n");

  for (let i = 0; i < arrayRes.length; i++) {
    const itval = arrayRes[i].split(/\s{2,}/);
    if (itval.length === 5 && itval[2].indexOf("EFI") === 0) {
      const option = {
        text: itval[2].slice(itval[2].indexOf("EFI") + 4) + " " + itval[4],
        value: itval[4],
        partitionname:itval[2].slice(itval[2].indexOf("EFI") + 4),
        ismounted : false
      };
      VUEAPP.select_efi_drives.options.push(option);
      check_disk_ismounted(option);
      if(VUEAPP.select_efi_drives.selected.length === 0) VUEAPP.select_efi_drives.selected = itval[4];

    }
  }
}

//检测下来框中的 EFI 磁盘是否已经挂载
async function check_disk_ismounted(diskoption) {
  const { Command } = window.__TAURI__.shell;

    let result = await Command.create('run-check-diskmouted', ['-c', "mount |grep " + diskoption.value]).execute();

    if(result.stdout.length > 0) {
      const selectedOption = VUEAPP.select_efi_drives.options.find(it=>it.value === diskoption.value);
      selectedOption.ismounted = true;
    }
    
}

//运行 diskutil list 命令获取 efi 磁盘信息
async function getEFIdiskName_MT () {
    const { Command } = window.__TAURI__.shell;
    const shellresult = await Command.create('run-diskutil-list', ['list']).execute();
    add_select_efi_drives(shellresult.stdout);
}

//挂载选定的 EFI 磁盘
async function mountEFIDisk_MT () {
  const BSDname = VUEAPP.select_efi_drives.selected;
  if (BSDname === "") {
    toastr.error(VUEAPP.lang.tip_no_mount_disk);
    return;
  }

  const selectedOption = VUEAPP.select_efi_drives.options.find(it=>it.value === BSDname);
  
  if(selectedOption.ismounted) {
    toastr.error(VUEAPP.lang.tip_mount_disk_ismounted);
    return;
  }


  const { invoke } = window.__TAURI__.core;
  const abc = await invoke("mount_efi_disk", { diskname: `/dev/${BSDname}` });
  selectedOption.ismounted = true;
}

/**
 * 检查 plist 文件格式是否正确
 * @param {string} plistfilepath 
 * @returns 
 */
async function checkPlistfile(plistfilepath) {
  const { Command } = window.__TAURI__.shell;
    
  let result = await Command.create('run-check-plist-file', ['-c', "plutil -lint " + escapeFileName(plistfilepath)]).execute();

  if(typeof result?.stdout === 'string' ) {
    if(result.stdout.replace(/\n/g, "").slice(-2) === 'OK') {
      return false;
    } else {      
      //console.log("检测文件有问题:" + result.stdout);
      showTipModal(VUEAPP.lang.tip_file_format_error + "<br>" + result.stdout, 'error');
      return true;
    }
  }
  //如果检查操作失败
  return false;
}

//弹出文件选择框, 并调用 读取文件内容, 初始化界面数据 函数
async function openconfigfile() {
  const { open } = window.__TAURI__.dialog;
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Opencore config file web editor',
      extensions: ['plist']
    }]
  });

  if(typeof selected === 'string') {
    VUEAPP.tauri_file_choose = VUEAPP.lang.change;
    //去检查文件格式是否正确
    const checkres = await checkPlistfile(selected);
    if(checkres) return;
    const arrselected = selected.split('/');
    VUEAPP.tauri_file_path = arrselected[arrselected.length-1];
    VUEAPP.open_file_path = selected
    $("#span_open_file_path").text(selected);
    readconfigfile(selected);
  }
}

//读取文件内容, 初始化界面数据
async function readconfigfile(open_file_path) {
  const { invoke } = window.__TAURI__.core;
  //console.log(open_file_path)
  const content = await invoke("read_file_to_string", { filepath: open_file_path});
  VUEAPP["plistJsonObject"] = formatContext(content);
  VUEAPP.initAllData();
}

//保存修改后的内容到文件中
async function savePlistTauri() {
  if(VUEAPP.open_file_path === '') {
    toastr.error(VUEAPP.lang.tip_file_save_failed);
    return;
  }
  const cotstring = checkOneditTable();
  if (cotstring !== "") {
    toastr.error(cotstring);
    return;
    
  } else {
    const xmlcontext = getAllPlist();
    const { invoke } = window.__TAURI__.core;
    const saveresult = await invoke("save_file", { filepath: VUEAPP.open_file_path,content:xmlcontext});
    //console.log(saveresult);
    if(saveresult === 'Ok') {
      showTipModal(VUEAPP.lang.tip_file_save_success, "success");
    } else {
      showTipModal(saveresult, "error");
    }
    
  }
  
}

//升级 Opencore 程序
function upgradeOpencore_MT() {
  //先检查 EFI 分区是否已经挂载，如果没有挂载就提示挂载
  const selectedOption = VUEAPP.select_efi_drives.options.find(it=>it.value === VUEAPP.select_efi_drives.selected);
  if(!selectedOption.ismounted) {
    showTipModal(fillLangString(VUEAPP.lang.tip_EFI_partition_not_exist, selectedOption.partitionname),'error');
    return;
  }
  //getAndSetDatajson();
  bootbox.confirm("<div style='font-size:18px'>" 
    + fillLangString(VUEAPP.lang.tip_is_continue_upgrading_opencore,selectedOption.partitionname,VUEAPP.opencore_latest_version) + "</div>", function(result) {
    if(result) {
      asyncupgradeOpencore(`/Volumes/${selectedOption.partitionname}/EFI`);
    }
  });

  

}

async function asyncupgradeOpencore(diskno) {


  $('body').css('cursor', 'progress');

  const  { tempDir } = window.__TAURI__.path;
  const  { invoke } = window.__TAURI__.core;
  const tempPath = await tempDir();
  
  const unzipPath = `${tempPath}OpenCore-${VUEAPP.opencore_latest_version}-RELEASE`;
  const zipfilePath = `${tempPath}OpenCore-${VUEAPP.opencore_latest_version}-RELEASE.zip`;
  //console.log(zipfilePath)
  showTipModal(VUEAPP.lang.tip_file_download_start);


  const saveresult = await invoke("get_file_size", { filepath: zipfilePath});
  //如果文件不存在或者文件大小小于8000000, 就去 github 上下载
  if(saveresult < 8000000) {
    console.log("文件不存在,需要下载")
    const durl = `${VUEAPP.download_proxy_url}/https://github.com/acidanthera/OpenCorePkg/releases/download/${VUEAPP.opencore_latest_version}/OpenCore-${VUEAPP.opencore_latest_version}-RELEASE.zip`;
    console.log('下载地址：' + durl);
    const download = await invoke("download_file", { url: durl, outputdir:tempPath});
    if(download === 0) {
      $('body').css('cursor', '');
      showTipModal(VUEAPP.lang.tip_file_download_failed,'error');
      return;
    }
  }
  showTipModal(VUEAPP.lang.tip_file_download_success);
  //开始解压文件
  const unzipres = await invoke("unzip_file_to_dir", { zippath: zipfilePath, destdir:unzipPath});
  if(unzipres === 'Ok') {
    showTipModal(VUEAPP.lang.tip_file_decompressed_update);
  }

  //开始更新文件，只更新 BOOT，OC，OC/Drivers，OC/Tools 下的文件
  const destDirList = [
    '/BOOT',
    '/OC',
    '/OC/Drivers',
    '/OC/Tools',
  ];
  for(const ddl of destDirList) {
    const filelist = await invoke("list_files_in_dir", { dirpath: diskno + ddl});
    const filelistJSON = JSON.parse(filelist); 

    for(const it of filelistJSON.files) {
      const copyfileres = await invoke("copy_file_to_dir", { srcfile: unzipPath + "/X64/EFI" + ddl + '/' +it, destdir:diskno + ddl});
      if(copyfileres === 'Ok') {
        showTipModal(fillLangString(VUEAPP.lang.tip_file_upgrade_success,it));
      }
    }
  }
  $('body').css('cursor', '');
  showTipModal(VUEAPP.lang.tip_upgrade_opencore_success);
}


