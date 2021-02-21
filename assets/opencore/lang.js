
const GLOBAL_LANG = {
    'zh-CN' : {
        down : '保存',
        copy : '复制',
        no_file : '没有配置文件 ...',
        choose : '打开',
        change : '更换',
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
        hexstringlengthisodd : '<{@1}>不是有效的十六进制字符串, 因为十六进制字符串的长度不能为奇数',
        pleasecheckmessage : '请勾选需要的选项，然后点击 确定 按钮, 放弃请点击 关闭 按钮',
        supportversion : '注意: 当前版本保存后的plist文件最高支持官方发布的OpenCore-0.6.6-RELEASE',
        footermessage:'最高支持: OpenCore-0.6.6-RELEASE 修改于20210221 email:295799583@qq.com'
    },

    'en-US' : {
        down : 'Save',
        copy : 'Copy',
        no_file : 'No config files ...',
        choose : 'Open',
        change : 'Change',
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
        hexstringlengthisodd : '<{@1}> is not a valid hexadecimal string, because the length of a hexadecimal string cannot be odd',
        pleasecheckmessage : 'Please check the required options, and then click the OK button, to give up, please click the Close button',
        supportversion : 'Note: The plist file saved in the current version supports up to the officially released OpenCore-0.6.6-RELEASE',
        footermessage:'Maximum support: OpenCore-0.6.6-RELEASE Updated 20210221 email:295799583@qq.com'
    }
};
