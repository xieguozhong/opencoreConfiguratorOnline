
$(document).ready(function() {
    $('#id-input-file-2').ace_file_input({
        no_file:VUEAPP.lang.no_file,
        btn_choose:VUEAPP.lang.choose,
        btn_change:VUEAPP.lang.change,
        droppable:false,
        onchange:null,
        allowExt:['plist'],
        thumbnail:false,
        before_change: function(files){
            const reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function () {
            	VUEAPP['plistcontext'] = formatContext(this.result);
            	VUEAPP.initAllData();
        	}
            return true;
        }
        }).on('file.error.ace', function() {
            showTipModal(VUEAPP.lang.alertfileerror, 'error');
    });


    //初始化表格
    initGridTableACPI();
    initGridTableBooter();
    initGridTableDeviceProperties();
    initGridTableKernel();
    initGridTableMisc();
    initGridTableNVRAM();
    initGridTablePlatformInfo();
    initGridTableUEFI();

    //绑定所有按钮
    bindAllButton();

    //初始化提示插件
    $.minimalTips();

    //设置弹出提示插件
    toastr.options = {
      "closeButton": true,
      "positionClass": "toast-top-center"
    };

    //显示适用于版本信息
    //showTipModal(VUEAPP.lang.supportversion);
    
    //页面加载完成后解除文件选择框的禁用属性
    $("#id-input-file-2").removeAttr("disabled");

});

// ACPI Add 和 UEFI Drivers Kernel_Add处添加文件
function addFile(fileid) {
    
    const   file = document.getElementById(fileid), 
            thetablename = fileid.substr(fileid.indexOf('_')+1);
    
    const thetable = getJqgridObjectbyKey(thetablename);

    let files, maxid = getMaxrowid(thetable);

    //依次循环处理多选的多个文件
	for(let i=0; i<file.files.length; i++){
		files = file.files[i];
        
        if(thetablename === "ACPI_Add") {            
            thetable.jqGrid('addRowData', ++maxid, { Comment:'', Path:files.name, Enabled:"YES"}, 'last');
        } else if(thetablename === "UEFI_Drivers") {           
            thetable.jqGrid('addRowData', ++maxid, { Path:files.name,Arguments:'',Comment:'',Enabled:"YES"}, 'last');
        } else if(thetablename === 'Kernel_Add') {
            handFile(files, thetable);
        }
	}
}


//用JSzip处理kext中Plugin中的文件,单独处理Kernel_Add处添加文件
function handFile(ff, thetable) {
    const sfl = new Set(), sfonly = new Set();
    
    JSZip.loadAsync(ff)
        .then(function(zip) {
            zip.forEach( (relativePath) => {  
                sfl.add(relativePath);

                //这里大部分都是相同的会被过滤掉
                sfonly.add(relativePath.substring(0,findStrAssIndex(relativePath,'/',1)));

                const pindex = relativePath.indexOf('PlugIns');
                if(pindex > -1) {
                    const p2index = findStrAssIndex(relativePath,'/',4);
                    if(p2index > -1) {
                        sfonly.add(relativePath.substring(0, p2index));
                    }
                    
                }
                
            });

            let maxid = getMaxrowid(thetable), newData = null;

            sfonly.forEach((kname) => {
                const lastdotindex = kname.lastIndexOf('.');
                const lastslaindex = kname.lastIndexOf('/') + 1;
                const knamekey = kname.substring(lastslaindex,lastdotindex);
                let ExecutablePath = '', PlistPath = '';
                
                if(sfl.has(kname + '/Contents/MacOS/' + knamekey)) {
                    ExecutablePath = 'Contents/MacOS/' + knamekey;
                }
                if(sfl.has(kname + '/Contents/Info.plist')) {
                    PlistPath = 'Contents/Info.plist';
                }

                newData = { Arch:'',BundlePath:kname,Comment:'',ExecutablePath:ExecutablePath,PlistPath:PlistPath,MaxKernel:'',MinKernel:'',Enabled:"YES"};
                maxid = maxid + 1;
                
                thetable.jqGrid('addRowData', maxid, newData, 'last');

            });

        }, function (e) {
            console.log(e.message);
        });
}


