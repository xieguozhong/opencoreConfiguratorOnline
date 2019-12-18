
$(document).ready(function() {
    $('#id-input-file-2').ace_file_input({
        no_file : VUEAPP.lang.no_file,
        btn_choose : VUEAPP.lang.choose,
        btn_change : VUEAPP.lang.change,
        droppable : false,
        onchange : null,
        allowExt : ['plist'],
        thumbnail : false,
        before_change: function(files, dropped){
            let reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function () {
            	VUEAPP['plistcontext'] = formatContext(this.result);
            	//console.log(VUEAPP['plistcontext']);
            	VUEAPP.initAllData();
        	}
            return true;
        }
        }).on('file.error.ace', function(event, info) {
            showTipModal(VUEAPP.lang.alertfileerror, 'error');
    });



    initGridTableACPI();
    initGridTableBooter();
    initGridTableDeviceProperties();
    initGridTableKernel();
    initGridTableMisc();
    initGridTableNVRAM();
    initGridTableUEFI();

    bindAllButton();

    $.minimalTips();

    toastr.options = {
      "closeButton": true,
      "positionClass": "toast-top-center"
    };


});



//绑定所有的按钮的clicks事件
function bindAllButton() {


    for(let i=0,len=GLOBAL_ARRAY_TABLE[0].length;i<len;i++ ) {
        bindClick(GLOBAL_ARRAY_TABLE[0][i]);
    }

    for(let i=0,len=GLOBAL_ARRAY_TABLE[1].length;i<len;i++ ) {
        bindClick(GLOBAL_ARRAY_TABLE[1][i]);
    }



    function bindClick(currentGridTable) {


        let gridtableid = currentGridTable.attr('id');
        let buttonBehind = gridtableid.slice(9);

        // 1 绑定所有的增加按钮
        $("#btnadd" + buttonBehind).on("click",function(){

            //如果是右边表格, 先检查左边有没有选中, 如果没有, 不做任何反应
            if(buttonBehind.substr(-5) === 'Right') {
                let gridid = '#gridtable' + buttonBehind.replace('Right','Left');

                let selectedId = jQuery(gridid).jqGrid("getGridParam", "selrow");
                if(selectedId !== null) {
                    currentGridTable.jqGrid('addRowData', MAXROWID ++ , {pid:selectedId}, 'last');
                }

            } else {

                currentGridTable.jqGrid('addRowData', MAXROWID ++, {}, 'last');
            }


        });


        // 2 绑定所有的删除按钮
        $("#btndel" + buttonBehind).on("click",function(){

            let selectedIds = currentGridTable.jqGrid('getGridParam','selarrrow');

            //如果有选中行, 说明有数据被删除
            if(selectedIds.length > 0) {
                let deleteIds = [];
                for(let i=0,len=selectedIds.length;i<len;i++) {
                    deleteIds.push(parseInt(selectedIds[i]));
                }
                deleteIds.sort(sortNumber);
                let len = deleteIds.length - 1;
                for(let i=len;i>=0;i--) {

                    currentGridTable.jqGrid('delRowData', deleteIds[i]);
                }

                //如果删除左边表格, 要隐藏右边表格
                if(buttonBehind.substr(-4) === 'Left') {
                    let rightGrid = jQuery('#' + gridtableid.replace('Left', 'Right'));
                    let rowIds = rightGrid.getDataIDs();
                    for(let i=0,len=rowIds.length;i<len;i++) {
                        rightGrid.setRowData(rowIds[i],null,{display: 'none'});
                    }
                }

                showTipModal(VUEAPP.lang.deleterowsuccess, 'success');
            }

            function sortNumber(a,b){
				return a - b;
			}

        });


        // 3 绑定所有的复制按钮
        $("#btncopy" + buttonBehind).on("click",function(){

            //先清空剪贴板
            let selectedId = currentGridTable.jqGrid("getGridParam", "selarrrow");
            if(selectedId.length === 0) {
                copyDatatoClipboard(' ');
                showTipModal(VUEAPP.lang.checkdatafirst, 'error');
                return;
            }
            let rowData, strdata = '';
            for(let i=0,len=selectedId.length;i<len;i++) {
                rowData = currentGridTable.jqGrid('getRowData', selectedId[i]);
                if(i > 0) {
                    strdata += ',';
                }
                strdata += JSON.stringify(rowData);
            }

            copyDatatoClipboard('[' + strdata + ']');

            showTipModal(VUEAPP.lang.copydatasuccess, 'success');


        });

        // 4 绑定所有的粘贴按钮
        $("#btnpaste" + buttonBehind).on("click",function(){
            VUEAPP.current_paste_tableid = gridtableid;
            showTextareaModal();
        });

        // 5 绑定所有的 启用/禁用 按钮
        $("#btnenabled" + buttonBehind).on("click",function(){
            let selectedIds = currentGridTable.jqGrid("getGridParam", "selarrrow");


            if(selectedIds.length > 0) {
                let theEnabled = currentGridTable.jqGrid('getCell', selectedIds[0], "Enabled");
                theEnabled = theEnabled === 'YES' ? 'NO' : 'YES';

                for(let i=0,len=selectedIds.length;i<len;i++) {
                    currentGridTable.jqGrid('setCell',selectedIds[i],"Enabled",theEnabled);
                }
            }

        });

    }




}

