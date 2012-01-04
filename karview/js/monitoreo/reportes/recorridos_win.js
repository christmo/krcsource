/*
 * nota : porfavor no utilizar variables con nombre
 * generico ej: store - combo - contenedor
 * porque se las referencia en diferenes archivos
 * e incluso extjs tiene propiedades con esos nombres
 * (he pasado bastante tiempo corrigiendo eso ¬¬ )
 */

var contenedorWin;
var win;
var idVehcPuntos;

Ext.onReady(function(){

    Ext.apply(Ext.form.VTypes, {
        daterange : function(val, field) {            
            var date = field.parseDate(val);            
            if(!date){
                return;
            }
            if (field.startDateField && (!this.dateRangeMax ||
                (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin ||
                (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });

    var fecha1 = new Ext.form.DateField ({
        fieldLabel: 'Desde el',
        xtype:'datefield',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaIni',
        name: 'fechaIni',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        endDateField: 'fechaFin',
        emptyText:'Fecha Inicial...',
        anchor:'98%'
    });

    var fecha2 = new Ext.form.DateField({
        fieldLabel: 'Hasta el',
        xtype:'datefield',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFin',
        name: 'fechaFin',
        width:140,
        allowBlank:false,
        vtype: 'daterange',
        startDateField: 'fechaIni',
        emptyText:'Fecha Final...',
        anchor:'98%'
    });

    var horaIniSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });

    var horaFinSpinner = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });

    var btn1 = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);
            //fechas
            fecha1.setValue(nowDate.format('Y-m-d'));
            fecha2.setValue(nowDate.format('Y-m-d'));
            //horas
            horaIniSpinner.setValue('00:01');
            horaFinSpinner.setValue(nowDate.format('H:i'));
        },
        id: 'btnHoy'
    });

    var btn2 = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            fecha1.setValue(nowDateY.format('Y-m-d'));
            fecha2.setValue(nowDateY.format('Y-m-d'));
            //horas
            horaIniSpinner.setValue('00:01');
            horaFinSpinner.setValue('23:59');
            
        },
        id: 'btnAyer'
    });

    var panelBotonos = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [btn1]
            },{
                columnWidth:.5,
                items: [btn2]
            }]
        }]
    });

    contenedorWin = new Ext.FormPanel({
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
                items: [comboVehic]           
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
                items: [panelBotonos]
            }]
        }


        ,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [fecha1]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [fecha2]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                horaIniSpinner
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                horaFinSpinner
                ]
            }]
        }
        ],

        buttons: [ {
            text: 'Trazar',
            handler: function() {
                contenedorWin.getForm().submit({
                    url : 'php/monitoreo/datos_ruta_mapa.php',
                    method:'POST',
                    waitMsg : 'Comprobando Datos...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'No hay un trazo posible en estas fechas y horas...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        //dibujar la ruta en el mapa
                        // generarTrazado(resultado.datos.coordenadas);
                        lienzosRecorridoHistorico(placaVh,resultado.datos.coordenadas);

                        //Limpia los datos del formulario y lo oculta
                        limpiar_datos();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: limpiar_datos
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function limpiar_datos(){
    contenedorWin.getForm().reset();
    if (win != null) {
        win.hide();
    }
    
}

var comboVehic = new Ext.form.ComboBox({
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
            auxNamePoint = record.get('name');
            placaVh = auxNamePoint.split("-")[0];
        }
    }
});            

function ventanaRecorridos(idu){
    if(!win){
        win = new Ext.Window({
            layout:'fit',
            title:'Nuevo Recorrido',
            resizable : false,
            width:500,
            height:170,
            closeAction:'hide',
            plain: true,
            items: [contenedorWin]
        });
    }
    win.show(this);

    if (idu != 0) {
        comboVehic.setValue(idu);
    }
}