//绑定所有的按钮的clicks事件
function bindAllButton() {

    //为所有表格绑定事件
    for (let objtb of GLOBAL_MAP_TABLE.values()) {
        bindClick(objtb);
    }

    function bindClick(currentGridTable) {

        const gridtableid = currentGridTable.selector;
        const buttonBehind = gridtableid.slice(11);//表格ID都是以 #gridtable_ 开头

        // 1 绑定所有的增加按钮
        $("#btnadd_" + buttonBehind).on("click",function(){

            //如果是右边表格, 先检查左边有没有选中, 如果没有, 不做任何反应
            if(buttonBehind.endsWith('Right')) {                
                
                const theGrid = getJqgridObjectbyKey(buttonBehind.replace('Right','Left'));
                const selectedId = theGrid.jqGrid("getGridParam", "selrow");

                if(selectedId !== null) {
                    let maxid = getMaxrowid(currentGridTable);
                    currentGridTable.jqGrid('addRowData',  ++maxid , {pid:selectedId}, 'last');
                }

            } else {
                let maxid = getMaxrowid(currentGridTable);
                currentGridTable.jqGrid('addRowData', ++maxid, {}, 'last');
            }


        });


        // 2 绑定所有的删除按钮
        $("#btndel_" + buttonBehind).on("click",function(){

            const selectedIds = currentGridTable.jqGrid('getGridParam','selarrrow');

            //如果有选中行, 说明可以进行删除操作
            if(selectedIds.length > 0) {
                let deleteIds = [], rowData, leftSelectedId;

                //如果是右边表格, 只要删除左边选中行下面的数据即可
                if(buttonBehind.endsWith('Right')) {
                    let leftGrid = getJqgridObjectbyKey(buttonBehind.replace('Right','Left'));

                    leftSelectedId = leftGrid.jqGrid("getGridParam", "selrow");
                }

                for(let i=0,len=selectedIds.length;i<len;i++) {
                    
                    if(leftSelectedId === undefined) {
                        deleteIds.push(parseInt(selectedIds[i]));
                    } else {
                        rowData = currentGridTable.jqGrid('getRowData', selectedIds[i]);
                        if(leftSelectedId == rowData.pid) {
                            deleteIds.push(parseInt(selectedIds[i]));
                        }
                    }
                    
                }
                deleteIds.sort((x,y) => y-x);

                for(let it of deleteIds) {
                    //在删除行之前,把GLOBAL_SET_ONEDITTABLE中的记录删除(如果有的话)
                    GLOBAL_SET_ONEDITTABLE.delete('#gridtable_' + buttonBehind + '_' + it);

                    currentGridTable.jqGrid('delRowData', it);
                }

                //如果删除左边表格, 要隐藏右边表格
                if(buttonBehind.endsWith('Left')) {
                    const rightButtonBehind = buttonBehind.replace('Left', 'Right')
                    const rightGrid = getJqgridObjectbyKey(rightButtonBehind);
                    const rowIds = rightGrid.getDataIDs();
                    for(let it of rowIds) {
                        //在隐藏行之前,把GLOBAL_SET_ONEDITTABLE中的记录删除(如果有的话)
                        GLOBAL_SET_ONEDITTABLE.delete('#gridtable_' + rightButtonBehind + '_' + it);

                        rightGrid.setRowData(it,null,{display: 'none'});
                    }
                }

                showTipModal(VUEAPP.lang.deleterowsuccess, 'success');
            }

        });


        // 3 绑定所有的复制按钮
        $("#btncopy_" + buttonBehind).on("click",function(){

            //先清空剪贴板
            const selectedId = currentGridTable.jqGrid("getGridParam", "selarrrow");
            if(selectedId.length === 0) {
                copyDatatoClipboard(' ');
                showTipModal(VUEAPP.lang.checkdatafirst, 'error');
                return;
            }
            let rowData, arrStrdata = [], leftSelectedId;

            //如果是右边表格, 只要复制左边选中行下面的数据即可
            if(buttonBehind.endsWith('Right')) {               
                
                const leftGrid = getJqgridObjectbyKey(buttonBehind.replace('Right','Left'));

                leftSelectedId = leftGrid.jqGrid("getGridParam", "selrow");
                
            }

            for(let i=0,len=selectedId.length;i<len;i++) {
                rowData = currentGridTable.jqGrid('getRowData', selectedId[i]);
                
                if(leftSelectedId === undefined || leftSelectedId == rowData.pid) {
                    arrStrdata.push(JSON.stringify(rowData));
                }
                
            }
            
            copyDatatoClipboard('[' + arrStrdata.join() + ']');

            showTipModal(VUEAPP.lang.copydatasuccess, 'success');


        });

        // 4 绑定所有的粘贴按钮
        $("#btnpaste_" + buttonBehind).on("click",function(){
            VUEAPP.current_paste_tableid = gridtableid;
            showTextareaModal();
        });

        // 5 绑定所有的 启用/禁用 按钮
        $("#btnenabled_" + buttonBehind).on("click",function(){
            const selectedIds = currentGridTable.jqGrid("getGridParam", "selarrrow");

            if(selectedIds.length > 0) {
                let theEnabled = currentGridTable.jqGrid('getCell', selectedIds[0], "Enabled");
                theEnabled = theEnabled === 'YES' ? 'NO':'YES';

                for(let i=0,len=selectedIds.length;i<len;i++) {
                    currentGridTable.jqGrid('setCell',selectedIds[i],"Enabled",theEnabled);
                }
            }

        });

    }


}


