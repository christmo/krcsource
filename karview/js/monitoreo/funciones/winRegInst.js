
var regInsCntdWin;
var regInsWin;
var rolStore;

Ext.onReady(function(){

    //Lista de Vehiculos
    var regInsVhLst = new Ext.form.ComboBox({
        fieldLabel: 'Vehic',
        store: linkVhec,
        hiddenName: 'idVhInst',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Vehiculo...',
        allowBlank:false,
        resizable:true,
        width:200,
        selectOnFocus:true,
        labelStyle:'padding-left:15px;width:10px;'
    });


    // operadoras
    var datos = [['1', 'Claro'],['2', 'Movistar'],['3', 'Alegro']];
    var storeD = new Ext.data.ArrayStore({
        fields: ['id', 'name'],
        data : datos
    });
  
    //Lista de Operadoras
    var regInsOp = new Ext.form.ComboBox({
        fieldLabel: 'Oper',
        store: storeD,
        hiddenName: 'regInsOp',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Operadora...',
        allowBlank:false,
        resizable:false,
        width:90,
        selectOnFocus:true
        ,
        labelStyle:'padding-left:15px;width:10px;'
    });

    //txt Num Chip
    var regInsChip = new Ext.form.NumberField({
        fieldLabel:'Chip #',
        allowBlank:false,
        name:'regInsChip',
        emptyText:'',
        id:"regInsChip",
        maxLength:13,
        maxLengthText:'Revise el número',
        width:110
        ,
        labelStyle:'padding-left:10px;'
    });

    //txt Tecnico Instalador
    var regInsTec = new Ext.form.TextField({
        fieldLabel:'Técnico',
        allowBlank:false,
        name:'regInsTec',
        emptyText:'',
        id:"regInsTec",
        width:250
    //,labelStyle:'padding-left:8px;width:10px;'
    });

    //txt IMEI
    var regInsIMEI = new Ext.form.NumberField({
        fieldLabel:'IMEI',
        allowBlank:false,
        name:'regInsIMEI',
        emptyText:'',
        id:"regInsIMEI",
        width:150,
        maxLength:10,
        maxLengthText:'Solo se permiten 10 caracteres'
        ,
        labelStyle:'padding-left:25px;width:10px;'
    });


    //txt Num Cel
    var regInsCel = new Ext.form.NumberField({
        fieldLabel:'# Cel',
        allowBlank:false,
        name:'regInsCel',
        emptyText:'',
        id:"regInsCel",
        width:150,
        minLength:7,
        minLengthText:'Revise el número',
        maxLength:9,
        maxLengthText:'Solo se permiten 10 caracteres'
        ,
        labelStyle:'padding-left:0px; ' //width:20px;
    });

    //txt Lugar Instalación
    var regInsLug = new Ext.form.TextField({
        fieldLabel:'Lug. Inst',
        allowBlank:false,
        name:'regInsLug',
        emptyText:'',
        id:"regInsLug",
        width:150
    //,labelStyle:'padding-left:8px;width:10px;'
    });

    //txt Observacion
    var regInsObs = new Ext.form.TextArea({
        fieldLabel:'Observ',
        name:'regInsObs',
        emptyText:'',
        allowBlank:true,
        id:"regInsObs",
        width:380
    });

    

    //Panel Contenedor Principal
    regInsCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 400,
        items: [
        {
            layout:'column',
            items:[
            {
                columnWidth:.6,
                layout: 'form',
                items: [regInsVhLst]
            },
            {
                columnWidth:.4,
                layout: 'form',
                items: [regInsChip]
            }]
        }, regInsTec,
        {
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [regInsOp,regInsCel]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [regInsIMEI,regInsLug]
            }]
        }, regInsObs
        ],
        buttons: [ {
            text: 'Guardar',
            handler: function(){
            /*
                var isImg = 0;
                if (regInsImg.getValue().length >4) {
                    isImg = 1;
                }

*/
                regInsCntdWin.getForm().submit({
                    url : 'php/monitoreo/regInst.php',
                    method:'POST',
                    waitMsg : 'Guardando...',
                    failure: function (form, action) {

                        if (action.response != undefined) {
                            var resultado = Ext.util.JSON.decode(action.response.responseText);
                            var data = resultado.d;
                        
                            Ext.MessageBox.show({
                                title: 'Atencion',
                                msg: data,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    },
                    success: function (form, action) {                        

                        Ext.MessageBox.show({
                            title: 'Correcto',
                            msg: 'Datos Guardados',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.OK
                        });
                        regInsClean();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: regInsClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function regInsClean(){

    regInsCntdWin.getForm().reset();
    if (regInsWin != null) {
        regInsWin.hide();
    }
    
}

function regInsWindow(){

    if(!regInsWin){
        regInsWin = new Ext.Window({
            layout:'fit',
            title:'Registro Instalación',
            resizable : false,
            width:500,
            height:280,
            modal:true,
            closeAction:'hide',
            plain: true,
            items: [regInsCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }
    regInsWin.show(this);
}


