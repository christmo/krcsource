var fltContenedorWin;
var fltWin;
var prdIdVehcPuntos;
var fltFecha1;
var fltFecha2;
var fltHoraIniSpinner;
var fltHoraFinSpinner;
var fltF1;
var fltF2;
var vhicList;
var dd;
var fltJsCmbGeo = null;

Ext.onReady(function(){

    fltFecha1 = new Ext.form.DateField ({
        fieldLabel: 'Desde el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'fltFchIni',
        name: 'fltFchIni',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        endDateField: 'prdFchFin',
        emptyText:'Fecha Inicial...',
        anchor:'98%'
    });

    fltFecha2 = new Ext.form.DateField({
        fieldLabel: 'Hasta el',
        xtype:'datefield',
        format: 'Y-m-d', 
        id: 'fltFchFin',
        name: 'fltFchFin',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        startDateField: 'prdFchIni',
        emptyText:'Fecha Final...',
        anchor:'98%'
    });

    fltHoraIniSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        name: 'fltHoraIni',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });

    fltHoraFinSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        name: 'fltHoraFin',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });

    var fltBtn1 = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);
            //fechas
            fltFecha1.setValue(nowDate.format('Y-m-d'));
            fltFecha2.setValue(nowDate.format('Y-m-d'));
            //horas
            fltHoraIniSpinner.setValue('00:01');
            fltHoraFinSpinner.setValue(nowDate.format('H:i'));
        },
        id: 'fltBtnHoy'
    });

    var fltBtn2 = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);
            //fechas
            fltFecha1.setValue(nowDateY.format('Y-m-d'));
            fltFecha2.setValue(nowDateY.format('Y-m-d'));
            //horas
            fltHoraIniSpinner.setValue('00:01');
            fltHoraFinSpinner.setValue('23:59');
            
        },
        id: 'fltBtnAyer'
    });

    var fltPanelBotones = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [fltBtn1]
            },{
                columnWidth:.5,
                items: [fltBtn2]
            }]
        }]
    });


    if (fltJsCmbGeo == null) {
        fltJsCmbGeo = new Ext.data.JsonStore({
            url: 'php/combos/vehiculosFlota.php',
            root: 'unidades',
            fields: [{
                name:'value'
            },{
                name:'text'
            }]
        });
        fltJsCmbGeo.load();
    }

    dd = new Ext.ux.form.ItemSelector({
        xtype: 'itemselector',
        name: 'vehList',
        imagePath: 'js/monitoreo/ux/images/',
        drawUpIcon:false,
        drawDownIcon:false,
        drawLeftIcon:true,
        drawRightIcon:true,
        drawTopIcon:false,
        drawBotIcon:false,

        multiselects: [{
            width: 180,
            height: 150,
            legend: 'Vehiculos',
            store: fltJsCmbGeo,
            displayField: 'text',
            valueField: 'value'

        },{
            width: 180,
            height: 150,
            legend: 'Seleccionados',
            store: [[-1,]],  //borrar -1
            tbar:[{
                text: 'vaciar',
                handler:function(){
                    dd.reset();
                }
            }]
        }]
    });

    fltContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 600,
        items: [
        dd
        ,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [fltFecha1]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [fltFecha2]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                fltHoraIniSpinner
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                fltHoraFinSpinner
                ]
            }]
        },
        fltPanelBotones
        ],

        buttons: [ {
            text: 'Trazar',
            handler: function() {



                fltContenedorWin.getForm().submit({
                    url : 'php/monitoreo/reportes/repDataFlota.php',
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

                        fltParametrosRp();
                        
                        //nombre por id
                        for(i = 0; i< resultado.dt.length; i++){
                            resultado.dt[i].a = cmbCompartido.getById(resultado.dt[i].a).get("name");
                        }

                        var dtStore = new Ext.data.JsonStore({
                            data: resultado.dt,
                            autoLoad:true,
                            id: "dt",
                            fields: ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
                        });

                        rpFlt_AgregarTab("Reporte de Flota", dtStore, resultado.dt.length);

                        fltClean();

                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: fltClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function fltClean(){
    fltContenedorWin.getForm().reset();
    if (fltWin != null) {
        fltWin.hide();
    }    
}       

function fltWindow(){
    if(!fltWin){
        fltWin = new Ext.Window({
            layout:'fit',
            title:'Reporte Flotas',
            resizable : false,
            width:510,
            height:315,
            closeAction:'hide',
            plain: true,
            items: [fltContenedorWin]
        });
    }
    fltWin.show(this);
}

function fltParametrosRp(){

    fltFInicio = fltFecha1.getValue().format('Y-m-d');
    fltFFin = fltFecha2.getValue().format('Y-m-d');

    fltHInicio = fltHoraIniSpinner.value;
    fltHFin = fltHoraFinSpinner.value;

    fltF1 = fltFInicio + " " + fltHInicio;
    fltF2 = fltFFin + " " + fltHFin;

    vhicList = dd.getValue();

}

function rpFlt_AgregarTab(tipoReporte, storeDt, ttl){

    var encabezado =
    tipoReporte + " <br/>" +
    "Desde: " + fltF1 + " <br/>" +
    "Hasta: " + fltF2 + " <br/>" +
    "Vehiculos: " + ttl + "<br/>";

    //URL
    var url = 'php/xls/xlsFlt.php?a='
    + fltF1 + '&b=' + fltF2 +
    '&c=' + vhicList;
    //------

    // Crear Grid
    var fltGrid = new Ext.grid.GridPanel({
        store: storeDt,
        columns: [
        {
            id:'fecha',
            header: '<center>Vehiculo</center>',
            width: 250,
            sortable: true,
            dataIndex: 'a'
        },{
            header: '<center>Distancia Km</center>',
            width: 80,
            sortable: true,
            dataIndex: 'b',
            renderer: center
        },{
            header: '<center>Vel. Max Km/h </center>',
            width: 80,
            sortable: true,
            dataIndex: 'c',
            renderer: center
        },{
            id: 'direc',
            header: '<center>Vel. Promed Km/h</center>',
            width: 80,
            sortable: false,
            dataIndex: 'd',
            renderer: center
        },{
            header: '<center>Tmp Redando</center>',
            width: 75,
            sortable: true,
            dataIndex: 'e',
            renderer: center
        },{
            header: '<center>Tmp Detenido</center>',
            width: 75,
            sortable: true,
            dataIndex: 'f',
            renderer: center
        },{
            header: '<center>Paradas</center>',
            width: 70,
            sortable: true,
            dataIndex: 'g',
            renderer: center
        },{
            header: '<center>% Rodando</center>',
            width: 75,
            sortable: true,
            dataIndex: 'h',
            renderer: center
        },{
            header: '<center>% Detenido</center>',
            width: 75,
            sortable: true,
            dataIndex: 'i',
            renderer: center
        }

        ],
        stripeRows: true,
        //autoExpandColumn: 'direc',
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
        title: 'Rpt Flota..',
        closable: true,
        iconCls: 'app-icon',
        items: fltGrid
    });

    start.add(tab);
    start.setActiveTab(tab);

}