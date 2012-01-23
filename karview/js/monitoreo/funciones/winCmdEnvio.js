var cmdEnvCntdWin;
var cmdEnvWin;
var rolStore;

Ext.onReady(function(){

    //Lista de Vehiculos
    var cmdEnvVhLst = new Ext.form.ComboBox({
        fieldLabel: 'Vehic',
        store: cmbCompartido,
        hiddenName: 'idVhCmd',
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


    //txt Comando
    var cmdEnvText = new Ext.form.TextField({
        fieldLabel:'Comando',
        allowBlank:false,
        name:'cmdEnvTxt',
        emptyText:'',
        id:"cmdEnvTxt",
        width:200,
        minLength:3,
        minLengthText:"Comando inválido"
    });
   

    //Panel Contenedor Principal
    cmdEnvCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 320,
        items: [cmdEnvVhLst,cmdEnvText],
        buttons: [ {
            text: 'Enviar',
            handler: function(){

                console.warn("enviando ");

                Ext.MessageBox.confirm('Confirmar', 'Se va a enviar el CMD al equipo?',
                    function(opt){
                        if(opt == 'yes'){

                            cmdEnvCntdWin.getForm().submit({
                                url : 'php/monitoreo/envCmd.php',
                                method:'POST',
                                waitMsg : 'Enviando...',
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
                                        msg: 'Comando Enviado',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.OK
                                    });
                                    cmdEnvClean();
                                }
                            });

                        }
                    });
            }
        },{
            text: 'Cancelar',
            handler: cmdEnvClean
        }]
    });
});


function confirmarCmd(opt){
   
}

/* oculta la venta y limpia los datos no guardados */
function cmdEnvClean(){

    cmdEnvCntdWin.getForm().reset();
    if (cmdEnvWin != null) {
        cmdEnvWin.hide();
    }
    
}

function cmdEnvWindow(){

    if(!cmdEnvWin){
        cmdEnvWin = new Ext.Window({
            layout:'fit',
            title:'Enviar Comando',
            resizable : false,
            width:320,
            height:150,
            modal:true,
            closeAction:'hide',
            plain: true,
            items: [cmdEnvCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }
    cmdEnvWin.show(this);
}


