const PAGE_TITLE = {
    lang : {
        down : '下载',
        copy : '复制',
        no_file : '没有配置文件 ...',
        choose : '打开',
        change : '更换',
        alertfileerror : '只能选择plist文件',
        toNumberError : '整形格式的数据被错误的输入了字符串, 可能导致配置文件错误, 请检查, 如果有修改后未提交的数据请先在修改处按回车键提交修改',
        DeviceError : '增加或修改配置行后请按回车键提交, 不需要的空行请删除, 否则可能导致配置文件格式错误',
        copyplistSuccess : '已成功复制到剪贴板中, 请手动粘贴到EFI的config.plist文件中',
        pasteMessage : '请直接先按 Command+V ,然后点击下面的 粘贴 按钮',
        starPaste : '粘贴',
        close : '关闭',
        paste : '粘贴',
        add  : '增加',
        del  : '删除',
        Error : '错误',
        hexstringlengthisodd : '<{@1}>不是有效的十六进制字符串, 因为十六进制字符串的长度不能为奇数'
    },

    ACPI : {
        Title : '用于加载, 屏蔽和修补 ACPI (DSDT, SSDT) 表', 
        
        Add : {
            Title : '同步 EFI/OC/ACPI/ 下的文件'
        },

        Block : {
            Title : '屏蔽ACPI (DSDT, SSDT) 表, (可以删除此项, 大多数用户都用不到)'
        },

        Patch : {
            Title : '对 DSDT (SSDT) 的内容进行查找和替换'
        },

        Quirks : {
            Title : 'ACPI 相关设置',
            FadtEnableReset : 'NO 在旧硬件上修复重启和关机, 除非需要, 否则不推荐开启',
            NormalizeHeaders: 'NO 清除 ACPI 头字段, 只有 macOS 10.13 需要',
            RebaseRegions: 'NO 尝试试探性地重新定位 ACPI 内存区域, 除非使用了自定义 DSDT, 否则不需要',
            ResetHwSig: 'NO 存在重新启动后因无法维持硬件签名而导致从休眠中唤醒的问题的硬件需要开启',
            ResetLogoStatus: 'NO 无法在有 BGRT 表的系统上显示 OEM Windows 标志的硬件需要开启'
        }
        
    },

    Booter : {
        Title : '用于设置 FwRuntimeServices.efi (Slide 值计算, KASLR)',
        Quirks : {
            AvoidRuntimeDefrag: 'YES 修复 UEFI 的运行服务, 例如日期, 时间, NVRAM, 电源控制等',
            DevirtualiseMmio: 'NO 减少 Stolen 内存占用空间，扩大 Slide = N 值的范围，但可能与主板不兼容。通常用于 APTIO V 固件 (Broadwell +)',
            DisableSingleUser: 'NO 禁止 Cmd + S 和 -s 的使用，使设备更加接近于 T2 白苹果',
            DisableVariableWrite: 'NO 禁止 NVRAM 写入, 在 Z390/HM370 等没有原生 macOS 支持 NVRAM 的设备上需要开启',
            DiscardHibernateMap: 'NO 重用原始休眠内存映射，仅某些旧硬件需要',
            EnableSafeModeSlide: 'YES 允许在安全模式下使用 Slide 值',
            EnableWriteUnprotector: 'YES 在执行期间删除 CR0 寄存器中的写入保护',
            ForceExitBootServices: 'NO 确保 ExitBootServices 即使在 MemoryMap 发生更改时也能调用成功, 除非有必要, 否则请勿使用',
            ProtectCsmRegion: 'NO 用于修复人为制造和睡眠唤醒的问题, AvoidRuntimeDefrag 已经修复了这个问题所以请尽可能避免使用这个 Quirk',
            ProvideCustomSlide: 'YES 如果 Slide 值存在冲突, 此选项将强制 macOS 执行以下操作: 使用一个伪随机值。 只有在遇到 Only N/256 slide values are usable! 时需要',
            SetupVirtualMap: 'YES 将 SetVirtualAddresses 调用修复为虚拟地址',
            ShrinkMemoryMap: 'NO 有巨大且不兼容内存映射的主板需要开启, 非必须不要使用'
        }
    },

    DeviceProperties : {
        Title : '用于设置 PCI 设备属性, 如英特尔缓冲帧补丁, 声卡 Layout ID 不同的设备硬件地址不一样! 你需要先通过 Hackintool 或者 Windows 设备管理器 等工具查看 PCI 设备地址',
        Add : {
            Title : '设置设备属性'
        },
        Block : {
            Title : '用于删除设备属性 (可以删除此项, 大多数用户都用不到)'
        }

    },

    Kernel : {
        Title : '用于说明 OpenCore 的具体加密信息, 配置 Kext 加载顺序以及屏蔽驱动',
        Add_title : '这里是你指定要加载哪些 Kext 以及仿冒 CPU ID 的地方, \n这里的顺序非常重要, 所以请确保 Lilu.Kext 始终在第一位! \n其他优先级更高的 Kext 为 Lilu 的插件, \n如 VirtualSMC, AppleALC, WhateverGreen 等。(有些驱动里面还包含插件驱动, 如: VoodooI2C, VoodooPS2 注意要把里面的插件也全部列出)',
        Block_title : '屏蔽系统里的 Kext',
        Patch_title : '这是你要添加系统内核补丁, Kext 补丁, 和 AMD CPU 补丁的地方。(等同于 Clover 的 KextToPatch 和 KernelToPatch)',
        Emulate_title : '小兵博客没写这项啊, 所以我也不知道',
        Quirks : {
            AppleCpuPmCfgLock: 'NO 仅在 BIOS 中无法禁用 CFG-Lock 时才需要',
            AppleXcpmCfgLock: 'NO 仅在 BIOS 中无法禁用 CFG-Lock 时才需要',
            AppleXcpmExtraMsrs: 'NO 禁用奔腾和某些至强等不支持 CPU 所需的多个 MSR 访问',
            CustomSMBIOSGuid: 'NO 对 UpdateSMBIOSMode 自定义模式执行 GUID 修补, 用于戴尔笔记本电脑 (等同于 Clover 的 DellSMBIOSPatch)',
            DisbaleIOMapper: 'NO 需要绕过 VT-d 且 BIOS 中禁用时使用',
            ExternalDiskIcons: 'YES 硬盘图标补丁, macOS 将内部硬盘视为外接硬盘 (黄色) 时使用',
            LapicKernelPanic: 'NO 禁用由 AP 核心 lapic 中断造成的内核崩溃, 通常用于惠普电脑 (等同于 Clover 的 Kernel LAPIC)',
            PanicNoKextDump: 'YES 在发生内核崩溃时阻止输出 Kext 列表, 提供可供排错参考的日志',
            ThirdPartyDrives: 'NO 为 SSD 启用 TRIM 指令, NVMe SSD 会自动被 macOS 加载因此不需要',
            XhciPortLimit: 'YES 这实际上是 15 端口限制补丁, 不建议依赖, 因为这不是 USB 的最佳解决方案。有能力的情况下请选择定制 USB, 这个选项用于没有定制 USB 的设备'
        }
    },

    Misc : {
        Title : '用于 OpenCore 的自身设置',
        Boot_title: '引导界面的设置 (保持原样, 除非你知道你在做什么)',
        Debug_title: 'Debug 有特殊用途, 除非你知道你在做什么, 否则保持原样',
        Security_title: '安全',
        Tools_title :  '用于运行 OC 调试工具, 例如验证 CFG 锁 (VerifyMsrE2)',
        Entires_title: '用于指定 OpenCore 无法自动找到的无规律引导路径',
        
        Boot : {
            HibernateMode: 'None 最好避免与黑苹果一同休眠',
            HideSelf: 'YES 在 OpenCore 的启动选择中隐藏自身 EFI 分区的启动项',
            PollAppleHotKeys: 'YES 允许在引导过程中使用苹果原生快捷键, 需要与 AppleGenericInput.efi 或 UsbKbDxe.efi 结合使用, 具体体验取决于固件',
            Timeout: '5 设置引导项等待时间',
            ShowPicker: 'YES 显示 OpenCore 的 UI, 用于查看可用引导项, 设置为 NO 可以和 PollAppleHotKeys 配合提升体验',
            UsePicker: 'YES 使用 OpenCore 的默认 GUI, 如果您希望使用其他 GUI (暂时没有), 则设置为 NO'
        }

    },

    NVRAM : {
        Title : '用于注入 NVRAM (如引导标识符和 SIP)'
    },

    Platforminfo : {
        Title:'用于设置 SMBIOS 机型信息'
    },

    UEFI : {
        Title : '用于加载 UEFI 驱动以及以何种顺序加载',
        ConnectDrivers: 'YES 强制加载 .efi 驱动程序, 更改为 NO 将自动连接 UEFI 驱动程序, 这样以获得更快的启动速度, 但并非所有驱动程序都可以自行连接, 某些文件系统驱动程序可能无法加载',
        Drivers: '在这里添加你的 .efi 驱动',
        Input : {
            KeyForgetThreshold: '5 按住按键后每个键之间的时间间隔 (单位: 毫秒)',
            KeyMergeThreshold: '2 按住按键被重置的时间间隔 (单位: 毫秒)',
            KeySupport: 'YES 开启 OC 的内置键盘支持 使用 UsbKbDxe.efi 请设置为 NO',
            KeySupportMode: 'Auto 键值转换协议模式 V1: UEFI 旧版输入协议    V2: UEFI 新输入协议',
            AMI: 'APTIO 输入协议',
            KeySwap: 'NO 交换 Command 和 Option 键',
            PointerSupport: 'NO    修复 UEFI 选择器协议',
            PointerSupportMode: '留空 ',
            TimerResolution: '50000 固件时钟刷新的频率 (单位: 100纳秒) 华硕主板为自己的界面使用 60000 苹果使用 100000'
        },

        Protocols : {
            AppleBootPolicy: 'NO 用于确保虚拟机或旧白苹果上兼容 APFS',
            ConsoleControl: 'YES macOS 引导加载程序基于文本输出的控制台控制协议, 某些固件缺少该协议。当协议已经在固件中可用时, 需要设置此选项, 并且使用其他控制台控制选项, 例如 IgnoreTextInGraphics, SanitiseClearScreen 以及 ConsoleBehaviourUi 的 ConsoleBehaviourOs',
            DataHub: 'NO 重新安装数据库',
            DeviceProperties: 'NO 确保在 VM 或旧白苹果上完全兼容',
            FirmwareVolume: 'NO 修复 Filevault 的 UI 问题, 设置为 YES 可以获得更好地兼容 FileVault',
            HashServices: 'NO 修复运行 FileVault 时鼠标光标大小不正确的问题, 设置为 YES 可以更好地兼容 FileVault',
            UnicodeCollation: 'NO 一些较旧的固件破坏了 Unicode 排序规则, 设置为 YES 可以修复这些系统上 UEFI Shell 的兼容性 (通常为用于 IvyBridge 或更旧的设备)'
        }
    }
    
    
}