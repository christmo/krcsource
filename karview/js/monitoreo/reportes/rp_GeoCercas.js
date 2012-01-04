var gccContent;
var gccVent;

//Valores del Reporte
var gccNUnidad;
var gccVehiculo;
var gccGeoCerca;
var gccFInicio;
var gccFFin;
var gccHInicio;
var gccHFin;
var gccIdCoop;
var gccId;
var gccIdVehiculo;

var gccHora1;
var gccHora2;

Ext.onReady(function(){

    var gccBtn1 = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            //fechas
            gccFechaIni.setValue(nowDate.format('Y-m-d'));
            gccFechaFin.setValue(nowDate.format('Y-m-d'));
            //horas
            gccHora1.setValue('00:01');
            gccHora2.setValue(nowDate.format('H:i'));
        },
        id: 'gccBtnHoy'
    });

    var gccBtn2 = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            gccFechaIni.setValue(nowDateY.format('Y-m-d'));
            gccFechaFin.setValue(nowDateY.format('Y-m-d'));
            //horas
            gccHora1.setValue('00:01');
            gccHora2.setValue('23:59');

        },
        id: 'gccBtnAyer'
    });

    var gccPanelB = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [gccBtn1]
            },{
                columnWidth:.5,
                items: [gccBtn2]
            }]
        }]
    });

    gccHora1 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        id : 'gccHI',
        name: 'gccHI',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });

    gccHora2 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        id: 'gccHF',
        name: 'gccHF',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });

    gccContent = new Ext.FormPanel({
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
                items: [gccCmbVehic]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [gccCmbGeo]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                gccFechaIni
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                gccFechaFin
                ]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                gccHora1
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                gccHora2
                ]
            }]
        },

        {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                gccPanelB
                ]
            }]
        }

        ],

        buttons: [{
            text: 'Generar',
            handler: function() {

                gccContent.getForm().submit({
                    url : 'php/monitoreo/reportes/repDataGeoCercas.php',
                    method:'POST',
                    waitMsg : 'Buscando Datos...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Sin Datos...',
                            msg: 'Lo siento, no se encontraron datos!',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
            
                    success: function (form, action) {
            
                        gccParametrosRp();            
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        var dtStore = new Ext.data.JsonStore({
                            data: resultado.dt,
                            autoLoad:true,
                            fields: ["i", "o", "t"]
                        });

                        rpGcc_AgregarTab("GeoC. ", dtStore, "fIn", "fFin");

                        gccClean();
                    }
            
                });
            
            }
        },{
            text: 'Cancelar',
            handler: gccClean
        }]
    });
});

function gccClean(){
    gccContent.getForm().reset();
    gccVent.hide();
}

function gccWindow(){
    if(!gccVent){
        gccVent = new Ext.Window({
            layout:'fit',
            title:'Reportes GeoCercas',
            resizable : false,
            width:500,
            height:185,
            closeAction:'hide',
            plain: true,
            items: [gccContent]
        });
    }
    gccVent.show(this);
}


var gccJsCmbGeo = new Ext.data.JsonStore({
    url: 'php/combos/eventos.php',
    root: 'd',
    fields: [{
        name:'id'
    },{
        name:'name'
    }]
});

var gccCmbGeo = new Ext.form.ComboBox({
    fieldLabel: ' GeoC ',
    store: gccJsCmbGeo,
    hiddenName: 'gccIdGcc',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    disabled: false,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Seleccionar Evento...',
    allowBlank:false,
    resizable:true,
    minListWidth:300,
    selectOnFocus:true,
    listeners:{
        select: function(cmb,record,index){
            gccId = record.get('id');
            gccGeoCerca = record.get('name');
        }
    }
});


var gccCmbVehic = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    store: cmbCompartido,
    hiddenName: 'gccIdVeh',
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
            gccVehiculo = record.get('name');
            gccIdVehiculo = record.get('id');

            gccJsCmbGeo.proxy.conn.url = 'php/combos/geocercas.php?e=' + record.get('id');
            gccJsCmbGeo.load();
        }
    }
});            

var gccFechaFin = new Ext.form.DateField({
    fieldLabel: 'Hasta el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'gccFF',
    name: 'gccFF',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    startDateField: 'fechaIniEvt',
    emptyText:'Fecha Final...',
    anchor:'98%'

});

var gccFechaIni = new Ext.form.DateField({
    fieldLabel: 'Desde el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'gccFI',
    name: 'gccFI',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    endDateField: 'fechaFinEvt',
    emptyText:'Fecha Inicial...',
    anchor:'98%'

});

function gccParametrosRp(){
    gccFInicio = gccFechaIni.getValue().format('Y-m-d');
    gccFFin = gccFechaFin.getValue().format('Y-m-d');

    gccHInicio = gccHora1.value;
    gccHFin = gccHora2.value;

    gccF1 = gccFInicio + " " + gccHInicio;
    gccF2 = gccFFin + " " + gccHFin;
}

function rpGcc_AgregarTab(tipoReporte, storeDt){

    var encabezado =
    gccVehiculo + " <br/>" +
    "Geocerca: " + gccGeoCerca + " <br/>" +
    "Desde: " + gccF1 + " <br/>" +
    "Hasta: " + gccF2 + " <br/>";

    //URL
    var url = 'php/xls/xlsGeoC.php?a='
    + gccId + '&b=' + gccIdVehiculo +
    '&c=' + gccVehiculo + '&d=' + gccF1 +
    '&e=' + gccF2 + '&f=' + gccGeoCerca;
    //------

    // Crear Grid
    var gccGrid = new Ext.grid.GridPanel({
        store: storeDt,
        columns: [
        {
            id:'fecha',
            header: '<center>Entrada</center>',
            width: 120,
            sortable: true,
            dataIndex: 'i',
            renderer: center
        },{
            header: '<center>Salida</center>',
            width: 120,
            sortable: true,
            dataIndex: 'o',
            renderer: center
        },{
            header: '<center>Tiempo Dentro</center>',
            width: 80,
            sortable: true,
            dataIndex: 't',
            renderer: center
        }
        ],
        stripeRows: true,
        height: 450,
        width: 350,
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
        title: tipoReporte + gccVehiculo.replace(" ", "").substring(0,6) + '...',
        closable: true,
        iconCls: 'app-icon',
        items: gccGrid
    });

    start.add(tab);
    start.setActiveTab(tab);
    
}