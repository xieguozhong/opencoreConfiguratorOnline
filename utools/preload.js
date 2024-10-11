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
  // 1 window & macos 保存指定的内容到指定的文件中
  window.services.saveFile = (filepath, fileContent) => {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, fileContent, "utf8", (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  };

  // 2 window & macos 检测一个文件是否存在
  window.services.checkFolderExist = (path) => {
    const fs = require("fs");
    return new Promise((resolve) => {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  // 3 window & macos 查看github上 opencore 的版本
  window.services.getGithubOpencoreVersion = () => {
    const { request } = require("https");

    const options = {
      hostname: "api.github.com",
      port: 443,
      path: "/repos/acidanthera/OpenCorePkg/releases/latest",
      method: "GET",
      headers: {
        "User-Agent": "OpenCore Configurator Online/1.0.0",
      },
    };

    return new Promise((resolve, reject) => {
      const req = request(options, (res) => {
        res.on("data", (d) => {
          const dd = d.toString();
          if (dd.includes("tag_name")) {
            const regex = /"tag_name":"([^"]+)"/;
            const match = regex.exec(dd);
            if (match && match.length > 1) {
              resolve(match[1]);
            }
          }
        });
      });

      req.on("error", (e) => {
        reject(e);
        console.error(`请求遇到问题: ${e.message}`);
      });

      req.end();
    });


  };

  // 4 window & macos 下载最新版 opencore
  window.services.downloadOpencore = (zipfilePath, version) => {

    //随机选择一个代理服务器下载
    const mirrors = [
      'ghp.ci',
      'github.moeyy.xyz',
      'cf.ghproxy.cc',
      'mirror.ghproxy.com',
      'hub.gitmirror.com',
      'gh.api.99988866.xyz'
    ];

    const durl = `https://${mirrors[Math.floor(Math.random()*mirrors.length)]}/https://github.com/acidanthera/OpenCorePkg/releases/download/${version}/OpenCore-${version}-RELEASE.zip`;
    console.log('下载地址：' + durl);
    const fs = require("fs");
    const https = require("https");

    return new Promise((resolve, reject) => {
      https
        .get(durl, (res) => {
          const file = fs.createWriteStream(zipfilePath);
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve(zipfilePath);
          });
        })
        .on("error", (err) => {
          reject(err.message);
          console.log("Error: ", err.message);
        });
    });
  };

  // 5 window & macos 解压文件
  window.services.unzipFile = (zipfilePath, unzipPath) => {
    return new Promise((resolve, reject) => {
      const AdmZip = require("./public/adm-zip");
      try {
        const zip = new AdmZip(zipfilePath);
        //const unzipPath = `${folder}OpenCore-${version}-RELEASE`;
        zip.extractAllTo(unzipPath, true);
        resolve(unzipPath);
      } catch (err) {
        reject(err);
      }

    });
  };

  // 6 window & macos 读取指定目录下的文件列表
  window.services.getFileNameList = (path) => {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          console.log("Error: ", err.message);
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  };

  // 7 window & macos 复制文件
  window.services.copyFile = (source, destination) => {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
      // 复制文件，如果目标文件存在则覆盖它
      fs.access(source, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(`源文件 ${source} 不存在,跳过`);
          resolve();
        } else {
          fs.copyFile(source, destination, (err) => {
            if (err) {
              console.log("Error: ", err.message);
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  };

  // 8 window & macos 得到一个文件的大小
  window.services.getFileSize = (file) => {

    const fs = require('fs');

    return new Promise((resolve) => {

      fs.stat(file, (err, stats) => {
        if (err) {
          resolve(0)
        } else {
          resolve(stats.size);
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
      const sudo = require("./public/sudo-prompt");
      console.log("执行命令：" + stringShell);
      return new Promise((resolve, reject) => {
        sudo.exec(
          stringShell,
          { name: "OpenCore Configurator" },
          (error, stdout) => {
            if (error) {
              reject(error);
            } else {
              resolve(stdout);
            }
          }
        );
      });
    };

    // 3 查看本地 opencore 的版本
    window.services.getLocalOpencoreVersion = () => {
      const shell = `nvram 4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102:opencore-version`;
      return pubcomm_exec_promise(shell);
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
