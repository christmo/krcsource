
var cmdHContenedorWin;
var cmdHWin;
var cmdHIdVehcPuntos;

//paramReporte
var cmdHVehiculo;
var cmdHNumVehc;

Ext.onReady(function(){
    
    var cmdHFecha1 = new Ext.form.DateField ({
        fieldLabel: 'Desde el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'cmdHFchIni',
        name: 'cmdHFchIni',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        endDateField: 'cmdHFchFin',
        emptyText:'Fecha Inicial...',
        anchor:'98%'
    });

    var cmdHFecha2 = new Ext.form.DateField({
        fieldLabel: 'Hasta el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'cmdHFchFin',
        name: 'cmdHFchFin',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        startDateField: 'cmdHFchIni',
        emptyText:'Fecha Final...',
        anchor:'98%'
    });

    cmdHContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,
        items: [
        cmdHCmbVehic
        ,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [cmdHFecha1]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [cmdHFecha2]
            }]
        }
        ],

        buttons: [ {
            text: 'Buscar',
            handler: function() {

                var f1 = cmdHFecha1.getValue().format('Y-m-d');
                var f2 = cmdHFecha2.getValue().format('Y-m-d');
                var idE = cmdHCmbVehic.getValue();
                                           
                cmdH_AgregarTab(
                    "Hist_CMD",
                    f1,
                    f2,
                    idE);

            }
        },{
            text: 'Cancelar',
            handler: cmdHClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function cmdHClean(){
    cmdHContenedorWin.getForm().reset();
    if (cmdHWin != null) {
        cmdHWin.hide();
    }
    
}

var cmdHCmbVehic = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    store: cmbCompartido,
    hiddenName: 'cmdHIdVeh2',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    disabled: false,
    mode: 'local',  
    triggerAction: 'all',
    emptyText:'Seleccionar Vehic...',
    allowBlank:false,
    resizable:true,
    minListWidth:300,
    selectOnFocus:true,
    listeners:{
        select: function(cmb,record,index){
            cmdHVehiculo = record.get('name');
            cmdHNumVehc = record.get('id');
        }
    }
});            

function cmdHWindow(){
    if(!cmdHWin){
        cmdHWin = new Ext.Window({
            layout:'fit',
            title:'Historial de Comandos',
            resizable : false,
            width:500,
            height:170,
            closeActicmdH:'hide',
            plain: true,
            items: [cmdHContenedorWin]
        });
    }
    cmdHWin.show(this);

}

function center(val){
    if (val == "") {
        return "<center>---</center>";
    }
    return "<center>" + val + "</center>";
}

function stado(val){
    if (val == "1") {
        return "<center>ENCENDIDO</center>";
    }
    return "<center>APAGADO</center>";
}


//Agregar Pestaña

function cmdH_AgregarTab(tipoReporte, fIn, fFin, ideqp){

    //Store para paginación
    var strCmd = new Ext.data.JsonStore({
        url: 'php/monitoreo/reportes/repCmdHist.php',
        baseParams: {
            fi: fIn,
            ff: fFin,
            id: ideqp
        },
        root: 'p',
        totalProperty: 't',
        idProperty: 'threadid',
        fields: ["u", "c", "r", "fc", "fe", "s"]
    });

    //toolBar de paginación
    var pgBarCmdH = new Ext.PagingToolbar({
        id:'pgBarGridH',
        pageSize: 10,
        afterPageText : "de {0}",
        beforePageText: "Pag",
        store: strCmd,
        displayInfo: true,
        displayMsg: 'Mostrando {0} - {1} de {2}',
        emptyMsg: "No hay datos"
    });

    //Grid de comandos historial con paginación
    var gridTCmdH = new Ext.grid.GridPanel({
        title: '<center> COMANDOS ENVIADOS <BR/> <BR/>'+cmdHVehiculo+
        '<BR/><BR/> Desde: '+fIn+'<br/>Hasta: '+fFin+'  </center>',
        height:400,
        style: "padding:0px 0px 10px 0px;",
        store: strCmd,
        trackMouseOver:false,
        selModel: new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),
        loadMask: true,
        //grid columns
        columns:[{
            header: "<center>Usuario</center>",
            dataIndex: 'u',
            width: 75,
            sortable: false,
            menuDisabled:true
        },{
            header: "<center>Comando</center>",
            dataIndex: 'c',
            width: 270,
            sortable: false,
            menuDisabled:true
        },
        {
            header: "<center>Respuesta</center>",
            dataIndex: 'r',
            width: 150,
            sortable: false,
            menuDisabled:true
        },{
            header: "<center>Creacion</center>",
            dataIndex: 'fc',
            width: 125,
            sortable: false,
            menuDisabled:true
        },
        {
            header: "<center>Envio</center>",
            dataIndex: 'fe',
            width: 125,
            sortable: false,
            menuDisabled:true
        },{
            header: "<center>Estado</center>",
            dataIndex: 's',
            width: 150,
            sortable: false,
            menuDisabled:true
        }],
        // paging bar on the bottom
        bbar: pgBarCmdH
    });


    //*****************************************************************************
    //*****************************************************************************

    var tab = new Ext.Panel({
        title: tipoReporte + cmdHVehiculo.replace(" ", "").substring(0,6) + '...',
        closable: true,
        iccmdHCls: 'app-iccmdH',
        items: gridTCmdH
    });

    start.add(tab);
    start.setActiveTab(tab);

    cmdHClean();

    // trigger the data store load
    strCmd.load({
        params:{
            start:0,
            limit:5
        }
    });


}