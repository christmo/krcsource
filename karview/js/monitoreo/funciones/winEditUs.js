
var editUsCntdWin;
var editUsWin;


Ext.onReady(function(){

    Ext.QuickTips.init();    

    // Validación de Correspondencia de Claves
    Ext.apply(Ext.form.VTypes, {
        passC: function(val) {
            var valOrg = editUsCntdWin.getForm().findField('editUsCl').getValue();
            if (valOrg == val) {
                return true;
            }else{
                return false;
            }          
        },
        passCText: 'Contraseñas no coinciden'
    });



    // Permitir clave vacía pero no menor a 4 caracteres.
    Ext.apply(Ext.form.VTypes, {
        passLeng: function(val) {
            if (val.length > 0 && val.length < 4) {
                return false;
            }else{
                return true;
            }
        },
        passLengText: 'Mínimo 4 caracteres'
    });



    //Store para paginación
    var rolStoreTest = new Ext.data.JsonStore({
        url: 'php/combos/userList.php',
        root: 'p',
        totalProperty: 't',
        idProperty: 'threadid',
        fields: [{
            name:'id'
        },{
            name:'ced'
        },{
            name:'name'
        }]
    });

    //toolBar de paginación
    var pgBar = new Ext.PagingToolbar({
        id:'pgBarGrid',
        pageSize: 5,
        afterPageText : "de {0}",
        beforePageText: "Pag",
        store: rolStoreTest,
        displayInfo: true,
        displayMsg: 'Mostrando {0} - {1} de {2}',
        emptyMsg: "No hay datos"
    });

    //Grid de usuarios con paginación
    var gridT = new Ext.grid.GridPanel({
        width:350,
        height:190,
        style: "padding:0px 0px 10px 0px;", //margin: 100px 40px 10px 70px;
        store: rolStoreTest,
        //groupable: false,
        trackMouseOver:false,
        selModel: new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),
        loadMask: true,

        //grid columns
        columns:[{
            dataIndex: 'id',
            hidden: true
        },{
            header: "<center>Cedula</center>",
            dataIndex: 'ced',
            width: 75,
            sortable: false,
            menuDisabled:true
        },{
            header: "<center>Apellidos / Nombres</center>",
            dataIndex: 'name',
            width: 270,
            sortable: false,
            menuDisabled:true
        }],
        // paging bar on the bottom
        bbar: pgBar,
        listeners: {
            rowclick:function(grid, rowIndex, e) {

                DisabledFields(false);

                var dataG = grid.getStore().getAt(rowIndex)
                //limpiar cajas
                editUsCntdWin.getForm().reset();
                //Mensaje de carga
                var waitUser = Ext.MessageBox.wait('Extrayendo datos...', 'Consultando');
                //Extraer data de vehiculo
                getInfoUser(dataG.get('id'), waitUser);
            //                setReadOnlyCmps(false);
            }
        }
    });

    // trigger the data store load
    rolStoreTest.load({
        params:{
            start:0,
            limit:5
        }
    });

   
    //Lista de Roles
    var editUsRolLst = new Ext.form.ComboBox({
        id:'editUsRolLst',
        fieldLabel: 'Rol',
        store: rolStore,
        hiddenName: 'editUsRol',
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
    var editUsName = new Ext.form.TextField({
        fieldLabel:'Nombres',
        allowBlank:false,
        name:'editUsName',
        emptyText:'',
        id:"editUsName",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtApellidos
    var editUsApel = new Ext.form.TextField({
        fieldLabel:'Apellidos',
        allowBlank:false,
        name:'editUsApel',
        emptyText:'',
        id:"editUsApel",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtCedula
    var editUsCed = new Ext.form.NumberField({
        fieldLabel:'Cedula',
        name:'editUsCed',
        emptyText:'',
        id:"editUsCed",
        vtype:"cedValida",
        readOnly:true,
        width:150,
        maxLength:10,
        maxLengthText:'Solo se permiten 10 caracteres',
        labelStyle:'padding-left:8px;width:10px;'
    });


    //DatePicker Fecha de Nacimiento
    var editUsFe = new Ext.form.DateField ({
        fieldLabel: 'F. Nac.',
        xtype:'datefield',
        format: 'Y-m-d', //YYYY-MMM-DD
        maxValue: new Date(),
        id: 'editUsFe',
        name: 'editUsFe',
        width:95,
        labelStyle:'padding-left:2px;'
    });

    //txtDireccion
    var editUsDir = new Ext.form.TextField({
        fieldLabel:'Direccion',
        allowBlank:false,
        name:'editUsDir',
        emptyText:'',
        id:"editUsDir",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtEmail
    var editUsEm = new Ext.form.TextField({
        fieldLabel:'Email',
        name:'editUsEm',
        emptyText:'',
        allowBlank:true,
        id:"editUsEm",
        vtype:'emailD',
        width:150 ,
        labelStyle:'padding-left:15px;width:10px;'
    });

    //txtFono1
    var editUsFn1 = new Ext.form.NumberField({
        fieldLabel:'Fono_1',
        name:'editUsFn1',
        emptyText:'',
        id:"editUsFn1",
        width:150,
        labelStyle:'padding-left:12px;width:10px;'
    });

    //txtFono2
    var editUsFn2 = new Ext.form.NumberField({
        fieldLabel:'Fono_2',
        name:'editUsFn2',
        emptyText:'',
        id:"editUsFn2",
        width:150,
        labelStyle:'padding-left:8px;width:10px;'
    });

    //txtUsuario
    var editUsUs = new Ext.form.TextField({
        fieldLabel:'Usuario',
        allowBlank:false,
        name:'editUsUs',
        emptyText:'',
        id:"editUsUs",
        width:150,
        labelStyle:'padding-left:12px;width:10px;'
    });

    //txtClave
    var editUsCl = new Ext.form.TextField({
        fieldLabel:'Clave',
        //minLength:4,
        //minLengthText:'La clave debe tener almenos 4 caracteres',
        vtype:'passLeng',
        inputType: 'password',
        name:'editUsCl',
        emptyText:'',
        id:"editUsCl",
        width:125,
        labelStyle:'padding-left:20px;width:10px;'
    });

    //txtClave Validar
    var editUsClV = new Ext.form.TextField({
        fieldLabel:'Val Clave',
        //allowBlank:false,
        inputType: 'password',
        name:'editUsClV',
        vtype:'passC',
        emptyText:'',
        id:"editUsClV",
        width:125
    });


    //Field para subir imagen
    var editUsImg = new Ext.ux.form.FileUploadField({
        emptyText: 'Máximo 5MB',
        fieldLabel: 'Fotogr',
        width:250,
        buttonText: 'Seleccionar',
        buttonConfig: {
            iconCls: 'upload-icon'
        },
        name: 'editUsImg',
        id: 'editUsImg',
        style: 'margin: 0 auto;'
        ,
        labelStyle:'padding-left:10px;width:10px;'
    });


    //Boton de Eliminar
    var btnElimUs = new Ext.Button({
        text: 'Eliminar',
        handler: function() {
            var itemsSelectGrid = gridT.getSelectionModel().getSelections();
            Ext.iterate(itemsSelectGrid, function(banner, index) {
                var idVhGrid = gridT.getStore().getAt(gridT.getStore().indexOf(banner)).get('id')
                delUser(idVhGrid);
            });
        },
        id: 'btnElimUs',
        name: 'btnElimUs'
    });

    //Boton de Guardar
    var btnGuarUs = new Ext.Button({
        text: 'Guardar',
        handler: function() {

            var idS = -1;
            var itemsSelectGrid = gridT.getSelectionModel().getSelections();
            Ext.iterate(itemsSelectGrid, function(banner, index) {
                idS = gridT.getStore().getAt(gridT.getStore().indexOf(banner)).get('id')
            });

            editUsCntdWin.getForm().submit({
                url : 'php/monitoreo/updUser.php',
                method:'POST',
                params :{
                    id:idS
                },
                waitTitle: 'Espere por favor',
                waitMsg : 'Guardando Cambios...',
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
                        msg: 'Usuario Modificado',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK
                    });
                    editUsCntdWin.getForm().reset();
                    pgBar.doRefresh();


                }
            });
        },
        id: 'btnGuarUs',
        name: 'btnGuarUs'
    });

    //Panel Contenedor Principal
    editUsCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        labelWidth:60,
        bodyStyle:'padding:5px 5px 0',
        fileUpload:true,
        width: 400,
       
        items: [
        {
            layout:'hbox',
            layoutConfig: {
                padding:'5',
                pack:'center',
                align:'middle'
            },
            items:[ gridT ]
        },

        {
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                editUsName,
                editUsApel,
                editUsDir,
                editUsFn1]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                editUsCed,
                editUsFe,
                editUsEm,
                editUsFn2
                ]
            }
            ]
        },
        editUsImg,
        {
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                editUsUs,
                editUsRolLst
                ]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                editUsCl,
                editUsClV
                ]
            }
            ]
        }
        ],
        buttons: [ {
            text: 'OK',
            handler: editUsClean
        }, btnGuarUs, btnElimUs]
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
function editUsClean(){

    editUsCntdWin.getForm().reset();
    if (editUsWin != null) {
        editUsWin.hide();
    }
    
}

