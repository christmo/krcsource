var dato;
var strCantEqCoop;
var strCoopCons;
var winCred;

function tabla_estados(){

    ///////////   TABLA CANTIDAD EQUIPOS   ////

    //Define los campos
    var metadataCoopCons = Ext.data.Record.create([
    {
        name: 'ID_COOP'
    },{
        name: 'IP'
    },
    {
        name: 'MIN_ATRAS',
        type: 'int'
    }
    ]);

    //Define Store
    strCoopCons = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'php/monitoreo/coop_consultando.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({},metadataCoopCons),
        remoteSort: false
    });
    //Carga el Store (asyncrono)
    strCoopCons.load();

    // Crear Grid
    var grdCoopCons = new Ext.grid.GridPanel({
        //  renderTo: 'datos',
        store: strCoopCons,
        columns: [
        {
            id:'id_cp',
            header: '<center>COOP</center>',
            width: 60,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'ID_COOP'
        },
        {
            header: '<center>DESDE</center>',
            width: 100,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'IP'
        },
        {
            header: '<center>MIN ATRAS</center>',
            width: 75,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'MIN_ATRAS'
        }
        ],
        stripeRows: true,
        height: 170,
        width: 260,
        title: '<center> COOPERATIVAS </center>',
        stateful: true,
        stateId: 'grdCoopCons'
    });



    ///////////   TABLA CANTIDAD EQUIPOS   ////

    //Define los campos
    var metadataCantEqCoop = Ext.data.Record.create([
    {
        name: 'ID_EMPRESA'
    },
    {
        name: 'CANT',
        type: 'int'
    }
    ]);


    //Define Store
    strCantEqCoop = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'php/monitoreo/cant_equipos_coop.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({},metadataCantEqCoop),
        remoteSort: false
    });
    //Carga el Store (asyncrono)
    strCantEqCoop.load();

    // Crear Grid
    var grdCantEqCoop = new Ext.grid.GridPanel({
        //  renderTo: 'datos',
        store: strCantEqCoop,
        columns: [
        {
            id:'id_coop',
            header: '<center>COOP</center>',
            width: 85,
            sortable: true,
            dataIndex: 'ID_EMPRESA'
        },
        {
            header: '<center>CANT</center>',
            width: 75,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'CANT'
        }
        ],
        stripeRows: true,
        height: 170,
        width: 185,
        title: '<center> CANTIDAD DE EQUIPOS </center>',
        stateful: true,
        stateId: 'grdCantEqCoop'
    });


    ///////////   TABLA ESTADO EQUIPOS   ////




    var filterRow = new Ext.ux.grid.FilterRow({
        // automatically refilter store when records are added
        refilterOnStoreUpdate: true
    });   

    //Define los campos
    var MetaData = Ext.data.Record.create([
    {
        name: 'EQUIPO'
    },
    {
        name: 'TAXI'
    },
    {
        name: 'FH_CON'
    },

    {
        name: 'FH_DES'
    },

    {
        name: 'TMPCON',
        type: 'int'
    },

    {
        name: 'TMPDES',
        type: 'int'
    },
    {
        name: 'BATERIA',
        type: 'int'
    },
    {
        name: 'GSM',
        type: 'int'
    },
    {
        name: 'GPS2',
        type: 'int'
    },
    {
        name: 'ESTADO'
    },
    {
        name: 'FECHA_ESTADO'
    },
    {
        name: 'VEL'
    },
    {
        name: 'ING',
        type: 'int'
    }
    ]);

    //Define Store
    dato = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'php/monitoreo/estado_equipos.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({},MetaData),
        remoteSort: false
    });
    //Carga el Store (asyncrono)
    dato.load();

    // Crear Grid
    var grid = new Ext.grid.GridPanel({
        //  renderTo: 'datos',
        store: dato,
        columns: [
        {
            id:'fecha',
            header: '<center>Equipo</center>',
            width: 85,
            sortable: true,
            dataIndex: 'EQUIPO',
            filter: {
                test: "/^{0}/i"
            }
        },
        {
            header: '<center>Unidad</center>',
            width: 75,
            sortable: true,
            dataIndex: 'TAXI',
            filter: {
                test: "/^{0}/i"
            }
        },
        {
            header: '<center>FechaConex</center>',
            width: 120,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'FH_CON'
        },
        {
            header: '<center>Fecha Ult Trama</center>',
            width: 120,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'FH_DES'
        },
        {
            header: '<center>Tmp Conex</center>',
            width: 70,
            sortable: true,
            renderer: centrarTexto,
            dataIndex: 'TMPCON'
        },
        {
            header: '<center>Estado</center>',
            width: 70,
            sortable: true,
            renderer: setEstado,
            dataIndex: 'TMPDES'
        },
        {
            header: '<center>Tmp Desconex</center>',
            width: 85,
            sortable: true,
            renderer: isDisconect,
            dataIndex: 'TMPDES'
        },
        {
            header: '<center>BAT</center>',
            width: 45,
            sortable: true,
            dataIndex: 'BATERIA'
        },


        {
            header: '<center>GSM</center>',
            width: 45,
            sortable: true,
            dataIndex: 'GSM'
        },
        {
            header: '<center>GPS2</center>',
            width: 45,
            sortable: true,
            dataIndex: 'GPS2'
        },
        {
            header: '<center>ING</center>',
            width: 45,
            sortable: true,
            dataIndex: 'ING'
        },
        {
            header: '<center>VELOC</center>',
            width: 45,
            sortable: true,
            dataIndex: 'VEL'
        },
        
        {
            header: '<center>ESTADO</center>',
            width: 80,
            sortable: true,
            dataIndex: 'ESTADO',
            filter: {
                test: "/^{0}/i"
            }
        },
        {
            header: '<center>EST_FECHA</center>',
            width: 80,
            sortable: true,
            dataIndex: 'FECHA_ESTADO'
        }
        ],
        plugins: [filterRow],
        stripeRows: true,
        height: 645,
        width: 920,  //692
        title: '<center> ESTADO DE EQUIPOS </center>',
        stateful: true,
        stateId: 'grid',
        rowspan:3   //******** CAMBIO A 3
        
    });







    var simple = new Ext.FormPanel({
        labelWidth: 65, // label settings here cascade unless overridden
        frame:true,
        title: 'Asignar Estado a Equipo',
        bodyStyle:'padding:5px 5px 0',
        width: 275,
        defaults: {
            width: 180
        },
        defaultType: 'textfield',

        items: [{
            width: 100,
            fieldLabel: 'Equipo',
            name: 'eqp',
            allowBlank:false
        },{
            fieldLabel: 'Estado',
            name: 'estado'
        },{
            fieldLabel: 'Fecha',
            xtype:'datefield',
            format: 'Y-m-d',
            id: 'dateEstado',
            name: 'dateEstado',
            width: 100
        }
        ],

        buttons: [{
            text: 'Asignar',
            handler: function() {
                simple.getForm().submit({
                    url : 'php/monitoreo/cambio_estado_equipo.php',
                    method:'POST',
                    waitMsg : 'Asignando Estado',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'Ups... Estado no asignado',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        simple.getForm().reset();
                        reloadGrid();
                        Ext.MessageBox.show({
                            title: 'Cambiado',
                            msg: 'Estado cambiado',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.OK
                        });
                        
                    }
                });
            }
        }]
    });







    ////////   PANEL PRINCIPAL

    var panel = new Ext.Panel({
        id:'main-panel',
        baseCls:'x-plain',
        renderTo: Ext.getBody(),
        layout:'table',
        layoutConfig: {
            columns:3
        },
        items:[
        grid,
        {
            width : 15,
            rowspan:3 //******** CAMBIO A 3
        },
        simple,
        grdCantEqCoop,
        grdCoopCons
        
        ]
    });

    //Actualizará en un determinado tiempo
    setInterval("reloadGrid()",30*1000);
    setInterval("reloadGrdCantEqCoop()",60*1000);
}


function efecto() {

}

/**
 * Recarga el Store
 */
function reloadGrid(){
    dato.reload();
}
/**
 * Recarga grid Cantidad Equipos
 */
function reloadGrdCantEqCoop() {
    strCantEqCoop.reload();
    strCoopCons.reload();
}
/**
 * Presenta la cantidad de tiempo que
 * lleva desconectado
 */
function isDisconect(val){
    if(val>3){
        return val;
    }
    return null;
}

/**
 * Colo el estado del Dispositivo
 */
function setEstado(val){
    if (val>3){
        return '<span style="color:red;">Disconect</span>';
    }else{
        return '<span style="color:green;">Conect</span>';
    }
}

/**
 * Centra el texto en el GRID
 */
function centrarTexto(val){
    return '<center>'+val+'</center>';
}


/**
 * Tabla con Cantidad de equipos
 */
function cantidadEquiposCoop() {
    
}