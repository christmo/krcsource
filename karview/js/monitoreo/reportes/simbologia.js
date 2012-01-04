var winCred;
var myData;
var vSim;

function ventanaSimbolos(){
    if(!vSim){
        vSim = new Ext.Window({
            layout:'fit',
            title:'SIMBOLOGIA',
            resizable : false,
            width:210,
            height:250,
            closeAction:'hide',
            plain: true,
            items: [panelEst]
        });
    }
    vSim.show(this);
}



function colorEstados(val){
    if (val == 'ASIGNADO'){
        return '<span style="color:purple;">' + val + '</span>';
    }else if (val == 'OCUPADO'){
        return '<span style="color:#734D26;">' + val + '</span>';
    }else if (val == 'LIBRE'){
        return '<span style="color:green;">' + val + '</span>';
    }else if (val == 'S/E'){
        return '<span style="color:blue;">' + val + '</span>';
    }else {
        return '<span style="color:red;">' + val + '</span>';
    }
}

/**
 * Calcula la velocidad a presentar
 */
function velocidad(val) {
    var velo = val * 1.85;
    return velo.toFixed(2);
}

function agregarTab(tipoReporte){

    var encabezado = "Vehiculo : "+nameVh
    +" <br> Desde : "+ fInicio + " " + hInicio
    +" <br> Hasta : "+ fFin + " " + hFin;

    var url = 'php/xls/dataxls.php?vh='
    + nUnidad + '&fi=' + fInicio +
    '&ff=' + fFin + '&hi=' + hInicio +
    '&hf=' + hFin + '&nv=' + nameVh +
    '&tr=' + tipoReporte;

    if (EvtId != null && EvtId!= -1) {
        url += '&evtid=' + EvtId;
        EvtId = -1;
    }

    // Almacen de Datos
    var store = new Ext.data.ArrayStore({
        fields: [        
        {
            name: 'lat'
        },
        {
            name: 'lon'
        },
        {
            name: 'fecha'
        },
        {
            name: 'hora'
        },
        {
            name: 'velo'
        },{
            name: 'dir'
        },{
            name: 'evt'
        }
        ]
    });

    // Cargar datos desde el arreglo
    store.loadData(myData);

    // Crear Grid
    var grid2 = new Ext.grid.GridPanel({
        store: store,
        columns: [
        {
            id:'fecha',
            header: '<center>Fecha</center>',
            width: 85,
            sortable: true,
            dataIndex: 'fecha'
        },
        {
            header: '<center>Hora</center>',
            width: 75,
            sortable: true,
            dataIndex: 'hora'
        },
        {
            header: '<center>Latitud</center>',
            width: 75,
            sortable: true,
            //   renderer: change,
            dataIndex: 'lat'
        },

        {
            header: '<center>Longitud</center>',
            width: 75,
            sortable: true,
            //       renderer: pctChange,
            dataIndex: 'lon'
        },
        {
            header: '<center>Velocidad</center>',
            width: 80,
            sortable: true,
            renderer: velocidad,
            dataIndex: 'velo'
        },
        {
            header: '<center>DIRECCION</center>',
            width: 250,
            sortable: true,
            dataIndex: 'dir'
        },
        {
            header: '<center>EVENTO</center>',
            width: 250,
            sortable: true,
            dataIndex: 'evt'            
        }

        ],
        stripeRows: true,
        //autoExpandColumn: 'fecha',  //==> CUAL ¿?
        height: 450,
        width: 915, //550
        title: '<center>'+encabezado+'</center>',
        // config options for stateful behavior
        stateful: true,
        stateId: 'grid',

        tbar: [
        '-',{
            xtype: 'box',
            autoEl: {
                tag: 'a',
                href: url,
                html: 'Exportar a Excel'
            }
        }
        ]


    });

    var tab = new Ext.Panel({
        title: tipoReporte + nameVh.substring(0,4) + '...',
        closable: true, //<-- este tab se puede cerrar
        iconCls: 'app-icon',
        items: grid2
    });

    start.add(tab);
    start.setActiveTab(tab);

    //*****************************************************************
    grid2.on('rowcontextmenu', function(grid, row, e) {
        e.stopEvent();
        var posXY = new Array(2) ;
        posXY[0] = window.event.clientX ;
        posXY[1] = window.event.clientY ;       
        getData = grid.getStore().getAt(row);
        mnuContextGrid.showAt(posXY);        
    }, grid);

}

