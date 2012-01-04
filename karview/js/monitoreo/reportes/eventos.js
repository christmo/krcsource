var contenEvt;
var ventEvt;

//Valores del Reporte
var nUnidad;
var nameVh;
var fInicio;
var fFin;
var hInicio;
var hFin;
var idCoop;
var EvtId;

Ext.onReady(function(){

    var btn1Evt = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            //fechas
            fechaIniObjEvt.setValue(nowDate.format('Y-m-d'));
            fechaFinObjEvt.setValue(nowDate.format('Y-m-d'));
            //horas
            horaEvt1.setValue('00:01');
            horaEvt2.setValue(nowDate.format('H:i'));
        },
        id: 'btnHoyEvt'
    });

    var btn2Evt = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            fechaIniObjEvt.setValue(nowDateY.format('Y-m-d'));
            fechaFinObjEvt.setValue(nowDateY.format('Y-m-d'));
            //horas
            horaEvt1.setValue('00:01');
            horaEvt2.setValue('23:59');

        },
        id: 'btnAyerEvt'
    });

    var panelBEvt = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [btn1Evt]
            },{
                columnWidth:.5,
                items: [btn2Evt]
            }]
        }]
    });

    var horaEvt1 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        id : 'horaIniEvt',
        name: 'horaIniEvt',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });

    var horaEvt2 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        id: 'horaFinEvt',
        name: 'horaFinEvt',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });

    contenEvt = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,
        items: [{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [comboVehicEvt]

            },{
                columnWidth:.5,
                layout: 'form',
                items: [comboEvt]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaIniObjEvt
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaFinObjEvt
                ]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                horaEvt1
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [ 
                horaEvt2
                ]
            }]
        },

        {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                panelBEvt
                ]
            }]
        }

        ],

        buttons: [{
            text: 'Generar',
            handler: function() {
                contenEvt.getForm().submit({
                    url : 'php/monitoreo/datos_eventos.php',
                    method:'POST',
                    waitMsg : 'Buscando Datos...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'No existen datos en estas fechas y horas...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },

                    success: function (form, action) {

                        //carga de los parametros
                        parametrosReporteEvt();

                        var resultado = Ext.util.JSON.decode(action.response.responseText);
                        var datos = resultado.datos.coordenadas;
                        var filas =  datos.split("#");
                        myData = new Array();
                        for ( i=0; i<filas.length-1; i++ ) {
                            var columnas = filas[i].split("%");
                            myData[i] = columnas;
                        }
                        limpiar_datoEvt();
                        agregarTab("Rep. Evento[" + EvtId + "]-");
                    }

                });
            }
        },{
            text: 'Cancelar',
            handler: limpiar_datoEvt
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function limpiar_datoEvt(){
    contenEvt.getForm().reset();
    ventEvt.hide();
}

function ventReporteEvt(){
    if(!ventEvt){
        ventEvt = new Ext.Window({
            layout:'fit',
            title:'Eventos - Histórico',
            resizable : false,
            width:500,
            height:185,
            closeAction:'hide',
            plain: true,
            items: [contenEvt]
        });
    }
    ventEvt.show(this);
}


var js_comboEvt;

js_comboEvt = new Ext.data.JsonStore({
    url:'php/combos/eventos.php',
    root: 'eventos',
    fields: [{
        name:'id'
    },{
        name:'name'
    }]
});
js_comboEvt.load();

var comboEvt = new Ext.form.ComboBox({
    fieldLabel: 'Evento',
    store: js_comboEvt,
    hiddenName: 'IdEvento',
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
            EvtId = record.get('id');
        }
    }
});


var comboVehicEvt = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    store: cmbCompartido,
    hiddenName: 'idVeh',
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
            nUnidad = record.get('id');
            nameVh = record.get('name');            
        }
    }
});            

var fechaFinObjEvt = new Ext.form.DateField({
    fieldLabel: 'Hasta el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaFinEvt',
    name: 'fechaFinEvt',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    startDateField: 'fechaIniEvt',
    emptyText:'Fecha Final...',
    anchor:'98%'

});

var fechaIniObjEvt = new Ext.form.DateField({
    fieldLabel: 'Desde el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaIniEvt',
    name: 'fechaIniEvt',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    endDateField: 'fechaFinEvt',
    emptyText:'Fecha Inicial...',
    anchor:'98%'

});

function parametrosReporteEvt(){
    fInicio = fechaIniObjEvt.getValue().format('Y-m-d');
    fFin = fechaFinObjEvt.getValue().format('Y-m-d');

    var hora1 = document.getElementById('horaIniEvt');
    var hora2 = document.getElementById('horaFinEvt');

    hInicio = hora1.value;
    hFin = hora2.value;
}