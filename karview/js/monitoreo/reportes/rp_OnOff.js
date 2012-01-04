
var OnContenedorWin;
var OnWin;
var OnIdVehcPuntos;

//paramReporte
var OnVehiculo;
var OnNumVehc;

Ext.onReady(function(){
    
    var OnFecha1 = new Ext.form.DateField ({
        fieldLabel: 'Desde el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'OnFchIni',
        name: 'OnFchIni',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        endDateField: 'prdFchFin',
        emptyText:'Fecha Inicial...',
        anchor:'98%'
    });

    var OnFecha2 = new Ext.form.DateField({
        fieldLabel: 'Hasta el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'OnFchFin',
        name: 'OnFchFin',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        startDateField: 'prdFchIni',
        emptyText:'Fecha Final...',
        anchor:'98%'
    });

    OnContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [OnCmbVehic]
            }]
        }
        ,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [OnFecha1]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [OnFecha2]
            }]
        }
        ],

        buttons: [ {
            text: 'Trazar',
            handler: function() {

                var f1 = OnFecha1.getValue().format('Y-m-d');
                var f2 = OnFecha2.getValue().format('Y-m-d');
                
                OnContenedorWin.getForm().submit({
                    url : 'php/monitoreo/reportes/repDataOnOff.php',
                    method:'POST',
                    waitMsg : 'Comprobando Datos...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Sin datos...',
                            msg: 'Lo siento, no se encontraron datos!',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);
                        
                        var dtStore = new Ext.data.JsonStore({
                            data: resultado.dt,
                            autoLoad:true,
                            id: "dt",
                            fields: ["a", "b", "c", "l", "ln", "f"]
                        });
                                        
                        rpOn_AgregarTab(
                            "Encd.",
                            dtStore,
                            f1,
                            f2);
                    
                        OnClean();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: OnClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function OnClean(){
    OnContenedorWin.getForm().reset();
    if (OnWin != null) {
        OnWin.hide();
    }
    
}

var OnCmbVehic = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    store: cmbCompartido,
    hiddenName: 'OnIdVeh',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    disabled: false,
    mode: 'local',  
    triggerAction: 'all',
    emptyText:'Seleccionar Unidad...',
    allowBlank:false,
    resizable:true,
    minListWidth:300,
    selectOnFocus:true,
    listeners:{
        select: function(cmb,record,index){
            OnVehiculo = record.get('name');
            OnNumVehc = record.get('id');
        }
    }
});            

function OnWindow(){
    if(!OnWin){
        OnWin = new Ext.Window({
            layout:'fit',
            title:'Reporte Encendido',
            resizable : false,
            width:500,
            height:170,
            closeAction:'hide',
            plain: true,
            items: [OnContenedorWin]
        });
    }
    OnWin.show(this);

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


//modificar

function rpOn_AgregarTab(tipoReporte, storeDt, fIn, fFin){

    var encabezado =
    OnVehiculo + " <br/>" +
    "Desde: " + fIn + " <br/>" +
    "Hasta: " + fFin + " <br/>";

    //URL
    var url = 'php/xls/xlsOnOff.php?p1='
    + OnNumVehc + '&p2=' + fIn +
    '&p3=' + fIn ;
    //------

    // Crear Grid
    var Ongrid2 = new Ext.grid.GridPanel({
        store: storeDt,
        columns: [
        {
            id:'fecha',
            header: '<center>FECHA</center>',
            width: 120,
            sortable: true,
            dataIndex: 'a',
            renderer: center
        },{
            header: '<center>HORA</center>',
            width: 120,
            sortable: true,
            dataIndex: 'b',
            renderer: center
        },{
            header: '<center>DIRECCION</center>',
            width: 250,
            sortable: true,
            dataIndex: 'c'
        },{
            id: 'direc',
            header: '<center>LAT</center>',
            width: 75,
            sortable: true,
            dataIndex: 'l'
        },{
            header: '<center>LON</center>',
            width: 75,
            sortable: true,
            dataIndex: 'ln'
        },{
            header: '<center>ESTADO</center>',
            width: 75,
            sortable: true,
            dataIndex: 'f',
            renderer: stado
        }
        ],
        stripeRows: true,
        autoExpandColumn: 'direc',
        height: 450,
        width: 715,
        title: '<center>'+encabezado+'</center>',
        stateful: true,
        stateId: 'grid',

        tbar: [
        '-',{
            xtype: 'box',
            autoEl: {
                tag: 'a',
                href: url,
                html: 'Exportar a Excel'
            }
        }
        ]
    });

    var tab = new Ext.Panel({
        title: tipoReporte + OnVehiculo.replace(" ", "").substring(0,6) + '...',
        closable: true,
        iconCls: 'app-icon',
        items: Ongrid2
    });

    start.add(tab);
    start.setActiveTab(tab);

    Ongrid2.on('rowcontextmenu', function(grid, row, e) {
        e.stopEvent();
        var posXY = new Array(2) ;
        posXY[0] = window.event.clientX ;
        posXY[1] = window.event.clientY ;
        getData = grid.getStore().getAt(row);
       
        mnuContextGrid.showAt(posXY);        
    }, grid);
}