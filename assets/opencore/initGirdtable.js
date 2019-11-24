let table_column_width = 0;
function initGridTableACPI() {

	//gridtable-ACPI-Add
	table_column_width = $('#gridtable-ACPI-Add').closest('[class^="col-"]').width();
	
	let colNames = ['Comment', 'Path','Enabled'];
	let colModel = [			
		{name:'Comment',index:'Comment',width:90, editable:true, sortable:false},
		{name:'Path',index:'Path', width:150,editable: true, sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable('#gridtable-ACPI-Add', VUEAPP.ACPI.Add, colNames, colModel);

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
	initGridTable('#gridtable-ACPI-Block', VUEAPP.ACPI.Block, colNames, colModel);

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
	initGridTable('#gridtable-ACPI-Patch', VUEAPP.ACPI.Patch, colNames, colModel);

	
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
	initGridTable('#gridtable-Misc-Entries', VUEAPP.Misc.Entries, colNames, colModel);
	$('#gridtable-Misc-Entries').jqGrid( 'setGridWidth', table_column_width );


	//Tools
	colNames = ['Arguments','Comment','Name','Path','Enabled'];
	colModel = [		
		{name:'Arguments',index:'Arguments', width:150,editable: true,  sortable:false},
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Name',index:'Name', width:150,editable: true,  sortable:false},
		{name:'Path',index:'Path', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true,edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable('#gridtable-Misc-Tools', VUEAPP.Misc.Tools, colNames, colModel);
	$('#gridtable-Misc-Tools').jqGrid( 'setGridWidth', table_column_width );
}

function initGridTableDeviceProperties() {
	//AddLeft
	let colNames = ['Devices', 'id'];
	let colModel = [			
		{name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
		{name:'id',index:'id', editable: false, hidden:true,key:true}
	];
	initGridTable('#gridtable-DeviceProperties-AddLeft', VUEAPP.DeviceProperties.AddLeft, colNames, colModel, 200);
	$('#gridtable-DeviceProperties-AddLeft').jqGrid( 'setGridWidth', table_column_width / 2 - 1);

	//AddRight
	colNames = ['Key', 'Value', 'Type','pid','id'];
	colModel = [			
		{name:'Key',index:'Key', width:150,editable: true, sortable:false},
		{name:'Value',index:'Value', width:150,editable: true, sortable:false},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false, key:true, hidden:true}
	];	
	initGridTable('#gridtable-DeviceProperties-AddRight', VUEAPP.DeviceProperties.AddRight, colNames, colModel, 200);
	$('#gridtable-DeviceProperties-AddRight').jqGrid( 'setGridWidth', table_column_width / 2 - 1);
		

	//增加行选中事件
	$("#gridtable-DeviceProperties-AddLeft").jqGrid('setGridParam',{ 
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
	initGridTable('#gridtable-DeviceProperties-BlockLeft', VUEAPP.DeviceProperties.BlockLeft, colNames, colModel, 200);
	$('#gridtable-DeviceProperties-BlockLeft').jqGrid( 'setGridWidth', table_column_width / 2 - 1);

	//BlockRight
    colNames = ['Volume', 'Type', 'pid', 'id'];
	colModel = [			
		{name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
		{name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
		{name:'pid',index:'pid', editable: false, hidden:true},
        {name:'id',index:'id', editable: false,key:true, hidden:true}
	];
	initGridTable('#gridtable-DeviceProperties-BlockRight', VUEAPP.DeviceProperties.BlockRight, colNames, colModel, 200);
	$('#gridtable-DeviceProperties-BlockRight').jqGrid( 'setGridWidth', table_column_width / 2 - 1);
	//增加行选中事件
	$("#gridtable-DeviceProperties-BlockLeft").jqGrid('setGridParam',{ 
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
	initGridTable('#gridtable-Booter-MmioWhitelist', VUEAPP.Booter.MmioWhitelist, colNames, colModel);
	$('#gridtable-Booter-MmioWhitelist').jqGrid( 'setGridWidth', table_column_width );
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
	initGridTable('#gridtable-Kernel-Add', VUEAPP.Kernel.Add, colNames, colModel);
	$('#gridtable-Kernel-Add').jqGrid( 'setGridWidth', table_column_width );

	//Block
	colNames = ['Comment','Identifier', 'MaxKernel','MinKernel','Enabled'];
	colModel = [			
		
		{name:'Comment',index:'Comment', width:150,editable: true,  sortable:false},
		{name:'Identifier',index:'Identifier', width:150,editable: true,  sortable:false},
		{name:'MaxKernel',index:'MaxKernel', width:150,editable: true,  sortable:false},
		{name:'MinKernel',index:'MinKernel', width:150,editable: true,  sortable:false},
		{name:'Enabled',index:'Enabled', width:70, editable: true, edittype:"checkbox",editoptions: {value:"YES:NO"}, sortable:false,fixed:true,align:'center',formatter:enabledFormat}
	];
	initGridTable('#gridtable-Kernel-Block', VUEAPP.Kernel.Block, colNames, colModel);
	$('#gridtable-Kernel-Block').jqGrid( 'setGridWidth', table_column_width );

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
	initGridTable('#gridtable-Kernel-Patch', VUEAPP.Kernel.Patch, colNames, colModel);
	$('#gridtable-Kernel-Patch').jqGrid( 'setGridWidth', table_column_width );

	

}

function initGridTableUEFI() {
	colNames = ['FileName'];
	colModel = [		
		{name:'FileName',index:'FileName', width:150,editable: true,  sortable:false}
	];
	initGridTable('#gridtable-UEFI-Drivers', VUEAPP.UEFI.Drivers, colNames, colModel);
	$('#gridtable-UEFI-Drivers').jqGrid( 'setGridWidth', table_column_width );
}

function initGridTableNVRAM() {
	let colNames = ['Devices', 'id'];
    let colModel = [            
        {name:'Devices',index:'Devices', width:150,editable: true, sortable:false},
        {name:'id',index:'id', editable: false, hidden:true,key:true}
    ];
    initGridTable('#gridtable-NVRAM-AddLeft', VUEAPP.NVRAM.AddLeft, colNames, colModel, 100);
    $('#gridtable-NVRAM-AddLeft').jqGrid( 'setGridWidth', table_column_width / 2 - 1);

    //AddRight
    colNames = ['Key', 'Value', 'Type', 'pid','id'];
    colModel = [            
        {name:'Key',index:'Key', width:150,editable: true, sortable:false},
        {name:'Value',index:'Value', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', editable: false,hidden:true},
        {name:'id',index:'id', editable: false,key:true,hidden:true}
    ];  
    initGridTable('#gridtable-NVRAM-AddRight', VUEAPP.NVRAM.AddRight, colNames, colModel, 100);
    $('#gridtable-NVRAM-AddRight').jqGrid( 'setGridWidth', table_column_width / 2 - 1);
        

    //增加行选中事件
    $("#gridtable-NVRAM-AddLeft").jqGrid('setGridParam',{ 
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
    initGridTable('#gridtable-NVRAM-BlockLeft', VUEAPP.NVRAM.BlockLeft, colNames, colModel, 100);
    $('#gridtable-NVRAM-BlockLeft').jqGrid( 'setGridWidth', table_column_width / 2 - 1);

    //BlockRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [            
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    initGridTable('#gridtable-NVRAM-BlockRight', VUEAPP.NVRAM.BlockRight, colNames, colModel, 100);
    $('#gridtable-NVRAM-BlockRight').jqGrid( 'setGridWidth', table_column_width / 2 - 1);
    $("#gridtable-NVRAM-BlockRight").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" });
    //增加行选中事件
    $("#gridtable-NVRAM-BlockLeft").jqGrid('setGridParam',{ 
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
    initGridTable('#gridtable-NVRAM-LegacySchemaLeft', VUEAPP.NVRAM.LegacySchemaLeft, colNames, colModel, 100);
    $('#gridtable-NVRAM-LegacySchemaLeft').jqGrid( 'setGridWidth', table_column_width / 2 - 1);

    //LegacySchemaRight
    colNames = ['Volume', 'Type', 'pid','id'];
    colModel = [            
        {name:'Volume',index:'Volume', width:150,editable: true, sortable:false},
        {name:'Type',index:'Type', width:90, fixed:true, editable: true, sortable:false, align:'center', edittype:'select', editoptions:{value:{string:'string',data:'data',real:'real',integer:'integer',bool:'bool',date:'date'}}},
        {name:'pid',index:'pid', hidden:true, editable: false},
        {name:'id',index:'id', hidden:true, editable: false, key:true}
    ];
    initGridTable('#gridtable-NVRAM-LegacySchemaRight', VUEAPP.NVRAM.LegacySchemaRight, colNames, colModel, 100);
    $('#gridtable-NVRAM-LegacySchemaRight').jqGrid( 'setGridWidth', table_column_width / 2 - 1);
    $("#gridtable-NVRAM-LegacySchemaRight").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" });
    //增加行选中事件
    $("#gridtable-NVRAM-LegacySchemaLeft").jqGrid('setGridParam',{ 
        onSelectRow : function (rowid) {
            initSubGridTable(rowid, "#gridtable-NVRAM-LegacySchemaRight", VUEAPP.NVRAM, 'LegacySchema');
        }
    }).trigger("reloadGrid"); //重新载入 

}

function initSubGridTable(pid, gridid, theData, keyname) {

    // let rightName = keyname + 'Right';
    // let subName = keyname + 'Sub';
    // theData[rightName].length = 0;
    // for(let i=0;i<theData[subName].length;i++) {
    //     if(theData[subName][i].pid == pid) {
    //         theData[rightName].push(theData[subName][i]);
    //     }
    // }
    // jQuery(gridid).trigger("reloadGrid");

    let rightName = keyname + 'Right', objGridTable = $(gridid);
    objGridTable.jqGrid('resetSelection');
    for(let i=0;i<theData[rightName].length;i++) {
        if(theData[rightName][i].pid == pid) {
            objGridTable.setRowData(theData[rightName][i].id,null,{display: ''});
        } else {
            objGridTable.setRowData(theData[rightName][i].id,null,{display: 'none'});
        }
    }


}


function initGridTable(gridid, gridData, colNames, colModel, height) {

	jQuery(gridid).jqGrid({
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
		ondblClickRow: function (rowid) {
            jQuery(gridid).jqGrid('editRow', rowid, {
                url:'clientArray', keys:true
            });
        }
	});

    
}
