
function getAllPlist() {

	let plistContext = '<?xml version="1.0" encoding="UTF-8"?>';
	plistContext += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';
	plistContext += '<plist version="1.0">';
	plistContext +=  '<dict>';

	//1 ACPI
	consolelog('getACPI');
	plistContext += getACPI();

	//2 Booter
	consolelog('getBooter');
	plistContext += getBooter();

	//3 DeviceProperties
	consolelog('getDeviceProperties');
	plistContext += getDeviceProperties();

	//4 Kernel
	consolelog('getKernel');
	plistContext += getKernel();

	//5 getMisc
	consolelog('getMisc');
	plistContext += getMisc();

	//6 NVRAM
	consolelog('getNVRAM');
	plistContext += getNVRAM();

	//7 PlatformInfo
	consolelog('getPlatformInfo');
	plistContext += getPlatformInfo();

	//8 UEFI
	consolelog('getUEFI');
	plistContext += getUEFI();


	plistContext +=  '</dict>';
	plistContext +=  '</plist>';

	plistContext = $.format(plistContext, {method: 'xml'});

	//格式特殊处理，只是为了美观
	plistContext = plistContext.replace("<dict/></dict>","<dict/>\n        </dict>");

	localStorage.setItem("lastOpenCorePlistConfig",plistContext);

	return plistContext;

}

function getACPI() {
	let acpiContext = '<key>ACPI</key><dict>';
	//Add
	
	acpiContext += '<key>Add</key>';
	acpiContext += genArrayDict('ACPI_Add', VUEAPP.ACPI.Add);
	//Delete
	
	acpiContext += '<key>Delete</key>';
	acpiContext += genArrayDict('ACPI_Delete', VUEAPP.ACPI.Delete, ['OemTableId','TableSignature'],['TableLength']);

	//Patch
	
	acpiContext += '<key>Patch</key>';
	acpiContext += genArrayDict('ACPI_Patch', VUEAPP.ACPI.Patch, ['Find','Mask','OemTableId','Replace','ReplaceMask','TableSignature'],['BaseSkip','Count','Limit','Skip','TableLength']);

	//Quirks
	if(VUEAPP.configisMOD === false) {
		acpiContext += '<key>Quirks</key>' + getBoolens(clone(VUEAPP.ACPI.Quirks,['EnableForAll']));
	} else {
		acpiContext += '<key>Quirks</key>' + getBoolens(VUEAPP.ACPI.Quirks);
	}
	


	return acpiContext + '</dict>';
}

function getBooter() {
	let BooterContext = '<key>Booter</key><dict>';

	//MmioWhitelist
	BooterContext += '<key>MmioWhitelist</key>';
	BooterContext += genArrayDict('Booter_MmioWhitelist', VUEAPP.Booter.MmioWhitelist,[],['Address']);

	//Patch
	BooterContext += '<key>Patch</key>';
	BooterContext += genArrayDict('Booter_Patch', VUEAPP.Booter.Patch,['Find','Mask','Replace','ReplaceMask'],['Count','Limit','Skip']);


	//Quirks
	let thedt = {ProvideMaxSlide:'integer',ResizeAppleGpuBars:'integer'};
	if(VUEAPP.configisMOD === false) {
		BooterContext += '<key>Quirks</key><dict>' + getStringorboolorinterger(clone(VUEAPP.Booter.Quirks,['EnableForAll']), thedt) + '</dict>';
	} else {
		BooterContext += '<key>Quirks</key><dict>' + getStringorboolorinterger(VUEAPP.Booter.Quirks, thedt) + '</dict>';
	}
	

	return BooterContext + '</dict>';
}

function getDeviceProperties() {
	let DPContext = '<key>DeviceProperties</key><dict>';

	//Add
	DPContext += '<key>Add</key>';
	DPContext += getDeviceData(getRewriteLRData('DeviceProperties_AddLeft', VUEAPP.DeviceProperties.AddLeft), getRewriteLRData('DeviceProperties_AddRight',VUEAPP.DeviceProperties.AddRight));

	//Delete
	DPContext += '<key>Delete</key>';
	DPContext += getDeviceVolumeData(getRewriteLRData('DeviceProperties_DeleteLeft', VUEAPP.DeviceProperties.DeleteLeft), getRewriteLRData('DeviceProperties_DeleteRight', VUEAPP.DeviceProperties.DeleteRight));

	return DPContext + '</dict>';
}