function addRowUEFIDrivers(drivers) {
    if(drivers.value !== '') {
        let thetable = jQuery('#gridtable-UEFI-Drivers');
        thetable.jqGrid('addRowData', MAXROWID++, {FileName:drivers.value}, 'last');
        drivers.value = '';
    }

}

function addkexts(kext) {

    let allKext = [
        ['RealtekRTL8100.kext','RealtekRTL8100.kext','Contents/MacOS/RealtekRTL8100','Contents/Info.plist'],
        ['ACPIBatteryManager.kext','ACPIBatteryManager.kext','Contents/MacOS/ACPIBatteryManager','Contents/Info.plist'],
        ['AHCI_3rdParty_SATA.kext','AHCI_3rdParty_SATA.kext','','Contents/Info.plist'],
        ['Lilu.kext','Lilu.kext','Contents/MacOS/Lilu','Contents/Info.plist'],
        ['BrcmWLFixup.kext','BrcmWLFixup.kext','Contents/MacOS/BrcmWLFixup','Contents/Info.plist'],
        ['VoodooI2CAtmelMXT.kext','VoodooI2CAtmelMXT.kext','Contents/MacOS/VoodooI2CAtmelMXT','Contents/Info.plist'],
        ['BrcmFirmwareData.kext','BrcmFirmwareData.kext','Contents/MacOS/BrcmFirmwareData','Contents/Info.plist'],
        ['HibernationFixup.kext','HibernationFixup.kext','Contents/MacOS/HibernationFixup','Contents/Info.plist'],
        ['AnyAppleUSBKeyboard.kext','AnyAppleUSBKeyboard.kext','','Contents/Info.plist'],
        ['NoTouchID.kext','NoTouchID.kext','Contents/MacOS/NoTouchID','Contents/Info.plist'],
        ['XHCI-300-series-injector.kext','XHCI-300-series-injector.kext','','Contents/Info.plist'],
        ['BT4LEContinuityFixup.kext','BT4LEContinuityFixup.kext','Contents/MacOS/BT4LEContinuityFixup','Contents/Info.plist'],
        ['AirportBrcmFixup.kext','AirportBrcmFixup.kext','Contents/MacOS/AirportBrcmFixup','Contents/Info.plist'],
        ['AnyAppleUSBMouse.kext','AnyAppleUSBMouse.kext','','Contents/Info.plist'],
        ['VoodooHDA.kext','VoodooHDA.kext','Contents/MacOS/VoodooHDA','Contents/Info.plist'],
        ['AppleALC.kext','AppleALC.kext','Contents/MacOS/AppleALC','Contents/Info.plist'],
        ['AtherosE2200Ethernet.kext','AtherosE2200Ethernet.kext','Contents/MacOS/AtherosE2200Ethernet','Contents/Info.plist'],
        ['IntelMausi.kext','IntelMausi.kext','Contents/MacOS/IntelMausi','Contents/Info.plist'],
        ['VoodooI2CUPDDEngine.kext','VoodooI2CUPDDEngine.kext','Contents/MacOS/VoodooI2CUPDDEngine','Contents/Info.plist'],
        ['SATA-100-series-unsupported.kext','SATA-100-series-unsupported.kext','','Contents/Info.plist'],
        ['IntelMausiEthernet.kext','IntelMausiEthernet.kext','Contents/MacOS/IntelMausiEthernet','Contents/Info.plist'],
        ['VoodooI2CSynaptics.kext','VoodooI2CSynaptics.kext','Contents/MacOS/VoodooI2CSynaptics','Contents/Info.plist'],
        ['SMCSuperIO.kext','SMCSuperIO.kext','Contents/MacOS/SMCSuperIO','Contents/Info.plist'],
        ['XHCI-200-series-injector.kext','XHCI-200-series-injector.kext','','Contents/Info.plist'],
        ['WhateverGreen.kext','WhateverGreen.kext','Contents/MacOS/WhateverGreen','Contents/Info.plist'],
        ['SMCBatteryManager.kext','SMCBatteryManager.kext','Contents/MacOS/SMCBatteryManager','Contents/Info.plist'],
        ['CPUFriendDataProvider.kext','CPUFriendDataProvider.kext','','Contents/Info.plist'],
        ['RealtekRTL8111.kext','RealtekRTL8111.kext','Contents/MacOS/RealtekRTL8111','Contents/Info.plist'],
        ['SATA-RAID-unsupported.kext','SATA-RAID-unsupported.kext','','Contents/Info.plist'],
        ['NullCPUPowerManagement.kext','NullCPUPowerManagement.kext','Contents/MacOS/NullCPUPowerManagement','Contents/Info.plist'],
        ['SMCProcessor.kext','SMCProcessor.kext','Contents/MacOS/SMCProcessor','Contents/Info.plist'],
        ['AppleIntelE1000e.kext','AppleIntelE1000e.kext','Contents/MacOS/AppleIntelE1000e','Contents/Info.plist'],
        ['USBInjectAll.kext','USBInjectAll.kext','Contents/MacOS/USBInjectAll','Contents/Info.plist'],
        ['CPUFriend.kext','CPUFriend.kext','Contents/MacOS/CPUFriend','Contents/Info.plist'],
        ['AsusSMC.kext','AsusSMC.kext','Contents/MacOS/AsusSMC','Contents/Info.plist'],
        ['VoodooI2CHID.kext','VoodooI2CHID.kext','Contents/MacOS/VoodooI2CHID','Contents/Info.plist'],
        ['AppleIGB.kext','AppleIGB.kext','Contents/MacOS/AppleIGB','Contents/Info.plist'],
        ['AppleBacklightFixup.kext','AppleBacklightFixup.kext','Contents/MacOS/AppleBacklightFixup','Contents/Info.plist'],
        ['CoreDisplayFixup.kext','CoreDisplayFixup.kext','Contents/MacOS/CoreDisplayFixup','Contents/Info.plist'],
        ['AHCI_3rdParty_eSATA.kext','AHCI_3rdParty_eSATA.kext','','Contents/Info.plist'],
        ['VoodooI2CFTE.kext','VoodooI2CFTE.kext','Contents/MacOS/VoodooI2CFTE','Contents/Info.plist'],
        ['VoodooI2CELAN.kext','VoodooI2CELAN.kext','Contents/MacOS/VoodooI2CELAN','Contents/Info.plist'],
        ['AppleACPIPS2Nub.kext','AppleACPIPS2Nub.kext','Contents/MacOS/AppleACPIPS2Nub','Contents/Info.plist'],
        ['ApplePS2SmartTouchPad.kext','ApplePS2SmartTouchPad.kext','Contents/MacOS/ApplePS2SmartTouchPad','Contents/Info.plist'],
        ['ApplePS2SmartTouchPad.kext','ApplePS2SmartTouchPad.kext/Contents/PlugIns/ApplePS2Keyboard.kext','Contents/MacOS/ApplePS2Keyboard','Contents/Info.plist'],
        ['ApplePS2SmartTouchPad.kext','ApplePS2SmartTouchPad.kext/Contents/PlugIns/ApplePS2Controller.kext','Contents/MacOS/ApplePS2Controller','Contents/Info.plist'],
        ['VirtualSMC.kext','VirtualSMC.kext','Contents/MacOS/VirtualSMC','Contents/Info.plist'],
        ['BrcmPatchRAM.kext','BrcmPatchRAM.kext','Contents/MacOS/BrcmPatchRAM','Contents/Info.plist'],
        ['BrcmFirmwareRepo.kext','BrcmFirmwareRepo.kext','Contents/MacOS/BrcmFirmwareRepo','Contents/Info.plist'],
        ['VoodooPS2Controller.kext','VoodooPS2Controller.kext','Contents/MacOS/VoodooPS2Controller','Contents/Info.plist'],
        ['VoodooPS2Controller.kext','VoodooPS2Controller.kext/Contents/PlugIns/VoodooPS2Trackpad.kext','Contents/MacOS/VoodooPS2Trackpad','Contents/Info.plist'],
        ['VoodooPS2Controller.kext','VoodooPS2Controller.kext/Contents/PlugIns/VoodooPS2Keyboard.kext','Contents/MacOS/VoodooPS2Keyboard','Contents/Info.plist'],
        ['VoodooPS2Controller.kext','VoodooPS2Controller.kext/Contents/PlugIns/VoodooPS2Mouse.kext','Contents/MacOS/VoodooPS2Mouse','Contents/Info.plist'],
        ['HoRNDIS.kext','HoRNDIS.kext','Contents/MacOS/HoRNDIS','Contents/Info.plist'],
        ['SMCLightSensor.kext','SMCLightSensor.kext','Contents/MacOS/SMCLightSensor','Contents/Info.plist'],
        ['FakeSMC.kext','FakeSMC.kext','Contents/MacOS/FakeSMC','Contents/Info.plist'],
        ['SATA-200-series-unsupported.kext','SATA-200-series-unsupported.kext','','Contents/Info.plist'],
        ['USBPorts.kext','USBPorts.kext','','Contents/Info.plist'],
        ['BrcmPatchRAM2.kext','BrcmPatchRAM2.kext','Contents/MacOS/BrcmPatchRAM2','Contents/Info.plist'],
        ['VoodooI2C.kext','VoodooI2C.kext','Contents/MacOS/VoodooI2C','Contents/Info.plist'],
        ['VoodooI2C.kext','VoodooI2C.kext/Contents/PlugIns/VoodooGPIO.kext','Contents/MacOS/VoodooGPIO','Contents/Info.plist'],
        ['VoodooI2C.kext','VoodooI2C.kext/Contents/PlugIns/VoodooI2CServices.kext','Contents/MacOS/VoodooI2CServices','Contents/Info.plist'],
        ['AHCI_Intel_Generic_SATA.kext','AHCI_Intel_Generic_SATA.kext','','Contents/Info.plist'],
        ['XHCI-unsupported.kext','XHCI-unsupported.kext','','Contents/Info.plist'],
        ['CodecCommander.kext','CodecCommander.kext','Contents/MacOS/CodecCommander','Contents/Info.plist'],
        ['SystemProfilerMemoryFixup.kext','SystemProfilerMemoryFixup.kext','Contents/MacOS/SystemProfilerMemoryFixup','Contents/Info.plist']
        ];

    let thetable = jQuery("#gridtable-Kernel-Add");

    for(let i=0,len=allKext.length;i<len;i++) {

        if(allKext[i][0] === kext.value) {

            thetable.jqGrid('addRowData', MAXROWID++, {
                BundlePath : allKext[i][1],
                Comment : '',
                Enabled : "YES",
                ExecutablePath : allKext[i][2],
                MaxKernel : '', MinKernel : '',
                PlistPath : allKext[i][3]
            }, 'last');

        }
    }
    kext.value = '';
    //console.log(kext.value);
    delete allKext;
}


