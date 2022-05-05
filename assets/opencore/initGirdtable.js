let GLOBAL_TABLE_WIDTH = 0,  			//表格的宽度
	GLOBAL_TABLE_HEIGHT = 0, 			//表格的高度
	GLOBAL_TABLE_HALF_WIDTH = 0, 		//半表格的宽度
	GLOBAL_ARRAY_TABLE=[{},{}],      	//用于存储所有初始化好的表格，0是全宽表格，1是半宽表格
	GLOBAL_ONEDIT_TABLE=[],				//用于存储编辑中的表格名称，回车保存后会从数组中删除
	MAXROWID = 500;						//表格点新增时的jqgrid的id起始值，如果谁的配置有500行，那么会产生bug




function initGridTableACPI() {


	//gridtable-ACPI-Add
	let objGT_ACPI_Add = jQuery('#gridtable_ACPI_Add');
	GLOBAL_ARRAY_TABLE[0]['ACPI_Add'] = objGT_ACPI_Add;

	GLOBAL_TABLE_WIDTH = objGT_ACPI_Add.closest('.tab-content').width();
	GLOBAL_TABLE_HALF_WIDTH = parseInt(GLOBAL_TABLE_WIDTH / 2) - 8;
	GLOBAL_TABLE_HEIGHT = $(document).height();


	let colNames = ['Comment', 'Path','Enabled'];
	let colModel = [
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false, formatter:plistEncode},
		{name:'Path',index:'Path', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable(objGT_ACPI_Add, VUEAPP.ACPI.Add, colNames, colModel);

	//gridtable-ACPI-Delete
	colNames = ['Comment', 'OemTableId','TableLength','TableSignature','All','Enabled'];
	colModel = [
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false, formatter:plistEncode},
		{name:'OemTableId',index:'OemTableId', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'TableLength',index:'TableLength',width:90, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'TableSignature',index:'TableSignature', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'All',index:'All', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,formatter:enabledFormat, fixed:true, align:'center'},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_ACPI_Delete = jQuery('#gridtable_ACPI_Delete');
	GLOBAL_ARRAY_TABLE[0]['ACPI_Delete'] = objGT_ACPI_Delete;
	initGridTable(objGT_ACPI_Delete, VUEAPP.ACPI.Delete, colNames, colModel);

	//gridtable-ACPI-Patch
	colNames = ['Base','BaseSkip','Comment','Count','Find','Limit','Mask','OemTableId','Replace','ReplaceMask','Skip','TableLength','TableSignature','Enabled'];
	colModel = [
			{name:'Base',index:'Base',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'BaseSkip',index:'BaseSkip',width:90, editable:true, sortable:false,align:'center', formatter:formatInteger},
			{name:'Comment',index:'Comment',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'Count',index:'Count',width:60, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
			{name:'Find',index:'Find',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'Limit',index:'Limit',width:60, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
			{name:'Mask',index:'Mask',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'OemTableId',index:'OemTableId',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'Replace',index:'Replace',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'ReplaceMask',index:'ReplaceMask',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'Skip',index:'Skip',width:60, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
			{name:'TableLength',index:'TableLength',width:90, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
			{name:'TableSignature',index:'TableSignature',width:90, editable:true, sortable:false, formatter:plistEncode},
			{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
		];

	let objGT_ACPI_Patch = jQuery('#gridtable_ACPI_Patch');
	GLOBAL_ARRAY_TABLE[0]['ACPI_Patch'] = objGT_ACPI_Patch;
	initGridTable(objGT_ACPI_Patch, VUEAPP.ACPI.Patch, colNames, colModel);


}

function initGridTableMisc() {
	let colNames = ['Arguments','Comment','Name','Flavour','Path','TextMode','Auxiliary','Enabled'];
	let colModel = [
		{name:'Arguments',index:'Arguments', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:130,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Name',index:'Name', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Flavour',index:'Flavour', width:80,editable: true,  sortable:false, formatter:getPlistEncodeFunction('Auto')},
		{name:'Path',index:'Path', width:410,editable: true,  sortable:false, formatter:plistEncode},
		{name:'TextMode',index:'TextMode', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat},
		{name:'Auxiliary',index:'Auxiliary', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Entries = jQuery('#gridtable_Misc_Entries');
	GLOBAL_ARRAY_TABLE[0]['Misc_Entries'] = objGT_Misc_Entries;
	initGridTable(objGT_Misc_Entries, VUEAPP.Misc.Entries, colNames, colModel);

	//BlessOverride
	colNames = ['ScanningPaths'];
	colModel = [
		{name:'ScanningPaths',index:'ScanningPaths', width:150,editable: true,  sortable:false, formatter:plistEncode}
	];
	let objGT_Misc_BlessOverride = jQuery('#gridtable_Misc_BlessOverride');
	GLOBAL_ARRAY_TABLE[0]['Misc_BlessOverride'] = objGT_Misc_BlessOverride;
	
	initGridTable(objGT_Misc_BlessOverride, VUEAPP.Misc.BlessOverride, colNames, colModel);



	//Tools
	colNames = ['Arguments','Comment','Name','Flavour','Path','Auxiliary','RealPath','TextMode','Enabled'];
	colModel = [
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Name',index:'Name', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Flavour',index:'Flavour', width:150,editable: true,  sortable:false, formatter:getPlistEncodeFunction('Auto')},
		{name:'Path',index:'Path', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Auxiliary',index:'Auxiliary', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat},
		{name:'RealPath',index:'RealPath', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat},
		{name:'TextMode',index:'TextMode', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Tools = jQuery('#gridtable_Misc_Tools');
	GLOBAL_ARRAY_TABLE[0]['Misc_Tools'] = objGT_Misc_Tools;
	initGridTable(objGT_Misc_Tools, VUEAPP.Misc.Tools, colNames, colModel);

}

function initGridTableDeviceProperties() {
	//AddLeft
	let colNames = ['Devices', 'id'];
	let colModel = [
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];
	let objGT_DeviceProperties_AddLeft = jQuery('#gridtable_DeviceProperties_AddLeft');
	GLOBAL_ARRAY_TABLE[1]['DeviceProperties_AddLeft'] = objGT_DeviceProperties_AddLeft;
	initGridTable(objGT_DeviceProperties_AddLeft, VUEAPP.DeviceProperties.AddLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


	//AddRight
	colNames = ['Key', 'Value', 'Type','pid','id'];
	colModel = [
		{name:'Key',index:'Key', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Value',index:'Value', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false, key:true, hidden:true}
	];
	let objGT_DeviceProperties_AddRight = jQuery('#gridtable_DeviceProperties_AddRight');
	GLOBAL_ARRAY_TABLE[1]['DeviceProperties_AddRight'] = objGT_DeviceProperties_AddRight;
	initGridTable(objGT_DeviceProperties_AddRight, VUEAPP.DeviceProperties.AddRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);



	//增加行选中事件
	objGT_DeviceProperties_AddLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
        	initSubGridTable(rowid, "DeviceProperties_AddRight", VUEAPP.DeviceProperties, 'Add');
        }
    }).trigger("reloadGrid");


	//DeleteLeft
    colNames = ['Devices', 'id'];
	colModel = [
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];

	let objGT_DeviceProperties_DeleteLeft = jQuery('#gridtable_DeviceProperties_DeleteLeft');
	GLOBAL_ARRAY_TABLE[1]['DeviceProperties_DeleteLeft'] = objGT_DeviceProperties_DeleteLeft;
	initGridTable(objGT_DeviceProperties_DeleteLeft, VUEAPP.DeviceProperties.DeleteLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


	//DeleteRight
    colNames = ['Volume', 'Type', 'pid', 'id'];
	colModel = [
		{name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false,key:true, hidden:true}
	];
	let objGT_DeviceProperties_DeleteRight = jQuery('#gridtable_DeviceProperties_DeleteRight');
	GLOBAL_ARRAY_TABLE[1]['DeviceProperties_DeleteRight'] = objGT_DeviceProperties_DeleteRight;
	initGridTable(objGT_DeviceProperties_DeleteRight, VUEAPP.DeviceProperties.DeleteRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);

	//增加行选中事件
	objGT_DeviceProperties_DeleteLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
        	initSubGridTable(rowid, "DeviceProperties_DeleteRight", VUEAPP.DeviceProperties, 'Delete');
        }
    }).trigger("reloadGrid"); //重新载入



}

function initGridTableBooter() {

	//MmioWhitelist
	let colNames = ['Address', 'Comment','Enabled'];
	let colModel = [
		{name:'Address',index:'Address', width:100,editable: true, sortable:false, formatter:formatInteger},
		{name:'Comment',index:'Comment', width:200,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];

	let objGT_Booter_MmioWhitelist = jQuery('#gridtable_Booter_MmioWhitelist');
	GLOBAL_ARRAY_TABLE[0]['Booter_MmioWhitelist'] = objGT_Booter_MmioWhitelist;
	initGridTable(objGT_Booter_MmioWhitelist, VUEAPP.Booter.MmioWhitelist, colNames, colModel, GLOBAL_TABLE_WIDTH-15, parseInt(GLOBAL_TABLE_HEIGHT * 0.44));


	colNames = ['Arch','Comment', 'Count','Find','Identifier','Limit','Mask','Replace','ReplaceMask','Skip','Enabled'];
	colModel = [
		{name:'Arch',index:'Arch', width:52,editable: true, sortable:false, edittype:'select', editoptions:{value:{Any:'Any',i386:'i386',x86_64:'x86_64'}}},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Count',index:'Count', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Find',index:'Find', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Limit',index:'Limit', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Mask',index:'Mask', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Replace',index:'Replace', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'ReplaceMask',index:'ReplaceMask', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Skip',index:'Skip', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true, align:'center',formatter:enabledFormat}
	];
	let objGT_Booter_Patch = jQuery('#gridtable_Booter_Patch');
	GLOBAL_ARRAY_TABLE[0]['Booter_Patch'] = objGT_Booter_Patch;
	initGridTable(objGT_Booter_Patch, VUEAPP.Booter.Patch, colNames, colModel, GLOBAL_TABLE_WIDTH-15, parseInt(GLOBAL_TABLE_HEIGHT * 0.44));


}

function initGridTableKernel() {

	let tableHeight = parseInt(GLOBAL_TABLE_HEIGHT * 0.44);
	let kernelTableWidth = GLOBAL_TABLE_WIDTH - 15;
	//Add
	let colNames = ['Arch','BundlePath', 'Comment','ExecutablePath','PlistPath','MaxKernel','MinKernel','Enabled'];
	let colModel = [
		{name:'Arch',index:'Arch', width:52,editable: true, sortable:false, edittype:'select', editoptions:{value:{Any:'Any',i386:'i386',x86_64:'x86_64'}},formatter:getPlistEncodeFunction('Any')},
		{name:'BundlePath',index:'BundlePath', width:170,editable: true, sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:160,editable: true,  sortable:false, formatter:plistEncode},
		{name:'ExecutablePath',index:'ExecutablePath', width:180,editable: true,  sortable:false, formatter:plistEncode},		
		{name:'PlistPath',index:'PlistPath', width:130,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:80,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:80,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Add = jQuery('#gridtable_Kernel_Add');
	GLOBAL_ARRAY_TABLE[0]['Kernel_Add'] = objGT_Kernel_Add;
	initGridTable(objGT_Kernel_Add, VUEAPP.Kernel.Add, colNames, colModel, kernelTableWidth, tableHeight);


	//Block
	colNames = ['Arch','Comment','Identifier', 'MaxKernel','MinKernel','Strategy','Enabled'];
	colModel = [
		{name:'Arch',index:'Arch', width:70,editable: true, sortable:false, edittype:'select', editoptions:{value:{Any:'Any',i386:'i386',x86_64:'x86_64'}},formatter:getPlistEncodeFunction('Any')},
		{name:'Comment',index:'Comment', width:170,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Identifier',index:'Identifier', width:180,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:80,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:80,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Strategy',index:'Strategy', width:100,editable: true,  sortable:false, edittype:'select', align:'center',editoptions:{value:{Disable:'Disable',Exclude:'Exclude'}},formatter:getPlistEncodeFunction('Disable')},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Block = jQuery('#gridtable_Kernel_Block');
	GLOBAL_ARRAY_TABLE[0]['Kernel_Block'] = objGT_Kernel_Block;
	initGridTable(objGT_Kernel_Block, VUEAPP.Kernel.Block, colNames, colModel, kernelTableWidth, tableHeight);


	//Patch
	colNames = ['Arch','Base','Comment', 'Count','Find','Identifier','Limit','Mask','MaxKernel', 'MinKernel','Replace','ReplaceMask','Skip','Enabled'];
	colModel = [
		{name:'Arch',index:'Arch', width:52,editable: true, sortable:false, edittype:'select', editoptions:{value:{Any:'Any',i386:'i386',x86_64:'x86_64'}},formatter:getPlistEncodeFunction('Any')},
		{name:'Base',index:'Base', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Count',index:'Count', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Find',index:'Find', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Limit',index:'Limit', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Mask',index:'Mask', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:75,editable: true,  sortable:false, fixed:true, align:'center', formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:75,editable: true,  sortable:false, fixed:true, align:'center', formatter:plistEncode},
		{name:'Replace',index:'Replace', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'ReplaceMask',index:'ReplaceMask', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Skip',index:'Skip', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true, align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Patch = jQuery('#gridtable_Kernel_Patch');
	GLOBAL_ARRAY_TABLE[0]['Kernel_Patch'] = objGT_Kernel_Patch;
	initGridTable(objGT_Kernel_Patch, VUEAPP.Kernel.Patch, colNames, colModel, kernelTableWidth, tableHeight);


	//Force
	colNames = ['Arch','BundlePath', 'Comment','Identifier','ExecutablePath','MaxKernel','MinKernel','PlistPath','Enabled'];
	colModel = [
		{name:'Arch',index:'Arch', width:52,editable: true, sortable:false, edittype:'select', editoptions:{value:{Any:'Any',i386:'i386',x86_64:'x86_64'}},formatter:getPlistEncodeFunction('Any')},
		{name:'BundlePath',index:'BundlePath', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:100,editable: true,  sortable:false, fixed:true, align:'center', formatter:plistEncode},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'ExecutablePath',index:'ExecutablePath', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:50,editable: true,  sortable:false, fixed:true, align:'center', formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:50,editable: true,  sortable:false, formatter:plistEncode},
		{name:'PlistPath',index:'PlistPath', width:75,editable: true,  sortable:false, fixed:true, align:'center', formatter:plistEncode},		
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true, align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Force = jQuery('#gridtable_Kernel_Force');
	GLOBAL_ARRAY_TABLE[0]['Kernel_Force'] = objGT_Kernel_Force;
	initGridTable(objGT_Kernel_Force, VUEAPP.Kernel.Force, colNames, colModel, kernelTableWidth, tableHeight);




}

function initGridTablePlatformInfo() {
	colNames = ['AssetTag','BankLocator','DeviceLocator','Manufacturer','PartNumber','SerialNumber','Size','Speed']; 
	colModel = [
		{name:'AssetTag',index:'AssetTag', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'BankLocator',index:'BankLocator', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'DeviceLocator',index:'DeviceLocator', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Manufacturer',index:'Manufacturer', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'PartNumber',index:'PartNumber', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'SerialNumber',index:'SerialNumber', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Size',index:'Size', width:100,editable: true,  sortable:false, formatter:formatInteger},
		{name:'Speed',index:'Speed', width:100,editable: true,  sortable:false, formatter:formatInteger}

	];
	let objGT_PlatformInfo_MemoryDevices = jQuery('#gridtable_PlatformInfo_MemoryDevices');
	GLOBAL_ARRAY_TABLE[0]['PlatformInfo_MemoryDevices'] = objGT_PlatformInfo_MemoryDevices;
	initGridTable(objGT_PlatformInfo_MemoryDevices, VUEAPP.PlatformInfo.Memory.Devices, colNames, colModel, GLOBAL_TABLE_WIDTH - 15);
}

function initGridTableUEFI() {
	let colNames = ['Path','Arguments','Comment','Enabled'];
	let colModel = [
		{name:'Path',index:'Path', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:250,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_UEFI_Drivers = jQuery('#gridtable_UEFI_Drivers');

	GLOBAL_ARRAY_TABLE[0]['UEFI_Drivers'] = objGT_UEFI_Drivers;
	initGridTable(objGT_UEFI_Drivers, VUEAPP.UEFI.Drivers, colNames, colModel);

	let typeValues = {
		Reserved:'Reserved',
		LoaderCode:'LoaderCode',
		LoaderData:'LoaderData',
		BootServiceCode:'BootServiceCode',
		BootServiceData:'BootServiceData',
		RuntimeCode:'RuntimeCode',
		RuntimeData:'RuntimeData',
		Available:'Available',
		Persistent:'Persistent',
		UnusableMemory:'UnusableMemory',
		ACPIReclaimMemory:'ACPIReclaimMemory',
		ACPIMemoryNVS:'ACPIMemoryNVS',
		MemoryMappedIO:'MemoryMappedIO',
		MemoryMappedIOPortSpace:'MemoryMappedIOPortSpace',
		PalCode:'PalCode'
	};
	
	colNames = ['Address','Comment','Size','Type','Enabled'];
	colModel = [
		{name:'Address',index:'Address', width:150,editable: true,  sortable:false, formatter:formatInteger},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Size',index:'Size', width:100,editable: true,  sortable:false, formatter:formatInteger},
		{name:'Type',index:'Type', width:52,editable: true, sortable:false, edittype:'select', editoptions:{value:typeValues},formatter:getPlistEncodeFunction('Reserved')},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_UEFI_ReservedMemory = jQuery('#gridtable_UEFI_ReservedMemory');
	GLOBAL_ARRAY_TABLE[0]['UEFI_ReservedMemory'] = objGT_UEFI_ReservedMemory;
	initGridTable(objGT_UEFI_ReservedMemory, VUEAPP.UEFI.ReservedMemory, colNames, colModel);

}

function initGridTableNVRAM() {
	let colNames = ['Devices', 'id'],
	tableWidth = GLOBAL_TABLE_HALF_WIDTH - 7
	;

	//consolelog(tableWidth);
    let colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];

    let objGT_NVRAM_AddLeft = jQuery('#gridtable_NVRAM_AddLeft');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_AddLeft'] = objGT_NVRAM_AddLeft;
    initGridTable(objGT_NVRAM_AddLeft, VUEAPP.NVRAM.AddLeft, colNames, colModel, tableWidth);


    //AddRight
    colNames = ['Key', 'Value', 'Type', 'pid','id'];
    colModel = [
        {name:'Key',index:'Key', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Value',index:'Value', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', editable: false,hidden:true},
        {name:'id',index:'id', editable: false,key:true,hidden:true}
    ];
    let objGT_NVRAM_AddRight = jQuery('#gridtable_NVRAM_AddRight');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_AddRight'] = objGT_NVRAM_AddRight;
    initGridTable(objGT_NVRAM_AddRight, VUEAPP.NVRAM.AddRight, colNames, colModel, tableWidth);



    //增加行选中事件
    objGT_NVRAM_AddLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "NVRAM_AddRight", VUEAPP.NVRAM, 'Add');
        }
    }).trigger("reloadGrid");


    //DeleteLeft
    colNames = ['Devices', 'id'];
    colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_DeleteLeft = jQuery('#gridtable_NVRAM_DeleteLeft');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_DeleteLeft'] = objGT_NVRAM_DeleteLeft;
    initGridTable(objGT_NVRAM_DeleteLeft, VUEAPP.NVRAM.DeleteLeft, colNames, colModel, tableWidth);


    //DeleteRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_DeleteRight = jQuery('#gridtable_NVRAM_DeleteRight');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_DeleteRight'] = objGT_NVRAM_DeleteRight;
    initGridTable(objGT_NVRAM_DeleteRight, VUEAPP.NVRAM.DeleteRight, colNames, colModel, tableWidth);

    //增加行选中事件
    objGT_NVRAM_DeleteLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "NVRAM_DeleteRight", VUEAPP.NVRAM, 'Delete');
        }
    }).trigger("reloadGrid"); //重新载入

    //LegacySchemaLeft
    colNames = ['Devices', 'id'];
    colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_LegacySchemaLeft = jQuery('#gridtable_NVRAM_LegacySchemaLeft');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_LegacySchemaLeft'] = objGT_NVRAM_LegacySchemaLeft;
    initGridTable(objGT_NVRAM_LegacySchemaLeft, VUEAPP.NVRAM.LegacySchemaLeft, colNames, colModel, tableWidth);


    //LegacySchemaRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_LegacySchemaRight = jQuery('#gridtable_NVRAM_LegacySchemaRight');
    GLOBAL_ARRAY_TABLE[1]['NVRAM_LegacySchemaRight'] = objGT_NVRAM_LegacySchemaRight;
    initGridTable(objGT_NVRAM_LegacySchemaRight, VUEAPP.NVRAM.LegacySchemaRight, colNames, colModel, tableWidth);

    //增加行选中事件
    objGT_NVRAM_LegacySchemaLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "NVRAM_LegacySchemaRight", VUEAPP.NVRAM, 'LegacySchema');
        }
    }).trigger("reloadGrid"); //重新载入

}

/**
* 根据左边的id决定右边的数据是否显示
**/
function initSubGridTable(pid, gridkey, theData, keyname) {
	
    let rightName = keyname + 'Right', objGridTable = getJqgridObjectbyKey(gridkey);
    objGridTable.jqGrid('resetSelection');
    for(let i=0,len=theData[rightName].length;i<len;i++) {
        if(theData[rightName][i].pid == pid) { //这里一定是==,不能===
            objGridTable.setRowData(theData[rightName][i].id,null,{display: ''});
        } else {
            objGridTable.setRowData(theData[rightName][i].id,null,{display: 'none'});
        }
    }


}


function initGridTable(objGridTable, gridData, colNames, colModel, width , height) {


	if(height === undefined) {
		height = parseInt(GLOBAL_TABLE_HEIGHT * 0.45);
	}

	if(width === undefined || width === 0) {
		width = GLOBAL_TABLE_WIDTH;
	}

	objGridTable.jqGrid({
		data 	: gridData,
		datatype : "local",
		height : height,
		shrinkToFit:true,
		autowidth : true,
		colNames:colNames,
		colModel:colModel,
		altRows: true,
        scroll: false,
        multiselect : true,
		multiboxonly : true,
		rowNum: 9000,
		ondblClickRow : function (rowid) {
            objGridTable.jqGrid('editRow', rowid, {
                url : 'clientArray',
                keys : true,
                oneditfunc: function() {  //进入编辑状态
        			GLOBAL_ONEDIT_TABLE.push(objGridTable.selector);
    			},    			
    			aftersavefunc:function() {  //按回车保存
    				//consolelog("aftersavefunc--" + objGridTable.selector);
    				removeEditTable(objGridTable.selector);
    			},
    			afterrestorefunc:function() {	//按Esc还原
    				//consolelog("afterrestorefunc--" + objGridTable.selector);
    				removeEditTable(objGridTable.selector);
    			}

            });
        }

	});

	objGridTable.jqGrid('setGridWidth', width );
	//行拖动功能
	objGridTable.jqGrid('sortableRows', {
		items : '.jqgrow:not(.unsortable)'
	});

	//窗口拉动
	$(window).on('resize.jqGrid', function () {
		let tab_content_width = objGridTable.closest('.tab-content').width();
		if(tab_content_width > 0) {
			GLOBAL_TABLE_WIDTH = tab_content_width;

			(function resetAllTableWidth(theWidth) {
				setTimeout(function(){

					if(theWidth === GLOBAL_TABLE_WIDTH) {
						for(let it in GLOBAL_ARRAY_TABLE[0]) {
							GLOBAL_ARRAY_TABLE[0][it].jqGrid( 'setGridWidth', theWidth);
						}
						theWidth = theWidth / 2 - 8;
						for(let it in GLOBAL_ARRAY_TABLE[1]) {
							GLOBAL_ARRAY_TABLE[1][it].jqGrid( 'setGridWidth', theWidth);
						}
					}

				}, 200);
			})(tab_content_width);
		}
	})

}