const VUEAPP = new Vue({
    el: '#main-container',
    data: {
        root:'ACPI',                  //决定当前显示哪个节点
        plistcontext:'',              //保存从config.plist中读取的内容
        title:SYSTEM_TIPS,             //下面都是提示变量
        textarea_content:'',          //保存粘贴页面时候textarea中的内容
        current_paste_tableid:'',     //保存点击当前粘贴按钮的table id
        lang:{},                      //语言数据, 和浏览器的语言设置挂钩
        configisfull:false,           //是否full模式
        configisMOD:false,             //是否OpenCore MOD版本
        ACPI:{
            Add:[],
            Delete:[],
            Patch:[] ,
            Quirks:{
                FadtEnableReset:false, NormalizeHeaders:false, RebaseRegions:false, ResetHwSig:false, ResetLogoStatus:false,SyncTableIds:false
                ,EnableForAll:false
                }
            },
        Booter:{
            MmioWhitelist:[],
            Patch:[],
            Quirks:{
                AllowRelocationBlock:false,AvoidRuntimeDefrag:false, DevirtualiseMmio:false,  DisableSingleUser:false, DisableVariableWrite:false,
                DiscardHibernateMap:false, EnableSafeModeSlide:false, EnableWriteUnprotector:false,ForceBooterSignature:false, ForceExitBootServices:false, ProtectMemoryRegions:false,
                ProtectSecureBoot:false,ProtectUefiServices:false,ProvideCustomSlide:false, ProvideMaxSlide:0, RebuildAppleMemoryMap:false,
                ResizeAppleGpuBars:-1,SetupVirtualMap:false, SignalAppleOS:false, SyncRuntimePermissions:false,EnableForAll:false
            }
        },
        DeviceProperties:{
            AddLeft:[],
            AddRight:[],
            DeleteLeft:[],
            DeleteRight:[]
        },
        Kernel:{
            Add:[],
            Block:[],
            Patch:[],
            Emulate:{Cpuid1Data:'',Cpuid1Mask:'', MaxKernel:'', MinKernel:'',DummyPowerManagement:false},
            Scheme:{KernelArch:'Auto',KernelCache:'Auto',CustomKernel:false,FuzzyMatch:false},
            Force:[],
            Quirks:{
                
                AppleCpuPmCfgLock:false, AppleXcpmCfgLock:false, AppleXcpmExtraMsrs:false, AppleXcpmForceBoost:false,CustomPciSerialDevice:false,CustomSMBIOSGuid:false,
                DisableIoMapper:false, DisableLinkeditJettison:false,DisableRtcChecksum:false, ExtendBTFeatureFlags:false, ExternalDiskIcons:false,ForceAquantiaEthernet:false,
                ForceSecureBootScheme:false,IncreasePciBarSize:false,
                LapicKernelPanic:false, LegacyCommpage:false, PanicNoKextDump:false,
                PowerTimeoutKernelPanic:false,ProvideCurrentCpuInfo:false,SetApfsTrimTimeout:-1, ThirdPartyDrives:false, XhciPortLimit:false
            }
        },
        Misc:{
            BlessOverride:[],
            Boot:{
                HibernateMode:'None', PickerMode:'Builtin', PickerVariant:'Auto', TakeoffDelay:'0',
                Timeout:'0', HideAuxiliary:false, LauncherOption:'Disabled',LauncherPath:'Default', ConsoleAttributes:'0', 
                PickerAttributes:'0', PickerAudioAssist:false,PollAppleHotKeys: false, ShowPicker: false,SkipCustomEntryCheck:false
            },
            Debug: {
                AppleDebug:false, ApplePanic:false, DisableWatchDog:false, DisplayDelay:'0', DisplayLevel:'0',LogModules:'*', SysReport:false,
                Target:'0'
            },
            Security:{
                ExposeSensitiveData:'', HaltLevel:'', ScanPolicy:'', Vault:'Secure', AllowNvramReset:false, AllowSetDefault:false,AllowToggleSip:false,AuthRestart:false,
                BlacklistAppleUpdate:false,
                ApECID:'',DmgLoading:'Signed',EnablePassword:false,PasswordHash:'',PasswordSalt:'',SecureBootModel:'Default'
            },
            Entries:[],
            Tools:[],
            Serial:{
                Init:false,Override:false,
                Custom:{BaudRate:115200,ClockRate:1843200,ExtendedTxFifoSize:64,FifoControl:7,LineControl:7,PciDeviceInfo:'FF',RegisterAccessWidth:8,RegisterBase:1016,
                RegisterStride:1,UseHardwareFlowControl:false,UseMmio:false
                }
            }
        },
        NVRAM:{
            root:{ LegacyEnable:false, LegacyOverwrite:false, WriteFlash:false},
            AddLeft:[],
            AddRight:[],
            DeleteLeft:[],
            DeleteRight:[],
            LegacySchemaLeft:[],
            LegacySchemaRight:[]
        },
        PlatformInfo:{
            root:{
                Automatic:false, CustomMemory:false,UpdateDataHub:false, UpdateNVRAM:false, UpdateSMBIOS:false, UpdateSMBIOSMode:'Create',
                UseRawUuidEncoding:false
            },
            DataHub:{
                ARTFrequency:'', BoardProduct:'', BoardRevision:'', DevicePathsSupported:'', FSBFrequency:'',
                InitialTSC:'', PlatformName:'', SmcBranch:'', SmcPlatform:'', SmcRevision:'', StartupPowerEvents:'',
                SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            Generic:{
                AdviseFeatures:false,
                MLB:'', MaxBIOSVersion:false,ProcessorType:'',ROM:'', SpoofVendor:false, SystemMemoryStatus:'Auto',
                SystemProductName:'', SystemSerialNumber:'', SystemUUID:''
            },
            PlatformNVRAM:{
                BID:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', MLB:'', ROM:'',SystemSerialNumber:'',SystemUUID:''
            },
            Memory:{
                DataWidth:'',ErrorCorrection:'',FormFactor:'',MaxCapacity:'',TotalWidth:'',Type:'',TypeDetail:'',
                Devices:[]
            },

            SMBIOS:{
                BIOSReleaseDate:'', BIOSVendor:'', BIOSVersion:'', BoardAssetTag:'', BoardLocationInChassis:'', BoardManufacturer:'',
                BoardProduct:'', BoardSerialNumber:'', BoardType:'', BoardVersion:'', ChassisAssetTag:'', ChassisManufacturer:'',
                ChassisSerialNumber:'', ChassisType:'', ChassisVersion:'', FirmwareFeatures:'', FirmwareFeaturesMask:'', 
                PlatformFeature:'', ProcessorType:'', SmcVersion:'', SystemFamily:'', SystemManufacturer:'',
                SystemProductName:'', SystemSKUNumber:'', SystemSerialNumber:'', SystemUUID:'', SystemVersion:''
            }
        },
        UEFI:{
            root:{ ConnectDrivers:false},
            Drivers:[],
			APFS:{
				EnableJumpstart:false, GlobalConnect:false, HideVerbose:false, JumpstartHotPlug:false, MinDate:0, MinVersion:0
			},
            AppleInput:{
                AppleEvent:'Auto',CustomDelays:false,GraphicsInputMirroring:false,KeyInitialDelay:50,KeySubsequentDelay:5,PointerPollMask:-1,
                PointerPollMax:0,PointerPollMin:0,PointerSpeedDiv:1,PointerSpeedMul:1
            },
			Audio:{
				AudioCodec:0, AudioDevice:'', AudioOutMask:-1,AudioSupport:false,DisconnectHda:false,MaximumGain:-15,MinimumAssistGain:-30,MinimumAudibleGain:-128,
                PlayChime:'Auto',ResetTrafficClass:false,SetupDelay:0
			},
            Input:{
                KeyFiltering:false,KeyForgetThreshold:'', KeySupport:false, KeySupportMode:'Auto', KeySwap:false,  
                PointerSupport:false, PointerSupportMode:'', TimerResolution:''

            },
            Output:{
                ClearScreenOnModeSwitch:false,ConsoleMode:'',DirectGopRendering:false,ForceResolution:false,GopPassThrough:'Disabled',
                IgnoreTextInGraphics:false,ProvideConsoleGop:false,ReconnectGraphicsOnConnect:false,ReconnectOnResChange:false,ReplaceTabWithSpace:false,
                Resolution:'',SanitiseClearScreen:false,TextRenderer:'BuiltinGraphics',UIScale:-1,UgaPassThrough:false
            },
            ProtocolOverrides:{
                AppleAudio:false,AppleBootPolicy:false, AppleDebugLog:false,AppleEg2Info:false, AppleFramebufferInfo:false,AppleImageConversion:false,
                AppleImg4Verification:false, AppleKeyMap:false, AppleRtcRam:false,AppleSecureBoot:false, AppleSmcIo:false,AppleUserInterfaceTheme:false,
                DataHub:false, DeviceProperties:false, FirmwareVolume:false, HashServices:false, OSInfo:false,UnicodeCollation:false
            },
            Quirks:{
                ActivateHpetSupport:false,DisableSecurityPolicy:false,EnableVectorAcceleration:false,EnableVmx:false,ExitBootServicesDelay:0,
                ForceOcWriteFlash:false,ForgeUefiSupport:false,IgnoreInvalidFlexRatio:false,
                ReleaseUsbOwnership:false, ReloadOptionRoms:false, RequestBootVarRouting:false, ResizeGpuBars:-1,TscSyncTimeout:0, UnblockFsConnect:false
            },
            ReservedMemory:[]
        },

        //弹出窗口辅助
        Assist:{

            RADIO_CHECK_BOX:'C',           //用于标记显示多选列表还是单选列表, C表示多选,R表示单选
            last_checkbox_ids:[],          //记录最后显示的是哪个多选数据
            last_radiobox_ids:[],          //记录最后显示的是哪个多选数据

            pagePublic_List:[],            //前台页面多选值循环用
            pagePublic_Selected:[],        //控制哪些多选项被勾选

            pageRadio_List:[],             //前台页面单选值循环用
            pageRadio_CurrentValue:''      //记录当前选中的单选的值

            //特殊,,ConsoleMode_List 的数据和 Resolution_List一样
            ,ConsoleMode_List: SYSTEM_TIPS.Assist.Resolution_List
            
            
        }

    },

    created:function () {
        let syslang = navigator.language;
        
        if(syslang === undefined || GLOBAL_LANG[syslang] === undefined) {
            this.lang = GLOBAL_LANG['en-US'];
        } else {
            this.lang = GLOBAL_LANG[syslang];
        }
        
        //用SYSTEM_TIPS.Assist填充Assist
        for(let assetit in SYSTEM_TIPS.Assist) {
            this.Assist[assetit] = SYSTEM_TIPS.Assist[assetit];
        }
    },

    watch: {

        //监视configisfull变量, 为否时显示Generic标签的内容
        configisfull(newval, oldval) {
        	if(oldval === true && newval === false && $("#li_PlatformInfo_Generic").hasClass("active") === false) {
        		$('#button_PlatformInfo_Generic').click();
        	}

        }
    },

    methods: {

        setRoot:function (rootname) {
            this.root = rootname;
        }

        // 初始化所有表格
        , initAllData:function () {
            
            GLOBAL_SET_ONEDITTABLE.clear();

            consolelog("initACPI");
            this.initACPI();
            this.setRoot('ACPI');
            consolelog("initBooter");
            this.initBooter();
            consolelog("initDeviceProperties");
            this.initDeviceProperties();
            consolelog("initKernel");
            this.initKernel();
            consolelog("initMisc");
            this.initMisc();
            consolelog("initNVRAM");
            this.initNVRAM();
            consolelog("initPlatformInfo");
            this.initPlatformInfo();
            consolelog("initUEFI");
            this.initUEFI();

            this.plistcontext = '';
        }

        // 获取并设置dict的值和bool值
        , getAndSetDictItem(context='', vueData) {
            if(context === "") {                
                return;
            }

            let dataType = '', gbvabknvalue;
            for(let it in vueData) {
                dataType = typeof(vueData[it]);        
                if(dataType === "boolean") {
                    Vue.set(vueData, it, partrue(getValuesByKeyname(context, it)));
                } else if(dataType === "object"){
                    //如果是数组，什么都不干，任其继续进入下一轮循环
                    continue;
                } else {
                    gbvabknvalue = getValuesByKeyname(context, it);
                    
                    if(gbvabknvalue !== undefined) {
                        Vue.set(vueData, it, String(gbvabknvalue));
                    }
                    
                }

            }

        }

        , initNVRAM:function () {

            this.NVRAM.AddLeft.length = 0;
            this.NVRAM.AddRight.length = 0;
            this.NVRAM.DeleteLeft.length = 0;
            this.NVRAM.DeleteRight.length = 0;
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

            getJqgridObjectbyKey("NVRAM_AddLeft").trigger("reloadGrid");
            getJqgridObjectbyKey("NVRAM_AddRight").trigger("reloadGrid");
            //选中第一条记录
            getJqgridObjectbyKey("NVRAM_AddLeft").jqGrid('setSelection',0, true);

            //DeleteLeft
            let DeleteText = getValuesByKeyname(NVRAMText, 'Delete')
            let arrayParent2 = getKeyarrayZIkey(DeleteText);

            for(let j=0,len=arrayParent2.length;j<len;j++) {
                this.NVRAM.DeleteLeft.push({id:j, Devices:arrayParent2[j]});
            }


            subarray = getKeyarrayZIarray(DeleteText);
            for(let it in subarray) {
                subarray[it]['id'] = it;
                this.NVRAM.DeleteRight.push(subarray[it]);
            }
            getJqgridObjectbyKey("NVRAM_DeleteLeft").trigger("reloadGrid");
            getJqgridObjectbyKey("NVRAM_DeleteRight").trigger("reloadGrid");
            getJqgridObjectbyKey("NVRAM_DeleteLeft").jqGrid('setSelection',0, true);

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
            getJqgridObjectbyKey("NVRAM_LegacySchemaLeft").trigger("reloadGrid");
            getJqgridObjectbyKey("NVRAM_LegacySchemaRight").trigger("reloadGrid");
            getJqgridObjectbyKey("NVRAM_LegacySchemaLeft").jqGrid('setSelection',0, true);


        }

        , initUEFI:function () {
            let UEFIText = getValuesByKeyname(VUEAPP.plistcontext, 'UEFI', true);

            //root
            this.getAndSetDictItem(UEFIText, this.UEFI.root);

            //Drivers
            this.getPlistAndResetTableData(UEFIText, 'Drivers', 'UEFI_Drivers', this.UEFI.Drivers);

            //####Drivers特殊处理开始，从0.7.2升级到0.7.3用
            let DriversText = getValuesByKeyname(UEFIText, 'Drivers');
            let arrayDrivers = parsePlistArray2stringArray(DriversText);
            let shenji72to73 = true;
            for(let i=0,len=arrayDrivers.length;i<len;i++) {
                                
                if(arrayDrivers[i]['Volume'].indexOf("<key>") === 0) {
                    shenji72to73 = false;
                    break;
                }
                this.UEFI.Drivers.push({ Path:arrayDrivers[i]['Volume'],Arguments:'',Enabled:true}) ;
                
            }
            if(shenji72to73 === true) {
                getJqgridObjectbyKey("UEFI_Drivers").trigger("reloadGrid");
            }
            
            //####Drivers特殊处理结束，从0.7.2升级到0.7.3用
            
            

			//APFS
            let APFSText = getValuesByKeyname(UEFIText, 'APFS');
            this.getAndSetDictItem(APFSText, this.UEFI.APFS);

            //AppleInput
            let AppleInputText = getValuesByKeyname(UEFIText, 'AppleInput');
            this.getAndSetDictItem(AppleInputText, this.UEFI.AppleInput);

            //Audio
            let AudioText = getValuesByKeyname(UEFIText, 'Audio');            
            this.getAndSetDictItem(AudioText, this.UEFI.Audio);
            //处理一下PlayChime
            switch(this.UEFI.Audio['PlayChime']) {
            case 'true':
                this.UEFI.Audio['PlayChime'] = 'Enabled';
                break;
            case 'false':
                this.UEFI.Audio['PlayChime'] = 'Disabled';
                break;
            case '':
                this.UEFI.Audio['PlayChime'] = 'Auto';
                break;
            }


            

            //Input
            let InputText = getValuesByKeyname(UEFIText, 'Input');
            this.getAndSetDictItem(InputText, this.UEFI.Input);

            //Output
            let OutputText = getValuesByKeyname(UEFIText, 'Output');
            this.getAndSetDictItem(OutputText, this.UEFI.Output);

            //ProtocolOverrides
            let ProtocolOverridesText = getValuesByKeyname(UEFIText, 'ProtocolOverrides');
            this.getAndSetDictItem(ProtocolOverridesText, this.UEFI.ProtocolOverrides);

            //Quirks
            let QuirksText = getValuesByKeyname(UEFIText, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.UEFI.Quirks);

            //ReservedMemory
            this.getPlistAndResetTableData(UEFIText, 'ReservedMemory', 'UEFI_ReservedMemory', this.UEFI.ReservedMemory);

        }

        , initPlatformInfo:function () {
            let ipiText = getValuesByKeyname(VUEAPP.plistcontext, 'PlatformInfo', true);

            //root
            this.getAndSetDictItem(ipiText, this.PlatformInfo.root);

            //DataHub
            let DataHubText = getValuesByKeyname(ipiText, 'DataHub');

            //如果DataHub为空, 就不显示datahub , PlatformNVRAM SMBIOS 三项目
            this.configisfull = DataHubText === undefined ? false:true;

            //consolelog('DataHubText=' + DataHubText);
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

            //Memory
            let MemoryText = getValuesByKeyname(ipiText, 'Memory');
            this.getAndSetDictItem(MemoryText, this.PlatformInfo.Memory,true);
            this.getPlistAndResetTableData(MemoryText, 'Devices', 'PlatformInfo_MemoryDevices', this.PlatformInfo.Memory.Devices);

        }

        , initMisc:function() {
            let MiscText = getValuesByKeyname(VUEAPP.plistcontext, 'Misc', true);

            //BlessOverride
            let BlessOverrideText = getValuesByKeyname(MiscText, 'BlessOverride');
            this.Misc.BlessOverride.length = 0;
            let arrayBlessOverride = parsePlistArray2stringArray(BlessOverrideText);
            for(let i=0,len=arrayBlessOverride.length;i<len;i++) {
                this.Misc.BlessOverride.push({ ScanningPaths:arrayBlessOverride[i]['Volume']}) ;
            }
            getJqgridObjectbyKey("Misc_BlessOverride").trigger("reloadGrid");

            //Entries
            this.getPlistAndResetTableData(MiscText, 'Entries', 'Misc_Entries', this.Misc.Entries);
            //Tools
            this.getPlistAndResetTableData(MiscText, 'Tools', 'Misc_Tools', this.Misc.Tools);
            //Boot
            let BootText = getValuesByKeyname(MiscText, 'Boot');
            this.getAndSetDictItem(BootText, this.Misc.Boot);

            //Debug
            let DebugText = getValuesByKeyname(MiscText, 'Debug');
            this.getAndSetDictItem(DebugText, this.Misc.Debug);

            //Security
            let SecurityText = getValuesByKeyname(MiscText, 'Security');
            this.getAndSetDictItem(SecurityText, this.Misc.Security);

            //Serial
            let SerialText = getValuesByKeyname(MiscText, 'Serial');
            this.getAndSetDictItem(SerialText, this.Misc.Serial);

            //Serial.Custom
            let CustomText = getValuesByKeyname(SerialText, 'Custom');
            this.getAndSetDictItem(CustomText, this.Misc.Serial.Custom);
            //consolelog(CustomText);
        }



        , initKernel:function () {
            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Kernel', true);
            //consolelog(this.Kernel.Add);
            this.getPlistAndResetTableData(text, 'Add', 'Kernel_Add', this.Kernel.Add);
            this.getPlistAndResetTableData(text, 'Block', 'Kernel_Block', this.Kernel.Block);
            this.getPlistAndResetTableData(text, 'Patch', 'Kernel_Patch', this.Kernel.Patch);
            this.getPlistAndResetTableData(text, 'Force', 'Kernel_Force', this.Kernel.Force);

            let EmulateText = getValuesByKeyname(text, 'Emulate');
            this.getAndSetDictItem(EmulateText, this.Kernel.Emulate);

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Kernel.Quirks);

            let SchemeText = getValuesByKeyname(text, 'Scheme');
            this.getAndSetDictItem(SchemeText, this.Kernel.Scheme);

        }

        , initDeviceProperties:function () {
            this.DeviceProperties.AddLeft.length = 0;
            this.DeviceProperties.AddRight.length = 0;
            this.DeviceProperties.DeleteLeft.length = 0;
            this.DeviceProperties.DeleteRight.length = 0;

            let text = getValuesByKeyname(VUEAPP.plistcontext, 'DeviceProperties', true);
            //consolelog(text);
            let AddText = getValuesByKeyname(text, 'Add');
            //Add
            let arrayParent = getParentKeys(AddText);
            for(let i=0,len=arrayParent.length;i<len;i++) {
                this.DeviceProperties.AddLeft.push({id:i, Devices:arrayParent[i]});
            }

            let subArray = getSubKeys(AddText);
            for(let it in subArray) {
                subArray[it]['id'] = it;
                //consolelog(subArray[it]);
                this.DeviceProperties.AddRight.push(subArray[it]);
            }
            getJqgridObjectbyKey("DeviceProperties_AddLeft").trigger("reloadGrid");
            getJqgridObjectbyKey("DeviceProperties_AddRight").trigger("reloadGrid");
            //选中第一条记录
            getJqgridObjectbyKey("DeviceProperties_AddLeft").jqGrid('setSelection',0, true);

            //Delete
            let DeleteText = getValuesByKeyname(text, 'Delete')
            let arrayParent2 = getKeyarrayZIkey(DeleteText);
            //consolelog(arrayParent2);
            for(let i=0,len=arrayParent2.length;i<len;i++) {
                this.DeviceProperties.DeleteLeft.push({id:i, Devices:arrayParent2[i]});
            }


            subArray = getKeyarrayZIarray(DeleteText);
            for(let it in subArray) {
                subArray[it]['id']=it;
                this.DeviceProperties.DeleteRight.push(subArray[it]);
            }

            getJqgridObjectbyKey("DeviceProperties_DeleteLeft").trigger("reloadGrid");
            getJqgridObjectbyKey("DeviceProperties_DeleteRight").trigger("reloadGrid");
            getJqgridObjectbyKey("DeviceProperties_DeleteLeft").jqGrid('setSelection',0, true);

        }


        , initBooter:function () {

            let text = getValuesByKeyname(VUEAPP.plistcontext, 'Booter', true);
            
            this.getPlistAndResetTableData(text, 'Patch', 'Booter_Patch', this.Booter.Patch);
            
            this.getPlistAndResetTableData(text, 'MmioWhitelist', 'Booter_MmioWhitelist', this.Booter.MmioWhitelist);

            let QuirksText = getValuesByKeyname(text, 'Quirks');
            this.getAndSetDictItem(QuirksText, this.Booter.Quirks);

        }

        , initACPI:function () {
            let acpiText = getValuesByKeyname(VUEAPP.plistcontext, 'ACPI', true);
            this.getPlistAndResetTableData(acpiText, 'Add', 'ACPI_Add', this.ACPI.Add);
            this.getPlistAndResetTableData(acpiText, 'Delete', 'ACPI_Delete', this.ACPI.Delete);
            this.getPlistAndResetTableData(acpiText, 'Patch', 'ACPI_Patch', this.ACPI.Patch);

            let QuirksText = getValuesByKeyname(acpiText, 'Quirks');
            
            this.configisMOD = QuirksText.indexOf("<key>EnableForAll</key>") >= 0 ? true : false;
            this.getAndSetDictItem(QuirksText, this.ACPI.Quirks);


            //强制刷新一下, 否则 checkbox 不更新
            this.$forceUpdate();
        }

        // 获取plist中array的值并更新到table表格中
        , getPlistAndResetTableData:function (context, keyname, gridkey, gridData) {

            let arrayAdd = parrayToJSarray(getValuesByKeyname(context, keyname));
            gridData.length = 0;

            for(let it in arrayAdd) {
                gridData.push(arrayAdd[it]);
            }
            
            
            getJqgridObjectbyKey(gridkey).trigger("reloadGrid");
        }

        // 单选按钮点击事件
        , btnradioboxclick:function(event) {
            this.Assist.RADIO_CHECK_BOX = 'R';
            let buttonids = event.currentTarget.id.split('_');
            if(this.Assist.last_radiobox_ids.join('_') === event.currentTarget.id) {
                consolelog('上次页面和将要显示的页面相同，不做单选数据填充');
            
            } else {
                consolelog('上次页面和将要显示的页面不相同，做单选数据填充处理');
                this.Assist.pageRadio_List = this.Assist[buttonids[3] + '_List'];
                this.Assist.last_radiobox_ids = buttonids;
                
            }

            //根据输入框中的值决定要不要勾选单选框
            let iv = this[buttonids[1]][buttonids[2]][buttonids[3]];
            if(this.Assist.pageRadio_CurrentValue !== iv) {
                this.Assist.pageRadio_CurrentValue = iv;
            }

            $('#divMuCheckboxPageModal').modal('show');
        }

        // 弹出多选窗口按钮点击事件
        , btncheckboxclick:function (event, vlen=8) {
            this.Assist.RADIO_CHECK_BOX = 'C';
            let buttonids = event.currentTarget.id.split('_');
            
            // 1 为要显示的页面添加可选框数据列表 current_checkbox_id
            if(this.Assist.last_checkbox_ids.join('_') === event.currentTarget.id) {
                consolelog('上次页面和将要显示的页面相同，不做多选数据填充');
            
            } else {
                consolelog('上次页面和将要显示的页面不相同，做多选数据填充处理');
                this.Assist.pagePublic_List = this.Assist[buttonids[3] + '_List'];
                this.Assist.last_checkbox_ids = buttonids;
                this.Assist.pagePublic_Selected = [];
            }
            

            // 2 获取页面上输入框中的值
            let pageinputvalue = this[buttonids[1]][buttonids[2]][buttonids[3]];

            //如果页面输入框中的值为空，就清空已经选中的项目
            if((pageinputvalue > 0) === false) {
                this.Assist.pagePublic_Selected = [];
                $('#divMuCheckboxPageModal').modal('show');
                return;
            } 
            
            // 4 如果勾选的值和页面输入框中的值相等   
            if(pageinputvalue == this.getCheckedTotal()) {
                $('#divMuCheckboxPageModal').modal('show');
                consolelog('勾选值和页面值相等，不做自动勾选处理');
                return;
            }

            let piv16 = parseInt(pageinputvalue).toString(16), itval,
            ckdict = {
                '1':['1'],
                '2':['2'],
                '3':['1','2'],
                '4':['4'],
                '5':['1','4'],
                '6':['2','4'],
                '7':['1','2','4'],
                '8':['8'],
                '9':['1','8'],
                'a':['2','8'],   //10
                'b':['1','2','8'],//11
                'c':['4','8'],//12
                'd':['1','4','8'],//13
                'e':['2','4','8'],//14
                'f':['1','2','4','8']//15
            };
            this.Assist.pagePublic_Selected = [];

            
            if(vlen === 0) {
                vlen = 8;
            }

            for(let i=piv16.length-1,k=1;i>=0;i--,k++) {
                if(piv16[i] === '0') continue;
        
                itval = ckdict[piv16[i]];
                for(let j=0;j<itval.length;j++) {
                    this.Assist.pagePublic_Selected.push('0x' + '0'.repeat(vlen-k) + itval[j] + '0'.repeat(k-1));
                }
                
            }

            
            $('#divMuCheckboxPageModal').modal('show');
        }

        //勾选页面点击确定按钮事件
        , checkboxPageBtnOKclick:function () {
            if(this.Assist.RADIO_CHECK_BOX === 'C') {
                this[this.Assist.last_checkbox_ids[1]][this.Assist.last_checkbox_ids[2]][this.Assist.last_checkbox_ids[3]] = this.getCheckedTotal();
            } 

            else if(this.Assist.RADIO_CHECK_BOX === 'R') {
                this[this.Assist.last_radiobox_ids[1]][this.Assist.last_radiobox_ids[2]][this.Assist.last_radiobox_ids[3]] = this.Assist.pageRadio_CurrentValue;
            }
            
            $('#divMuCheckboxPageModal').modal('hide');
        }

        //获取勾选项的合计值，以10进制返回
        , getCheckedTotal:function () {
            let pagetotal = 0;
            for(let i=0,len=this.Assist.pagePublic_Selected.length;i<len;i++) {
                //consolelog(checklist[i]);
                pagetotal += parseInt(this.Assist.pagePublic_Selected[i],16);
            }
            //consolelog('勾选值=' + pagetotal);
            return pagetotal;
        }


    }
})