function getKernel() {
	let keContext = '<key>Kernel</key><dict>';

	//Add
	keContext += '<key>Add</key>';
	keContext += genArrayDict('Kernel_Add', VUEAPP.Kernel.Add);

	//Block
	keContext += '<key>Block</key>';
	keContext += genArrayDict('Kernel_Block', VUEAPP.Kernel.Block);

	//Emulate
	keContext += '<key>Emulate</key><dict>';
	
	keContext += '<key>Cpuid1Data</key>';
	keContext += '<data>' + hextoBase64(VUEAPP.Kernel.Emulate['Cpuid1Data']) + '</data>';
	keContext += '<key>Cpuid1Mask</key>';
	keContext += '<data>' + hextoBase64(VUEAPP.Kernel.Emulate['Cpuid1Mask']) + '</data>';
	keContext += '<key>DummyPowerManagement</key>';
	keContext += toBoolStringStrict(VUEAPP.Kernel.Emulate['DummyPowerManagement']);
	keContext += '<key>MaxKernel</key>' + addCharstring(VUEAPP.Kernel.Emulate['MaxKernel']);
	keContext += '<key>MinKernel</key>' + addCharstring(VUEAPP.Kernel.Emulate['MinKernel']);
	keContext += '</dict>';

	//Force
	keContext += '<key>Force</key>';
	keContext += genArrayDict('Kernel_Force', VUEAPP.Kernel.Force);

	//Patch
	keContext += '<key>Patch</key>';
	keContext += genArrayDict('Kernel_Patch', VUEAPP.Kernel.Patch,['Find','Mask','Replace','ReplaceMask'],['Count','Limit','Skip']);

	//Quirks
	keContext += '<key>Quirks</key>';
	keContext += getBoolens(VUEAPP.Kernel.Quirks, ['SetApfsTrimTimeout']);

	//Scheme
	keContext += '<key>Scheme</key><dict>';
	keContext += '<key>CustomKernel</key>';
	keContext += toBoolStringStrict(VUEAPP.Kernel.Scheme['CustomKernel']);
	keContext += '<key>FuzzyMatch</key>';
	keContext += toBoolStringStrict(VUEAPP.Kernel.Scheme['FuzzyMatch']);
	keContext += '<key>KernelArch</key>' + addCharstring(VUEAPP.Kernel.Scheme['KernelArch']);
	keContext += '<key>KernelCache</key>' + addCharstring(VUEAPP.Kernel.Scheme['KernelCache']);
	keContext += '</dict>';


	return keContext + '</dict>';
}