var getData;

var mnuContextGrid = new Ext.menu.Menu({
    items: [{
        id: 'men1',
        text: 'Localizar'
    }],
    listeners: {
        itemclick: function(item) {

            //WARNING: Las coordenadas están invertidas!!!

            if (item.id == 'men1') {
                var coord1 = getData.get('lon');
                if (typeof coord1 === "undefined") {
                    coord1 = getData.get('l');
                }

                var coord2 = getData.get('lat');
                if (typeof coord2 === "undefined") {
                    coord2 = getData.get('ln');
                }

                var dt2 = new OpenLayers.LonLat(coord2,coord1);
                dt2.transform( new OpenLayers.Projection( "EPSG:4326" ),
                    new OpenLayers.Projection( "EPSG:900913" ));

                start.setActiveTab(0);
                centrarMapa(dt2.lon,dt2.lat,15);

                if (IdTimeOut != null) {
                    clearTimeout(IdTimeOut);
                }
                iconFlecha.destroyFeatures();
                var point = new OpenLayers.Geometry.Point( coord2,coord1 );
                point.transform( new OpenLayers.Projection( "EPSG:4326" ),
                    new OpenLayers.Projection( "EPSG:900913" ) );
                var demo = new OpenLayers.Feature.Vector( point );
                iconFlecha.addFeatures([demo]);

                IdTimeOut = setTimeout(quitarIndicador, 4 * 1000);
            }
        }
    }
});



function agregarTabAsig(){

    var encabezado = "Unidad : " + nUnidadAsig + "  " +  nameCoopAsig + "<br>Desde : " + fInicioAsig + "   " + hInicioAsig + "<br>Hasta : " + fFinAsig + "   " + hFinAsig;
    var urlSoft = 'php/xls/dataxlsAsgVeh.php?cp=' + idCoopAsig + '&vh=' + nUnidadAsig + '&fi=' + fInicioAsig + '&ff=' + fFinAsig + '&hi=' + hInicioAsig + '&hf=' + hFinAsig;
	
    // Almacen de Datos
    var storeAsig = new Ext.data.ArrayStore({
        fields: [
        {
            name: 'COD_CLIENTE'
        },
        {
            name: 'ESTADO'
        },
        {
            name: 'FECHA'
        },
        {
            name: 'HORA'
        },
        {
            name: 'FONO'
        },
        {
            name: 'DIRECCION'
        }
        ]
    });

    // Cargar datos desde el arreglo
    storeAsig.loadData(dataAsig);

    // Crear Grid
    var grid = new Ext.grid.GridPanel({
        store: storeAsig,
        columns: [
        {
            id:'codCliente',
            header: '<center>COD_CLIENTE</center>',
            width: 85,
            sortable: true,
            dataIndex: 'COD_CLIENTE'
        },
        {
            header: '<center>ESTADO</center>',
            width: 75,
            sortable: true,
            renderer: colorEstados,
            dataIndex: 'ESTADO'
        },
        {
            header: '<center>FECHA</center>',
            width: 75,
            sortable: true,
            dataIndex: 'FECHA'
        },

        {
            header: '<center>HORA</center>',
            width: 75,
            sortable: true,
            dataIndex: 'HORA'
        },
        {
            header: '<center>FONO</center>',
            width: 85,
            sortable: true,
            dataIndex: 'FONO'
        },
        {
            header: '<center>DIRECCION</center>',
            width: 225,
            sortable: true,
            dataIndex: 'DIRECCION'
        }
        ],
        stripeRows: true,
        height: 450,
        width: 650,
        title: '<center>'+encabezado+'</center>',
        stateful: true,
        stateId: 'grid',
				
        tbar: [
        '-',{
            xtype: 'box',
            autoEl: {
                tag: 'a',
                href: urlSoft,
                html: 'Exportar a Excel'
            }
        }
        ]
		
		
    });

    var tab = new Ext.Panel({
        title: 'Asignaciones del Software',
        closable: true, //<-- este tab se puede cerrar
        iconCls: 'app-icon',
        //        layout: 'column',
        width : 900,
        labelWidth: 120,
        items: [
        grid
        ]
    });

    start.add(tab);
    start.setActiveTab(tab);
}