//查看有没有表格在被编辑中
function checkOneditTable() {

    if(GLOBAL_SET_ONEDITTABLE.size === 0) {
        return '';
    }

    const newset = new Set();
    for(let it of GLOBAL_SET_ONEDITTABLE) {
        let arrit = it.split('_');
        newset.add(arrit[1] + " | " + arrit[2]);
        
    }
    
    let newmsg = '-'.repeat(30) + '<br>' + Array.from(newset).join('<br>') + '<br>' + '-'.repeat(30);
    return fillLangString(VUEAPP.lang.editingtablemessage, newmsg);
}


//保存按钮
function savePlist() {
    let cotstring = checkOneditTable();
    if(cotstring !== "") {
        toastr.error(cotstring);
        return;
    }
    let xmlcontext = getAllPlist();
    let blob = new Blob([xmlcontext], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "config.plist");
    showTipModal(VUEAPP.lang.downplistSuccess, 'success');
}

//复制按钮
function copyPlist() {
    let cotstring = checkOneditTable();
    if(cotstring !== "") {
        toastr.error(cotstring);
        return;
    }
	let xmlcontext = getAllPlist();
	copyDatatoClipboard(xmlcontext);
	showTipModal(VUEAPP.lang.copyplistSuccess, 'success');
}

//数据行粘贴
function startPaste() {
    VUEAPP.textarea_content = VUEAPP.textarea_content.trim();
	if(VUEAPP.textarea_content === '') {
		showTipModal(VUEAPP.lang.nopasteData, 'error');
		return;
	}

	let rowData = stringToJSON(VUEAPP.textarea_content);
	
	if(rowData === false || (rowData instanceof Array) === false) {
		showTipModal(VUEAPP.lang.dataFormaterror,'error');
		return;
	}

    
 	let ids = VUEAPP.current_paste_tableid.split('_');
    
    let objGridTable = getJqgridObjectbyKey(ids[1] + '_' + ids[2]);

    //检查数据复制源和复制的格式是否一致
    let arrayColNames = objGridTable.jqGrid('getGridParam','colNames');
    for(let con in rowData[0]) {
        if(arrayColNames.indexOf(con) === -1) {
            showTipModal(VUEAPP.lang.dataFormaterror,'error');
            return;
        }

    }

    //如果是右边表格, 要多做几个处理,1 检查左边是否选中, 2 修改pid 3 删除id
    if(ids[2].endsWith('Right')) {
        let leftgrid = getJqgridObjectbyKey(ids[1] + '_' + ids[2].replace('Right','Left'));
        let leftSelectedId = leftgrid.jqGrid("getGridParam", "selrow");


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
    let maxid = getMaxrowid(objGridTable);
	for(let it in rowData) {
		objGridTable.jqGrid('addRowData', ++maxid, rowData[it], 'last');
	}
	$('#inputModal').modal('hide');

	showTipModal(VUEAPP.lang.pasteDataSuccess, 'success');
}