function getMisc() {
	let miscContext = '<key>Misc</key><dict>';

	//1 BlessOverride
	miscContext += '<key>BlessOverride</key>';
	let bodata = VUEAPP.Misc.BlessOverride, bostring = '';
	//consolelog('bodata type = ' + getTypeof(bodata))
	for(let i=0,len=bodata.length;i<len;i++) {
		bostring += addCharstring(bodata[i]['ScanningPaths']);
	}
	miscContext += bothsidesAddarray(bostring);


	//2 Boot
	miscContext += '<key>Boot</key><dict>';
	miscContext += '<key>ConsoleAttributes</key><integer>' + toNumber(VUEAPP.Misc.Boot['ConsoleAttributes']) + '</integer>';
	miscContext += '<key>HibernateMode</key>' + addCharstring(VUEAPP.Misc.Boot['HibernateMode']);

	miscContext += '<key>HideAuxiliary</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['HideAuxiliary']);
	miscContext += '<key>LauncherOption</key>' + addCharstring(VUEAPP.Misc.Boot['LauncherOption']);
	miscContext += '<key>LauncherPath</key>' + addCharstring(VUEAPP.Misc.Boot['LauncherPath']);

	miscContext += '<key>PickerAttributes</key><integer>' + toNumber(VUEAPP.Misc.Boot['PickerAttributes']) + '</integer>';
	miscContext += '<key>PickerAudioAssist</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['PickerAudioAssist']);
	miscContext += '<key>PickerMode</key>' + addCharstring(VUEAPP.Misc.Boot['PickerMode']);
	miscContext += '<key>PickerVariant</key>' + addCharstring(VUEAPP.Misc.Boot['PickerVariant']);
	miscContext += '<key>PollAppleHotKeys</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['PollAppleHotKeys']);

	miscContext += '<key>ShowPicker</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['ShowPicker']);
	if(VUEAPP.configisMOD === true) {
		miscContext += '<key>SkipCustomEntryCheck</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['SkipCustomEntryCheck']);
	}
	miscContext += '<key>TakeoffDelay</key><integer>' + toNumber(VUEAPP.Misc.Boot['TakeoffDelay']) + '</integer>';
	miscContext += '<key>Timeout</key><integer>' + toNumber(VUEAPP.Misc.Boot['Timeout']) + '</integer>';


	//3 Debug
	miscContext += '</dict><key>Debug</key><dict>';
	miscContext += '<key>AppleDebug</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['AppleDebug']);
	miscContext += '<key>ApplePanic</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['ApplePanic']);
	miscContext += '<key>DisableWatchDog</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['DisableWatchDog']);
	miscContext += '<key>DisplayDelay</key><integer>' + toNumber(VUEAPP.Misc.Debug['DisplayDelay']) + '</integer>';
	miscContext += '<key>DisplayLevel</key><integer>' + toNumber(VUEAPP.Misc.Debug['DisplayLevel']) + '</integer>';
	miscContext += '<key>LogModules</key>' + addCharstring(VUEAPP.Misc.Debug['LogModules']);
	miscContext += '<key>SysReport</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['SysReport']);
	miscContext += '<key>Target</key><integer>' + toNumber(VUEAPP.Misc.Debug['Target']) + '</integer>';

	//4 Entries
	miscContext += '</dict><key>Entries</key>';
	miscContext += genArrayDict('Misc_Entries', VUEAPP.Misc.Entries);

	//5 Security
	miscContext += '<key>Security</key><dict>';
	miscContext += '<key>AllowSetDefault</key>' + toBoolStringStrict(VUEAPP.Misc.Security['AllowSetDefault']);
	miscContext += '<key>ApECID</key><integer>' + toNumber(VUEAPP.Misc.Security['ApECID']) + '</integer>';
	miscContext += '<key>AuthRestart</key>' + toBoolStringStrict(VUEAPP.Misc.Security['AuthRestart']);
	miscContext += '<key>BlacklistAppleUpdate</key>' + toBoolStringStrict(VUEAPP.Misc.Security['BlacklistAppleUpdate']);
	miscContext += '<key>DmgLoading</key>' + addCharstring(VUEAPP.Misc.Security['DmgLoading']); 
	miscContext += '<key>EnablePassword</key>' + toBoolStringStrict(VUEAPP.Misc.Security['EnablePassword']);
	miscContext += '<key>ExposeSensitiveData</key><integer>' + toNumber(VUEAPP.Misc.Security['ExposeSensitiveData']) + '</integer>';
	miscContext += '<key>HaltLevel</key><integer>' + toNumber(VUEAPP.Misc.Security['HaltLevel']) + '</integer>';
	miscContext += '<key>PasswordHash</key>';
	miscContext += '<data>' + hextoBase64(VUEAPP.Misc.Security['PasswordHash']) + '</data>';
	miscContext += '<key>PasswordSalt</key>';
	miscContext += '<data>' + hextoBase64(VUEAPP.Misc.Security['PasswordSalt']) + '</data>';
	miscContext += '<key>ScanPolicy</key><integer>' + toNumber(VUEAPP.Misc.Security['ScanPolicy']) + '</integer>';
	miscContext += '<key>SecureBootModel</key>' + addCharstring(VUEAPP.Misc.Security['SecureBootModel']);
	miscContext += '<key>Vault</key>' + addCharstring(VUEAPP.Misc.Security['Vault']);

	//Serial
	miscContext += '</dict><key>Serial</key><dict>';
	miscContext += '<key>Init</key>' + toBoolStringStrict(VUEAPP.Misc.Serial['Init']);
	miscContext += '<key>Override</key>' + toBoolStringStrict(VUEAPP.Misc.Serial['Override']);

	//Serial.Custom
	if(VUEAPP.Misc.Serial['Override'] === true) {
		miscContext += '<key>Custom</key><dict>';
		miscContext += '<key>BaudRate</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['BaudRate']) + '</integer>';
		miscContext += '<key>ClockRate</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['ClockRate']) + '</integer>';
		miscContext += '<key>ExtendedTxFifoSize</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['ExtendedTxFifoSize']) + '</integer>';
		miscContext += '<key>FifoControl</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['FifoControl']) + '</integer>';
		miscContext += '<key>LineControl</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['LineControl']) + '</integer>';
		miscContext += '<key>PciDeviceInfo</key><data>' + hextoBase64(VUEAPP.Misc.Serial.Custom['PciDeviceInfo']) + '</data>';
		miscContext += '<key>RegisterAccessWidth</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['RegisterAccessWidth']) + '</integer>';
		miscContext += '<key>RegisterBase</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['RegisterBase']) + '</integer>';
		miscContext += '<key>RegisterStride</key><integer>' + toNumber(VUEAPP.Misc.Serial.Custom['RegisterStride']) + '</integer>';
		miscContext += '<key>UseHardwareFlowControl</key>' + toBoolStringStrict(VUEAPP.Misc.Serial.Custom['UseHardwareFlowControl']);
		miscContext += '<key>UseMmio</key>' + toBoolStringStrict(VUEAPP.Misc.Serial.Custom['UseMmio']);
		miscContext += '</dict>';
	}
	

	//6 Tools
	miscContext += '</dict><key>Tools</key>';
	miscContext += genArrayDict('Misc_Tools', VUEAPP.Misc.Tools);



	return miscContext + '</dict>';
}


