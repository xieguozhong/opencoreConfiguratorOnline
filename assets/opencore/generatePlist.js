
function getAllPlist() {
	//console.log(VUEAPP.ACPI.Block);
	//console.log(genArrayDict(VUEAPP.ACPI.Block, ['OemTableId','TableSignature'],['TableLength']));

	let plistContext = '<?xml version="1.0" encoding="UTF-8"?>';
	plistContext += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';
	plistContext += '<plist version="1.0">';
	plistContext +=  '<dict>';

	//1 ACPI
	plistContext += genACPI();

	//2 Booter
	plistContext += getBooter();

	//3 DeviceProperties
	plistContext += getDeviceProperties();

	//4 Kernel
	plistContext += getKernel();

	//5 getMisc
	plistContext += getMisc();

	//6 NVRAM
	plistContext += getNVRAM();

	//7 PlatformInfo
	plistContext += getPlatformInfo();

	//8 UEFI
	plistContext += getUEFI();


	plistContext +=  '</dict>';
	plistContext +=  '</plist>';

	return $.format(plistContext, {method: 'xml'});

}

function genACPI() {
	let acpiContext = '<key>ACPI</key><dict>';
	//Add
	acpiContext += '<key>Add</key>';
	acpiContext += genArrayDict(VUEAPP.ACPI.Add);
	//Block
	acpiContext += '<key>Block</key>';
	acpiContext += genArrayDict(VUEAPP.ACPI.Block, ['OemTableId','TableSignature'],['TableLength']);

	//Patch
	acpiContext += '<key>Patch</key>';
	acpiContext += genArrayDict(VUEAPP.ACPI.Patch, ['Find','Mask','OemTableId','Replace','ReplaceMask','TableSignature'],['Count','Limit','Skip','TableLength']);

	//Quirks
	acpiContext += '<key>Quirks</key>' + getBoolens(VUEAPP.ACPI.Quirks);


	return acpiContext + '</dict>';
}

function getBooter() {
	let BooterContext = '<key>Booter</key><dict>';

	//MmioWhitelist
	BooterContext += '<key>MmioWhitelist</key>';
	BooterContext += genArrayDict(VUEAPP.Booter.MmioWhitelist,[],['Address']);


	//Quirks
	BooterContext += '<key>Quirks</key>' + getBoolens(VUEAPP.Booter.Quirks);

	return BooterContext + '</dict>';
}

function getDeviceProperties() {
	let DPContext = '<key>DeviceProperties</key><dict>';

	//Add
	DPContext += '<key>Add</key>';
	DPContext += getDeviceData(VUEAPP.DeviceProperties.AddLeft, VUEAPP.DeviceProperties.AddRight);

	//Block
	DPContext += '<key>Block</key>';
	DPContext += getDeviceVolumeData(VUEAPP.DeviceProperties.BlockLeft, VUEAPP.DeviceProperties.BlockRight);

	return DPContext + '</dict>';
}

function getKernel() {
	let keContext = '<key>Kernel</key><dict>';

	//Add
	keContext += '<key>Add</key>';
	keContext += genArrayDict(VUEAPP.Kernel.Add);

	//Block
	keContext += '<key>Block</key>';
	keContext += genArrayDict(VUEAPP.Kernel.Block);

	//Emulate
	keContext += '<key>Emulate</key><dict>';
	keContext += '<key>Cpuid1Data</key>';
	keContext += '<data>' + hextoBase64(VUEAPP.Kernel.Emulate['Cpuid1Data']) + '</data>';
	keContext += '<key>Cpuid1Mask</key>';
	keContext += '<data>' + hextoBase64(VUEAPP.Kernel.Emulate['Cpuid1Mask']) + '</data>';

	//Patch
	keContext += '</dict><key>Patch</key>';
	keContext += genArrayDict(VUEAPP.Kernel.Patch,['Find','Mask','Replace','ReplaceMask'],['Count','Limit','Skip']);

	//Quirks
	keContext += '<key>Quirks</key>';
	keContext += getBoolens(VUEAPP.Kernel.Quirks);

	return keContext + '</dict>';
}

