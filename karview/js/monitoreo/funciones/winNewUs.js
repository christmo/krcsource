
var newUsCntdWin;
var newUsWin;
var rolStore;

Ext.onReady(function(){

    Ext.QuickTips.init();

    //validación de cedula
    Ext.apply(Ext.form.VTypes, {
        cedValida: function(val, field) {

            if (val.length == 10) {
                if (check_cedula( val )) {
                    return true;
                }else{
                    return false;
                }
            }
            return true;        
        },
        cedValidaText: 'No es una cédula válida'
    });

    // Validación de mail. Permite que el campo este vacío
    var email = /^([\w\-\'\-]+)(\.[\w-\'\-]+)*@([\w\-]+\.){1,5}([A-Za-z]){2,4}$/;
    Ext.apply(Ext.form.VTypes, {
        emailD: function(val) {
            if (val.length != 0) {
                return email.test(val);
            }else{
                return true;
            }
        },
        emailDText: 'Mail no válido'
    });



    // Validación de Correspondencia de Claves
    Ext.apply(Ext.form.VTypes, {
        passC: function(val) {
            var valOrg = newUsCntdWin.getForm().findField('newUsCl').getValue();
            if (valOrg == val) {
                return true;
            }else{
                return false;
            }          
        },
        passCText: 'Contraseñas no coinciden'
    });


    //Store de Propietarios
    rolStore = new Ext.data.JsonStore({
        url: 'php/combos/rols.php',
        root: 'p',
        fields: [{
            name:'id'
        },{
            name:'name'
        }]
    });
   
    //Lista de Roles
    var newUsRolLst = new Ext.form.ComboBox({
        fieldLabel: 'Rol',
        store: rolStore,
        hiddenName: 'newUsRol',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Rol...',
        allowBlank:false,
        resizable:true,
        minListWidth:115,
        width:115,
        selectOnFocus:true,
        labelStyle:'padding-left:35px;width:10px;'
    });

    //txtNombres
    var newUsName = new Ext.form.TextField({
        fieldLabel:'Nombres',
        allowBlank:false,
        name:'newUsName',
        emptyText:'',
        id:"newUsName",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtApellidos
    var newUsApel = new Ext.form.TextField({
        fieldLabel:'Apellidos',
        allowBlank:false,
        name:'newUsApel',
        emptyText:'',
        id:"newUsApel",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtCedula
    var newUsCed = new Ext.form.NumberField({
        fieldLabel:'Cedula',
        allowBlank:false,
        name:'newUsCed',
        emptyText:'',
        id:"newUsCed",
        vtype:"cedValida",
        width:150,
        maxLength:10,
        maxLengthText:'Solo se permiten 10 caracteres',
        labelStyle:'padding-left:8px;width:10px;'
    });


    //DatePicker Fecha de Nacimiento
    var newUsFe = new Ext.form.DateField ({
        fieldLabel: 'F. Nac.',
        xtype:'datefield',
        format: 'Y-m-d', //YYYY-MMM-DD
        maxValue: new Date(),
        id: 'newUsFe',
        name: 'newUsFe',
        width:95,
        labelStyle:'padding-left:2px;'
    });

    //txtDireccion
    var newUsDir = new Ext.form.TextField({
        fieldLabel:'Direccion',
        allowBlank:false,
        name:'newUsDir',
        emptyText:'',
        id:"newUsDir",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtEmail
    var newUsEm = new Ext.form.TextField({
        fieldLabel:'Email',
        name:'newUsEm',
        emptyText:'',
        allowBlank:true,
        id:"newUsEm",
        vtype:'emailD',
        width:150 ,
        labelStyle:'padding-left:15px;width:10px;'
    });

    //txtFono1
    var newUsFn1 = new Ext.form.NumberField({
        fieldLabel:'Fono_1',
        name:'newUsFn1',
        emptyText:'',
        id:"newUsFn1",
        width:150,
        labelStyle:'padding-left:12px;width:10px;'
    });

    //txtFono2
    var newUsFn2 = new Ext.form.NumberField({
        fieldLabel:'Fono_2',
        name:'newUsFn2',
        emptyText:'',
        id:"newUsFn2",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtUsuario
    var newUsUs = new Ext.form.TextField({
        fieldLabel:'Usuario',
        allowBlank:false,
        name:'newUsUs',
        emptyText:'',
        id:"newUsUs",
        width:150,
        labelStyle:'padding-left:12px;width:10px;'
    });

    //txtClave
    var newUsCl = new Ext.form.TextField({
        fieldLabel:'Clave',
        allowBlank:false,
        minLength:4,
        minLengthText:'La clave debe tener almenos 4 caracteres',
        inputType: 'password',
        name:'newUsCl',
        emptyText:'',
        id:"newUsCl",
        width:125,
        labelStyle:'padding-left:20px;width:10px;'
    });

    //txtClave Validar
    var newUsClV = new Ext.form.TextField({
        fieldLabel:'Val Clave',
        allowBlank:false,
        inputType: 'password',
        name:'newUsClV',
        vtype:'passC',
        emptyText:'',
        id:"newUsClV",
        width:125
    });


    //Field para subir imagen
    var newUsImg = new Ext.ux.form.FileUploadField({
        emptyText: 'Máximo 5MB',
        fieldLabel: 'Fotogr',
        width:250,
        buttonText: 'Seleccionar',
        buttonConfig: {
            iconCls: 'upload-icon'
        },
        name: 'newUsImg',
        id: 'newUsImg',
        style: 'margin: 0 auto;'
        ,
        labelStyle:'padding-left:10px;width:10px;'
    });
    

    //Panel Contenedor Principal
    newUsCntdWin = new Ext.FormPanel({
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
                newUsName,
                newUsApel,
                newUsDir,
                newUsFn1]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                newUsCed,
                newUsFe,
                newUsEm,
                newUsFn2]
            }]
        },
        newUsImg
        ,{
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                newUsUs,
                newUsRolLst
                ]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                newUsCl,
                newUsClV
                ]
            }]
        }
        ],
        buttons: [ {
            text: 'Guardar',
            handler: function(){

                var isImg = 0;
                if (newUsImg.getValue().length >4) {
                    isImg = 1;
                }


                newUsCntdWin.getForm().submit({
                    url : 'php/monitoreo/usNew.php',
                    method:'POST',
                    params: {
                        i: isImg
                    },
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
                            msg: 'Usuario Creado',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.OK
                        });
                        newUsClean();
                    }
                });



            }
        },{
            text: 'Cancelar',
            handler: newUsClean
        }]
    });
});

