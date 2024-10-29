use std::fs;
use std::fs::File;
use reqwest::blocking::get;
use std::io::{self, Write};
use std::path::{Path,PathBuf};
use sudo_prompt::{Opts, SudoPrompt};
use zip::read::ZipArchive;
use serde_json::json;
//use tauri_plugin_shell::ShellExt;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn mount_efi_disk(diskname: &str) -> String {
    let prompt = SudoPrompt {};
    let shell = format!("diskutil mount {}", diskname);
    let result = prompt
        .exec(&Opts {
            cmd: shell.to_string(),
            env: None,
            name: Some("OpenCore Configuration Web Editor".to_string()),
        })
        .unwrap();

    //format!("{}", result.stdout)
    match result.stdout {
        Some(t) => t.to_string(),
        None => "".to_string(),
    }
}

//读取指定的文件内容
#[tauri::command]
fn read_file_to_string(filepath: &str) -> String {
    return fs::read_to_string(filepath).unwrap();
}

//保存指定的文件内容, 成功返回 OK
#[tauri::command]
fn save_file(filepath: &str, content: &str) -> String {
    let path = Path::new(filepath);

    // 尝试打开文件，如果文件不存在则创建它
    let mut file = match File::create(&path) {
        Ok(file) => file,
        Err(_e) => return "Failed to create or open file".to_string(),
    };

    // 尝试写入内容到文件
    if let Err(_e) = file.write_all(content.as_bytes()) {
        //return Err(format!("Failed to write to file: {}", e));
        return "Failed to write to file".to_string();
    }

    // 刷新缓冲区以确保所有数据都写入磁盘
    if let Err(_e) = file.flush() {
        //return Err(format!("Failed to flush file: {}", e));
        return "Failed to flush file".to_string();
    }

    // 返回成功消息
    "Ok".to_string()
}

//检测文件是否存在, 存在就返回文件大小, 不存在返回 0
#[tauri::command]
fn get_file_size(filepath: &str) -> u64 {
    let path = Path::new(filepath);
    
    // 检查文件是否存在
    if path.exists() {
        // 获取文件的元数据
        match fs::metadata(path) {
            Ok(metadata) => metadata.len(), // 返回文件大小
            Err(_) => 0, // 如果无法获取元数据，返回 0
        }
    } else {
        0 // 文件不存在，返回 0
    }
}

//下载指定文件到指定目录,下载成功返回文件大小, 下载失败返回 0
#[tauri::command]
fn download_file(url: &str, outputdir: &str) -> u64 {
    // 获取文件名
    let filename = url.split('/').last().unwrap_or("downloaded_file");
    let output_path = Path::new(outputdir).join(filename);

    // 发送请求
    match get(url) {
        Ok(response) => {
            // 确保响应状态为成功
            if response.status().is_success() {
                // 创建文件
                let mut file = match File::create(&output_path) {
                    Ok(file) => file,
                    Err(_) => return 0,
                };

                // 写入文件内容
                match io::copy(&mut response.bytes().unwrap().as_ref(), &mut file) {
                    Ok(size) => size,
                    Err(_) => 0,
                }
            } else {
                0
            }
        }
        Err(_) => 0,
    }
}

//解压指定的文件
#[tauri::command]
fn unzip_file_to_dir(zippath: &str, destdir: &str) -> String {
    // 尝试打开 zip 文件
    let file = File::open(zippath);
    let file = match file {
        Ok(f) => f,
        Err(e) => return format!("Error opening file: {}", e),
    };

    // 创建 ZipArchive 以便解压
    let mut archive = match ZipArchive::new(file) {
        Ok(a) => a,
        Err(e) => return format!("Error reading zip archive: {}", e),
    };

    // 获取解压目的路径
    let output_dir = Path::new(destdir);

    // 解压每一个文件
    for i in 0..archive.len() {
        let mut file = match archive.by_index(i) {
            Ok(f) => f,
            Err(e) => return format!("Error accessing file in archive: {}", e),
        };
        let outpath = output_dir.join(file.name());

        // 判断是文件夹还是文件并执行相应操作
        if file.is_dir() {
            if let Err(e) = std::fs::create_dir_all(&outpath) {
                return format!("Error creating directory: {}", e);
            }
        } else {
            if let Some(p) = outpath.parent() {
                if let Err(e) = std::fs::create_dir_all(&p) {
                    return format!("Error creating parent directory: {}", e);
                }
            }
            let mut outfile = match File::create(&outpath) {
                Ok(f) => f,
                Err(e) => return format!("Error creating output file: {}", e),
            };
            if let Err(e) = io::copy(&mut file, &mut outfile) {
                return format!("Error writing to output file: {}", e);
            }
        }
    }
    "Ok".to_string()
}

//获取要更新哪些文件
#[tauri::command]
fn list_files_in_dir(dirpath: &str) -> String {
    let path = Path::new(dirpath);
    let mut files = vec![];

    // 检查路径是否存在且为目录
    if !path.exists() || !path.is_dir() {
        return json!({"error": "Directory does not exist or is not a directory"}).to_string();
    }

    // 使用递归遍历目录
    fn visit_dirs(dir: &Path, base_path: &Path, file_list: &mut Vec<String>) {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    let file_name = entry.file_name();
                    let file_name_str = file_name.to_string_lossy();

                    // 排除以 '.' 开头的文件和目录
                    if path.is_file() && !file_name_str.starts_with('.') {
                        // 获取相对路径
                        if let Ok(relative_path) = path.strip_prefix(base_path) {
                            file_list.push(relative_path.to_string_lossy().to_string());
                        }
                    } else if path.is_dir() && !file_name_str.starts_with('.') {
                        visit_dirs(&path, base_path, file_list); // 递归调用
                    }
                }
            }
        }
    }

    visit_dirs(path, path, &mut files);

    // 转换为 JSON 格式
    json!({ "files": files }).to_string()
}

//复制指定的文件到指定的目录中
#[tauri::command]
fn copy_file_to_dir(srcfile: &str, destdir: &str) -> String {
    let src_path = Path::new(srcfile);
    let dest_path = Path::new(destdir);

    // 检查源文件是否存在且是文件
    if !src_path.exists() || !src_path.is_file() {
        return format!("Error: Source file '{}' does not exist or is not a file", srcfile);
    }

    // 检查目标路径是否为目录
    if !dest_path.exists() || !dest_path.is_dir() {
        return format!("Error: Destination '{}' does not exist or is not a directory", destdir);
    }

    // 生成目标文件路径
    let mut dest_file_path = PathBuf::from(destdir);
    if let Some(file_name) = src_path.file_name() {
        dest_file_path.push(file_name);
    } else {
        return "Error: Source file name could not be determined".to_string();
    }

    // 执行文件复制
    match fs::copy(src_path, &dest_file_path) {
        Ok(_) => "Ok".to_string(),
        Err(e) => format!("Error copying file: {}", e),
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            mount_efi_disk,
            read_file_to_string,
            save_file,
            get_file_size,
            download_file,
            unzip_file_to_dir,
            list_files_in_dir,
            copy_file_to_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