function getNVRAM() {
	let nvramContext = '<key>NVRAM</key><dict>';

	//1 Add
	nvramContext += '<key>Add</key>';
	nvramContext += getDeviceData(getRewriteLRData('NVRAM_AddLeft', VUEAPP.NVRAM.AddLeft), getRewriteLRData('NVRAM_AddRight', VUEAPP.NVRAM.AddRight));

	//2 Delete
	nvramContext += '<key>Delete</key>';
	nvramContext += getDeviceVolumeData(getRewriteLRData('NVRAM_DeleteLeft', VUEAPP.NVRAM.DeleteLeft), getRewriteLRData('NVRAM_DeleteRight', VUEAPP.NVRAM.DeleteRight));

	//3 LegacyEnable
	nvramContext += '<key>LegacyEnable</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['LegacyEnable']);
	nvramContext += '<key>LegacyOverwrite</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['LegacyOverwrite']);

	//4 LegacySchema
	nvramContext += '<key>LegacySchema</key>';
	nvramContext += getDeviceVolumeData(getRewriteLRData('NVRAM_LegacySchemaLeft', VUEAPP.NVRAM.LegacySchemaLeft), getRewriteLRData('NVRAM_LegacySchemaRight', VUEAPP.NVRAM.LegacySchemaRight));

	//5 WriteFlash
	nvramContext += '<key>WriteFlash</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['WriteFlash']);

	return nvramContext + '</dict>';
}

function getPlatformInfo() {
	let pfiContext = '<key>PlatformInfo</key><dict>', configisfull = VUEAPP.configisfull;
	//consolelog(configisfull);

	//0 Automatic
	pfiContext += '<key>Automatic</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['Automatic']);
	pfiContext += '<key>CustomMemory</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['CustomMemory']);

	//1 Generic
	pfiContext += '<key>Generic</key><dict>';
	let gdatatype = {ROM:'data',ProcessorType:'integer'};
	pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.Generic, gdatatype);
	pfiContext += '</dict>';

	
	if(configisfull === true) {

		//DataHub
		pfiContext += '<key>DataHub</key><dict>';
		let thedt = {ARTFrequency:'integer', BoardRevision:'data',DevicePathsSupported:'integer',FSBFrequency:'integer', InitialTSC:'integer',SmcBranch:'data',SmcPlatform:'data'
				,SmcRevision:'data',StartupPowerEvents:'integer'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.DataHub, thedt);
		pfiContext += '</dict>';

		//Memory
		pfiContext += '<key>Memory</key><dict>';
		thedt = {DataWidth:'integer',ErrorCorrection:'integer',FormFactor:'integer',MaxCapacity:'integer',TotalWidth:'integer',Type:'integer',TypeDetail:'integer'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.Memory, thedt);
		pfiContext += '<key>Devices</key>';
		pfiContext += genArrayDict('PlatformInfo_MemoryDevices', VUEAPP.PlatformInfo.Memory_Devices,[],['Size','Speed']);
		pfiContext += '</dict>';

		//PlatformNVRAM
		pfiContext += '<key>PlatformNVRAM</key><dict>';
		let pfndatatype = {FirmwareFeatures:'data',FirmwareFeaturesMask:'data',ROM:'data'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.PlatformNVRAM, pfndatatype);
		pfiContext += '</dict>';

		//SMBIOS
		pfiContext += '<key>SMBIOS</key><dict>';
		let smbiosdatatype = {BoardType:'integer',ChassisType:'integer',FirmwareFeatures:'data',FirmwareFeaturesMask:'data',
		PlatformFeature:'integer',ProcessorType:'integer',SmcVersion:'data'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.SMBIOS, smbiosdatatype);
		pfiContext += '</dict>';

		


	}

	//root
	pfiContext += '<key>UpdateDataHub</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateDataHub']);
	pfiContext += '<key>UpdateNVRAM</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateNVRAM']);
	pfiContext += '<key>UpdateSMBIOS</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateSMBIOS']);
	pfiContext += '<key>UpdateSMBIOSMode</key>' + addCharstring(VUEAPP.PlatformInfo.root['UpdateSMBIOSMode']);
	pfiContext += '<key>UseRawUuidEncoding</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UseRawUuidEncoding']);
	return pfiContext + '</dict>';
}

