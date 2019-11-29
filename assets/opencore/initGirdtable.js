var table_column_width = 0;

function initGridTableACPI() {

	//gridtable-ACPI-Add
	let objGT_ACPI_Add = jQuery('#gridtable-ACPI-Add');

	table_column_width = objGT_ACPI_Add.closest('[class^="col-"]').width();
	
	let colNames = ['Comment', 'Path','Enabled'];
	let colModel = [			
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false},
		{name:'Path',index:'Path', width:150,editable: true, sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable(objGT_ACPI_Add, VUEAPP.ACPI.Add, colNames, colModel);

	//gridtable-ACPI-Block
	colNames = ['Comment', 'OemTableId','TableLength','TableSignature','All','Enabled'];
	colModel = [			
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false},
		{name:'OemTableId',index:'OemTableId', width:150,editable: true, sortable:false},
		{name:'TableLength',index:'TableLength',width:90, editable:true, sortable:false, fixed:true, align:'center'},
		{name:'TableSignature',index:'TableSignature', width:150,editable: true, sortable:false},
		{name:'All',index:'All', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,formatter:enabledFormat, fixed:true, align:'center'},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable(jQuery('#gridtable-ACPI-Block'), VUEAPP.ACPI.Block, colNames, colModel);

	//gridtable-ACPI-Patch
	colNames = ['Comment','Count','Find','Limit','Mask','OemTableId','Replace','ReplaceMask','Skip','TableLength','TableSignature','Enabled'];
	colModel = [			
			{name:'Comment',index:'Comment',width:90, editable:true, sortable:false},
			{name:'Count',index:'Count',width:60, editable:true, sortable:false, fixed:true, align:'center'},
			{name:'Find',index:'Find',width:90, editable:true, sortable:false},
			{name:'Limit',index:'Limit',width:60, editable:true, sortable:false, fixed:true, align:'center'},
			{name:'Mask',index:'Mask',width:90, editable:true, sortable:false},
			{name:'OemTableId',index:'OemTableId',width:90, editable:true, sortable:false},
			{name:'Replace',index:'Replace',width:90, editable:true, sortable:false},
			{name:'ReplaceMask',index:'ReplaceMask',width:90, editable:true, sortable:false},
			{name:'Skip',index:'Skip',width:60, editable:true, sortable:false, fixed:true, align:'center'},
			{name:'TableLength',index:'TableLength',width:90, editable:true, sortable:false, fixed:true, align:'center'},
			{name:'TableSignature',index:'TableSignature',width:90, editable:true, sortable:false},			
			{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
		];
	initGridTable(jQuery('#gridtable-ACPI-Patch'), VUEAPP.ACPI.Patch, colNames, colModel);

	
}

function initGridTableMisc() {
	let colNames = ['Arguments','Comment','Name','Path','Enabled'];
	let colModel = [		
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Name',index:'Name', width:100,editable: true,  sortable:false},
		{name:'Path',index:'Path', width:400,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Entries = jQuery('#gridtable-Misc-Entries');
	initGridTable(objGT_Misc_Entries, VUEAPP.Misc.Entries, colNames, colModel);
	objGT_Misc_Entries.jqGrid( 'setGridWidth', table_column_width );


	//Tools
	colNames = ['Arguments','Comment','Name','Path','Enabled'];
	colModel = [		
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Name',index:'Name', width:150,editable: true,  sortable:false},
		{name:'Path',index:'Path', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Misc_Tools = jQuery('#gridtable-Misc-Tools');
	initGridTable(objGT_Misc_Tools, VUEAPP.Misc.Tools, colNames, colModel);
	objGT_Misc_Tools.jqGrid( 'setGridWidth', table_column_width );
}

function initGridTableDeviceProperties() {
	//AddLeft
	let colNames = ['Devices', 'id'], tableHeight = 240, tableWidth = table_column_width / 2;
	let colModel = [			
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];
	let objGT_DeviceProperties_AddLeft = jQuery('#gridtable-DeviceProperties-AddLeft');
	initGridTable(objGT_DeviceProperties_AddLeft, VUEAPP.DeviceProperties.AddLeft, colNames, colModel, tableHeight);
	objGT_DeviceProperties_AddLeft.jqGrid( 'setGridWidth', tableWidth);

	//AddRight
	colNames = ['Key', 'Value', 'Type','pid','id'];
	colModel = [			
		{name:'Key',index:'Key', width:150,editable: true, sortable:false},
		{name:'Value',index:'Value', width:150,editable: true, sortable:false},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false, key:true, hidden:true}
	];
	let objGT_DeviceProperties_AddRight = jQuery('#gridtable-DeviceProperties-AddRight');
	initGridTable(objGT_DeviceProperties_AddRight, VUEAPP.DeviceProperties.AddRight, colNames, colModel, tableHeight);
	objGT_DeviceProperties_AddRight.jqGrid( 'setGridWidth', tableWidth);
		

	//增加行选中事件
	objGT_DeviceProperties_AddLeft.jqGrid('setGridParam',{ 
        onSelectRow : function (rowid) {
        	initSubGridTable(rowid, "#gridtable-DeviceProperties-AddRight", VUEAPP.DeviceProperties, 'Add');
        }
    }).trigger("reloadGrid");


	//BlockLeft
    colNames = ['Devices', 'id'];
	colModel = [			
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];

	let objGT_DeviceProperties_BlockLeft = jQuery('#gridtable-DeviceProperties-BlockLeft');
	initGridTable(objGT_DeviceProperties_BlockLeft, VUEAPP.DeviceProperties.BlockLeft, colNames, colModel, tableHeight);
	objGT_DeviceProperties_BlockLeft.jqGrid( 'setGridWidth', tableWidth);

	//BlockRight
    colNames = ['Volume', 'Type', 'pid', 'id'];
	colModel = [			
		{name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false,key:true, hidden:true}
	];
	let objGT_DeviceProperties_BlockRight = jQuery('#gridtable-DeviceProperties-BlockRight');

	initGridTable(objGT_DeviceProperties_BlockRight, VUEAPP.DeviceProperties.BlockRight, colNames, colModel, tableHeight);
	objGT_DeviceProperties_BlockRight.jqGrid( 'setGridWidth', tableWidth);
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
		{name:'Address',index:'Address', width:150,editable: true, sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];

	let objGT_Booter_MmioWhitelist = jQuery('#gridtable-Booter-MmioWhitelist');

	initGridTable(objGT_Booter_MmioWhitelist, VUEAPP.Booter.MmioWhitelist, colNames, colModel);
	objGT_Booter_MmioWhitelist.jqGrid( 'setGridWidth', table_column_width );
}

function initGridTableKernel() {

	//Add
	let colNames = ['BundlePath', 'Comment','ExecutablePath','MaxKernel','MinKernel','PlistPath','Enabled'];
	let colModel = [			
		{name:'BundlePath',index:'BundlePath', width:150,editable: true, sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'ExecutablePath',index:'ExecutablePath', width:150,editable: true,  sortable:false},
		{name:'MaxKernel',index:'MaxKernel', width:150,editable: true,  sortable:false},
		{name:'MinKernel',index:'MinKernel', width:150,editable: true,  sortable:false},
		{name:'PlistPath',index:'PlistPath', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Add = jQuery('#gridtable-Kernel-Add');
	initGridTable(objGT_Kernel_Add, VUEAPP.Kernel.Add, colNames, colModel);
	objGT_Kernel_Add.jqGrid( 'setGridWidth', table_column_width );

	//Block
	colNames = ['Comment','Identifier', 'MaxKernel','MinKernel','Enabled'];
	colModel = [			
		
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false},
		{name:'MaxKernel',index:'MaxKernel', width:150,editable: true,  sortable:false},
		{name:'MinKernel',index:'MinKernel', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Block = jQuery('#gridtable-Kernel-Block');
	initGridTable(objGT_Kernel_Block, VUEAPP.Kernel.Block, colNames, colModel);
	objGT_Kernel_Block.jqGrid( 'setGridWidth', table_column_width );

	//Patch
	colNames = ['Base','Comment', 'Count','Find','Identifier','Limit','Mask','MaxKernel', 'MinKernel','Replace','ReplaceMask','Skip','Enabled'];
	colModel = [			
		
		{name:'Base',index:'Base', width:150,editable: true,  sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Count',index:'Count', width:50,editable: true,  sortable:false, fixed:true, align:'center'},
		{name:'Find',index:'Find', width:150,editable: true,  sortable:false},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false},
		{name:'Limit',index:'Limit', width:50,editable: true,  sortable:false, fixed:true, align:'center'},
		{name:'Mask',index:'Mask', width:150,editable: true,  sortable:false},
		{name:'MaxKernel',index:'MaxKernel', width:75,editable: true,  sortable:false, fixed:true, align:'center'},
		{name:'MinKernel',index:'MinKernel', width:75,editable: true,  sortable:false, fixed:true, align:'center'},
		{name:'Replace',index:'Replace', width:150,editable: true,  sortable:false},
		{name:'ReplaceMask',index:'ReplaceMask', width:150,editable: true,  sortable:false},
		{name:'Skip',index:'Skip', width:50,editable: true,  sortable:false, fixed:true, align:'center'},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true, align:'center',formatter:enabledFormat}
	];
	let objGT_Kernel_Patch = jQuery('#gridtable-Kernel-Patch');
	initGridTable(objGT_Kernel_Patch, VUEAPP.Kernel.Patch, colNames, colModel);
	objGT_Kernel_Patch.jqGrid( 'setGridWidth', table_column_width );

	

}

function initGridTableUEFI() {
	colNames = ['FileName'];
	colModel = [		
		{name:'FileName',index:'FileName', width:150,editable: true,  sortable:false}
	];
	let objGT_UEFI_Drivers = jQuery('#gridtable-UEFI-Drivers');
	initGridTable(objGT_UEFI_Drivers, VUEAPP.UEFI.Drivers, colNames, colModel);
	objGT_UEFI_Drivers.jqGrid( 'setGridWidth', table_column_width );
}

function initGridTableNVRAM() {
	let colNames = ['Devices', 'id'], tabLeheight = 130, tableWidth = table_column_width / 2 - 5;
	//console.log(tableWidth);
    let colModel = [            
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_AddLeft = jQuery('#gridtable-NVRAM-AddLeft');
    initGridTable(objGT_NVRAM_AddLeft, VUEAPP.NVRAM.AddLeft, colNames, colModel, tabLeheight);
    objGT_NVRAM_AddLeft.jqGrid( 'setGridWidth', tableWidth);

    //AddRight
    colNames = ['Key', 'Value', 'Type', 'pid','id'];
    colModel = [            
        {name:'Key',index:'Key', width:150,editable: true, sortable:false},
        {name:'Value',index:'Value', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', editable: false,hidden:true},
        {name:'id',index:'id', editable: false,key:true,hidden:true}
    ];
    let objGT_NVRAM_AddRight = jQuery('#gridtable-NVRAM-AddRight');
    initGridTable(objGT_NVRAM_AddRight, VUEAPP.NVRAM.AddRight, colNames, colModel, tabLeheight);
    objGT_NVRAM_AddRight.jqGrid( 'setGridWidth', tableWidth);
        

    //增加行选中事件
    objGT_NVRAM_AddLeft.jqGrid('setGridParam',{ 
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-AddRight", VUEAPP.NVRAM, 'Add');
        }
    }).trigger("reloadGrid");


    //BlockLeft
    colNames = ['Devices', 'id'];
    colModel = [            
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_BlockLeft = jQuery('#gridtable-NVRAM-BlockLeft');
    initGridTable(objGT_NVRAM_BlockLeft, VUEAPP.NVRAM.BlockLeft, colNames, colModel, tabLeheight);
    objGT_NVRAM_BlockLeft.jqGrid( 'setGridWidth', tableWidth);

    //BlockRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [            
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_BlockRight = jQuery('#gridtable-NVRAM-BlockRight');
    initGridTable(objGT_NVRAM_BlockRight, VUEAPP.NVRAM.BlockRight, colNames, colModel, tabLeheight);
    objGT_NVRAM_BlockRight.jqGrid( 'setGridWidth', tableWidth);
    //$("#gridtable-NVRAM-BlockRight").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" });
    //增加行选中事件
    objGT_NVRAM_BlockLeft.jqGrid('setGridParam',{ 
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-BlockRight", VUEAPP.NVRAM, 'Block');
        }
    }).trigger("reloadGrid"); //重新载入 

    //LegacySchemaLeft
    colNames = ['Devices', 'id'];
    colModel = [            
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    let objGT_NVRAM_LegacySchemaLeft = jQuery('#gridtable-NVRAM-LegacySchemaLeft');
    initGridTable(objGT_NVRAM_LegacySchemaLeft, VUEAPP.NVRAM.LegacySchemaLeft, colNames, colModel, tabLeheight);
    objGT_NVRAM_LegacySchemaLeft.jqGrid( 'setGridWidth', tableWidth);

    //LegacySchemaRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [            
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    let objGT_NVRAM_LegacySchemaRight = jQuery('#gridtable-NVRAM-LegacySchemaRight');
    initGridTable(objGT_NVRAM_LegacySchemaRight, VUEAPP.NVRAM.LegacySchemaRight, colNames, colModel, tabLeheight);
    objGT_NVRAM_LegacySchemaRight.jqGrid( 'setGridWidth', tableWidth);
    //$("#gridtable-NVRAM-LegacySchemaRight").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" });
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


function initGridTable(objGridTable, gridData, colNames, colModel, height) {

	objGridTable.jqGrid({
		data 	: gridData,
		datatype : "local",
		height : height===undefined?'auto':height,
		//width : 'auto',
		autowidth : true,
		colNames:colNames,
		colModel:colModel, 		
		altRows: true,
        autoScroll: true,
        multiselect:true,
        multiboxonly : true,
		ondblClickRow : function (rowid) {
            objGridTable.jqGrid('editRow', rowid, {
                url:'clientArray', keys:true
            });
        }
	});

    
}
