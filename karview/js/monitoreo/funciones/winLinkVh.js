
var linkVhCntdWin;
var linkVhWin;
var linkVhec;

var linkVhUsersAll;
var linkVhUsersAct;

Ext.onReady(function(){

    //Store de Vehiculos
    linkVhec = new Ext.data.JsonStore({
        url: 'php/combos/vehicList.php',
        root: 'p',
        fields: [{
            name:'id'
        },{
            name:'name'
        }]
    });
    linkVhec.load();


    //Store Usuarios NO seleccionados
    linkVhUsersAll = new Ext.data.JsonStore({
        url: 'php/combos/perListAll.php',
        baseParams:{
            idvh:999,
            std:1
        },
        root: 'd',
        fields: [{
            name:'value'
        },{
            name:'text'
        }]
    });

    //Store usuarios Seleccionados
    linkVhUsersAct = new Ext.data.JsonStore({
        url: 'php/combos/perListAll.php',
        baseParams:{
            idvh:999,
            std:0
        },
        root: 'd',
        fields: [{
            name:'value'
        },{
            name:'text'
        }]
    });

    
    //Lista de Vehiculos
    var linkVhList = new Ext.form.ComboBox({
        fieldLabel: ' Vehic. ',
        store: linkVhec,
        hiddenName: 'linkVhList',
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        disabled: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Seleccionar Vehiculo...',
        allowBlank:false,
        resizable:true,
        minListWidth:250,
        selectOnFocus:true,
        listeners:{
            select: function(cmb,record,index){
                linkVhUsersAll.baseParams.idvh = record.get('id');
                linkVhUsersAll.reload();

                linkVhUsersAct.baseParams.idvh = record.get('id');
                linkVhUsersAct.reload();
            }
        }
    });


    var itemsLinkVh = new Ext.ux.form.ItemSelector({
        xtype: 'itemselector',
        name: 'itemsLinkVh',
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
            legend: 'Propietarios',
            store: linkVhUsersAll,
            displayField: 'text',
            valueField: 'value'

        },{
            width: 180,
            height: 150,
            legend: 'Seleccionados',
            store: linkVhUsersAct,
            displayField: 'text',
            valueField: 'value',
            tbar:[{
                text: 'vaciar',
                handler:function(){
                    itemsLinkVh.reset();
                }
            }]
        }]
    });
    

    //Panel Contenedor Principal
    linkVhCntdWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 400,
        items: [        
        linkVhList, itemsLinkVh
        ],
        buttons: [ {
            text: 'Guardar',
            handler: function(){
                linkVhCntdWin.getForm().submit({
                    url : 'php/monitoreo/linkVhc.php',
                    method:'POST',
                    waitMsg : 'Guardando...',
                    failure: function (form, action) {
                        
                        Ext.MessageBox.show({
                            title: 'Problemas',
                            msg: 'No se pudo vincular el Vehiculo',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                        
                    },
                    success: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Correcto',
                            msg: 'Vehiculo Vinculado',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.OK
                        });
                        linkVhClean();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: linkVhClean
        }]
    });
});

/**
 * oculta la venta y
 * limpia los datos no guardados
 **/
function linkVhClean(){

    linkVhCntdWin.getForm().reset();
    if (linkVhWin != null) {
        linkVhWin.hide();
    }

    //vaciar ambos stores
    if (linkVhUsersAll != null) {
        linkVhUsersAll.removeAll();
    }
    if (linkVhUsersAct!= null) {
        linkVhUsersAct.removeAll();
    }
}

function linkVhWindow(){

    if(!linkVhWin){
        linkVhWin = new Ext.Window({
            layout:'fit',
            title:'Vincular Vehic.',
            resizable : false,
            width:500,
            height:300,
            closeAction:'hide',
            plain: true,
            items: [linkVhCntdWin],
            listeners: {
                hide:function(f) {
                    
                }
            }
        });
    }
    //vaciar ambos stores
    if (linkVhUsersAll != null) {
        linkVhUsersAll.removeAll();
    }
    if (linkVhUsersAct!= null) {
        linkVhUsersAct.removeAll();
    }
    linkVhWin.show(this);
}


