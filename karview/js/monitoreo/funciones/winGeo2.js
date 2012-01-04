var g2ContenedorWin;
var g2Win;
var g2IdVehcPuntos;

//paramReporte
var g2Vehiculo;
var g2NumVehc;
var vertPolygon = '';
var g2Area;

var trazando = 0;

Ext.onReady(function(){

    //Area de la GeoCerca
    g2Area = new Ext.form.TextField({
        name:'g2Area',
        id:"g2Area",
        width:100,
        readOnly: true
    });

    //funcional
    var g2Name = new Ext.form.TextField({
        fieldLabel:'Nombre',
        name:'g2Name',
        emptyText:'',
        id:"g2Name",
        width:150,
        allowBlank:false
    });

    //Campo oculto para coordenadasGeocerca
    var g2Coord = new Ext.form.Hidden({
        name:'g2Coord',
        id:"g2Coord",
        value:""
    });

    //funcional
    var g2Desc = new Ext.form.TextArea({
        fieldLabel:'Descripción',
        name:'g2Desc',
        emptyText:'',
        id:"g2Desc",
        width:150,
        allowBlank:false
    });

    //Indicador de carga de GeoCerca
    var lbl = new Ext.form.Label({
        text:'*',
        height: 15
    });

    //Boton para trazar GeoCerca (mapa)
    var g2Btn1 = new Ext.Button({
        text: 'Trazar GeoCerca',
        handler: function() {
            trazando = 1;
            g2Win.hide();
            estadoControlD("polygon");
            lbl.setText(""); // indica que ha sido cargada la geoCerca
        },
        id: 'g2Btn1'
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
    var g2Data = new Ext.ux.form.ItemSelector({
        xtype: 'itemselector',
        name: 'g2VehList',
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
                    g2Data.reset();
                }
            }]
        }]
    });

    //Panel Contenedor Principal
    g2ContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,
        items: [
        g2Name,
        {
            layout:'column',
            items:[{
                columnWidth:.7,
                layout: 'form',
                items:[g2Desc]
            },lbl,
            {
                items:[ g2Btn1, g2Coord, g2Area ]
            }]
        },
        g2Data],
        buttons: [ {
            text: 'Guardar',
            handler: function() {

                if (g2Data.getValue()=='') {
                    Ext.MessageBox.show({
                        title: 'Sin Vehiculos',
                        msg: 'Debe vincular almenos un vehículo',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return;
                }


                if (vertPolygon != '') {
                    g2Coord.setValue(vertPolygon);

                    g2ContenedorWin.getForm().submit({
                        url : 'php/monitoreo/geoNew.php',
                        method:'POST',
                        waitMsg : 'Guardando...',
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Problemas',
                                msg: 'No se puede guardar la Geocerca',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function (form, action) {
                            auxStore.load();
                            lienzoGeoCercas.destroyFeatures();
                            Ext.MessageBox.show({
                                title: 'Correcto',
                                msg: 'GeoCerca guardada',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.OK
                            });
                            g2Clean();
                        
                        }
                    });
                    vertPolygon = '';
                }else{
                    Ext.MessageBox.show({
                        title: 'Sin Geocerca',
                        msg: 'Aún no traza la GeoCerca',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }

            }
        },{
            text: 'Cancelar',
            handler: g2Clean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function g2Clean(){
    lienzoGeoCercas.destroyFeatures();
    vertPolygon = '';
    g2ContenedorWin.getForm().reset();
    if (g2Win != null) {
        g2Win.hide();
    }
    
}

function g2Window(){
    if(!g2Win){
        g2Win = new Ext.Window({
            layout:'fit',
            title:'Nueva Geocerca',
            resizable : false,
            width:500,
            height:325,
            closeAction:'hide',
            plain: true,
            items: [g2ContenedorWin],
            listeners: {
                hide:function(f) {
                    if (trazando != 1) {
                        lienzoGeoCercas.destroyFeatures();
                    }
                }
            }
        });
    }
    g2Win.show(this);
}