function getMisc() {
	let miscContext = '<key>Misc</key><dict>';

	//1 BlessOverride
	miscContext += '<key>BlessOverride</key>';
	let bodata = VUEAPP.Misc.BlessOverride, bostring = '';
	for(let i=0,len=bodata.length;i<len;i++) {
		bostring += addCharstring(bodata[i]['ScanningPaths']);
	}
	miscContext += bothsidesAddarray(bostring);


	//2 Boot
	miscContext += '<key>Boot</key><dict>';



	miscContext += '<key>ConsoleAttributes</key><integer>' + toNumber(VUEAPP.Misc.Boot['ConsoleAttributes']) + '</integer>';
	miscContext += '<key>HibernateMode</key>' + addCharstring(VUEAPP.Misc.Boot['HibernateMode']);

	miscContext += '<key>HideAuxiliary</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['HideAuxiliary']);
	miscContext += '<key>HideSelf</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['HideSelf']);

	miscContext += '<key>PickerAttributes</key><integer>' + toNumber(VUEAPP.Misc.Boot['PickerAttributes']) + '</integer>';
	miscContext += '<key>PickerAudioAssist</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['PickerAudioAssist']);
	miscContext += '<key>PickerMode</key>' + addCharstring(VUEAPP.Misc.Boot['PickerMode']);
	miscContext += '<key>PollAppleHotKeys</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['PollAppleHotKeys']);

	miscContext += '<key>ShowPicker</key>' + toBoolStringStrict(VUEAPP.Misc.Boot['ShowPicker']);
	miscContext += '<key>TakeoffDelay</key><integer>' + toNumber(VUEAPP.Misc.Boot['TakeoffDelay']) + '</integer>';
	miscContext += '<key>Timeout</key><integer>' + toNumber(VUEAPP.Misc.Boot['Timeout']) + '</integer>';


	//3 Debug
	miscContext += '</dict><key>Debug</key><dict>';
	miscContext += '<key>AppleDebug</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['AppleDebug']);
	miscContext += '<key>DisableWatchDog</key>' + toBoolStringStrict(VUEAPP.Misc.Debug['DisableWatchDog']);
	miscContext += '<key>DisplayDelay</key><integer>' + toNumber(VUEAPP.Misc.Debug['DisplayDelay']) + '</integer>';
	miscContext += '<key>DisplayLevel</key><integer>' + toNumber(VUEAPP.Misc.Debug['DisplayLevel']) + '</integer>';
	miscContext += '<key>Target</key><integer>' + toNumber(VUEAPP.Misc.Debug['Target']) + '</integer>';

	//4 Entries
	miscContext += '</dict><key>Entries</key>';
	miscContext += genArrayDict(VUEAPP.Misc.Entries);

	//5 Security
	miscContext += '<key>Security</key><dict>';
	miscContext += '<key>AllowNvramReset</key>' + toBoolStringStrict(VUEAPP.Misc.Security['AllowNvramReset']);
	miscContext += '<key>AllowSetDefault</key>' + toBoolStringStrict(VUEAPP.Misc.Security['AllowSetDefault']);
	miscContext += '<key>AuthRestart</key>' + toBoolStringStrict(VUEAPP.Misc.Security['AuthRestart']);
	miscContext += '<key>BootProtect</key>' + addCharstring(VUEAPP.Misc.Security['BootProtect']);
	miscContext += '<key>ExposeSensitiveData</key><integer>' + toNumber(VUEAPP.Misc.Security['ExposeSensitiveData']) + '</integer>';
	miscContext += '<key>HaltLevel</key><integer>' + toNumber(VUEAPP.Misc.Security['HaltLevel']) + '</integer>';
	miscContext += '<key>ScanPolicy</key><integer>' + toNumber(VUEAPP.Misc.Security['ScanPolicy']) + '</integer>';
	miscContext += '<key>Vault</key>' + addCharstring(VUEAPP.Misc.Security['Vault']);

	//6 Tools
	miscContext += '</dict><key>Tools</key>';
	miscContext += genArrayDict(VUEAPP.Misc.Tools);



	return miscContext + '</dict>';
}


