var prdContenedorWin;
var prdWin;
var prdIdVehcPuntos;

//paramReporte
var prdVehiculo;
var prdNumVehc;

Ext.onReady(function(){

    var prdFecha1 = new Ext.form.DateField ({
        fieldLabel: 'Desde el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'prdFchIni',
        name: 'prdFchIni',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        endDateField: 'prdFchFin',
        emptyText:'Fecha Inicial...',
        anchor:'98%'
    });

    var prdFecha2 = new Ext.form.DateField({
        fieldLabel: 'Hasta el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'prdFchFin',
        name: 'prdFchFin',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        startDateField: 'prdFchIni',
        emptyText:'Fecha Final...',
        anchor:'98%'
    });

    var prdHoraIniSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        name: 'prdHoraIni',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });

    var prdHoraFinSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        name: 'prdHoraFin',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });

    var prdBtn1 = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);
            //fechas
            prdFecha1.setValue(nowDate.format('Y-m-d'));
            prdFecha2.setValue(nowDate.format('Y-m-d'));
            //horas
            prdHoraIniSpinner.setValue('00:01');
            prdHoraFinSpinner.setValue(nowDate.format('H:i'));
        },
        id: 'prdBtnHoy'
    });

    var prdBtn2 = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            prdFecha1.setValue(nowDateY.format('Y-m-d'));
            prdFecha2.setValue(nowDateY.format('Y-m-d'));
            //horas
            prdHoraIniSpinner.setValue('00:01');
            prdHoraFinSpinner.setValue('23:59');
            
        },
        id: 'prdBtnAyer'
    });

    var prdPanelBotones = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [prdBtn1]
            },{
                columnWidth:.5,
                items: [prdBtn2]
            }]
        }]
    });

    prdContenedorWin = new Ext.FormPanel({
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
                items: [prdCmbVehic]
            },{
                columnWidth:.05,
                layout: 'form',
                items: [{
                    xtype:'label',
                    text:'.'
                }]
            },{
                columnWidth:.4,
                layout: 'form',
                items: [prdPanelBotones]
            }]
        }


        ,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [prdFecha1]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [prdFecha2]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                prdHoraIniSpinner
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                prdHoraFinSpinner
                ]
            }]
        }
        ],

        buttons: [ {
            text: 'Trazar',
            handler: function() {

                var f1 = prdFecha1.getValue().format('Y-m-d');
                var f2 = prdFecha2.getValue().format('Y-m-d');

                var h1 = prdHoraIniSpinner.value;
                var h2 = prdHoraFinSpinner.value;

                prdContenedorWin.getForm().submit({
                    url : 'php/monitoreo/reportes/repDataParadas.php',
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
                            fields: ["id", "i", "f", "d", "l", "ln", "di"]
                        });


                        rpPrd_AgregarTab(
                            "Prds.",
                            dtStore,
                            resultado.p,
                            resultado.dt.length,
                            f1 + " " + h1,
                            f2 + " " + h2);

                        prdClean();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: prdClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function prdClean(){
    prdContenedorWin.getForm().reset();
    if (prdWin != null) {
        prdWin.hide();
    }
    
}

var prdCmbVehic = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    store: cmbCompartido,
    hiddenName: 'prdIdVeh',
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
            prdVehiculo = record.get('name');
            prdNumVehc = record.get('id');

        }
    }
});            

function prdWindow(){
    if(!prdWin){
        prdWin = new Ext.Window({
            layout:'fit',
            title:'Reporte Paradas',
            resizable : false,
            width:500,
            height:170,
            closeAction:'hide',
            plain: true,
            items: [prdContenedorWin]
        });
    }
    prdWin.show(this);

}

function center(val){
    if (val == "") {
        return "<center>---</center>";
    }
    return "<center>" + val + "</center>";
}

function rpPrd_AgregarTab(tipoReporte, storeDt, deten, total, fIn, fFin){

    var encabezado =
    prdVehiculo + " <br/>" +
    "Desde: " + fIn + " <br/>" +
    "Hasta: " + fFin + " <br/>" +
    "Total: " + total + " Paradas<br/>" +
    "Detenido: " + deten + "% <br/>";

    //URL
    var url = 'php/xls/xlsPrd.php?a='
    + prdNumVehc + '&b=' + 12 +
    '&c=' + fIn + '&d=' + fFin +
    '&e=' + hFin + '&f=' + prdVehiculo;
    //------

    // Crear Grid
    var grid2 = new Ext.grid.GridPanel({
        store: storeDt,
        columns: [
        {
            id:'fecha',
            header: '<center>Inicio</center>',
            width: 120,
            sortable: true,
            dataIndex: 'i',
            renderer: center
        },{
            header: '<center>Fin</center>',
            width: 120,
            sortable: true,
            dataIndex: 'f',
            renderer: center
        },{
            header: '<center>Duracion</center>',
            width: 80,
            sortable: true,
            dataIndex: 'd',
            renderer: center
        },{
            id: 'direc',
            header: '<center>Dirección</center>',
            width: 250,
            sortable: true,
            dataIndex: 'di'
        },{
            header: '<center>Latitud</center>',
            width: 75,
            sortable: true,
            dataIndex: 'l'
        },{
            header: '<center>Longitud</center>',
            width: 75,
            sortable: true,
            dataIndex: 'ln'
        }

        ],
        stripeRows: true,
        autoExpandColumn: 'direc',
        height: 450,
        width: 915, 
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
        title: tipoReporte + prdVehiculo.replace(" ", "").substring(0,6) + '...',
        closable: true,
        iconCls: 'app-icon',
        items: grid2
    });

    start.add(tab);
    start.setActiveTab(tab);

    grid2.on('rowcontextmenu', function(grid, row, e) {
        e.stopEvent();
        var posXY = new Array(2) ;
        posXY[0] = window.event.clientX ;
        posXY[1] = window.event.clientY ;
        getData = grid.getStore().getAt(row);
        mnuContextGrid.showAt(posXY);        
    }, grid);
}