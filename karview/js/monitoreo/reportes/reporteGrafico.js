/*
 * Copyright(c) 2010
 */

var conten;
var vent;

//Valores del Reporte
var nUnidad;
var nameVh;
var fInicio;
var fFin;
var hInicio;
var hFin;
var idCoop;


var horaIniExc = new Ext.ux.form.Spinner(
{
    fieldLabel: 'Desde las',
    id : 'horaIni2',
    name: 'horaIni',
    strategy: new Ext.ux.form.Spinner.TimeStrategy(),
    allowBlank:false,
    emptyText:'Hora Inicial...',
    anchor:'98%'
});

var horaFinExc = new Ext.ux.form.Spinner(
{
    fieldLabel: 'Hasta las',
    id: 'horaFin2',
    name: 'horaFin',
    strategy: new Ext.ux.form.Spinner.TimeStrategy(),
    allowBlank:false,
    emptyText:'Hora Final...',
    anchor:'98%'
});



var comboVehicExcel = new Ext.form.ComboBox({
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
            nameVh = record.get('name')
        }
    }
});

var fechaFinObj = new Ext.form.DateField({
    fieldLabel: 'Hasta el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaFin2',
    name: 'fechaFin',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    startDateField: 'fechaIni2',
    emptyText:'Fecha Final...',
    anchor:'98%'

});

var fechaIniObj = new Ext.form.DateField({
    fieldLabel: 'Desde el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaIni2',
    name: 'fechaIni',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    endDateField: 'fechaFin2',
    emptyText:'Fecha Inicial...',
    anchor:'98%'

});

var btn1Exc = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);
            //fechas
            fechaIniObj.setValue(nowDate.format('Y-m-d'));
            fechaFinObj.setValue(nowDate.format('Y-m-d'));
            //horas
            horaIniExc.setValue('00:01');
            horaFinExc.setValue(nowDate.format('H:i'));
        }
    });

    var btn2Exc = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            fechaIniObj.setValue(nowDateY.format('Y-m-d'));
            fechaFinObj.setValue(nowDateY.format('Y-m-d'));
            //horas
            horaIniExc.setValue('00:01');
            horaFinExc.setValue('23:59');

        }
    });

    var panelBotonesExc = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [btn1Exc]
            },{
                columnWidth:.5,
                items: [btn2Exc]
            }]
        }]
    });
    

Ext.onReady(function(){
 
    conten = new Ext.FormPanel({
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
                items: [comboVehicExcel]

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
                items: [panelBotonesExc]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaIniObj
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaFinObj
                ]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                horaIniExc
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [ 
                horaFinExc
                ]
            }]
        }
        ],

        buttons: [{
            text: 'Generar',
            handler: function() {
                conten.getForm().submit({
                    url : 'php/monitoreo/datos_ruta_grid.php',
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
                        parametrosReporte();

                        var resultado = Ext.util.JSON.decode(action.response.responseText);
                        var datos = resultado.datos.coordenadas;
                        var filas =  datos.split("#");
                        myData = new Array();
                        for ( i=0; i<filas.length-1; i++ ) {
                            var columnas = filas[i].split("%");
                            myData[i] = columnas;
                        }
                        limpiar_dato();
                        agregarTab("Rep. Ruta-");
                    }

                });
            }
        },{
            text: 'Cancelar',
            handler: limpiar_dato
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function limpiar_dato(){
    conten.getForm().reset();
    vent.hide();
}

function ventReporte(){
    if(!vent){
        vent = new Ext.Window({
            layout:'fit',
            title:'Nuevo Reporte',
            resizable : false,
            width:500,
            height:170,
            closeAction:'hide',
            plain: true,
            items: [conten]
        });
    }
    vent.show(this);
}

function parametrosReporte(){
    fInicio = fechaIniObj.getValue().format('Y-m-d');
    fFin = fechaFinObj.getValue().format('Y-m-d');

    var hora1 = document.getElementById('horaIni2');
    var hora2 = document.getElementById('horaFin2');

    hInicio = hora1.value;
    hFin = hora2.value;

}