function agregarTabAsgCentral(dtASig){

    var encabezado = "Asignaciones desde la Central <br>" + nCoopAsgCentral
    + "<br>Desde : " + fInicioAC + "  " + hInicioAC
    + "<br>Hasta : " + fFinAC + "  " + hFinAC;
	
    var urlCtr = 'php/xls/dataxlsAsgCent.php?cp=' + idCoopAsgCentral + '&fi=' + fInicioAC + '&ff=' + fFinAC + '&hi=' + hInicioAC + '&hf=' + hFinAC;
		
    // Almacen de Datos
    var storeAsig = new Ext.data.ArrayStore({
        fields: [
        {
            name: 'FECHA'
        },
        {
            name: 'HORA'
        },
        {
            name: 'N_UNIDAD'
        },
        {
            name: 'ESTADO'
        },
        {
            name: 'COD_CLIENTE'
        },
        {
            name: 'FONO'
        },
        {
            name: 'DIR'
        }
        ]
    });

    // Cargar datos desde el arreglo
    storeAsig.loadData(dtASig);

    // Crear Grid
    var grid = new Ext.grid.GridPanel({
        store: storeAsig,
        columns: [
        {
            header: '<center>FECHA</center>',
            width: 75,
            sortable: true,
            dataIndex: 'FECHA'
        },
        {
            header: '<center>HORA</center>',
            width: 75,
            sortable: true,
            dataIndex: 'HORA'
        },{
            id:'nUnidad',
            header: '<center>N UNIDAD</center>',
            width: 85,
            sortable: true,
            dataIndex: 'N_UNIDAD'
        },
        {
            header: '<center>ESTADO</center>',
            width: 75,
            sortable: true,
            renderer: colorEstados,
            dataIndex: 'ESTADO'
        },{
            id:'codCliente',
            header: '<center>COD_CLIENTE</center>',
            width: 85,
            sortable: true,
            dataIndex: 'COD_CLIENTE'
        },        
        {
            header: '<center>FONO</center>',
            width: 85,
            sortable: true,
            dataIndex: 'FONO'
        },
        {
            header: '<center>DIRECCION</center>',
            width: 150,
            sortable: true,
            dataIndex: 'DIR'
        }
        ],
        stripeRows: true,
        height: 450,
        width: 650,
        title: '<center>'+encabezado+'</center>',
        stateful: true,
        stateId: 'grid',
		
        tbar: [
        '-',{
            xtype: 'box',
            autoEl: {
                tag: 'a',
                href: urlCtr,
                html: 'Exportar a Excel'
            }
        }
        ]
		
    });

    var tab = new Ext.Panel({
        title: 'Asignaciones desde la Central',
        closable: true, //<-- este tab se puede cerrar
        iconCls: 'app-icon',
        width : 900,
        labelWidth: 120,
        items: [
        grid
        ]
    });

    start.add(tab);
    start.setActiveTab(tab);
}

function credits() {

    if(!winCred){

        contenedorWinC = new Ext.FormPanel({
            labelAlign: 'left',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            labelWidth:60,
            width: 500,
            items: [
            {
                layout: 'form',
                items: [{
                    html: '<div id="efecto"><center> <IMG SRC="img/logo.png"> '+
                    '<br><br>info@kradac.com <br><br></center>'+
                    '<br><br>'+
                    '<P ALIGN=right>qmarqeva</P></div>',
                    xtype: "panel"
                }]
            }
            ],
            buttonAlign: 'center',
            buttons: [{
                text: 'OK',

                handler: function() {
                    winCred.hide();
                }
            }]
        });

        winCred = new Ext.Window({
            layout:'fit',
            title:'Credits',
            resizable : false,
            width:300,
            height:240,
            closeAction:'hide',
            plain: true,
            items: [contenedorWinC]
        });
    }
    winCred.show(this);

    var el = Ext.get('efecto');

    el.fadeIn({
        duration:10,
        easing: ''
    });
}