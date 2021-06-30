
const SYSTEM_TIPS = {

    ACPI:{
        title:'ACPI（高级配置和电源接口）是发现和配置计算机硬件的开放标准。ACPI 规范定义了标准表（例如 DSDT、SSDT、FACS、DMAR）和各种实现方法（例如_DSM、_PRW）。现代硬件只需很少更改才能保持 ACPI 兼容性，但其中一些硬件是作为 OpenCore 的一部分提供的。',

        Add:{
            title:'类型：plist 数组\n故障安全：空\n说明：从 OC/ACPI 目录中加载选定的表。\n\n1. 评论\n类型：plist 字符串\n故障安全：空字符串\n说明：用于为条目提供人类可读引用的任意 ASCII 字符串。是否使用此值是实现的。\n2. 已启用\n类型： 列表布尔\n故障安全：错误\n说明：除非设置为 true，否则不会添加此 ACPI 表。\n3. 路径\n类型：plist 字符串\n故障安全：空字符串\n说明：要作为 ACPI 表加载的文件路径。示例值包括 DSDT.aml、SubDir/SSDT-8.aml、SSDT-USBX.ml 等。'
        },

        Delete:{
            title:'屏蔽ACPI (DSDT, SSDT) 表, (可以删除此项, 大多数用户都用不到)'
        },

        Patch:{
            title:'对 DSDT (SSDT) 的内容进行查找和替换'
        },

        Quirks:{
            title:'ACPI 相关设置',
            FadtEnableReset:'NO 在旧硬件上修复重启和关机, 除非需要, 否则不推荐开启',
            NormalizeHeaders:'NO 清除 ACPI 头字段, 只有 macOS 10.13 需要',
            RebaseRegions:'NO 尝试试探性地重新定位 ACPI 内存区域, 除非使用了自定义 DSDT, 否则不需要',
            ResetHwSig:'NO 存在重新启动后因无法维持硬件签名而导致从休眠中唤醒的问题的硬件需要开启',
            ResetLogoStatus:'NO 无法在有 BGRT 表的系统上显示 OEM Windows 标志的硬件需要开启'
        }

    },

    Booter:{
        title:'用于设置 FwRuntimeServices.efi (Slide 值计算, KASLR)',
        Quirks:{
            AllowRelocationBlock:'NO 允许通过重定位块引导macOS',
            AvoidRuntimeDefrag:'YES 修复 UEFI 的运行服务, 例如日期, 时间, NVRAM, 电源控制等',
            DevirtualiseMmio:'NO 减少 Stolen 内存占用空间，扩大 Slide = N 值的范围，但可能与主板不兼容。通常用于 APTIO V 固件 (Broadwell +)',
            DisableSingleUser:'NO 禁止 Cmd + S 和 -s 的使用，使设备更加接近于 T2 白苹果',
            DisableVariableWrite:'NO 禁止 NVRAM 写入, 在 Z390/HM370 等没有原生 macOS 支持 NVRAM 的设备上需要开启',
            DiscardHibernateMap:'NO 重用原始休眠内存映射，仅某些旧硬件需要',
            EnableSafeModeSlide:'YES 允许在安全模式下使用 Slide 值',
            EnableWriteUnprotector:'YES 在执行期间删除 CR0 寄存器中的写入保护',
            ForceBooterSignature:'NO 将macOS引导签名设置为OpenCore启动器',
            ForceExitBootServices:'NO 确保 ExitBootServices 即使在 MemoryMap 发生更改时也能调用成功, 除非有必要, 否则请勿使用',
            ProtectMemoryRegions:'NO 保护内存区域免受错误访问',
			ProtectSecureBoot:'NO 保护UEFI安全启动变量不被写入',
			ProtectUefiServices:'NO 保护UEFI服务不被固件覆盖',
            ProvideCustomSlide:'YES 如果 Slide 值存在冲突, 此选项将强制 macOS 执行以下操作:使用一个伪随机值。 只有在遇到 Only N/256 slide values are usable! 时需要',
			ProvideMaxSlide:'0 在内存不足时提供自定义的KASLR Slide',
			RebuildAppleMemoryMap:'NO 生成与macOS兼容的内存映射',
            SetupVirtualMap:'YES 将 SetVirtualAddresses 调用修复为虚拟地址',
            SignalAppleOS:'NO 报告通过OS Info加载的任何OS的macOS',
            SyncRuntimePermissions:'NO 更新运行时环境的内存权限'
        },
        MmioWhitelist:{
            title:''
        }
    },

    DeviceProperties:{
        title:'用于设置 PCI 设备属性, 如英特尔缓冲帧补丁, 声卡 Layout ID 不同的设备硬件地址不一样! 你需要先通过 Hackintool 或者 Windows 设备管理器 等工具查看 PCI 设备地址',
        Add:{
            title:'设置设备属性'
        },
        Delete:{
            title:'用于删除设备属性 (可以删除此项, 大多数用户都用不到)'
        }

    },

    Kernel:{
        title:'用于说明 OpenCore 的具体加密信息, 配置 Kext 加载顺序以及屏蔽驱动',
        Add_title:'这里是你指定要加载哪些 Kext 以及仿冒 CPU ID 的地方, <br>这里的顺序非常重要, 所以请确保 Lilu.Kext 始终在第一位! <br>其他优先级更高的 Kext 为 Lilu 的插件, <br>如 VirtualSMC, AppleALC, WhateverGreen 等。(有些驱动里面还包含插件驱动, 如:VoodooI2C, VoodooPS2 注意要把里面的插件也全部列出)',
        Block_title:'屏蔽系统里的 Kext',
        Patch_title:'这是你要添加系统内核补丁, Kext 补丁, 和 AMD CPU 补丁的地方。(等同于 Clover 的 KextToPatch 和 KernelToPatch)',
        Emulate_title:'小兵博客没写这项啊, 所以我也不知道',
        Quirks:{
            AppleCpuPmCfgLock:'NO 仅在 BIOS 中无法禁用 CFG-Lock 时才需要',
            AppleXcpmCfgLock:'NO 仅在 BIOS 中无法禁用 CFG-Lock 时才需要',
            AppleXcpmExtraMsrs:'NO 禁用奔腾和某些至强等不支持 CPU 所需的多个 MSR 访问',
            AppleXcpmForceBoost:'NO 在XCPM模式下强制发挥最佳性能',
            CustomSMBIOSGuid:'NO 对 UpdateSMBIOSMode 自定义模式执行 GUID 修补, 用于戴尔笔记本电脑 (等同于 Clover 的 DellSMBIOSPatch)',
            DisableIoMapper:'NO 需要绕过 VT-d 且 BIOS 中禁用时使用',
            DisableLinkeditJettison:'禁用__LINKEDIT抛售代码。此选项使Lilu.kext以及可能的其他功能在macOS Big Sur中以最佳性能运行而无需keepsyms = 1引导参数',
			DisableRtcChecksum:'禁用 AppleRTC 中写入的主校验和 （0x58-0x59）',
            ExtendBTFeatureFlags:'NO 将FeatureFlags设置为0x0F，以获得Bluetooth的全部功能，包括Continuity。注意：此选项替代了BT4LEContinuityFixup.kext，由于更新太晚而无法正常运行修补进度。',
            ExternalDiskIcons:'YES 硬盘图标补丁, macOS 将内部硬盘视为外接硬盘 (黄色) 时使用',
            ForceSecureBootScheme:'NO 强制使用x86方案进行IMG4验证。<br>注意：当使用与x86legacy不同的SecureBootModel时，在虚拟机上需要此选项',
            IncreasePciBarSize:'NO 将IOPCIFamily中的32位PCI条尺寸从1 GB增加到4 GB',
            LapicKernelPanic:'NO 禁用由 AP 核心 lapic 中断造成的内核崩溃, 通常用于惠普电脑 (等同于 Clover 的 Kernel LAPIC)',
            LegacyCommpage:'NO 将默认的64位combpage bcopy实现替换为不需要的实现SSSE3，对旧平台有用。 这可以防止由于没有可用内容而导致上一次恐慌不匹配的commpage不需要SSSE3的64位bcopy函数。',
            PanicNoKextDump:'YES 在发生内核崩溃时阻止输出 Kext 列表, 提供可供排错参考的日志',
            ThirdPartyDrives:'NO 将供应商修补程序应用于IOAHCIBlockStorage.kext，以启用第三方驱动器的本机功能，例如SSD上的TRIM或10.15及更高版本上的休眠支持',
            PowerTimeoutKernelPanic:'YES 修复 macOS Catalina 中由于设备电源状态变化超时而导致的内核崩溃',
            ProvideCurrentCpuInfo:'NO 向内核提供当前的 CPU 信息',
            SetApfsTrimTimeout:'-1 为SSD上的APFS文件系统设置微调超时（以微秒为单位）',
            XhciPortLimit:'YES 这实际上是 15 端口限制补丁, 不建议依赖, 因为这不是 USB 的最佳解决方案。有能力的情况下请选择定制 USB, 这个选项用于没有定制 USB 的设备'
        },
        Scheme:{
            KernelArch:'Auto 如果可用，首选指定的内核体系结构（Auto，i386，i386-user32，x86_64）',
            KernelCache:'Auto 如果可用，首选指定的内核缓存类型（自动，无缓存，Mkext，预链接）',
            FuzzyMatch:'NO 在可用时将内核缓存与不同的校验和一起使用'
        },
        Emulate:{
			DummyPowerManagement:'NO 禁用AppleIntelCpuPowerManagement',
            Cpuid1Data:'为不支持的CPU进行仿冒以加载电源管理,比如Haswell-E的处理器为:F2060300 00000000 00000000 00000000',
            Cpuid1Mask:'为不支持的CPU进行仿冒以加载电源管理,比如Haswell-E的处理器为:010A0000 00000000 00000000 00000000',
			MaxKernel:'模拟CPUID并在指定的macOS版本或更老版本上应用DummyPowerManagement',
			MinKernel:'模拟CPUID并在指定的macOS版本或更新版本上应用DummyPowerManagement'
        }
    },

    Misc:{
        title:'用于 OpenCore 的自身设置',
        Boot_title:'引导界面的设置 (保持原样, 除非你知道你在做什么)',
        Debug_title:'Debug 有特殊用途, 除非你知道你在做什么, 否则保持原样',
        Security_title:'安全',
        Tools_title:'用于运行 OC 调试工具, 例如验证 CFG 锁 (VerifyMsrE2)',
        Entires_title:'用于指定 OpenCore 无法自动找到的无规律引导路径',

        Boot:{
            HibernateMode:'None 休眠检测模式（最好避免与黑苹果一同休眠）,支持以下模式:',
            PickerMode:'选择用于引导管理的引导选择器 <br>1 Builtin -- 引导管理由OpenCore处理，使用了纯文本用户界面<br>2 External -- 如果可用，则使用外部引导管理协议。否则使用内置模式<br>3 Apple -- 如果可用，则使用Apple引导管理。否则使用内置模式',
			PickerVariant:'选择用于启动管理的特定图标集 <br>• Auto — 根据DefaultBackground颜色自动选择一组图标<br>• Default — 普通图标集（不带前缀）<br>• 其他值 — 如果资源支持，则设置自定义图标：例：Acidanthera\\GoldenGate',
            HideAuxiliary:'NO 默认情况下从选择器菜单隐藏辅助条目',
            LauncherOption:'在固件首选项中注册启动器选项以实现持久性<br>•Disabled — 啥也不干<br> •Full — 在启动引导程序时在UEFI变量存储中创建或更新最优先启动选项<br>•Short — 创建短启动选项，而不是完整的启动选项',
            LauncherPath:'Default LauncherOption的启动路径，自定义格式如：\\EFI\\SomeLauncher.efi',
            PollAppleHotKeys:'YES 允许在引导过程中使用苹果原生快捷键, 需要与 AppleGenericInput.efi 或 UsbKbDxe.efi 结合使用, 具体体验取决于固件',
            Timeout:'5 设置引导项等待时间',
			ConsoleAttributes:'0 设置控制台的特定属性',
			PickerAttributes:'0 设置选择器的特定属性',
			PickerAudioAssist:'NO 默认情况下在启动选择器中启用屏幕阅读器',
            TakeoffDelay:'0 处理选择器启动和操作热键之前执行的延迟（以微秒为单位）',
            ShowPicker:'YES 显示 OpenCore 的 UI, 用于查看可用引导项, 设置为 NO 可以和 PollAppleHotKeys 配合提升体验'
        },
        Debug:{
			AppleDebug:'NO 启用boot.efi调试日志保存到OpenCore日志',
			ApplePanic:'NO 将macOS内核紧急情况保存到OpenCore根分区',
            DisableWatchDog:'NO 某些固件可能无法成功快速启动操作系统，尤其是在调试模式下，这会导致看门狗定时器中止该过程。此选项关闭看门狗计时器',
            DisplayDelay:'0 屏幕上显示每条打印线后执行的微秒延迟',
            DisplayLevel:'0 屏幕上显示了EDK II调试级别位掩码（总和）。除非Target启用控制台（屏幕上）打印，否则屏幕上的调试输出将不可见',
			SerialInit:'NO 执行串口初始化',
			SysReport:'NO 在ESP文件夹上生成系统报告',
            Target:'0 启用的日志记录目标的位掩码（总和）。默认情况下，所有日志记录输出都是隐藏的，因此在需要调试时需要设置此选项'
        },
        Security:{
            AllowNvramReset:'NO 允许CMD + OPT + P + R处理并在引导选择器中启用显示NVRAM重置条目',
            AllowSetDefault:'NO 允许CTRL + Enter和CTRL + Index处理来设置启动选择器中的默认启动选项',
            AllowToggleSip:'NO 在 OpenCore 选择器中启用用于禁用和启用系统完整性保护的条目',
            AuthRestart:'NO 启用与VirtualSMC兼容的身份验证重新启动',
            BlacklistAppleUpdate:'NO 忽略尝试更新Apple外围设备固件的引导选项（例如 MultiUpdater.efi）',
			ApECID:'苹果飞地标识符',
            Signed:'Signed 定义用于macOS恢复的磁盘映像（DMG）加载策略',
            EnablePassword:'NO 启用密码保护以允许敏感操作',
            PasswordHash:'设置EnabledPassword时使用的密码哈希',
            PasswordSalt:'设置EnabledPassword时使用的密码盐',
            SecureBootModel:'Default Apple安全启动硬件模型',
            ExposeSensitiveData:'操作系统的敏感数据公开位掩码（总和）',
            HaltLevel:'EDK II调试级别位掩码（总和）在获取HaltLevel消息后导致CPU停止（停止执行）。可能的值与DisplayLevel值匹配',
			Vault:'在OpenCore中启用存储机制 <br>1 Optional -- 不需要任何东西，不执行任何保管库，不安全<br>2 Basic -- 要求OC目录中存在vault.plist文件。这提供了基本的文件系统完整性验证并可以防止意外的文件系统损坏<br>3 Secure -- 在OC目录中需要vault.sig签名文件作为vault.plist的文件。这包括基本完整性检查，但也尝试建立可信任的启动链',
            DmgLoading:'Signed 定义用于 macOS 恢复的磁盘映像 (DMG) 加载策略',
            ScanPolicy:'定义操作系统检测策略'
        }

    },

    NVRAM:{
        title:'用于注入 NVRAM (如引导标识符和 SIP)',
        LegacyEnable:'NO 启用从EFI卷根目录加载名为nvram.plist的NVRAM变量文件<br>1 没有原生 NVRAM 的设备设置为 YES<br>2 macOS 下硬件 NVRAM 工作「不」正常的设备设置为 YES<br>3 macOS 下硬件 NVRAM 工作正常的设备设置为',
        LegacyOverwrite:'NO 允许覆盖nvram.plist中的固件变量',
        WriteFlash:'NO 允许为所有添加的变量写入闪存'
    },

    PlatformInfo:{
        title:'用于设置 SMBIOS 机型信息',
        configisfull:'如果你打算使用的 SMBIOS 苹果已经停止支持(2011年或更早)或者你是用的是戴尔 OEM 笔记本, 那么请先勾选这里并「认真」补全所有 SMBIOS 信息, 然后再点击 下载 或者 复制 按钮',
        root:{
            UpdateSMBIOSMode:'更新SMBIOS字段方法',
            UseRawUuidEncoding:'NO 对SMBIOS UUID使用原始编码',
            Create:'将表替换为在AllocateMaxAddress处新分配的EfiReservedMemoryType，而没有任何后备',
            TryOverwrite:'如果新大小小于对齐页面的原始大小，则覆盖，并且旧版区域解锁没有问题。否则创建。某些固件有问题',
            Overwrite:'如果适合新大小，则覆盖现有的gEfiSmbiosTableGuid和gEfiSmbiosTable3Guid数据。否则以未指定状态中止',
            Custom:'将第一个SMBIOS表（gEfiSmbiosTableGuid）写入gOcCustomSmbiosTableGuid，以解决固件在ExitBootServices覆盖SMBIOS内容的问题。否则等效于创建。要求修补AppleSmbios.kext和AppleACPIPlatform.kext以便从另一个GUID读取：“ EB9D2D31”-“ EB9D2D35”（ASCII），由CustomSMBIOSGuid自动完成',
            Automatic:'NO 根据通用部分而不是使用DataHub，NVRAM和SMBIOS部分的值生成PlatformInfo',
            CustomMemory:'NO 使用“内存”部分中定义的自定义内存配置。这将完全替换SMBIOS中的任何现有内存配置，并且仅在UpdateSMBIOS设置为true时才处于活动状态',
            UpdateDataHub:'NO 更新数据中心字段。这些字段是根据“Automatic”值从“Generic”或“DataHub”部分读取的',
            UpdateNVRAM:'更新与平台信息有关的NVRAM字段',
            UpdateSMBIOS:'更新SMBIOS字段。这些字段是从“Generic”或“SMBIOS”部分读取的，具体取决于“Automatic”值'
        },

        Generic:{
            AdviseFeatures:'NO 使用支持的位更新固件功能',
            MaxBIOSVersion:'NO 将BIOSVersion设置为9999.999.999.999.999，建议在使用“自动”功能的旧Mac上使用PlatformInfo避免在非官方支持的macOS版本中更新BIOS',
            SystemMemoryStatus:'指示系统内存是否可以在PlatformFeature中升级。 这控制可见度“关于此Mac”中的“内存”选项卡',
            SpoofVendor:'YES 仿冒制造商为 Acidanthera 来避免出现冲突',
            SystemProductName:'',
            MLB:'用 macserial 读取或生成',
            ProcessorType:'0 处理器主要类型和次要类型的组合',
            ROM:'可以是任意 6 Byte MAC 地址, 如 0x112233000000',
            SystemProductName:'用 macserial 读取或生成',
            SystemSerialNumber:'用 macserial 读取或生成',
            SystemUUID:'填入设备的硬件 UUID 以免造成 Windows 和其它软件的激活问题 (官方不再建议留空)'

        }
    },

    UEFI:{
        title:'用于加载 UEFI 驱动以及以何种顺序加载',
        ConnectDrivers:'YES 强制加载 .efi 驱动程序, 更改为 NO 将自动连接 UEFI 驱动程序, 这样以获得更快的启动速度, 但并非所有驱动程序都可以自行连接, 某些文件系统驱动程序可能无法加载',
        Drivers:'在这里添加你的 .efi 驱动',
        Input:{
			KeyFiltering:'NO 启用键盘输入完整性检查',
            KeyForgetThreshold:'5 按住按键后每个键之间的时间间隔 (单位:毫秒)',
            KeySupport:'YES 开启 OC 的内置键盘支持 使用 UsbKbDxe.efi 请设置为 NO',
            KeySupportMode:'Auto 键值转换协议模式 V1:UEFI 旧版输入协议    V2:UEFI 新输入协议',
            KeySwap:'NO 交换 Command 和 Option 键',
            PointerSupport:'NO 修复 UEFI 选择器协议',
            PointerSupportMode:'留空 设置用于内部指针驱动程序的OEM协议 ',
            TimerResolution:'50000 固件时钟刷新的频率 (单位:100纳秒) 华硕主板为自己的界面使用 60000 苹果使用 100000'
        },

		Audio:{
			AudioSupport:'NO 通过连接到后端驱动程序来激活音频支持',
			PlayChime:'空 在启动时播放提示音 <br>•Auto —当StartupMute NVRAM变量不存在或设置为00时启用提示音<br>•Enabled-无条件启用提示音<br>•Disabled-无条件禁用提示音',
            ResetTrafficClass:'NO 将HDA流量类别选择寄存器设置为TC0',
            SetupDelay:'音频编解码器重新配置延迟（以微秒为单位）',
            AudioDevice:'用于音频支持的指定音频控制器的设备路径',
            AudioCodec:'指定音频控制器上的编解码器地址以支持音频',
            AudioOut:'指定编解码器输出端口的索引从0开始',
            MinimumVolume:'最小音量从0到100',
            VolumeAmplifier:'系统体积到原始体积线性转换的乘法系数从0到1000'
		},

		APFS:{
			EnableJumpstart:'NO 从APFS容器加载嵌入式APFS驱动程序',
			GlobalConnect:'NO 在APFS加载期间执行完整的设备连接',
			HideVerbose:'NO 隐藏APFS驱动程序的详细输出',
			JumpstartHotPlug:'NO 为新连接的设备加载APFS驱动程序',
			MinDate:'0 允许的最小APFS驱动程序日期',
			MinVersion:'0 允许的最低APFS驱动程序版本'
		},
        AppleInput:{
            AppleEvent:'Auto 确定是否使用OC内置或OEM Apple Event协议',
            CustomDelays:'Auto 启用自定义按键重复延迟',
            KeyInitialDelay:'在Apple Event协议的OpenCore实施中配置初始键盘重复延迟，以10ms为单位',
            KeySubsequentDelay:'在Apple Event协议的OpenCore实施中配置后续的键盘重复延迟，以10ms为单位',
            PointerSpeedDiv:'在Apple Event协议的OpenCore实施中配置指针速度除数',
            PointerSpeedMul:'在Apple Event协议的OpenCore实现中配置指针速度倍增器'
        },
        Output:{ 
            TextRenderer:'为通过标准控制台输出的文本选择渲染器<br>1 BuiltinGraphics -- 切换到“图形”模式并将内置渲染器与自定义ConsoleControl一起使用<br>2 SystemGraphics -- 切换到“图形”模式，然后将系统渲染器与自定义ConsoleControl一起使用<br>3 SystemText -- 切换到文本模式，然后将系统渲染器与自定义ConsoleControl一起使用<br>4 SystemGeneric -- 将系统渲染器与系统ConsoleControl一起使用，并假设其行为正确', 
            ConsoleMode:'按照WxH（例如80x24）格式的字符串指定的设置控制台输出模式', 			
            Resolution:'设置控制台输出屏幕分辨率<br>•设置为WxH @ Bpp（例如1920x1080 @ 32）或WxH（例如1920x1080）格式的字符串以请求自定义分辨率从GOP（如果有）<br>•空字符串 不更改屏幕分辨率<br>•Max 设置为最大以尝试使用最大的可用屏幕分辨率',
            ClearScreenOnModeSwitch:'NO 从图形模式切换到文本模式时，某些固件仅清除部分屏幕，先前绘制的图像片段可见。此选项会先用黑色填充整个图形屏幕切换至文字模式', 
            IgnoreTextInGraphics:'NO 选择固件可在图形和文本模式下在屏幕上输出文本。这通常是意外的，因为随机文本可能会出现在图形图像上并导致UI损坏。将此选项设置为true将当控制台控件处于不同于“文本”的模式时，丢弃所有文本输出', 
            ProvideConsoleGop:'NO 确保控制台句柄上的GOP（图形输出协议）', 
            DirectGopRendering:'NO 使用内置的图形输出协议渲染器进行控制台',
            ForceResolution:'NO 在默认情况下（例如在旧版Intel GMA和第一代Intel HD Graphics（Ironlake / Arrandale）上）无法使用所需分辨率的情况下，强制设置分辨率。将“分辨率”设置为“最大”将尝试从连接的显示器的EDID中获取最大的可用分辨率',
            GopPassThrough:'NO 在UGA协议实例之上提供GOP协议实例',
            ReconnectOnResChange:'NO 更改屏幕分辨率后重新连接控制台控制器', 
            ReplaceTabWithSpace:'NO 某些固件无法打印制表符甚至其后的所有内容，从而造成困难或无法使用UEFI Shell内置文本编辑器来编辑属性列表和其他文档。这个选项使控制台输出空间而不是选项卡', 
            SanitiseClearScreen:'NO 某些固件在尝试清除时将屏幕分辨率重置为故障保护值（例如1024x768）使用大显示（例如2K或4K）时的屏幕内容。此选项尝试应用解决方法。',
			UgaPassThrough:'NO 在GOP协议之上提供UGA协议实例'
        },

        ProtocolOverrides:{
            AppleAudio:'NO 安装具有内置版本的Apple音频协议',
            AppleBootPolicy:'NO 用于确保虚拟机或旧白苹果上兼容 APFS',
			AppleDebugLog:'NO 重新安装具有内置版本的Apple Debug Log协议',
            AppleEg2Info:'NO 用内置版本替换 Apple EFI Graphics 2 协议',
			AppleFramebufferInfo:'NO 重新安装具有内置版本的Apple Framebuffer Info协议。 这可以用来覆盖VM或旧版Mac上的帧缓冲信息，以提高与旧版EfiBoot的兼容性，例如macOS 10.4',
            AppleImageConversion:'NO 重新安装具有内置版本的Apple Image Conversion协议',
            AppleImg4Verification:'NO 重新安装具有内置版本的Apple IMG4 Verification协议。 该协议用于验证Apple安全启动使用的im4m清单文件',
            AppleKeyMap:'NO 安装具有内置版本的Apple Key Map协议',
			AppleRtcRam:'NO 重新安装具有内置版本的Apple RTC RAM协议',
            AppleSecureBoot:'NO 重新安装具有内置版本的Apple Secure Boot协议',
            AppleSmcIo:'NO 重新安装具有内置版本的Apple SMC I / O协议',
            AppleUserInterfaceTheme:'NO 重新安装具有内置版本的Apple用户界面主题协议',            
            DataHub:'NO 重新安装数据库',
            DeviceProperties:'NO 确保在 VM 或旧白苹果上完全兼容',
            FirmwareVolume:'NO 修复 Filevault 的 UI 问题, 设置为 YES 可以获得更好地兼容 FileVault',
            HashServices:'NO 修复运行 FileVault 时鼠标光标大小不正确的问题, 设置为 YES 可以更好地兼容 FileVault',
            OSInfo:'NO 强制使用内置版本重新安装OS Info协议。该协议通常用于从macOS引导程序，固件或其他应用程序接收通知',
            UnicodeCollation:'NO 一些较旧的固件破坏了 Unicode 排序规则, 设置为 YES 可以修复这些系统上 UEFI Shell 的兼容性 (通常为用于 IvyBridge 或更旧的设备)'
        },
        Quirks:{
            IgnoreInvalidFlexRatio:'NO BIOS 中无法禁用 MSR_FLEX_RATIO(0x194) 时开启',            
            ReleaseUsbOwnership:'NO 从固件驱动程序中释放 USB 控制器所属权, 除非您不知道自己在做什么, 否则避免使用。Clover 的等效设置是 FixOwnership',   
            ReloadOptionRoms:'NO 查询PCI设备并重新加载其选件ROM（如果有）',    
            RequestBootVarRouting:'YES 从 EFI_GLOBAL_VARIABLE_GUID 中为 OC_VENDOR_VARIABLE_GUID 请求 redirectBoot 前缀变量 <br>启用此项以便能够在与 macOS 引导项设计上不兼容的固件中可靠地使用 启动磁盘 设置',
            UnblockFsConnect:'NO 惠普笔记本在 OpenCore 引导界面没有引导项时设置为 YES',
			
			TscSyncTimeout:'尝试以指定的超时执行TSC同步',
            ActivateHpetSupport:'NO 激活HPET支持',
            DisableSecurityPolicy:'NO 禁用平台安全策略',
            EnableVectorAcceleration:'NO 启用SHA-512和SHA-384哈希算法的AVX矢量加速',
            ForgeUefiSupport:'NO 在EFI 1.x固件上实现部分UEFI 2.x支持',
            ExitBootServicesDelay:'在EXIT_BOOT_SERVICES事件后增加延迟（以微秒为单位）'
        }
    },

    Assist:{            

            ScanPolicy_List:[
                {val:'0x00000001', des:'限定为⽂件系统（OC_SCAN_FILE_SYSTEM_LOCK）'},
                {val:'0x00000002', des:'限定为设备类型（OC_SCAN_DEVICE_LOCK）'},
                {val:'0x00000100', des:'允许扫描 APFS ⽂件系统（OC_SCAN_ALLOW_FS_APFS）'},
                {val:'0x00000200', des:'允许扫描 HFS ⽂件系统（OC_SCAN_ALLOW_FS_HFS）'},
                {val:'0x00000400', des:'允许扫描 EFI System Partition/ESP ⽂件系统（OC_SCAN_ALLOW_FS_ESP）'},
                {val:'0x00000800', des:'允许扫描 NTFS（Windows）⽂件系统（OC_SCAN_ALLOW_FS_NTFS）'},
                {val:'0x00001000', des:'允许扫描 EXT（Linux）⽂件系统（OC_SCAN_ALLOW_FS_EXT）'},
                {val:'0x00010000', des:'允许扫描 SATA 设备（OC_SCAN_ALLOW_DEVICE_SATA）'},
                {val:'0x00020000', des:'允许扫描 SAS 和 Mac NVMe 设备（OC_SCAN_ALLOW_DEVICE_SASEX）'},
                {val:'0x00040000', des:'允许扫描 SCSI 设备（OC_SCAN_ALLOW_DEVICE_SCSI）'},
                {val:'0x00080000', des:'允许扫描 NVMe 设备（OC_SCAN_ALLOW_DEVICE_NVME）'},
                {val:'0x00100000', des:'允许扫描 CD/DVD 旧SATA 设备（OC_SCAN_ALLOW_DEVICE_ATAPI）'},
                {val:'0x00200000', des:'允许扫描 USB 设备（OC_SCAN_ALLOW_DEVICE_USB）'},
                {val:'0x00400000', des:'允许扫描 FireWire 设备（OC_SCAN_ALLOW_DEVICE_FIREWIRE）'},
                {val:'0x00800000', des:'允许扫描读卡器设备（OC_SCAN_ALLOW_DEVICE_SDCARD）'},
                {val:'0x01000000', des:'允许扫描PCI设备（OC_SCAN_ALLOW_DEVICE_PCI）'}
            ],
            

            ExposeSensitiveData_List:[
                {val:'0x01', des:'将可打印的引导程序路径公开为UEFI变量'},
                {val:'0x02', des:'将OpenCore版本公开为UEFI变量'},
                {val:'0x04', des:'在引导选择器菜单标题中公开OpenCore版本'},
                {val:'0x08', des:'将OEM信息公开为一组UEFI变量'}
            ]

            ,DisplayLevel_List:[
                {val:'0x00000002', des:'DEBUG_WARN in DEBUG, NOOPT, RELEASE'},
                {val:'0x00000040', des:'DEBUG_INFO in DEBUG, NOOPT'},
                {val:'0x00400000', des:'DEBUG_VERBOSE in custom builds'},
                {val:'0x80000000', des:'DEBUG_ERROR in DEBUG, NOOPT, RELEASE'}
            ]

            ,Target_List:[

                {val:'0x01', des:'启用日志记录，否则所有日志将被丢弃'},
                {val:'0x02', des:'启用基本控制台（屏幕上）日志记录'},
                {val:'0x04', des:'启用日志记录到数据中心'},
                {val:'0x08', des:'启用串行端口日志记录'},
                {val:'0x10', des:'启用UEFI变量记录'},
                {val:'0x20', des:'启用非易失性UEFI变量日志记录'},
                {val:'0x40', des:'启用记录到文件'}
            ]

            ,PickerAttributes_List:[
                {val:'0x0001', des:'OC_ATTR_USE_VOLUME_ICON，为启动项提供自定义图标'},
                {val:'0x0002', des:'OC_ATTR_USE_DISK_LABEL_FILE，为启动项提供定制的呈现标题'},
                {val:'0x0004', des:'OC_ATTR_USE_GENERIC_LABEL_IMAGE，为没有自定义条目的引导条目提供了预定义的标签图像'},
                {val:'0x0008', des:'OC_ATTR_USE_ALTERNATE_ICONS，将已使用图标集更改为备用图标（如果支持）'}
            ]

            ,TypeDetail_List:[
                {val:'0x0002', des:'其它'},
                {val:'0x0004', des:'未知'},
                {val:'0x0080', des:'同步'},
                {val:'0x2000', des:'已注册（已缓存）'},
                {val:'0x4000', des:'未缓存（未注册）'}
            ]

            ,PickerVariant_List:[
                {val:'Auto',      des:'Auto - 根据DefaultBackground颜色自动选择一组图标'},
                {val:'Default',   des:'Default - 普通图标集（不带前缀） Acidanthera\\GoldenGate'}
               
            ]

            ,KernelArch_List:[
                {val:'Auto',      des:'Auto - 自动选择首选架构'},
                {val:'i386',   des:'i386 - 可用时使用i386（32位）内核'},
                {val:'i386-user32',       des:'i386-user32 - 在可用时使用i386（32位）内核，并在64位上强制使用32位（如果操作系统支持）'},
                {val:'x86_64',       des:'x86_64 - 可用时使用x86_64（64位）内核'}
            ]

            ,KernelCache_List:[
                {val:'Auto',      des:'Auto - 自动'},
                {val:'Cacheless',   des:'Cacheless - 无缓存'},
                {val:'Mkext',       des:'Mkext - 巴拉巴拉'},
                {val:'Prelinked',       des:'Prelinked - 巴拉巴拉'}
            ]

           ,Resolution_List:[
                {val:'Max',           des:'Max - 使用最大的可用屏幕分辨率'},               
                {val:'1152x864',      des:'1152x864'},
                {val:'1280x720',      des:'1280x720'},
                {val:'1280x800',      des:'1280x800'},
                {val:'1280x1024',      des:'1280x1024'},
                {val:'1360x768',      des:'1360x768'},
                {val:'1366x768',      des:'1366x768'},
                {val:'1400x1050',      des:'1400x1050'},
                {val:'1440x900',      des:'1440x900'},
                {val:'1600x900',      des:'1600x900'},
                {val:'1600x1200',      des:'1600x1200'},
                {val:'1680x1050',      des:'1680x1050'},
                {val:'1920x1080',      des:'1920x1080'},
                {val:'2048x1252',      des:'2048x1252'},
                {val:'2048x1536',      des:'2048x1536'},
                {val:'2560x1600',      des:'2560x1600'},
                {val:'2560x2048',      des:'2560x2048'},
                {val:'3840x2160',      des:'3840x2160'},
                {val:'4096x2160',      des:'4096x2160'},
                {val:'5120x2880',      des:'5120x2880'}
                
            ]       
            
            ,LauncherOption_List:[
                {val:'Disabled',           des:'Disabled — 啥也不干'},
                {val:'Full',           des:'Full — 在启动引导程序时在UEFI变量存储中创建或更新最优先启动选项'},
                {val:'Short',           des:'Short — 创建短启动选项，而不是完整的启动选项'}
            
            ],
            AppleEvent_List:[
                {val:'Auto',          des:'Auto — 自动选择实现'},
                {val:'Builtin',       des:'Builtin — 使用OpenCore更新的Apple Event协议重新实现'},
                {val:'OEM',           des:'OEM — 假设在驱动程序连接时可以使用Apple的协议'}
            ],
            CustomDelays_List:[
                {val:'Auto',          des:'Auto — 当KeySupport为true时视为已启用，否则为Disabled'},
                {val:'Enabled',       des:'Enabled — 使用值KeyInitialDelay和KeySubsequentDelay'},
                {val:'Disabled',      des:'Disabled — 苹果的默认值使用500ms（50）和50ms（5）'}
            ],            
            GopPassThrough_List:[
                {val:'Enabled',          des:'Enabled — 为所有 UGA 协议提供 GOP'},
                {val:'Apple',       des:'Apple — 为支持 AppleFramebufferInfo 的协议提供 GOP'},
                {val:'Disabled',      des:'Disabled — 不提供 GOP'}
            ],
            TextRenderer_List:[
                {val:'BuiltinGraphics',          des:'BuiltinGraphics — 切换到图形模式并使用带有自定义 ConsoleControl 的内置渲染器'},
                {val:'BuiltinText',       des:'BuiltinText — 切换到文本模式并使用带有自定义 ConsoleControl 的内置渲染器'},
                {val:'SystemGraphics',      des:'SystemGraphics — 切换到图形模式并使用带有自定义 ConsoleControl 的系统渲染器'},
                {val:'SystemText',      des:'SystemText — 切换到文本模式并使用带有自定义 ConsoleControl 的系统渲染器'},
                {val:'SystemGeneric',      des:'SystemGeneric — 将系统渲染器与系统 ConsoleControl 一起使用，假设它行为正确'}
            ],
            HibernateMode_List:[
                {val:'None',          des:'None — 忽略休眠状态'},
                {val:'Auto',       des:'Auto — 使用 RTC 和 NVRAM 检测'},
                {val:'RTC',      des:'RTC — 使用 RTC 检测'},
                {val:'NVRAM',      des:'NVRAM — 使用 NVRAM 检测'}
            ],
            PickerMode_List:[
                {val:'Builtin',          des:'Builtin — 引导管理由OpenCore处理，使用了纯文本用户界面'},
                {val:'External',       des:'External — 如果可用，则使用外部引导管理协议。否则使用内置模式'},
                {val:'Apple',      des:'Apple — 如果可用，则使用Apple引导管理。否则使用内置模式'}
            ],
            Vault_List:[
                {val:'Optional',          des:'Optional — 什么都不需要，没有强制执行保险库，不安全'},
                {val:'Basic',       des:'Basic — 要求 OC 目录中存在 Vault.plist 文件'},
                {val:'Secure',      des:'Secure — 要求 OC 目录中的 vault.plist 需要 vault.sig 签名文件'}
            ],
            DmgLoading_List:[
                {val:'Disabled',          des:'Disabled — 加载 DMG 图像将失败'},
                {val:'Signed',       des:'Signed — 只会加载 Apple 签名的 DMG 图像'},
                {val:'Any',      des:'Any — 任何 DMG 映像都将作为普通文件系统挂载'}
            ],
            SecureBootModel_List:[
                {val:'Default',          des:'Default'},
                {val:'Disabled',          des:'Disabled'},
                {val:'j137',          des:'j137 — iMacPro1,1 (December 2017)'},
                {val:'j680',          des:'j680 — MacBookPro15,1 (July 2018)'},
                {val:'j132',          des:'j132 — MacBookPro15,2 (July 2018)'},
                {val:'j174',          des:'j174 — Macmini8,1 (October 2018)'},
                {val:'j140k',          des:'j140k — MacBookAir8,1 (October 2018)'},
                {val:'j780',          des:'j780 — MacBookPro15,3 (May 2019)'},
                {val:'j213',          des:'j213 — MacBookPro15,4 (July 2019)'},
                {val:'j140a',          des:'j140a — MacBookAir8,2 (July 2019)'},
                {val:'j152f',          des:'j152f — MacBookPro16,1 (November 2019)'},
                {val:'j160',          des:'j160 — MacPro7,1 (December 2019)'},
                {val:'j230k',          des:'j230k — MacBookAir9,1 (March 2020)'},
                {val:'j214k',          des:'j214k — MacBookPro16,2 (May 2020)'},
                {val:'j223',          des:'j223 — MacBookPro16,3 (May 2020)'},
                {val:'j215',          des:'j215 — MacBookPro16,4 (June 2020)'},
                {val:'j185',          des:'j185 — iMac20,1 (August 2020)'},
                {val:'j185f',          des:'j185f — iMac20,2 (August 2020)'},
                {val:'x86legacy',          des:'x86legacy — Macs and VMs without T2 chip minimum macOS 11.0'}
            ],
            SystemMemoryStatus_List:[
                {val:'Auto',          des:'Auto — 系统内存状态'},
                {val:'Upgradable',       des:'Upgradable — 在 PlatformFeature 中明确取消设置 PT_FEATURE_HAS_SOLDERED_SYSTEM_MEMORY (0x2)'},
                {val:'Soldered',      des:'Soldered — 在 PlatformFeature 中显式设置 PT_FEATURE_HAS_SOLDERED_SYSTEM_MEMORY (0x2)'}
            ],
            UpdateSMBIOSMode_List:[
                {val:'Create',          des:'Create — 用新分配的 EfiReservedMemoryType 在 AllocateMaxAddress 替换表而不任何后备'},
                {val:'TryOverwrite',       des:'TryOverwrite — 如果新尺寸 <= 比页面对齐的原始尺寸，并且没有问题，则覆盖遗留区域解锁'},
                {val:'Overwrite',      des:'Overwrite — 如果适合新大小，则覆盖现有的 gEfiSmbiosTableGuid 和 gEfiSmbiosTable3Guid 数据'},
                {val:'Custom',      des:'Custom — 将 SMBIOS 表 ( gEfiSmbios(3)TableGuid ) 写入 gOcCustomSmbios(3)TableGuid 以解决问题固件在 ExitBootServices 覆盖 SMBIOS 内容'}
            ],
            PlayChime_List:[
                {val:'Auto',          des:'Auto — 当 StartupMute NVRAM 变量不存在或设置为 00 时启用提示音'},
                {val:'Enabled',       des:'Enabled — 无条件启用铃声'},
                {val:'Disabled',      des:'Disabled — 无条件禁用铃声'}
            ],
            KeySupportMode_List:[
                {val:'Auto',          des:'Auto — 使用以下首选项执行自动选择：AMI、V2、V1'},
                {val:'V1',       des:'V1 — 使用 UEFI 标准传统输入协议 EFI_SIMPLE_TEXT_INPUT_PROTOCOL'},
                {val:'V2',      des:'V2 — 使用 UEFI 标准现代输入协议 EFI_SIMPLE_TEXT_INPUT_EX_PROTOCOL'},
                {val:'AMI',      des:'AMI — 使用 APTIO 输入协议 AMI_EFIKEYCODE_PROTOCOL'}
            ]
            
        }


};