/**
* Validador de Cedula
*/
function check_cedula( cedula )
{
    var array = cedula.split( "" );
    var num = array.length;
    if ( num == 10 )
    {
        var total = 0;
        var digito = (array[9]*1);
        for( i=0; i < (num-1); i++ )
        {
            var mult = 0;
            if ( ( i%2 ) != 0 ) {
                total = total + ( array[i] * 1 );
            }
            else
            {
                mult = array[i] * 2;
                if ( mult > 9 )
                    total = total + ( mult - 9 );
                else
                    total = total + mult;
            }
        }
        var decena = total / 10;
        decena = Math.floor( decena );
        decena = ( decena + 1 ) * 10;
        var finald = ( decena - total );
        if ( ( finald == 10 && digito == 0 ) || ( finald == digito ) ) {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

/* oculta la venta y limpia los datos no guardados */
function newUsClean(){

    newUsCntdWin.getForm().reset();
    if (newUsWin != null) {
        newUsWin.hide();
    }
    
}

function newUsWindow(){

    if(!newUsWin){
        // la ventana se crea una sola vez
        rolStore.load();
        newUsWin = new Ext.Window({
            layout:'fit',
            title:'Nuevo Usuario',
            resizable : false,
            width:500,
            height:280,
            closeAction:'hide',
            plain: true,
            items: [newUsCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }
    newUsWin.show(this);
}