function getUEFI() {
	let uefiContext = '<key>UEFI</key><dict>';

	//APFS
	uefiContext += '<key>APFS</key><dict>';
	let ApfsDataType = {MinDate:'integer',MinVersion:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.APFS, ApfsDataType);
	uefiContext += '</dict>';

	//AppleInput
	uefiContext += '<key>AppleInput</key><dict>';
	let AppleInputDataType = {KeyInitialDelay:'integer',KeySubsequentDelay:'integer',PointerPollMask:'integer', PointerPollMax:'integer', PointerPollMin:'integer', PointerSpeedDiv:'integer',PointerSpeedMul:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.AppleInput, AppleInputDataType);
	uefiContext += '</dict>';

	// Audio
	uefiContext += '<key>Audio</key><dict>';
	let AudioDataType = {AudioCodec:'integer',AudioOutMask:'integer',MaximumGain:'integer',MinimumAssistGain:'integer',MinimumAudibleGain:'integer',SetupDelay:'integer'};
	//consolelog(VUEAPP.UEFI.Audio);
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Audio, AudioDataType);
	uefiContext += '</dict>';

	// root
	uefiContext += '<key>ConnectDrivers</key>' + toBoolStringStrict(VUEAPP.UEFI.root['ConnectDrivers']);


	// Drivers
	uefiContext += '<key>Drivers</key>';
	uefiContext += genArrayDict('UEFI_Drivers', VUEAPP.UEFI.Drivers,[],[]);


	// Input
	uefiContext += '<key>Input</key><dict>';
	let inputDataType = {KeyForgetThreshold:'integer',TimerResolution:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Input, inputDataType);
	uefiContext += '</dict>';

	// Output
	uefiContext += '<key>Output</key><dict>';
	let thedt = {UIScale:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Output, thedt);
	uefiContext += '</dict>';

	// ProtocolOverrides
	uefiContext += '<key>ProtocolOverrides</key><dict>';
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.ProtocolOverrides);
	uefiContext += '</dict>';

	// Quirks
	uefiContext += '<key>Quirks</key><dict>';
	let quirksDataType = {ExitBootServicesDelay:'integer',ResizeGpuBars:'integer',TscSyncTimeout:'integer'}
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Quirks, quirksDataType);
	uefiContext += '</dict>';

	//ReservedMemory
	uefiContext += '<key>ReservedMemory</key>';
	uefiContext += genArrayDict('UEFI_ReservedMemory', VUEAPP.UEFI.ReservedMemory,[],['Address','Size']);

	return uefiContext + '</dict>';
}






//*****************公共函数区**********************


function getDeviceVolumeData(leftData, rightData) {
	let strreturn = '<dict>',lenleftData = leftData.length;
	
	for(let it=0;it<lenleftData;it++) {
		if(leftData[it]['Devices'] === undefined) {
			showTipModal(VUEAPP.lang.DeviceError, 'warning');
		}
		strreturn += addKey(leftData[it]['Devices']);
		strreturn += getSubDeviceVolumeData(leftData[it]['id'], rightData);
	}

	return strreturn === '<dict>' ? '<dict/>' : strreturn + '</dict>';

}