function editUsWindow(){


    if(!editUsWin){
        // la ventana se crea una sola vez
        rolStore.load();
        editUsWin = new Ext.Window({
            layout:'fit',
            title:'Usuarios',
            resizable : false,
            width:470,
            height:470, //465
            modal : true,
            closeAction:'hide',
            plain: true,
            items: [editUsCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }
    DisabledFields(true);
    editUsWin.show(this);
}

/**
 * Extrae información de un determinado usuario
 **/
function getInfoUser(idVh, waitD) {
    Ext.Ajax.request({
        url: 'php/monitoreo/getDataUs.php',
        method: 'POST',
        params :{
            v:idVh
        },
        success: function(response){
            waitD.hide();
            var resultado = Ext.util.JSON.decode(response.responseText);
            var info = resultado.d;
            if (info != undefined) {
                var formLocal = editUsCntdWin.getForm();

                editUsCntdWin.getForm().reset();

                for(var i in resultado.d){
                    var reg = resultado.d[i];
                    if (reg.a != undefined && reg.b  != undefined && reg.c  != undefined
                        && reg.d  != undefined && reg.e  != undefined && reg.f  != undefined
                        && reg.g  != undefined && reg.h  != undefined && reg.i  != undefined
                        && reg.j  != undefined && reg.k  != undefined) {
                        formLocal.findField('editUsCed').setValue(reg.a);
                        formLocal.findField('editUsName').setValue(reg.b);
                        formLocal.findField('editUsApel').setValue(reg.c);
                        formLocal.findField('editUsDir').setValue(reg.d);
                        formLocal.findField('editUsEm').setValue(reg.e);
                        formLocal.findField('editUsImg').setValue(reg.f);
                        formLocal.findField('editUsFe').setValue(reg.g);
                        formLocal.findField('editUsFn1').setValue(reg.h);
                        formLocal.findField('editUsFn2').setValue(reg.i);
                        formLocal.findField('editUsUs').setValue(reg.j);
                        formLocal.findField('editUsRolLst').setValue(reg.k);
                    }
                }
            }
        },
        failure: function(){
            waitD.hide();
            Ext.MessageBox.show({
                title: 'Problemas',
                msg: 'No se pudo extraer información del Vehiculo',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}

/**
 * Elimina (marca) un vehiculo
 * en base a su ID de Equipo
 */
function delUser(idUs) {

    Ext.MessageBox.confirm("Confirmar","Esto borrará el usuario del sistema.",
        function(btn){
            if(btn == 'yes'){

                var waitConfirm = Ext.MessageBox.wait('Confirmando...', 'Eliminando');

                Ext.Ajax.request({
                    url: 'php/monitoreo/delUser.php',
                    method: 'POST',
                    params :{
                        v:idUs
                    },
                    success: function(response){

                        waitConfirm.hide();

                        var resultado = Ext.util.JSON.decode(response.responseText);
                        var info = resultado.d;

                        if (info != undefined) {
                            Ext.MessageBox.show({
                                title: 'Problemas',
                                msg: info,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }else{
                            Ext.getCmp('pgBarGrid').doRefresh();
                            editUsCntdWin.getForm().reset();
                            DisabledFields(true);
                            Ext.MessageBox.show({
                                title: 'Correcto',
                                msg: 'Vehiculo Eliminado',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.OK
                            });
                        }
                    },
                    failure: function(){
                        waitConfirm.hide();
                        Ext.MessageBox.hide();
                        Ext.MessageBox.show({
                            title: 'Problemas',
                            msg: 'No se pudo eliminar el Vehiculo',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                });
            }
        });
}

/**
 * Disable - Enable fields
 */
function DisabledFields(param) {
    var formLocal = editUsCntdWin.getForm();
    formLocal.findField('editUsCed').setDisabled(param);
    formLocal.findField('editUsName').setDisabled(param);
    formLocal.findField('editUsApel').setDisabled(param);
    formLocal.findField('editUsDir').setDisabled(param);
    formLocal.findField('editUsEm').setDisabled(param);
    formLocal.findField('editUsImg').setDisabled(param);
    formLocal.findField('editUsFe').setDisabled(param);
    formLocal.findField('editUsFn1').setDisabled(param);
    formLocal.findField('editUsFn2').setDisabled(param);
    formLocal.findField('editUsUs').setDisabled(param);
    formLocal.findField('editUsRolLst').setDisabled(param);
    formLocal.findField('editUsCl').setDisabled(param);
    formLocal.findField('editUsClV').setDisabled(param);

    Ext.getCmp('btnGuarUs').setDisabled(param);
    Ext.getCmp('btnElimUs').setDisabled(param);

}
