
//Windows专用 获取EFI磁盘列表
function getEfiDiskList_windows() {

  function checkDriverLetter(dl) {
    if (dl < 97) return;
    const letter = String.fromCharCode(dl);

    //列出所有已经挂载的EFI分区
    window.services.checkFolderExist(`${letter}:/EFI/OC/OpenCore.efi`).then(
      function (isExist) {
        if (isExist) {
          const option = { text: `${letter.toUpperCase()}:/EFI/OC`, value: letter };
          VUEAPP.select_efi_drives.options.push(option);
          if(VUEAPP.select_efi_drives.selected.length === 0) {
            VUEAPP.select_efi_drives.selected = letter;
          }
        }
        checkDriverLetter(dl - 1);
      }
    );
  }

  checkDriverLetter(122);
}

//Windows专用，升级opencore
function upgradeOpencore_Windows() {
  const selected = VUEAPP.select_efi_drives.selected;
  if (selected.length === 0) return;

  const iscontinue = confirm("windows下无法获取本地OpenCore版本，官方最新版本为：" + VUEAPP.array_opencor_version[0] + ", 需要继续升级“" + selected.toUpperCase() + ":/EFI”中的Opencore吗？");
  if (iscontinue) {
    upgradeOpencore(selected + ':/EFI');
  }


}

//检查 EFI 分区是否已经挂载，如果没有挂载就提示挂载
function checkEFIPartitionMounted() {

  const selectedOption = VUEAPP.select_efi_drives.options.find(it=>it.value === VUEAPP.select_efi_drives.selected);
  if(!selectedOption.ismounted) {
    alert(fillLangString(VUEAPP.lang.tip_EFI_partition_not_exist, selectedOption.partitionname));
    return;
  }

  const cf = confirm(fillLangString(VUEAPP.lang.tip_is_continue_upgrading_opencore,selectedOption.partitionname));
  if (cf) upgradeOpencore(`/Volumes/${selectedOption.partitionname}/EFI`);

}

//检测本地和最新的 OpenCore 版本
function checkOpenCoreVersion() {
  const tmpversion = VUEAPP.array_opencor_version;
  window.services
    .getGithubOpencoreVersion()
    .then(function (res) {
      tmpversion.push(res);
      tmpversion.push(Number((res.match(/\d+/g) || []).join("")));

      if(utools.isWindows()) {//如果是 windows 下就无法获取本地 opencore 版本
        return new Promise((resolve) => {resolve('');})
      } else {
        return window.services.getLocalOpencoreVersion();
      }

    })
    .then(function (res) {
      const lv = res.substr(res.indexOf("REL-")).split("-");
        if (lv.length === 5) {
        tmpversion.push(lv[1].split("").join("."));
        tmpversion.push(Number(lv[1]));
        //if (tmpversion[1] > tmpversion[3]) {
        //  VUEAPP.is_opencore_upgrade = true;
        //}
      } else {
        tmpversion.push('---');
        tmpversion.push(0);
      }

      let span_foot_right_opencore_version = fillLangString(VUEAPP.lang.span_foot_right_opencore_version,tmpversion[2],tmpversion[0]);

      $("#span_footer_right_message").text(span_foot_right_opencore_version);

    })
    .catch(function (error) {
      console.log(error, "error");
    });
}

//更新 Opencore
function upgradeOpencore(EFIPath) {
  $('body').css('cursor', 'progress');
  const tempPath = utools.getPath("temp");
  //console.log(tempPath)
  const arrayFileList = ["BOOT/BOOTx64.efi", "OC/OpenCore.efi"];
  const unzipPath = `${tempPath}OpenCore-${VUEAPP.array_opencor_version[0]}-RELEASE`;
  const zipfilePath = `${tempPath}OpenCore-${VUEAPP.array_opencor_version[0]}-RELEASE.zip`;

  showTipModal("开始下载文件");

  window.services.getFileSize(zipfilePath).then((size) => {
    if (size / 1024 / 1024 > 8) {
      return new Promise((resolve) => {
        resolve(zipfilePath);
      })
    } else {
      return window.services.downloadOpencore(zipfilePath, VUEAPP.array_opencor_version[0]);
    }
  })
    .then((downFile) => {
      showTipModal("文件下载成功, 开始解压文件,保存路径：" + downFile);
      return window.services.unzipFile(downFile, unzipPath);
    })
    .then((unzippath) => {
      showTipModal("文件解压成功到：" + unzippath);
      return window.services.getFileNameList(`${EFIPath}/OC/Drivers`);
    })
    .then((files) => {
      files.forEach((file) => {
        if (file.indexOf(".") !== 0) {//过滤掉以.开头的文件
          arrayFileList.push("OC/Drivers/" + file);
        }
      });

      return window.services.getFileNameList(`${EFIPath}/OC/Tools`);
    })
    .then((files) => {
      files.forEach((file) => {
        if (file.indexOf(".") !== 0) {
          arrayFileList.push("OC/Tools/" + file);
        }
      });

      upgradeFileOnebyOne(0);
    })
    .catch(function (error) {
      $('body').css('cursor', '');
      showTipModal(error, 'warning');
      console.log(error, "error");
    });

  function upgradeFileOnebyOne(z) {
    if (z >= arrayFileList.length) {
      $('body').css('cursor', '');
      if(z>0) showTipModal("OpenCore 更新完成，共更新了 " + z + " 个文件");
      return;
    }
    const source = `${unzipPath}/X64/EFI/${arrayFileList[z]}`;
    const destination = `${EFIPath}/${arrayFileList[z]}`;
    showTipModal(z + 1 + " 更新文件" + destination);
    console.info(z + 1 + " 更新文件" + destination);
    window.services.copyFile(source, destination).then(() => {
      upgradeFileOnebyOne(z + 1);
    });
  }
}