function getSubDeviceVolumeData(pid, rightData) {
	let strreturn = '',lenrightData=rightData.length;
	
	for(let it=0;it<lenrightData;it++) {
		if(rightData[it]['pid'] == pid) { 

			if(rightData[it].Volume === undefined) {
				showTipModal(VUEAPP.lang.DeviceError, 'warning');
			}
			
			const rightDataType = rightData[it].Type;
			switch(rightDataType) {
				case 'data':
					strreturn += '<data>' + hextoBase64(rightData[it].Volume) + '</data>';
					break;
				case 'bool':  //如果是bool, 转成<true/>或者 <false/>
					strreturn += toBoolString(rightData[it].Volume);
					break;
				case 'integer':
					strreturn += '<integer>' + toNumber(rightData[it].Value) + '</integer>';
					break;
				case 'real':
					strreturn += '<real>' + toNumber(rightData[it].Value, parseFloat) + '</real>';
					break;
				default: //如果是其他就直接用数据类型包裹值
					strreturn += '<' + rightDataType + '>' + htmlEscape(rightData[it].Volume) + '</' + rightDataType + '>';
			}

		}
	}
	//console.timeEnd('getSubDeviceVolumeData');
	return strreturn === '' ? '<array/>' : '<array>' + strreturn + '</array>';

}


function getStringorboolorinterger(theData, dataType={}) {
	
	
	let strreturn = "", vueitDatatype = '', itDataType = '';

	for(let it in theData) {

		
		vueitDatatype = typeof(theData[it]);
		if(vueitDatatype == 'object') continue; //如果碰到数组直接跳过


		strreturn += addKey(it);

		//如果数据类型是BOOLEAN
		if(vueitDatatype === 'boolean') {
			strreturn += (theData[it] === true ? '<true/>' : '<false/>');
		} else {
			itDataType = dataType[it];
			switch(itDataType) {
				case 'data':
					strreturn += '<data>' + hextoBase64(theData[it]) + '</data>';
					break;
				case undefined:
					strreturn += addCharstring(theData[it]);
					break;
				case 'integer':
					strreturn += '<integer>' + toNumber(theData[it]) + '</integer>';
					break;
				case 'real':
					strreturn += '<real>' + toNumber(theData[it], parseFloat) + '</real>';
					break;
				default:
					strreturn += '<' + itDataType + '>' + htmlEscape(theData[it]) + '</' + itDataType + '>';
			}
		}

	}

	return strreturn;
}


function getDeviceData(leftData, rightData) {
	let strreturn = '<dict>', lenleftData= leftData.length;
	//consolelog('leftData type = ' + getTypeof(leftData));
	for(let it=0;it<lenleftData;it++) {
		if(leftData[it]['Devices'] === undefined) {
			showTipModal(VUEAPP.lang.DeviceError, 'warning');
		}

		strreturn += addKey(leftData[it]['Devices']);
		strreturn += getSubDeviceData(leftData[it]['id'], rightData)
	}
	
	return strreturn === '<dict>' ? '<dict/>' : strreturn + '</dict>';
	
}

function getSubDeviceData(pid, rightData) {
	
	let subcontext = "<dict>", rightDataType = '', lenrightData=rightData.length;
	//consolelog('Data type = ' + getTypeof(rightData));
	for(let i=0;i<lenrightData;i++) {
		if(rightData[i].pid == pid) {
			
			if(rightData[i].Value === undefined) {
				showTipModal(VUEAPP.lang.DeviceError, 'warning');
			}

			subcontext += addKey(rightData[i].Key);

			rightDataType = rightData[i].Type;

			switch(rightDataType) {
				case 'data':
					subcontext += '<data>' + hextoBase64(rightData[i].Value) + '</data>';
					break;
				case 'bool':
					subcontext += toBoolString(rightData[i].Value);
					break;
				case 'integer':
					subcontext += '<integer>' + toNumber(rightData[i].Value) + '</integer>';
					break;
				case 'real':
					subcontext += '<real>' + toNumber(rightData[i].Value, parseFloat) + '</real>';
					break;
				default:
					subcontext += '<' + rightDataType + '>' + htmlEscape(rightData[i].Value) + '</' + rightDataType + '>';
			}

		}
	}

	return subcontext + "</dict>"
}


