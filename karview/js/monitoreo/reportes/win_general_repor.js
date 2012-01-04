
var contenGen;
var ventGen;

//Valores del Reporte
var nUnidadGen;
var nameCoopGen;
var fInicioGen;
var fFinGen;
var hInicioGen;
var hFinGen;
var datosReporte;


var comboVehicGen = new Ext.form.ComboBox({
    fieldLabel: 'Vehiculo',
    id:'vehGen',
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
            nUnidadGen = record.get('id');
            nUnidadAsig = record.get('id');
            nUnidad = record.get('id');
            nameVh = record.get('name');
        }
    }
});

var fechaIniGen = new Ext.form.DateField({
    fieldLabel: 'Desde el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaIniGen',
    name: 'fechaIni',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    endDateField: 'fechaFinGen',
    emptyText:'Fecha Inicial...',
    anchor:'98%'
});

var fechaFinGen = new Ext.form.DateField({
    fieldLabel: 'Hasta el',
    xtype:'datefield',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'fechaFinGen',
    name: 'fechaFin',
    width:140,
    allowBlank:false,
    vtype: 'daterange',
    startDateField: 'fechaIniGen',
    emptyText:'Fecha Final...',
    anchor:'98%'

});

var num1;
var num2;

Ext.onReady(function(){
    
    //Check para trazo en el mapa
    var chkRuta = new Ext.form.Checkbox({
        xtype : 'checkbox',
        checked: true,
        columnWidth: 0.3,
        fieldLabel: '',
        labelSeparator: '',
        boxLabel: 'Trazar Ruta (mapa)',
        name: 'bxOpt1'
    });

    //Check para datos de la ruta en tabla
    var chkRutaGrid = new Ext.form.Checkbox({
        xtype : 'checkbox',
        columnWidth: 0.3,
        fieldLabel: '',
        labelSeparator: '',
        boxLabel: 'Datos Ruta (tabla) ',
        name: 'bxOpt1'
    });

    //Borde contenedor de los Checks
    var opcionesReporte = new Ext.form.FieldSet({
        xtype:'fieldset',
        layout : 'column',
        title: 'Opciones de Reporte',
        collapsible: false,
        autoHeight:true,
        width : 460,
        items: [chkRuta, chkRutaGrid]
    });

    num1 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Desde las',
        id: 'horaIniGen',
        name: 'horaIni',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Inicial...',
        anchor:'98%'
    });
    num2 = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Hasta las',
        id: 'horaFinGen',
        name: 'horaFin',
        strategy: new Ext.ux.form.Spinner.TimeStrategy(),
        allowBlank:false,
        emptyText:'Hora Final...',
        anchor:'98%'
    });


    var btn1Gen = new Ext.Button({
        text: 'Hoy',
        handler: function() {
            //fecha actual
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + 10);
            //fechas
            fechaIniGen.setValue(nowDate.format('Y-m-d'));
            fechaFinGen.setValue(nowDate.format('Y-m-d'));
            //horas
            num1.setValue('00:01');
            num2.setValue(nowDate.format('H:i'));
        }
    });

    var btn2Gen = new Ext.Button({
        text: 'Ayer',
        handler: function() {
            //fecha actual
            var nowDateY = new Date();
            nowDateY.setDate(nowDateY.getDate() - 1);

            //fechas
            fechaIniGen.setValue(nowDateY.format('Y-m-d'));
            fechaFinGen.setValue(nowDateY.format('Y-m-d'));
            //horas
            num1.setValue('00:01');
            num2.setValue('23:59');

        }
    });

    var panelBotonesGen = new Ext.Panel({
        width: 60,
        items: [
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                items: [btn1Gen]
            },{
                columnWidth:.5,
                items: [btn2Gen]
            }]
        }]
    });


    contenGen = new Ext.FormPanel({
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
                items: [comboVehicGen]

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
                items: [panelBotonesGen]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaIniGen
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                fechaFinGen
                ]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                num1
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                num2
                ]
            }]
        },
        
        opcionesReporte //NUEVO OBJETO DE PRUEBA
        
        ],

        buttons: [{
            text: 'Generar',
            handler: function() {
                
                var ruta = chkRuta.getValue();
                var rutaGrid = chkRutaGrid.getValue();
            
                if (!ruta && !rutaGrid ) {
            
                    Ext.MessageBox.show({
                        title: 'Validador',
                        msg: 'Debe seleccionar almenos una opci&oacute;n para el reporte',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }else{
                    parametrosReporteGen();
                    if (ruta) {
                        graficar_recorrido_Map(num1, num2)
                    }
                    if (rutaGrid) {
                        tabla_recorrido(num1,num2);
                    }                 
                    limpiar_vent_gen();                        
                }
            }
        },{
            text: 'Cancelar',
            handler: limpiar_vent_gen
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function limpiar_vent_gen(){
    contenGen.getForm().reset();
    ventGen.hide();
}

function vent_rep_gen(){
    if(!ventGen){
        ventGen = new Ext.Window({
            layout:'fit',
            title:'Nuevo Reporte',
            resizable : false,
            width:500,
            height:220,
            closeAction:'hide',
            plain: true,
            items: [contenGen]
        });
    }
    ventGen.show(this);
}

function parametrosReporteGen(){
    fInicioAsig = fechaIniGen.getValue().format('Y-m-d');
    fFinAsig = fechaFinGen.getValue().format('Y-m-d');
    fInicio = fInicioAsig;
    fFin = fFinAsig;
    hInicio = num1.getValue();
    hFin = num2.getValue();

    hInicioAsig = hInicio;
    hFinAsig = hFin;

}

/**
     * Tabla de Recorrido
     */
function tabla_recorrido(num1, num2) {

    $.post("php/monitoreo/datos_ruta_grid.php", {
        idVeh: nUnidad,
        fechaIni:fInicio,
        horaIni: num1.getValue(),
        fechaFin: fFin,
        horaFin: num2.getValue()
    },
    function(data){
        var resultado = Ext.util.JSON.decode(data);
        var estado = resultado.success;
        if (estado) {
            var datos = resultado.datos.coordenadas;
            var filas =  datos.split("#");
            myData = new Array();
            for ( i=0; i<filas.length-1; i++ ) {
                var columnas = filas[i].split("%");
                myData[i] = columnas;
            }
            
            agregarTab("Rep. Ruta-");

        }else{
            Ext.MessageBox.show({
                title: 'Error...',
                msg: 'No hay un trazo posible en estas fechas y horas...',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}

/**
     * Grafica el Recorrido en el Mapa
     */
function graficar_recorrido_Map(num1, num2) {

    $.post("php/monitoreo/datos_ruta_mapa.php", {
        idVeh: nUnidad,
        fechaIni:fInicio,
        horaIni: num1.getValue(),
        fechaFin: fFin,
        horaFin: num2.getValue()
    },
    function(data){
        var resultado = Ext.util.JSON.decode(data);
        var estado = resultado.success;
        if (estado) {
            lienzosRecorridoHistorico(nameVh,resultado.datos.coordenadas);
        }else{
            Ext.MessageBox.show({
                title: 'Error...',
                msg: 'No hay un trazo posible en estas fechas y horas...',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }        
    });
}

/**
     * Estados del Software de Despachos
     */
function estados_software(num1, num2) {

    $.post("php/monitoreo/rpt_asignacion.php", {
        idCoop: idCoopP,
        idVeh: nUnidad,
        fechaIni:fInicio,
        horaIni: num1.getValue(),
        fechaFin: fFin,
        horaFin: num2.getValue()
    },
    function(data){
        var resultado = Ext.util.JSON.decode(data);

        var estado = resultado.success;
        if (estado) {
            var datos = resultado.datos.coordenadas;
            var filas =  datos.split("#");
            dataAsig = new Array();
            for ( i=0; i<filas.length-1; i++ ) {
                var columnas = filas[i].split("%");
                dataAsig[i] = columnas;
            }
            agregarTabAsig();
        }else{
            Ext.MessageBox.show({
                title: 'Error...',
                msg: 'No hay un trazo posible en estas fechas y horas...',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }      
    });
}