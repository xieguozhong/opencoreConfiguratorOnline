var GLOBAL_TABLE_WIDTH = 0, GLOBAL_TABLE_HEIGHT = 0, GLOBAL_TABLE_HALF_WIDTH = 0, GLOBAL_ARRAY_TABLE=[[],[]], MAXROWID = 500;




function initGridTableACPI() {


	//gridtable-ACPI-Add
	let objGT_ACPI_Add = jQuery('#gridtable-ACPI-Add');
	GLOBAL_ARRAY_TABLE[0].push(objGT_ACPI_Add);

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

	//gridtable-ACPI-Block
	colNames = ['Comment', 'OemTableId','TableLength','TableSignature','All','Enabled'];
	colModel = [
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false, formatter:plistEncode},
		{name:'OemTableId',index:'OemTableId', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'TableLength',index:'TableLength',width:90, editable:true, sortable:false, fixed:true, align:'center', formatter:formatInteger},
		{name:'TableSignature',index:'TableSignature', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'All',index:'All', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,formatter:enabledFormat, fixed:true, align:'center'},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_ACPI_Block = jQuery('#gridtable-ACPI-Block');
	GLOBAL_ARRAY_TABLE[0].push(objGT_ACPI_Block);
	initGridTable(objGT_ACPI_Block, VUEAPP.ACPI.Block, colNames, colModel);

	//gridtable-ACPI-Patch
	colNames = ['Comment','Count','Find','Limit','Mask','OemTableId','Replace','ReplaceMask','Skip','TableLength','TableSignature','Enabled'];
	colModel = [
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

	let objGT_ACPI_Patch = jQuery('#gridtable-ACPI-Patch');
	GLOBAL_ARRAY_TABLE[0].push(objGT_ACPI_Patch);
	initGridTable(objGT_ACPI_Patch, VUEAPP.ACPI.Patch, colNames, colModel);


}

function initGridTableMisc() {
	let colNames = ['Arguments','Comment','Name','Path','Enabled'];
	let colModel = [
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Name',index:'Name', width:100,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Path',index:'Path', width:400,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Entries = jQuery('#gridtable-Misc-Entries');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Misc_Entries);
	initGridTable(objGT_Misc_Entries, VUEAPP.Misc.Entries, colNames, colModel);

	//BlessOverride
	colNames = ['ScanningPaths'];
	colModel = [
		{name:'ScanningPaths',index:'ScanningPaths', width:150,editable: true,  sortable:false, formatter:plistEncode}
	];
	let objGT_Misc_BlessOverride = jQuery('#gridtable-Misc-BlessOverride');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Misc_BlessOverride);
	initGridTable(objGT_Misc_BlessOverride, VUEAPP.Misc.BlessOverride, colNames, colModel);



	//Tools
	colNames = ['Arguments','Comment','Name','Path','Enabled'];
	colModel = [
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Name',index:'Name', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Path',index:'Path', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Tools = jQuery('#gridtable-Misc-Tools');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Misc_Tools);
	initGridTable(objGT_Misc_Tools, VUEAPP.Misc.Tools, colNames, colModel);

}

