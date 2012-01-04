
var newUsCntdWin;
var newUsWin;
var rolStore;

Ext.onReady(function(){

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
        labelStyle:'padding-left:8px;width:10px;'
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
    var newUsCed = new Ext.form.TextField({
        fieldLabel:'Cedula',
        allowBlank:false,
        name:'newUsCed',
        emptyText:'',
        id:"newUsCed",
        width:150,
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
        fieldLabel:'e-mail',
        name:'newUsEm',
        emptyText:'',
        id:"newUsEm",
        width:150 ,
        labelStyle:'padding-left:2px;'
    });

    //txtFono1
    var newUsFn1 = new Ext.form.TextField({
        fieldLabel:'Fono_1',
        name:'newUsFn1',
        emptyText:'',
        id:"newUsFn1",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtFono2
    var newUsFn2 = new Ext.form.TextField({
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
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtClave
    var newUsCl = new Ext.form.TextField({
        fieldLabel:'Clave',
        allowBlank:false,
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
        emptyText:'',
        id:"newUsClV",
        width:125
        //,labelStyle:'padding-left:2px;width:10px;'
    });


    //Field para subir imagen
    var newUsImg = new Ext.ux.form.FileUploadField({
        emptyText: 'Seleccione una imagen',
        fieldLabel: 'Fotogr',
        width:220,
        buttonText: 'Seleccionar',
        buttonConfig: {
            iconCls: 'upload-icon'
        },
        name: 'newUsImg',
        id: 'newUsImg',
        style: 'margin: 0 auto;'
        ,labelStyle:'padding-left:10px;width:10px;'
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
            }
        },{
            text: 'Cancelar',
            handler: newUsClean
        }]
    });
});

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