function getNVRAM() {
	let nvramContext = '<key>NVRAM</key><dict>';

	//1 Add
	nvramContext += '<key>Add</key>';
	nvramContext += getDeviceData(VUEAPP.NVRAM.AddLeft, VUEAPP.NVRAM.AddRight);

	//2 Block
	nvramContext += '<key>Block</key>';
	nvramContext += getDeviceVolumeData(VUEAPP.NVRAM.BlockLeft, VUEAPP.NVRAM.BlockRight);

	//3 LegacyEnable
	nvramContext += '<key>LegacyEnable</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['LegacyEnable']);
	nvramContext += '<key>LegacyOverwrite</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['LegacyOverwrite']);

	//4 LegacySchema
	nvramContext += '<key>LegacySchema</key>';
	nvramContext += getDeviceVolumeData(VUEAPP.NVRAM.LegacySchemaLeft, VUEAPP.NVRAM.LegacySchemaRight);

	//5 WriteFlash
	nvramContext += '<key>WriteFlash</key>' + toBoolStringStrict(VUEAPP.NVRAM.root['WriteFlash']);

	return nvramContext + '</dict>';
}

function getPlatformInfo() {
	let pfiContext = '<key>PlatformInfo</key><dict>', configisfull = VUEAPP.configisfull;
	//console.log(configisfull);

	//0 Automatic
	pfiContext += '<key>Automatic</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['Automatic']);

	//1 DataHub
	if(configisfull === true) {
		pfiContext += '<key>DataHub</key><dict>';
		let thedt = {ARTFrequency:'integer', BoardRevision:'data',DevicePathsSupported:'integer',FSBFrequency:'integer', InitialTSC:'integer',SmcBranch:'data',SmcPlatform:'data'
				,SmcRevision:'data',StartupPowerEvents:'integer'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.DataHub, thedt);
		pfiContext += '</dict>';
	}


	//2 Generic
	pfiContext += '<key>Generic</key><dict>';
	let gdatatype = {ROM:'data'};
	pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.Generic, gdatatype);
	pfiContext += '</dict>';

	//3 PlatformNVRAM
	if(configisfull === true) {
		pfiContext += '<key>PlatformNVRAM</key><dict>';
		let pfndatatype = {FirmwareFeatures:'data',FirmwareFeaturesMask:'data',ROM:'data'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.PlatformNVRAM, pfndatatype);
		pfiContext += '</dict>';
	}

	//4 SMBIOS
	if(configisfull === true) {
		pfiContext += '<key>SMBIOS</key><dict>';
		let smbiosdatatype = {BoardType:'integer',ChassisType:'integer',FirmwareFeatures:'data',FirmwareFeaturesMask:'data',MemoryFormFactor:'integer'
					,PlatformFeature:'integer',ProcessorType:'integer',SmcVersion:'data'};
		pfiContext += getStringorboolorinterger(VUEAPP.PlatformInfo.SMBIOS, smbiosdatatype);
		pfiContext += '</dict>';
	}

	//5 root
	pfiContext += '<key>UpdateDataHub</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateDataHub']);
	pfiContext += '<key>UpdateNVRAM</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateNVRAM']);
	pfiContext += '<key>UpdateSMBIOS</key>' + toBoolStringStrict(VUEAPP.PlatformInfo.root['UpdateSMBIOS']);
	pfiContext += '<key>UpdateSMBIOSMode</key>' + addCharstring(VUEAPP.PlatformInfo.root['UpdateSMBIOSMode']);

	return pfiContext + '</dict>';
}