function initGridTableDeviceProperties() {
	//AddLeft
	let colNames = ['Devices', 'id'];
	let colModel = [
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];
	let objGT_DeviceProperties_AddLeft = jQuery('#gridtable-DeviceProperties-AddLeft');
	GLOBAL_ARRAY_TABLE[1].push(objGT_DeviceProperties_AddLeft);
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
	let objGT_DeviceProperties_AddRight = jQuery('#gridtable-DeviceProperties-AddRight');
	GLOBAL_ARRAY_TABLE[1].push(objGT_DeviceProperties_AddRight);
	initGridTable(objGT_DeviceProperties_AddRight, VUEAPP.DeviceProperties.AddRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);



	//增加行选中事件
	objGT_DeviceProperties_AddLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
        	initSubGridTable(rowid, "#gridtable-DeviceProperties-AddRight", VUEAPP.DeviceProperties, 'Add');
        }
    }).trigger("reloadGrid");


	//BlockLeft
    colNames = ['Devices', 'id'];
	colModel = [
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];

	let objGT_DeviceProperties_BlockLeft = jQuery('#gridtable-DeviceProperties-BlockLeft');
	GLOBAL_ARRAY_TABLE[1].push(objGT_DeviceProperties_BlockLeft);
	initGridTable(objGT_DeviceProperties_BlockLeft, VUEAPP.DeviceProperties.BlockLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


	//BlockRight
    colNames = ['Volume', 'Type', 'pid', 'id'];
	colModel = [
		{name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false,key:true, hidden:true}
	];
	let objGT_DeviceProperties_BlockRight = jQuery('#gridtable-DeviceProperties-BlockRight');
	GLOBAL_ARRAY_TABLE[1].push(objGT_DeviceProperties_BlockRight);
	initGridTable(objGT_DeviceProperties_BlockRight, VUEAPP.DeviceProperties.BlockRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);

	//增加行选中事件
	objGT_DeviceProperties_BlockLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
        	initSubGridTable(rowid, "#gridtable-DeviceProperties-BlockRight", VUEAPP.DeviceProperties, 'Block');
        }
    }).trigger("reloadGrid"); //重新载入



}

function initGridTableBooter() {

	//MmioWhitelist
	let colNames = ['Address', 'Comment','Enabled'];
	let colModel = [
		{name:'Address',index:'Address', width:150,editable: true, sortable:false, formatter:formatInteger},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];

	let objGT_Booter_MmioWhitelist = jQuery('#gridtable-Booter-MmioWhitelist');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Booter_MmioWhitelist);
	initGridTable(objGT_Booter_MmioWhitelist, VUEAPP.Booter.MmioWhitelist, colNames, colModel, 0, parseInt(GLOBAL_TABLE_HEIGHT * 0.44));

}

