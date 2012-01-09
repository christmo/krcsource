
var edVhContenedorWin;
var edVhWin;
var edVhIdVehcPuntos;
//paramReporte
var edVhVehiculo;
var edVhNumVehc;
//store Geocercas
var edVhStoreGeo;

var btnElim;
var btnAct;

Ext.onReady(function(){

    //Grid Geocercas
    var edVhGrid = new Ext.grid.GridPanel({
        store: cmbCompartido,
        title: "Vehiculos",
        columns: [
        {
            id:'idVh',
            hiden: true,
            dataIndex: 'id'
        },
        {
            id:'nameVh',
            width: 250,
            sortable: false,
            dataIndex: 'name'
        }
        ],
        selModel: new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),
        autoScroll:true,
        height: 200,
        width: 182,
        stateful: true,
        stateId: 'edVhGrid',
        listeners: {
            rowclick:function(grid, rowIndex, e) {
                var dataG = grid.getStore().getAt(rowIndex)
                //limpiar cajas
                edVhContenedorWin.getForm().reset();
                //Extraer data de vehiculo
                getInfoVeh(dataG.get('id'));
                //Id Equipo
                edVhContenedorWin.getForm().findField('edVhEqp').setValue(dataG.get('id'));
                setReadOnlyCmps(false);
            }
        }
    });
    //oculta la primer columna
    edVhGrid.getColumnModel().setHidden(0, true);


    //Placa
    var edVhPlaca = new Ext.form.TextField({
        fieldLabel:'Placa',
        name:'edVhPlaca',
        emptyText:'',
        id:"edVhPlaca",
        width:150,
        allowBlank:false,
        labelStyle:'padding-left:20px;width:10px;'
    });
    
    //Modelo
    var edVhModel = new Ext.form.TextField({
        fieldLabel:'Modelo',
        name:'edVhModel',
        emptyText:'',
        id:"edVhModel",
        width:118,
        allowBlank:false,
        labelStyle:'padding:0px 0px 0px 10px;width:10px;'
    });

    //Marca
    var edVhMarca = new Ext.form.TextField({
        fieldLabel:'Marca',
        name:'edVhMarca',
        emptyText:'',
        id:"edVhMarca",
        width:150,
        allowBlank:false,
        labelStyle:'padding-left:20px;width:10px;'
    });

    //Alias
    var edVhAlias = new Ext.form.TextField({
        fieldLabel:'Alias',
        name:'edVhAlias',
        emptyText:'',
        id:"edVhAlias",
        width:150,
        allowBlank:false,
        labelStyle:'padding-left:20px;width:10px;'
    });

    //Infor Adicional
    var edVhInfo = new Ext.form.TextArea({
        fieldLabel:'Info',
        name:'edVhInfo',
        emptyText:'',
        id:"edVhInfo",
        width:275,
        labelStyle:'padding:0px 10px 0px 20px;width:10px;'
    });

    //Spinner Año
    var edVhAn = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Año',
        name: 'edVhAn',
        value: 2011,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:1900,
            maxValue:2120,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:55,
        labelStyle:'padding:0px 0px 0px 22px;width:10px;'
    });


    //Spinner Numero Vehiculo
    var edVhNum = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'Num',
        name: 'edVhNum',
        value: 1,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:1,
            maxValue:999,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:55
        ,
        labelStyle:'padding:0px 0px 0px 22px;width:10px;'
    });

    //Spinner ID equipo
    var edVhEqp = new Ext.ux.form.Spinner(
    {
        fieldLabel: 'IdEqp',
        name: 'edVhEqp',
        value: 1,
        readOnly: true,
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:1,
            maxValue:999,
            incrementValue:1,
            alternateIncrementValue:10
        }),
        allowBlank:false,
        emptyText:'',
        width:55
        ,
        labelStyle:'padding:0px 0px 0px 15px;width:10px;'
    });



    //Lista de Propietarios
    var edVhPropLst = new Ext.form.ComboBox({
        fieldLabel: 'Propt',
        store: newVhProp,
        hiddenName: 'edVhPropLst',
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
        selectOnFocus:true,
        labelStyle:'padding-left:20px;width:10px;'
    });

    //Field para subir imagen
    var edVhImg = new Ext.ux.form.FileUploadField({
        emptyText: 'Seleccione una imagen .png',
        fieldLabel: 'Icono',
        width:220,
        buttonText: 'Cambiar',
        name: 'edVhImg',
        allowBlank: false,
        id: 'edVhImg',
        style: 'margin: 0 auto;',
        labelStyle:'padding-left:20px;width:10px;'
    });

    //Boton de Eliminar
    btnElim = new Ext.Button({
        text: 'Eliminar',
        handler: function() {
            var itemsSelectGrid = edVhGrid.getSelectionModel().getSelections();
            Ext.iterate(itemsSelectGrid, function(banner, index) {
                var idVhGrid = edVhGrid.getStore().getAt(edVhGrid.getStore().indexOf(banner)).get('id')
                delVehic(idVhGrid);
            });
        },
        id: 'btnElim',
        style: 'padding:10px 0px 0px 0px;'
    });

    //Boton de Actualizar
    btnAct = new Ext.Button({
        text: 'Actualizar',
        handler: function() {
            edVhContenedorWin.getForm().submit({
                url : 'php/monitoreo/updVehc.php',
                method:'POST',
                waitMsg : 'Actualizando Vehiculo',
                failure: function (form, action) {

                    if (action.response != undefined) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        Ext.MessageBox.show({
                            title: 'Problemas',
                            msg: resultado.d,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                success: function (form, action) {

                    Ext.MessageBox.show({
                        title: 'Correcto',
                        msg: 'Vehiculo Modificado',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK
                    });
                    edVhContenedorWin.getForm().reset();
                    setReadOnlyCmps(true);
                }
            });
        },
        id: 'btnAct'
    });

    //Panel Contenedor Principal
    edVhContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        fileUpload:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 650,
        items:
        [{
            layout:'column',
            items:[{
                columnWidth:.3,
                layout: 'form',
                items: [edVhGrid]
            },
            {
                columnWidth:.7,
                layout: 'form',
                items: [
                {
                    layout:'column',
                    items:[
                    {
                        columnWidth:.55,
                        layout: 'form',
                        items: [edVhPlaca,
                        edVhPropLst,
                        edVhMarca,
                        edVhAlias]
                    },
                    {
                        columnWidth:.45,
                        layout: 'form',
                        items: [edVhModel,
                        edVhNum,
                        edVhAn,
                        edVhEqp]
                    },
                    ]
                },
                edVhImg,

                {
                    layout:'column',
                    items:[
                    {
                        columnWidth:.85,
                        layout: 'form',
                        items: [edVhInfo]
                    },
                    {
                        columnWidth:.15,
                        layout: 'form',
                        items: [btnAct, btnElim]
                    },
                    ]
                }                
                ]
            },
            ]
        }
        ],
        buttons: [ {
            text: 'OK',
            handler: edVhClean
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function edVhClean(){

    edVhContenedorWin.getForm().reset();
    if (edVhWin != null) {
        edVhWin.hide();
    }
    
}

function edVhWindow(){

    if(!edVhWin){
        edVhWin = new Ext.Window({
            layout:'fit',
            title:'Vehiculos',
            resizable : false,
            width:650,
            height:300,
            closeAction:'hide',
            plain: true,
            items: [edVhContenedorWin],
            listeners: {
                hide:function(f) {                
                }
            }
        });
    }
    setReadOnlyCmps(true);
    edVhWin.show(this);
}

function getInfoVeh(idVh) {
    Ext.Ajax.request({
        url: 'php/monitoreo/getDataVhc.php',
        method: 'POST',
        params :{
            v:idVh
        },
        success: function(response){            
            //Ext.MessageBox.hide();
            var resultado = Ext.util.JSON.decode(response.responseText);
            var info = resultado.d;
            
            if (info != undefined) {
                var formLocal = edVhContenedorWin.getForm();

                for(var i in resultado.d){
                    var reg = resultado.d[i];
                    if (reg.a != undefined && reg.b  != undefined && reg.c  != undefined
                        && reg.d  != undefined && reg.e  != undefined && reg.f  != undefined
                        && reg.g  != undefined && reg.h  != undefined && reg.i  != undefined) {

                        formLocal.findField('edVhPlaca').setValue(reg.a);
                        formLocal.findField('edVhPropLst').setValue(reg.b);
                        formLocal.findField('edVhModel').setValue(reg.c);
                        formLocal.findField('edVhAn').setValue(reg.d);
                        formLocal.findField('edVhMarca').setValue(reg.e);
                        formLocal.findField('edVhAlias').setValue(reg.f);
                        formLocal.findField('edVhInfo').setValue(reg.g);
                        formLocal.findField('edVhImg').setValue(reg.h);
                        formLocal.findField('edVhNum').setValue(reg.i);

                    }
                }
            }
        },
        failure: function(){
            Ext.MessageBox.hide();
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
 * Activa o desactiva los componentes
 * solo para lectura
 * std : true  -> solo lectura
 * std : false -> lectura y escritura
 */
function setReadOnlyCmps(std) {
    var formLcl = edVhContenedorWin.getForm();
    
    formLcl.findField('edVhPlaca').setReadOnly(std);
    formLcl.findField('edVhPropLst').setReadOnly(std);
    formLcl.findField('edVhModel').setReadOnly(std);
    formLcl.findField('edVhAn').setReadOnly(std);
    formLcl.findField('edVhMarca').setReadOnly(std);
    formLcl.findField('edVhAlias').setReadOnly(std);
    formLcl.findField('edVhInfo').setReadOnly(std);
    formLcl.findField('edVhImg').setReadOnly(std);
    formLcl.findField('edVhNum').setReadOnly(std);
    
    btnElim.setDisabled(std);
    btnAct.setDisabled(std);

}

/**
 * Elimina (marca) un vehiculo
 * en base a su ID de Equipo
 */
function delVehic(idVhEqp) {

    Ext.MessageBox.confirm("Confirmar","Esto borrará el vehículo del sistema.",
        function(btn){
            if(btn == 'yes'){

                Ext.Ajax.request({
                    url: 'php/monitoreo/delVehc.php',
                    method: 'POST',
                    params :{
                        v:idVhEqp
                    },
                    success: function(response){
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
                            edVhContenedorWin.getForm().reset();

                            cmbCompartido.reload();
                            setReadOnlyCmps(true);

                            Ext.MessageBox.show({
                                title: 'Correcto',
                                msg: 'Vehiculo Eliminado',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.OK
                            });                           
                        }
                    },
                    failure: function(){
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