function getBoolens(boolData,intData=[]) {
	
	let strreturn = '<dict>';
	//consolelog('Data type = ' + getTypeof(boolData));
	for(let it in boolData) {
		strreturn += addKey(it);
		if(intData.indexOf(it) >= 0) {
			strreturn += '<integer>' + toNumber(boolData[it]) + '</integer>';
		} else {
			strreturn += toBoolStringStrict(boolData[it]);
		}
		
	}

	return strreturn === '<dict>' ? '<dict/>' : strreturn + '</dict>';
}

/**
<array>
<dict>
	<key>Comment</key>
	<string>My custom DSDT</string>
	<key>Enabled</key>
	<false/>
	<key>Path</key>
	<string>DSDT.aml</string>
</dict>
<dict>
	<key>Comment</key>
	<string>My custom SSDT</string>
	<key>Enabled</key>
	<false/>
	<key>Path</key>
	<string>SSDT-1.aml</string>
</dict>
根据tablekey去表格中读取数据并组装成字符串返回
genArrayDict(		tablekey，      表格在GLOBAL_MAP_TABLE中的key
					arrayDictData,  数据
					dataFileds,     要转换为base64的字段列表
					intFileds       要转换为整形的字段列表
					)
**/
function genArrayDict(tablekey, arrayDictData, dataFileds=[], intFileds=[]) {

	if(arrayDictData.length === 0) {
		return '<array/>'
	}


	let currentTableData = getJqgridObjectbyKey(tablekey).jqGrid('getRowData');
	arrayDictData = rewriteData(currentTableData, arrayDictData);

	let tmpreturn = '', lenarrayDictData = arrayDictData.length;
	//consolelog('Data type = ' + getTypeof(arrayDictData));
	for(let i=0;i<lenarrayDictData;i++) {
		tmpreturn += '<dict>';
		//consolelog('Data type = ' + getTypeof(arrayDictData[0]));
		for(let it in arrayDictData[0]) {   //字段顺序跟着第一行数据的字段顺序走，防止后增加的行的字段顺序和前面的不同
			if(it === 'id' || it === 'pid') {
				continue;
			}
			let itemData = arrayDictData[i][it] === undefined ? '' : arrayDictData[i][it];

			tmpreturn += addKey(it);

            // 如果当前字段在dataFileds中，说明要转为BASE64
            if(dataFileds.indexOf(it) >= 0) {
                if(itemData === '') {
                    tmpreturn += '<data></data>';
                } else {
					//consolelog(itemData);
                    tmpreturn += '<data>' + hextoBase64(itemData) + '</data>';
                }
            }
            // 如果在整形字段列表中
            else if(intFileds.indexOf(it) >= 0) {
                tmpreturn += '<integer>' + toNumber(itemData) + '</integer>';
            }
			//否则就是其他string boolean了
			else {
				tmpreturn += addvtype(itemData);
			}
            

		}
		tmpreturn += '</dict>';
	}
	return '<array>' + tmpreturn + '</array>';
}

/*
* 在key两边加上<key>字符串
*/
function addKey(keyContext) {
    return '<key>' + htmlEscape(keyContext) + '</key>';
}

/*
* 在字符串两边加上<array>
*/
function bothsidesAddarray(context='') {
	return context === '' ? '<array/>' : '<array>' + context + '</array>';
}

function addvtype(valu) {

	//复选框被勾选后会变成YES, NO
	if(valu === 'YES') {
		return '<true/>';
	} else if(valu === 'NO') {
		return '<false/>';
	}

	const tf = typeof(valu);

	if(tf === 'string') {
		return addCharstring(valu);
	} else if(tf === 'boolean') {
		return toBoolStringStrict(valu);
	}

}

//用左边的数据重写右边的数据并返回右边的数据
function rewriteData(leftdata, rightdata) {
	//consolelog('leftdata type = ' + getTypeof(leftdata) + "  " + 'rightdata type = ' + getTypeof(rightdata));
	const len=leftdata.length;
	for(let i=0;i<len;i++) {
		//consolelog('leftdata[i] type = ' + getTypeof(leftdata[i]))
		for(let it in leftdata[i]) {
			rightdata[i][it] = leftdata[i][it];
		}
	}
	return rightdata;
}

//用在左右两边表格的地方
function getRewriteLRData(tablekey, rightdata) {

	let currentTableData = getJqgridObjectbyKey(tablekey).jqGrid('getRowData');
	return rewriteData(currentTableData, rightdata);
	
}