function initGridTableKernel() {

	let tableHeight = parseInt(GLOBAL_TABLE_HEIGHT * 0.44);
	//Add
	let colNames = ['BundlePath', 'Comment','ExecutablePath','MaxKernel','MinKernel','PlistPath','Enabled'];
	let colModel = [
		{name:'BundlePath',index:'BundlePath', width:150,editable: true, sortable:false, formatter:plistEncode},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'ExecutablePath',index:'ExecutablePath', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'PlistPath',index:'PlistPath', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Add = jQuery('#gridtable-Kernel-Add');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Kernel_Add);
	initGridTable(objGT_Kernel_Add, VUEAPP.Kernel.Add, colNames, colModel, 0, tableHeight);


	//Block
	colNames = ['Comment','Identifier', 'MaxKernel','MinKernel','Enabled'];
	colModel = [

		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MaxKernel',index:'MaxKernel', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'MinKernel',index:'MinKernel', width:150,editable: true,  sortable:false, formatter:plistEncode},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Block = jQuery('#gridtable-Kernel-Block');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Kernel_Block);
	initGridTable(objGT_Kernel_Block, VUEAPP.Kernel.Block, colNames, colModel, 0, tableHeight);


	//Patch
	colNames = ['Base','Comment', 'Count','Find','Identifier','Limit','Mask','MaxKernel', 'MinKernel','Replace','ReplaceMask','Skip','Enabled'];
	colModel = [

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
	let objGT_Kernel_Patch = jQuery('#gridtable-Kernel-Patch');
	GLOBAL_ARRAY_TABLE[0].push(objGT_Kernel_Patch);
	initGridTable(objGT_Kernel_Patch, VUEAPP.Kernel.Patch, colNames, colModel, 0, tableHeight);




}

function initGridTableUEFI() {
	colNames = ['FileName'];
	colModel = [
		{name:'FileName',index:'FileName', width:150,editable: true,  sortable:false, formatter:plistEncode}
	];
	let objGT_UEFI_Drivers = jQuery('#gridtable-UEFI-Drivers');
	GLOBAL_ARRAY_TABLE[0].push(objGT_UEFI_Drivers);
	initGridTable(objGT_UEFI_Drivers, VUEAPP.UEFI.Drivers, colNames, colModel);

}

function initGridTableNVRAM() {
	let colNames = ['Devices', 'id'];
	//console.log(tableWidth);
    let colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];

    let objGT_NVRAM_AddLeft = jQuery('#gridtable-NVRAM-AddLeft');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_AddLeft);
    initGridTable(objGT_NVRAM_AddLeft, VUEAPP.NVRAM.AddLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


    //AddRight
    colNames = ['Key', 'Value', 'Type', 'pid','id'];
    colModel = [
        {name:'Key',index:'Key', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Value',index:'Value', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', editable: false,hidden:true},
        {name:'id',index:'id', editable: false,key:true,hidden:true}
    ];
    let objGT_NVRAM_AddRight = jQuery('#gridtable-NVRAM-AddRight');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_AddRight);
    initGridTable(objGT_NVRAM_AddRight, VUEAPP.NVRAM.AddRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);



    //增加行选中事件
    objGT_NVRAM_AddLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-AddRight", VUEAPP.NVRAM, 'Add');
        }
    }).trigger("reloadGrid");


    //BlockLeft
    colNames = ['Devices', 'id'];
    colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_BlockLeft = jQuery('#gridtable-NVRAM-BlockLeft');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_BlockLeft);
    initGridTable(objGT_NVRAM_BlockLeft, VUEAPP.NVRAM.BlockLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


    //BlockRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_BlockRight = jQuery('#gridtable-NVRAM-BlockRight');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_BlockRight);
    initGridTable(objGT_NVRAM_BlockRight, VUEAPP.NVRAM.BlockRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);

    //增加行选中事件
    objGT_NVRAM_BlockLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-BlockRight", VUEAPP.NVRAM, 'Block');
        }
    }).trigger("reloadGrid"); //重新载入

    //LegacySchemaLeft
    colNames = ['Devices', 'id'];
    colModel = [
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_LegacySchemaLeft = jQuery('#gridtable-NVRAM-LegacySchemaLeft');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_LegacySchemaLeft);
    initGridTable(objGT_NVRAM_LegacySchemaLeft, VUEAPP.NVRAM.LegacySchemaLeft, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);


    //LegacySchemaRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false, formatter:plistEncode},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_LegacySchemaRight = jQuery('#gridtable-NVRAM-LegacySchemaRight');
    GLOBAL_ARRAY_TABLE[1].push(objGT_NVRAM_LegacySchemaRight);
    initGridTable(objGT_NVRAM_LegacySchemaRight, VUEAPP.NVRAM.LegacySchemaRight, colNames, colModel, GLOBAL_TABLE_HALF_WIDTH);

    //增加行选中事件
    objGT_NVRAM_LegacySchemaLeft.jqGrid('setGridParam',{
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-LegacySchemaRight", VUEAPP.NVRAM, 'LegacySchema');
        }
    }).trigger("reloadGrid"); //重新载入

}

/**
* 根据左边的id决定右边的数据是否显示
**/
function initSubGridTable(pid, gridid, theData, keyname) {

    let rightName = keyname + 'Right', objGridTable = jQuery(gridid);
    objGridTable.jqGrid('resetSelection');
    for(let i=0;i<theData[rightName].length;i++) {
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
		ondblClickRow : function (rowid) {
            objGridTable.jqGrid('editRow', rowid, {
                url : 'clientArray',
                keys : true
            });
        }

	});

	objGridTable.jqGrid( 'setGridWidth', width );

	//窗口拉动
	$(window).on('resize.jqGrid', function () {
		let tab_content_width = objGridTable.closest('.tab-content').width();
		if(tab_content_width > 0) {
			GLOBAL_TABLE_WIDTH = tab_content_width;

			(function resetAllTableWidth(theWidth) {
				setTimeout(function(){

					if(theWidth === GLOBAL_TABLE_WIDTH) {
						for(let i=0;i<GLOBAL_ARRAY_TABLE[0].length;i++) {
							GLOBAL_ARRAY_TABLE[0][i].jqGrid( 'setGridWidth', theWidth);
						}
						theWidth = theWidth / 2 - 8;
						for(let i=0;i<GLOBAL_ARRAY_TABLE[1].length;i++) {
							GLOBAL_ARRAY_TABLE[1][i].jqGrid( 'setGridWidth', theWidth);
						}
					}

				}, 200);
			})(tab_content_width);
		}
	})

}