var VUEAPP = new Vue({
    el: '#main-container',
    data: {
        root : 'ACPI',                  //决定当前显示哪个节点
        plistcontext : '',              //保存从config.plist中读取的内容
        title : SYSTEM_TIPS,             //下面都是提示变量
        textarea_content : '',          //保存粘贴页面时候textarea中的内容
        current_paste_tableid : '',     //保存点击当前粘贴按钮的table id
        lang : {},                      //语言数据, 和浏览器的语言设置挂钩
        configisfull : false,           //是否full模式
        ACPI : {
            Add : [],
            Block : [],
            Patch : [] ,
            Quirks : {
                FadtEnableReset:false, NormalizeHeaders:false, RebaseRegions:false, ResetHwSig:false, ResetLogoStatus:false}
            },
        Booter : {
            MmioWhitelist : [],
            Quirks : {
                AvoidRuntimeDefrag:false, DevirtualiseMmio:false,  DisableSingleUser:false, DisableVariableWrite:false,
                DiscardHibernateMap:false, EnableSafeModeSlide:false, EnableWriteUnprotector:false, ForceExitBootServices:false, ProtectCsmRegion:false,
                ProvideCustomSlide:false, SetupVirtualMap:false, ShrinkMemoryMap:false
            }
        },
        DeviceProperties : {
            AddLeft:[],
            AddRight:[],
            BlockLeft : [],
            BlockRight : []
        },
        Kernel : {
            Add:[],
            Block:[],
            Patch:[],
            Emulate:{Cpuid1Data : '',Cpuid1Mask :''},
            Quirks:{
                AppleCpuPmCfgLock:false, AppleXcpmCfgLock:false, AppleXcpmExtraMsrs:false, CustomSMBIOSGuid:false,
                DisableIoMapper:false, ExternalDiskIcons:false, LapicKernelPanic:false, PanicNoKextDump:false,
                PowerTimeoutKernelPanic:false, ThirdPartyDrives:false, XhciPortLimit:false
            }
        },
        Misc : {
            BlessOverride:[],
            Boot:{
                ConsoleBehaviourOs:'', ConsoleBehaviourUi:'', ConsoleMode:'', HibernateMode:'None', Resolution:'', Timeout:'0',
                HideSelf : false, PollAppleHotKeys: false, ShowPicker: false, UsePicker: false
            },
            Debug: {
                DisableWatchDog:false, DisplayDelay:'0', DisplayLevel:'0', Target:'0'
            },
            Security : {
                ExposeSensitiveData:'', HaltLevel:'', ScanPolicy:'',AllowNvramReset:false, RequireSignature:false, RequireVault:false
            },
            Entries:[],
            Tools : []
        },
        NVRAM : {
            root : { LegacyEnable : false},
            AddLeft:[],
            AddRight:[],
            BlockLeft : [],
            BlockRight : [],
            LegacySchemaLeft : [],
            LegacySchemaRight : []
        },
        PlatformInfo : {
            root : {
                Automatic:false, UpdateDataHub:false, UpdateNVRAM:false, UpdateSMBIOS:false, UpdateSMBIOSMode : 'Create'
            },
            DataHub : {
                ARTFrequency:'', BoardProduct:'', BoardRevision:'', DevicePathsSupported:'', FSBFrequency:'',
                InitialTSC:'', PlatformName:'', SmcBranch:'', SmcPlatform:'', SmcRevision:'', StartupPowerEvents:'',
                SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            Generic : {
                MLB:'', ROM:'', SpoofVendor:false, SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            PlatformNVRAM : {
                BID:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', MLB:'', ROM:''
            },
            SMBIOS : {
                BIOSReleaseDate:'', BIOSVendor:'', BIOSVersion:'', BoardAssetTag:'', BoardLocationInChassis:'', BoardManufacturer:'',
                BoardProduct:'', BoardSerialNumber:'', BoardType:'', BoardVersion:'', ChassisAssetTag:'', ChassisManufacturer:'',
                ChassisSerialNumber:'', ChassisType:'', ChassisVersion:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', MemoryFormFactor:'',
                PlatformFeature:'', ProcessorType:'', SmcVersion:'', SystemFamily:'', SystemManufacturer:'',
                SystemProductName:'', SystemSKUNumber:'', SystemSerialNumber:'', SystemUUID:'', SystemVersion:''
            }
        },
        UEFI : {
            root : { ConnectDrivers : false},
            Drivers : [],
            Input : {
                KeyForgetThreshold:'', KeyMergeThreshold:'', KeySupport:false, KeySupportMode:'', KeySwap:false,  PointerSupport:false, PointerSupportMode:'', TimerResolution:''

            },
            Protocols : {
                AppleBootPolicy:false, AppleEvent:false, AppleImageConversion:false, AppleKeyMap:false, AppleUserInterfaceTheme:false,
                ConsoleControl:false, DataHub:false, DeviceProperties:false, FirmwareVolume:false, HashServices:false, UnicodeCollation:false
            },
            Quirks : {
                AvoidHighAlloc:false, ClearScreenOnModeSwitch:false, ExitBootServicesDelay:'', IgnoreInvalidFlexRatio:false, IgnoreTextInGraphics:false,
                ProvideConsoleGop:false, ReconnectOnResChange:false,ReleaseUsbOwnership:false, ReplaceTabWithSpace:false, RequestBootVarFallback:false,
                RequestBootVarRouting:false, SanitiseClearScreen:false ,UnblockFsConnect:false
            }
        }

    },

    created : function () {
        let syslang = navigator.language;
        //console.log(GLOBAL_LANG[syslang]);
        if(syslang === undefined || GLOBAL_LANG[syslang] === undefined) {
            this.lang = GLOBAL_LANG['en-US'];
        } else {
            this.lang = GLOBAL_LANG[syslang];
        }
    },

    watch: {

        //监视configisfull变量, 为否时显示Generic标签的内容
        configisfull(newval) {
            if(newval === false && $("#li_PlatformInfo_Generic").hasClass("active") === false) {
                $('#button_PlatformInfo_Generic').click();
            }
        }
    },

    methods: {

        setRoot : function (rootname) {
            this.root = rootname;
        }

        // 初始化所有表格
        , initAllData : function () {
            this.initACPI();
            this.setRoot('ACPI');

            this.initBooter();
            this.initDeviceProperties();
            this.initKernel();
            this.initMisc();
            this.initNVRAM();
            this.initPlatformInfo();
            this.initUEFI();
        }

        // 获取并设置dict的值和bool值
        , getAndSetDictItem(context, vueData) {
            for(let it in vueData) {
                if(typeof(vueData[it]) === "boolean") {
                    Vue.set(vueData, it, partrue(getValuesByKeyname(context, it)));
                } else {
                    Vue.set(vueData, it, getValuesByKeyname(context, it));
                }

            }

        }

        , initNVRAM : function () {

            this.NVRAM.AddLeft.length = 0;
            this.NVRAM.AddRight.length = 0;
            this.NVRAM.BlockLeft.length = 0;
            this.NVRAM.BlockRight.length = 0;
            this.NVRAM.LegacySchemaLeft.length = 0;
            this.NVRAM.LegacySchemaRight.length = 0;


            let NVRAMText = getValuesByKeyname(VUEAPP.plistcontext, 'NVRAM', true);
            this.getAndSetDictItem(NVRAMText, this.NVRAM.root);


            let AddText = getValuesByKeyname(NVRAMText, 'Add');
            //AddLeft
            let arrayParent = getParentKeys(AddText);
            for(let i=0,len=arrayParent.length;i<len;i++) {
                this.NVRAM.AddLeft.push({id:i, Devices:arrayParent[i]});
            }
            //this.NVRAM.AddSub = getSubKeys(AddText);
            let subarray = getSubKeys(AddText);

            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.AddRight.push(subarray[it]);
            }

            jQuery("#gridtable-NVRAM-AddLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-AddRight").trigger("reloadGrid");
            //选中第一条记录
            jQuery("#gridtable-NVRAM-AddLeft").jqGrid('setSelection',0, true);

            //BlockLeft
            let BlockText = getValuesByKeyname(NVRAMText, 'Block')
            let arrayParent2 = getKeyarrayZIkey(BlockText);

            for(let j=0,len=arrayParent2.length;j<len;j++) {
                this.NVRAM.BlockLeft.push({id:j, Devices:arrayParent2[j]});
            }


            subarray = getKeyarrayZIarray(BlockText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.BlockRight.push(subarray[it]);
            }
            jQuery("#gridtable-NVRAM-BlockLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-BlockRight").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-BlockLeft").jqGrid('setSelection',0, true);

            //LegacySchemaLeft
            let LegacySchemaText = getValuesByKeyname(NVRAMText, 'LegacySchema')
            let arrayParent3 = getKeyarrayZIkey(LegacySchemaText);

            for(let k=0,len=arrayParent3.length;k<len;k++) {

                this.NVRAM.LegacySchemaLeft.push({id:k, Devices:arrayParent3[k]});
            }


            subarray = getKeyarrayZIarray(LegacySchemaText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.LegacySchemaRight.push(subarray[it]);
            }
            jQuery("#gridtable-NVRAM-LegacySchemaLeft").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-LegacySchemaRight").trigger("reloadGrid");
            jQuery("#gridtable-NVRAM-LegacySchemaLeft").jqGrid('setSelection',0, true);


        }

        , initUEFI : function () {
            let UEFIText = getValuesByKeyname(VUEAPP.plistcontext, 'UEFI', true);

            //root
            this.getAndSetDictItem(UEFIText, this.UEFI.root);

            //Drivers
            let DriversText = getValuesByKeyname(UEFIText, 'Drivers');
            this.UEFI.Drivers.length = 0;
            let arrayDrivers = parsePlistArray2stringArray(DriversText);
            for(let i=0,len=arrayDrivers.length;i<len;i++) {
                this.UEFI.Drivers.push({ FileName : arrayDrivers[i]['Volume']}) ;
            }
            jQuery("#gridtable-UEFI-Drivers").trigger("reloadGrid");

            //Input
            let InputText = getValuesByKeyname(UEFIText, 'Input');
            this.getAndSetDictItem(InputText, this.UEFI.Input);

            //Protocols
            let ProtocolsText = getValuesByKeyname(UEFIText, 'Protocols');
            this.getAndSetDictItem(ProtocolsText, this.UEFI.Protocols);

            //Quirks
            let QuirksText = getValuesByKeyname(UEFIText, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.UEFI.Quirks);
        }

        , initPlatformInfo : function () {
            let ipiText = getValuesByKeyname(VUEAPP.plistcontext, 'PlatformInfo', true);

            //root
            this.getAndSetDictItem(ipiText, this.PlatformInfo.root);

            //DataHub
            let DataHubText = getValuesByKeyname(ipiText, 'DataHub');
            this.getAndSetDictItem(DataHubText, this.PlatformInfo.DataHub);

            //Generic
            let GenericText = getValuesByKeyname(ipiText, 'Generic');
            this.getAndSetDictItem(GenericText, this.PlatformInfo.Generic);

            //PlatformNVRAM
            let PlatformNVRAMText = getValuesByKeyname(ipiText, 'PlatformNVRAM');
            this.getAndSetDictItem(PlatformNVRAMText, this.PlatformInfo.PlatformNVRAM);

            //SMBIOS
            let SMBIOSText = getValuesByKeyname(ipiText, 'SMBIOS');
            this.getAndSetDictItem(SMBIOSText, this.PlatformInfo.SMBIOS);

        }

        , initMisc : function() {
            let MiscText = getValuesByKeyname(VUEAPP.plistcontext, 'Misc', true);

            //BlessOverride
            let BlessOverrideText = getValuesByKeyname(MiscText, 'BlessOverride');
            this.Misc.BlessOverride.length = 0;
            let arrayBlessOverride = parsePlistArray2stringArray(BlessOverrideText);
            for(let i=0,len=arrayBlessOverride.length;i<len;i++) {
                this.Misc.BlessOverride.push({ ScanningPaths : arrayBlessOverride[i]['Volume']}) ;
            }
            jQuery("#gridtable-Misc-BlessOverride").trigger("reloadGrid");

            //Entries
            this.getPlistAndResetTableData(MiscText, 'Entries', 'gridtable-Misc-Entries', this.Misc.Entries);
            //Tools
            this.getPlistAndResetTableData(MiscText, 'Tools', 'gridtable-Misc-Tools', this.Misc.Tools);
            //Boot
            let BootText = getValuesByKeyname(MiscText, 'Boot');
            this.getAndSetDictItem(BootText, this.Misc.Boot);

            //Debug
            let DebugText = getValuesByKeyname(MiscText, 'Debug');
            this.getAndSetDictItem(DebugText, this.Misc.Debug);

            //Security
            let SecurityText = getValuesByKeyname(MiscText, 'Security');
            this.getAndSetDictItem(SecurityText, this.Misc.Security);

        }



        , initKernel : function () {
            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Kernel', true);
            this.getPlistAndResetTableData(text, 'Add', 'gridtable-Kernel-Add', this.Kernel.Add);
            this.getPlistAndResetTableData(text, 'Block', 'gridtable-Kernel-Block', this.Kernel.Block);
            this.getPlistAndResetTableData(text, 'Patch', 'gridtable-Kernel-Patch', this.Kernel.Patch);

            let EmulateText = getValuesByKeyname(text, 'Emulate');
            this.getAndSetDictItem(EmulateText, this.Kernel.Emulate);

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Kernel.Quirks);


        }

        , initDeviceProperties : function () {
            this.DeviceProperties.AddLeft.length = 0;
            this.DeviceProperties.AddRight.length = 0;
            this.DeviceProperties.BlockLeft.length = 0;
            this.DeviceProperties.BlockRight.length = 0;

            let text = getValuesByKeyname(VUEAPP.plistcontext, 'DeviceProperties', true);
            //console.log(text);
            let AddText = getValuesByKeyname(text, 'Add');
            //Add
            let arrayParent = getParentKeys(AddText);
            for(let i=0,len=arrayParent.length;i<len;i++) {
                this.DeviceProperties.AddLeft.push({id:i, Devices:arrayParent[i]});
            }

            let subArray = getSubKeys(AddText);
            for(let it in subArray) {
                subArray[it]['id'] = it;
                //console.log(subArray[it]);
                this.DeviceProperties.AddRight.push(subArray[it]);
            }
            jQuery("#gridtable-DeviceProperties-AddLeft").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-AddRight").trigger("reloadGrid");
            //选中第一条记录
            jQuery("#gridtable-DeviceProperties-AddLeft").jqGrid('setSelection',0, true);

            //Block
            let BlockText = getValuesByKeyname(text, 'Block')
            let arrayParent2 = getKeyarrayZIkey(BlockText);
            //console.log(arrayParent2);
            for(let i=0,len=arrayParent2.length;i<len;i++) {
                this.DeviceProperties.BlockLeft.push({id:i, Devices:arrayParent2[i]});
            }


            subArray = getKeyarrayZIarray(BlockText);
            for(let it in subArray) {
                subArray[it]['id']=it;
                this.DeviceProperties.BlockRight.push(subArray[it]);
            }

            jQuery("#gridtable-DeviceProperties-BlockLeft").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-BlockRight").trigger("reloadGrid");
            jQuery("#gridtable-DeviceProperties-BlockLeft").jqGrid('setSelection',0, true);

        }


        , initBooter : function () {
            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Booter', true);
            this.getPlistAndResetTableData(text, 'MmioWhitelist', 'gridtable-Booter-MmioWhitelist', this.Booter.MmioWhitelist);

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Booter.Quirks);

        }

        , initACPI : function () {
            let acpiText = getValuesByKeyname(VUEAPP.plistcontext, 'ACPI', true);
            this.getPlistAndResetTableData(acpiText, 'Add', 'gridtable-ACPI-Add', this.ACPI.Add);
            this.getPlistAndResetTableData(acpiText, 'Block', 'gridtable-ACPI-Block', this.ACPI.Block);
            this.getPlistAndResetTableData(acpiText, 'Patch', 'gridtable-ACPI-Patch', this.ACPI.Patch);

            let QuirksText = getValuesByKeyname(acpiText, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.ACPI.Quirks);


            //强制刷新一下, 否则 checkbox 不更新
            this.$forceUpdate();
        }

        // 获取plist中array的值并更新到table表格中
        , getPlistAndResetTableData : function (context, keyname, gridid, gridData) {

            let arrayAdd = parrayToJSarray(getValuesByKeyname(context, keyname));
            gridData.length = 0;
            for(let it in arrayAdd) {
                gridData.push(arrayAdd[it]);
            }
            jQuery("#" + gridid).trigger("reloadGrid");
        }


    }
})