function getUEFI() {
	let uefiContext = '<key>UEFI</key><dict>';

	//APFS
	uefiContext += '<key>APFS</key><dict>';
	let ApfsDataType = {MinDate:'integer',MinVersion:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.APFS, ApfsDataType);
	uefiContext += '</dict>';


	// Audio
	uefiContext += '<key>Audio</key><dict>';
	let AudioDataType = {AudioCodec:'integer',AudioOut:'integer',MinimumVolume:'integer',VolumeAmplifier:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Audio, AudioDataType);
	uefiContext += '</dict>';

	// root
	uefiContext += '<key>ConnectDrivers</key>' + toBoolStringStrict(VUEAPP.UEFI.root['ConnectDrivers']);


	// Drivers
	uefiContext += '<key>Drivers</key>';
	let dridata = VUEAPP.UEFI.Drivers, dristring = '';
	//console.log(dridata);
	for(let i=0,len=dridata.length;i<len;i++) {
		dristring += addCharstring(dridata[i]['FileName']);
	}
	uefiContext += bothsidesAddarray(dristring);




	// Input
	uefiContext += '<key>Input</key><dict>';
	let inputDataType = {KeyForgetThreshold:'integer',KeyMergeThreshold:'integer',TimerResolution:'integer'};
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Input, inputDataType);
	uefiContext += '</dict>';

	// Output
	uefiContext += '<key>Output</key><dict>';
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Output);
	uefiContext += '</dict>';

	// ProtocolOverrides
	uefiContext += '<key>ProtocolOverrides</key><dict>';
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.ProtocolOverrides);
	uefiContext += '</dict>';

	// Quirks
	uefiContext += '<key>Quirks</key><dict>';
	let quirksDataType = {ExitBootServicesDelay:'integer'}
	uefiContext += getStringorboolorinterger(VUEAPP.UEFI.Quirks, quirksDataType);
	uefiContext += '</dict>';

	//ReservedMemory
	uefiContext += '<key>ReservedMemory</key>';
	uefiContext += genArrayDict(VUEAPP.UEFI.ReservedMemory,[],['Address','Size']);

	return uefiContext + '</dict>';
}






//*****************公共函数区**********************


function getDeviceVolumeData(leftData, rightData) {
	let strreturn = '<dict>';

	for(let it in leftData) {
		if(leftData[it]['Devices'] === undefined) {
			showTipModal(VUEAPP.lang.DeviceError, 'warning');
		}
		strreturn += addKey(leftData[it]['Devices']);
		strreturn += getSubDeviceVolumeData(leftData[it]['id'], rightData);
	}

	return strreturn + '</dict>';
}

function getSubDeviceVolumeData(pid, rightData) {
	let strreturn = '';
	//console.log(rightData);
	for(let it in rightData) {
		if(rightData[it]['pid'] == pid) {  //<string>MaximumBootBeepVolume</string>

			if(rightData[it].Volume === undefined) {
				showTipModal(VUEAPP.lang.DeviceError, 'warning');
			}

			if(rightData[it].Type === 'data') {
				strreturn += '<data>' + hextoBase64(rightData[it].Volume) + '</data>';
			}
			//如果是BOOL, 转成<true/>或者 <false/>
			else if(rightData[it].Type === 'bool') {
				strreturn += toBoolString(rightData[it].Volume);
			} else if(rightData[it].Type === 'integer' ) {
				strreturn += '<integer>' + toNumber(rightData[it].Value) + '</integer>';
			} else if(rightData[it].Type === 'real') {
				strreturn += '<real>' + toNumber(rightData[it].Value) + '</real>';
			}
			//如果是其他就直接用数据类型包裹值
			else {
				strreturn += '<' + rightData[it].Type + '>' + plistEncode(rightData[it].Volume) + '</' + rightData[it].Type + '>';
			}

		}
	}
	if(strreturn === '') {
		return '<array/>';
	} else {
		return '<array>' + strreturn + '</array>';
	}

}


function getStringorboolorinterger(theData, dataType) {
	if(dataType === undefined) dataType = {};

	let strreturn = "";

	for(let it in theData) {
		strreturn += addKey(it);

		//如果数据类型是BOOLEAN
		if(typeof(theData[it]) === 'boolean') {
			strreturn += (theData[it] === true ? '<true/>' : '<false/>');
		} else {
			let itDataType = dataType[it];
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
					strreturn += '<real>' + toNumber(theData[it]) + '</real>';
					break;
				default:
					strreturn += '<' + itDataType + '>' + plistEncode(theData[it]) + '</' + itDataType + '>';
			}
		}

	}

	return strreturn;
}

