
const GLOBAL_LANG = {

    'zh-CN' : {
        down : '下载',
        save : '保存',
        copy : '复制到剪贴板',
        no_file : '没有配置文件 ...',
        choose : '打开',
        change : '更换',
        unmounted:'未挂载',
        mounted:'已挂载',
        alertfileerror : '只能导入后缀为plist的文件',
        toNumberError : '整形格式的数据被错误的输入了字符串"{@1}", 可能导致配置文件错误, 请检查',
        DeviceError : '增加或修改配置行后请按回车键提交, 不需要的空行请删除, 否则可能导致配置文件格式错误',
        copyplistSuccess : '已成功复制到剪贴板中, 请手动粘贴到EFI的config.plist文件中',
        downplistSuccess : '已成功下载配置文件, 请把它更名成“config.plist”并手动拷贝到EFI/OC目录下覆盖旧文件, 注意备份',
        pasteMessage : '请按 Command+V 或者在下面框中点右键选择粘贴, 然后点击下面的 确定 按钮',
        checkdatafirst : '请先勾选要复制的数据行',
        copydatasuccess : '数据行复制成功',
        InputlengthError : '16进制数据输入长度不是4个字节的倍数',
        CharactersOutsideWarning : '输入字符串中超出Base64范围的字符被忽略',
        pasteDataSuccess : '粘贴成功',
        deleterowsuccess : '删除成功',
        nopasteData : '没有可供粘贴的数据',
        dataFormaterror : '数据格式不对,无法粘贴',
        chooseDevices: '请先在左边选择一条 Devices 记录',
        starPaste : '确定',
        close : '关闭',
        paste : '粘贴',
        add  : '增加',
        del  : '删除',
        Error : '错误',
        enabled : '启用/禁用',
        mountEFIDisk : "挂载系统EFI分区",
        mountSelectedDisk : "挂载选定EFI分区",
        hexstringlengthisodd : '<{@1}>不是有效的十六进制字符串, 因为十六进制字符串的长度不能为奇数',
        pleasecheckmessage : '请勾选需要的选项，然后点击 确定 按钮, 放弃请点击 关闭 按钮',
        editingtablemessage : '下列表格<br>{@1}<br>正在编辑中,请在被编辑的文本框中按回车键保存更改或者按Esc键取消更改',
        footermessage:'适配版本: ',
        loadlastplist:'已加载最后一次保存的config.plist内容',
        plistformaterror:'Plist文件格式错误, 没有找到名为 {@1} 的节点数据',
        tip_no_mount_disk:'没有可供挂载的 EFI 磁盘',
        tip_mount_disk_success:'EFI 分区已经被成功挂载到 {@1} 盘',
        tip_mount_disk_failed:'EFI 分区挂载操作失败，可能EFI分区已经挂载或者盘符被占用',
        tip_mount_disk_ismounted:'当前 EFI 分区已经挂载, 操作失败',
        tip_file_save_success:'文件保存成功',
        tip_file_save_failed:'文件保存失败，请先确认文件是否存在',
        tip_file_download_failed:'文件下载不成功, 操作失败, 可能是代理网站检测到频繁下载启用了真人验证, 请退出程序重试',
        tip_file_upgrade_success:'文件“{@1}”更新成功',
        tip_file_format_error:'配置文件内容格式不正确, 请检查, 错误如下:',
        tip_file_download_start:'开始下载文件',
        tip_file_download_success:'文件下载成功, 开始解压',
        tip_file_decompressed_update:'文件解压成功，开始更新文件',
        span_foot_right_opencore_version:"OpenCore版本信息：本机{@1}，最新{@2}",
        upgrade_opencore:"升级 OpenCore",
        tip_upgrade_opencore_success:"文件更新结束, Opencore 升级成功",
        tip_EFI_partition_not_exist:"请先挂载 EFI 分区“{@1}” ，否则无法升级",
        tip_is_continue_upgrading_opencore:"确认要升级 “{@1}” 分区中的 OpenCore 版本为“{@2}”吗？"
    },

    'en-US' : {
        down : 'Download',
        save : 'Save',
        copy : 'Copy',
        no_file : 'No config files ...',
        choose : 'Open',
        change : 'Change',
        unmounted:'Unmounted',
        mounted:'Mounted',
        alertfileerror : 'Only files with suffix plist can be imported',
        toNumberError : 'The data in the plastic format was incorrectly entered in the string "{@1}", which may cause the configuration file to be wrong. Please check it',
        DeviceError : 'After adding or modifying the configuration line, press enter key to submit, do not need the empty line please delete, otherwise it may result in a profile formatting error',
        copyplistSuccess : 'Successfully copied to the clipboard, please manually paste into the EFI config.plist file',
        downplistSuccess : 'The config.plist file has been downloaded successfully, please manually copy it to the EFI / OC directory to overwrite the old file, pay attention to the backup',
        pasteMessage : 'Please click Command-V or right-click paste in the box below, then click the OK button below',
        checkdatafirst : 'Please check the data rows to be copied first',
        copydatasuccess : 'Data row copied successfully',
        InputlengthError : 'Input length is not a multiple of 4 bytes',
        CharactersOutsideWarning : 'Characters outside Base64 range in input string ignored',
        pasteDataSuccess : 'Pasted successfully',
        deleterowsuccess : 'Delete successfully',
        nopasteData : 'No data to paste',
        dataFormaterror : 'The data format is incorrect and cannot be pasted',
        chooseDevices: 'Please select a Devices record on the left',
        starPaste : 'OK',
        close : 'Close',
        paste : 'Paste',
        add  : 'Add',
        del  : 'Delete',
        Error : 'Error',
        enabled : 'enabled/disabled',
        mountEFIDisk : "Mount system EFI partition",
        mountSelectedDisk : "Mount the selected EFI partition",
        hexstringlengthisodd : '<{@1}> is not a valid hexadecimal string, because the length of a hexadecimal string cannot be odd',
        pleasecheckmessage : 'Please check the required options, and then click the OK button, to give up, please click the Close button',
        editingtablemessage : 'The following table<br><br>{@1}<br>is being edited. Please press enter in the edited text box to save the changes or press ESC to cancel the changes',
        footermessage:'Maximum support: ',
        loadlastplist:'The last saved config.plist content has been loaded',
        plistformaterror:'Plist file format error, no node data named {@1} found',
        tip_no_mount_disk:'No EFI disk to mount',
        tip_mount_disk_success:'The EFI partition has been successfully mounted to the {@1} drive',
        tip_mount_disk_failed:'The EFI partition mounting operation failed. The EFI partition may have been mounted or the drive letter may have been occupied',
        tip_mount_disk_ismounted:'The current EFI partition has been mounted, and the operation failed',
        tip_file_save_success:'File saved successfully',
        tip_file_save_failed:'File saving failed, please confirm whether the file exists first',
        tip_file_download_failed:'File download failed. Operation failed',
        tip_file_upgrade_success:'File {@1} is successfully upgraded',
        tip_file_format_error:'The format of the configuration file is incorrect. Please check it.',
        tip_file_download_start:'Start downloading file',
        tip_file_download_success:'The file is successfully downloaded and decompressed',
        tip_file_decompressed_update:'The file is successfully decompressed and the file update starts',
        span_foot_right_opencore_version:"OpenCore version information: native{@1}, latest{@2}",
        upgrade_opencore:"Upgrade OpenCore",
        tip_upgrade_opencore_success:"The file update is complete and Opencore has been upgraded successfully",
        tip_EFI_partition_not_exist:"Please mount the EFI partition “{@1}” first, otherwise the upgrade cannot be done",
        tip_is_continue_upgrading_opencore:"Are you sure you want to upgrade the OpenCore version to “{@2}” in the {@1}  partition?"
    }
};