// 加载 EFI 磁盘(Macos 下 utools 专用 )
function loadEFIDisk_MU() {
  const BSDname = VUEAPP.select_efi_drives.selected;
  if (BSDname === "") {
    alert(VUEAPP.lang.tip_no_mount_disk);
    return;
  }

  const selectedOption = VUEAPP.select_efi_drives.options.find(it=>it.value === BSDname);
  if(selectedOption.ismounted) {
    alert('当前 EFI 分区已经挂载');
    return;
  }

  window.services.loadEFIDisk(BSDname).then(
    function (res) {
      console.log(res);
      selectedOption.ismounted = true;
      showTipModal(res);
    },
    function (error) {
      showTipModal(error, "error");
    }
  );
}

// 加载 EFI 磁盘(Windows 下 utools 专用 )
function loadEFIDisk_WU() {
  function checkDriverLetter(dl) {
    if (dl < 97) {
      showTipModal("EFI 分区挂载操作失败，所有盘符都被占用，厉害了", "error");
      return;
    }
    const diskno = String.fromCharCode(dl);

    window.services.checkDriveLetter(diskno).then(
      function () {
        checkDriverLetter(dl - 1);
      },
      function () {
        window.services.loadEFIDisk(diskno).then(
          function () {
            const option = { text: `${diskno.toUpperCase()}:/EFI/OC`, value: diskno };

            VUEAPP.select_efi_drives.options.push(option);
            VUEAPP.select_efi_drives.selected = diskno;
            showTipModal(
              fillLangString(VUEAPP.lang.tip_mount_disk_success, diskno.toUpperCase())
            );
          },
          function () {
            showTipModal(VUEAPP.lang.tip_mount_disk_failed, "error");
          }
        );
      }
    );
  }
  //从 P 找到 A
  checkDriverLetter(112);
}

//获取EFI的磁盘名称(Macos utools 专用 )
function getEFIdiskName_MU() {
  window.services.getEFIdiskName().then(
    function (res) {
      const arrayRes = res.split("\n");

      for (let i = 0; i < arrayRes.length; i++) {
        const itval = arrayRes[i].split(/\s{2,}/);
        if (itval.length === 5 && itval[2].indexOf("EFI") === 0) {
          const option = {
            text: itval[2].substr(itval[2].indexOf("EFI") + 4) + " " + itval[4],
            value: itval[4],
            partitionname:itval[2].substr(itval[2].indexOf("EFI") + 4),
            ismounted : false
          };
          VUEAPP.select_efi_drives.options.push(option);
          if(VUEAPP.select_efi_drives.selected.length === 0) VUEAPP.select_efi_drives.selected = itval[4];

        }
      }

      // 去批量更新 EFI 分区是否挂载
      function updateselect_efi_drives_ismounted(x) {
        if(x >= VUEAPP.select_efi_drives.options.length) {
          return;
        }
        const options = VUEAPP.select_efi_drives.options[x];
        //console.log(`/Volumes/${options.partitionname}/EFI 是否挂载`)
        window.services.checkFolderExist(`/Volumes/${options.partitionname}/EFI`)
        .then(function (isExist) {
          if (isExist) {
            options.ismounted = true;
          }
          updateselect_efi_drives_ismounted(x+1);
        });
      }
      updateselect_efi_drives_ismounted(0);
    },
    function (error) {
      console.log("出错了：" + error);
    }
  );
}