function getDeviceData(leftData, rightData) {
	let strreturn = '<dict>';
	//console.log(leftData);
	for(let it in leftData) {
		if(leftData[it]['Devices'] === undefined) {
			showTipModal(VUEAPP.lang.DeviceError, 'warning');
		}

		strreturn += addKey(leftData[it]['Devices']);
		strreturn += getSubDeviceData(leftData[it]['id'], rightData)
	}

	return strreturn + '</dict>';
}

function getSubDeviceData(pid, rightData) {
	//console.log(rightData);
	let subcontext = "<dict>"
	for(let i=0,len=rightData.length;i<len;i++) {
		if(rightData[i].pid == pid) {
			//console.log(rightData[i].Value);
			if(rightData[i].Value === undefined) {
				showTipModal(VUEAPP.lang.DeviceError, 'warning');
			}

			subcontext += addKey(rightData[i].Key);

			//如果数据类型是DATA, 转成BASE64
			if(rightData[i].Type === 'data') {
				subcontext += '<data>' + hextoBase64(rightData[i].Value) + '</data>';
			}
			//如果是BOOL, 转成<true/>或者 <false/>
			else if(rightData[i].Type === 'bool') {
				subcontext += toBoolString(rightData[i].Value);
			} else if(rightData[i].Type === 'integer' ) {
				subcontext += '<integer>' + toNumber(rightData[i].Value) + '</integer>';
			} else if(rightData[i].Type === 'real') {
				subcontext += '<real>' + toNumber(rightData[i].Value) + '</real>';
			}
			//如果是其他就直接用数据类型包裹值
			else {
				subcontext += '<' + rightData[i].Type + '>' + plistEncode(rightData[i].Value) + '</' + rightData[i].Type + '>';
			}
		}
	}

	return subcontext + "</dict>"
}


function getBoolens(boolData) {
	let strreturn = '<dict>';
	for(let it in boolData) {
		strreturn += addKey(it);
		strreturn += toBoolStringStrict(boolData[it]);
	}

	return strreturn + '</dict>';
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
**/
function genArrayDict(arrayDictData, dataFileds, intFileds) {
	if(dataFileds === undefined) dataFileds =[];
	if(intFileds === undefined) intFileds =[];

	if(arrayDictData.length === 0) {
		return '<array/>'
	}
	let tmpreturn = '';
	for(let i=0,len=arrayDictData.length;i<len;i++) {
		tmpreturn += '<dict>';
		//console.log(arrayDictData[i]);
		for(let it in arrayDictData[i]) {
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
                    tmpreturn += '<data>' + hextoBase64(itemData) + '</data>';
                }

                continue;
            }
            // 如果在整形字段列表中
            if(intFileds.indexOf(it) >= 0) {
                tmpreturn += '<integer>' + toNumber(itemData) + '</integer>';
                continue;
            }

            //否则就是其他string date boolean了
            tmpreturn += addvtype(itemData);

		}
		tmpreturn += '</dict>';
	}
	return '<array>' + tmpreturn + '</array>';
}

/*
* 在key两边加上<key>字符串
*/
function addKey(keyContext) {
    return '<key>' + plistEncode(keyContext) + '</key>';
}

/*
* 在字符串两边加上<array>
*/
function bothsidesAddarray(context) {
	if(context === '' || context === undefined) {
		return '<array/>';
	} else {
		return '<array>' + context + '</array>';
	}
}

function addvtype(valu) {

	//复选框被勾选后会变成YES, NO
	if(valu === 'YES') {
		return '<true/>';
	}
	if(valu === 'NO') {
		return '<false/>';
	}
	let tf = typeof(valu);
	//console.log('|' + valu + '|=' + tf);
	switch(tf) {
		case 'string':
			return addCharstring(valu);
			break;
		case 'boolean':
			return toBoolStringStrict(valu);
			break;

	}

}
