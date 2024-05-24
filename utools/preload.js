const { exec } = require("child_process");

//统一的公共shell执行函数
function pubcomm_exec_promise(stringShell) {
  console.log("执行命令：" + stringShell);
  return new Promise((resolve, reject) => {
    exec(stringShell, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

window.services = {};

(function () {

  //  保存指定的内容到指定的文件中
    window.services.saveFile = (filepath, fileContent) => {
      const fs = require('fs');
      return new Promise((resolve, reject) => {
          fs.exists(filepath, (exists) => {
            if (exists) {
              fs.writeFile(filepath, fileContent,'utf8', (err) => {
              if (err) {
                reject();
              } else {              
                resolve();
              }
            });
            } else {
              reject();
            }
          });
      });
    };


  if (utools.isMacOS()) {

    // 1 获取所有磁盘中的 EFI 分区
    window.services.getEFIdiskName = () => {
      const shell = `diskutil list`;
      return pubcomm_exec_promise(shell);
    };

    // 2 挂载指定的 EFI 磁盘
    window.services.loadEFIDisk = (BSDname) => {
      const stringShell = `diskutil mount /dev/${BSDname}`;
      const sudo = require("./public/sudoprompt");
      console.log("执行命令：" + stringShell)
      return new Promise((resolve, reject) => {
        sudo.exec(stringShell, {name: 'OpenCore Configurator'}, (error, stdout) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });

    };

    
  } else if (utools.isWindows()) {

    // 1 检测指定的盘符是否可用
    window.services.checkDriveLetter = (driveLetter) => {
      const shell = `mountvol ${driveLetter}: /L`;
      return pubcomm_exec_promise(shell);
    };

    // 2 挂载指定的 EFI 磁盘
    window.services.loadEFIDisk = (diskno) => {
      const shell = `mountvol ${diskno}: /S`;
      return pubcomm_exec_promise(shell);
    };
  } 
})();