function savePlist() {
    let xmlcontext = getAllPlist();
    let blob = new Blob([xmlcontext], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "config.plist");
    showTipModal(VUEAPP.lang.downplistSuccess, 'success');
}

function copyPlist() {
	let xmlcontext = getAllPlist();
	copyDatatoClipboard(xmlcontext);
	showTipModal(VUEAPP.lang.copyplistSuccess, 'success');
}

function startPaste() {
    VUEAPP.textarea_content = VUEAPP.textarea_content.trim();
	if(VUEAPP.textarea_content === '') {
		showTipModal(VUEAPP.lang.nopasteData, 'error');
		return;
	}

	let rowData = stringToJSON(VUEAPP.textarea_content);
	let isArray = rowData instanceof Array;

	if(isArray === false) {
		showTipModal(VUEAPP.lang.dataFormaterror,'error');
		return;
	}

 	let ids = VUEAPP.current_paste_tableid.split('-');
    let objGridTable = jQuery('#gridtable-' + ids[1] + '-' + ids[2]);

    //检查数据复制源和复制的格式是否一致
    let arrayColNames = objGridTable.jqGrid('getGridParam','colNames');
    for(let con in rowData[0]) {
        if(arrayColNames.indexOf(con) === -1) {
            showTipModal(VUEAPP.lang.dataFormaterror,'error');
            return;
        }

    }

    //如果是右边表格, 要多做几个处理,1 检查左边是否选中, 2 修改pid 3 删除id
    if(ids[2].substr(-5) === 'Right') {
        let leftgridid = '#gridtable-' + ids[1] + '-' + ids[2].replace('Right','Left');
        let leftSelectedId = $(leftgridid).jqGrid("getGridParam", "selrow");


        if(leftSelectedId === null) {
            showTipModal(VUEAPP.lang.chooseDevices, 'warning');
            return;
        }

        for(let it in rowData) {

            if(rowData[it]['pid'] !== undefined) {
                rowData[it]['pid'] = leftSelectedId;
            }
            if(rowData[it]['id'] !== undefined) {
                delete rowData[it]['id'];
            }
        }

    }

	for(let it in rowData) {
		objGridTable.jqGrid('addRowData', MAXROWID++, rowData[it], 'last');
	}
	$('#inputModal').modal('hide');

	showTipModal(VUEAPP.lang.pasteDataSuccess, 'success');
}