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
        fieldLabel:'Manual',
        allowBlank:false,
        disabled: true,
        name:'cmdEnvTxt',
        emptyText:'',
        id:"cmdEnvTxt",
        width:200,
        minLength:3,
        minLengthText:"Comando inválido"
    });

    // store comandos predefinidos
    var strCmdPredef;
    strCmdPredef = new Ext.data.JsonStore({
        url:'php/combos/cmdPredf.php',
        root: 'p',
        fields: [{
            name:'id'
        },{
            name:'name'
        }]
    });
    strCmdPredef.load();


    //Lista de Comandos Predefinidos
    var cmdEnvPredef = new Ext.form.ComboBox({
        fieldLabel: 'Predf ',
        store: strCmdPredef,
        hiddenName: 'idCmd',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Comando...',
        allowBlank:false,
        resizable:true,
        width:200,
        selectOnFocus:true,
        labelStyle:'padding-left:width:10px;'
    });
    

    var rbTipoCmd = new Ext.form.RadioGroup({
        fieldLabel: 'Tipo CMD',
        columns: 2,
        defaultType: 'radio',
        items: [
        {
            boxLabel: 'Manual',
            name: 'groupBtn',
            inputValue: 'cc',            
            listeners: {
                check: function (ctl, val) {
                    if (val) {
                        cmdEnvPredef.setDisabled(true);
                        cmdEnvText.setDisabled(false);
                    }
                }
            }
        },
        {
            boxLabel: 'Predefinido',
            name: 'groupBtn',
            inputValue: 'bb',
            checked: true,
            listeners: {
                check: function (ctl, val) {
                    if (val) {
                        cmdEnvPredef.setDisabled(false);
                        cmdEnvText.setDisabled(true);
                    }
                }
            }
        }
        ]
    });


    

    //Panel Contenedor Principal
    cmdEnvCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 320,
        items: [cmdEnvVhLst,rbTipoCmd,cmdEnvPredef,cmdEnvText],
        buttons: [ {
            text: 'Enviar',
            handler: function(){

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
            height:250,
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


