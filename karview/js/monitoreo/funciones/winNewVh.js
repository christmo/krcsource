
var newVhCntdWin;
var newVhWin;
var newVhProp;

var g1IdVehcPuntos;
//paramReporte
var g1Vehiculo;
var g1NumVehc;
//store Geocercas
var g1StoreGeo;

Ext.onReady(function(){

    //Store de Propietarios
    newVhProp = new Ext.data.JsonStore({
        url: 'php/combos/vhPropt.php',
        root: 'p',
        fields: [{
            name:'id'
        },{
            name:'name'
        }]
    });
    newVhProp.load();

    //Lista de Propietarios
    var newVhPropLst = new Ext.form.ComboBox({
        fieldLabel: ' Propt ',
        store: newVhProp,
        hiddenName: 'newVhPropLst',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Seleccionar Propietario...',
        allowBlank:false,
        resizable:true,
        minListWidth:250,
        selectOnFocus:true
    });

    //txtPlaca
    var newVhPlaca = new Ext.form.TextField({
        fieldLabel:'Placa',
        name:'newVhPlc',
        emptyText:'',
        id:"newVhPlc",
        width:80,
        labelStyle:'padding-left:10px;width:10px;'
    });

    //txtModelo
    var newVhMdl = new Ext.form.TextField({
        fieldLabel:'Modelo',
        name:'newVhMdl',
        emptyText:'',
        id:"newVhMdl",
        width:150
    });

    //txtMarca
    var newVhMrc = new Ext.form.TextField({
        fieldLabel:'Marca',
        name:'newVhMrc',
        emptyText:'',
        id:"newVhMrc",
        width:150
    });

    //txtSeudonimo
    var newVhpsd = new Ext.form.TextField({
        fieldLabel:'Alias',
        name:'newVhpsd',
        emptyText:'',
        id:"newVhpsd",
        width:150
    });

    //txtInfoAdicional
    var newVhInfAdc = new Ext.form.TextArea({
        fieldLabel:'Info',
        name:'newVhInfAdc',
        emptyText:'',
        id:"newVhInfAdc",
        width:350,
        height: 55
    });

    //Spinner Año
    var newVhAn = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Año',
        name: 'newVhAn',
        value: 2011,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:2011,
            maxValue:2120,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:55
    });

    //Spinner Num Vehiculo
    var newVhNumV = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Num Vh',
        name: 'newVhNumV',
        value: 1,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:1,
            maxValue:999,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:50
    });

    //Spinner Id Equipo
    var newVhidEqp = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Id Eqp',
        name: 'newVhidEqp',
        value: 1,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:1,
            maxValue:9999,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:55
    });

    //Field para subir imagen
    var newVhImg = new Ext.ux.form.FileUploadField({
        emptyText: 'Seleccione una imagen .png',
        fieldLabel: 'Icono Vh',
        width:220,
        buttonText: 'Seleccionar',
        buttonConfig: {
            iconCls: 'upload-icon'
        },
        name: 'newVhImg',
        allowBlank: false,
        id: 'newVhImg',
        style: 'margin: 0 auto;'
    });
    

    //Panel Contenedor Principal
    newVhCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        fileUpload:true,
        labelWidth:60,
        width: 400,
        items: [
        {
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                newVhPropLst,
                newVhMdl,
                newVhMrc,
                newVhpsd
                
                ]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                newVhPlaca,
                newVhAn,
                newVhNumV,
                newVhidEqp
                ]
            }]
        }, newVhImg, newVhInfAdc
        ],
        buttons: [ {
            text: 'Guardar',
            handler: function(){
                newVhCntdWin.getForm().submit({
                    url : 'php/monitoreo/vhProptNew.php',
                    method:'POST',
                    waitMsg : 'Guardando...',
                    failure: function (form, action) {

                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        Ext.MessageBox.show({
                            title: 'Problemas',
                            msg: resultado.d,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Correcto',
                            msg: 'Vehiculo Creado',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.OK
                        });
                        newVhClean();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: newVhClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function newVhClean(){

    newVhCntdWin.getForm().reset();
    if (newVhWin != null) {
        newVhWin.hide();
    }
    
}

function newVhWindow(){

    if(!newVhWin){
        newVhWin = new Ext.Window({
            layout:'fit',
            title:'Nuevo Vehiculo',
            resizable : false,
            width:500,
            height:300,
            closeAction:'hide',
            plain: true,
            items: [newVhCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }    
    newVhWin.show(this);
}


