/*!
 * Ext JS Library 3.2.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
//
// Note that these are all defined as panel configs, rather than instantiated
// as panel objects.  You could just as easily do this instead:
//
// var absolute = new Ext.Panel({ ... });
//
// However, by passing configs into the main container instead of objects, we can defer
// layout AND object instantiation until absolutely needed.  Since most of these panels
// won't be shown by default until requested, this will save us some processing
// time up front when initially rendering the page.
//
// Since all of these configs are being added into a layout container, they are
// automatically assumed to be panel configs, and so the xtype of 'panel' is
// implicit.  To define a config of some other type of component to be added into
// the layout, simply provide the appropriate xtype config explicitly.
//
/*
 * ================  Start page config  =======================
 */
// The default start page, also a simple example of a FitLayout.

var start = new Ext.TabPanel({
    region: 'center', // a center region is ALWAYS required for border layout
    deferredRender: false,
    margins:'3 3 3 0',
    activeTab: 0,
    
    defaults : {
        bodyStyle : 'padding:0px'
    },
    items : [ {
        title : 'Mapa',
        html : '<div style="position: absolute;" id="map"></div> ' + 
            
            
            '<div id=\"msg-div\"></div> '+


            ' <div id="infor" align= "right" '+
    'style="position:absolute; bottom:0; ' +
    'margin-bottom: 3px;' +
    ' display:none;'+
    ' background-color:#CCFF99;">	'+
    '<TABLE id="tablestados">'+
    '<TR >'+
    '	<TD rowspan="1" colspan="6" align="center" ><b><label id="idVeh"></label></b></td> '+
    '</TR>'+
    '<TR class="alt">'+
    '	<TD rowspan="1" colspan="2" align="center" ><b>Dist KM:</b></td> '+
    '	<TD rowspan="1" colspan="2" align="center" ><label id="distKM"></label></td> '+
    '</TR>'+
    '<TR>'+
    '	<TD align="right"> <b>Num: </b>	'		+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="num1"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="num2"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="num3"></label>'+
    '	</TD>'+
    '</TR>	'+
    '<TR class="alt">'+
    '	<TD align="right"><b>Fech:</b>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="fecha1"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="fecha2"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="fecha3"></label>'+
    '	</TD>'+
    '</TR>'+
    '<TR>'+
    '	<TD align="right"><b>Hor:</b>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="hora1"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="hora2"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="hora3"></label>'+
    '	</TD>'+

    '</TR>'+
    //    '<TR class="alt">'+
    //    '	<TD align="right"><b>Est:</b>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="est1"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="est2"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="est3"></label>'+
    //    '	</TD>'+
    //
    //    '</TR>'+
    //    '<TR>'+
    //    '	<TD align="right"><b>EsTx:</b>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="estx1"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="estx2"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="estx3"></label>'+
    //    '	</TD>'+
    //    '</TR>'+

    '<TR class="alt">'+
    '	<TD align="right"><b>Velo:</b>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="otr1"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="otr2"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="otr3"></label>'+
    '	</TD>'+
    '</TR>'+

    '<TR>'+
    '	<TD align="right"><b>EVT:</b>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="evt1"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="evt2"></label>'+
    '	</TD>'+
    '	<TD align="center">'+
    '		<label id="evt3"></label>'+
    '	</TD>'+
    '</TR>'+

    //    '<TR>'+
    //    '	<TD align="right"><b>Fono:</b>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="fono1"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="fono2"></label>'+
    //    '	</TD>'+
    //    '	<TD align="center">'+
    //    '		<label id="fono3"></label>'+
    //    '	</TD>'+
    //    '</TR>'+


    '</TABLE>'+
    '</div>'
    }]
});

var strCoopCons;
var selecModel;
//Define los campos
var metadataCoopCons = Ext.data.Record.create([
{
    name: 'HORA'
},{
    name: 'VEHICULO'
},{
    name: 'EVENTO'
},{
    name: 'COORDENADA'
},{
    name: 'DIRECCION'
}
]);

//Store desde PHP
//Define Store
strCoopCons = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: '',  //debería extraer los datos de la BD o no ¿?
        method: 'POST'
    }),
    reader: new Ext.data.JsonReader({},metadataCoopCons),
    remoteSort: false
});
//Carga el Store (asyncrono)
//strCoopCons.load();

var grid = new Ext.grid.GridPanel({
    region: 'south',
    deferredRender: false,
    store: strCoopCons,
    height: 200,
    collapsible: true,
    margins: '0 0 0 0',
    title: "Ultimos Reportes de Vehiculos",
    autoScroll: true, 
    columns: [
    {
        header: 'Hora',
        width: 38,
        sortable: true,
        dataIndex: 'HORA'
    },
    {
        header: 'Vehiculo',
        width: 35,
        sortable: true,
        dataIndex: 'VEHICULO'
    },
    {
        header: 'Evento',
        width: 80,
        sortable: true,
        dataIndex: 'EVENTO'
    },
    {
        header: 'Velocidad (KH)',
        width: 40,
        sortable: true,
        dataIndex: 'VELOCIDAD'
    },{
        header: 'Direccion',
        //        width: 120,
        sortable: true,
        dataIndex: 'DIRECCION'
    },
    {
        header: 'COORDENADA',
        width: 15,
        sortable: true,
        dataIndex: 'COORDENADA'
    }
    ],
    viewConfig: {
        forceFit: true
    }
});

var panelCentral = new Ext.Panel({
    region : 'center',
    layout : "border",
    items : [start,grid]
});


var IdTimeOut = null;

grid.on('click', function(e) {
    var getData = grid.getSelectionModel().getSelected();

    if (getData != undefined) {
        var coord = getData.get('COORDENADA').split(',');
        var dt = new OpenLayers.LonLat(coord[1],coord[0]);

        dt.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ));
           
        start.setActiveTab(0);
        centrarMapa(dt.lon,dt.lat,15);
    
        if (IdTimeOut != null) {
            clearTimeout(IdTimeOut);
        }
        iconFlecha.destroyFeatures();
        var point = new OpenLayers.Geometry.Point( coord[1],coord[0] );
        point.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ) );
        var demo = new OpenLayers.Feature.Vector( point );
        iconFlecha.addFeatures([demo]);

        IdTimeOut = setTimeout(quitarIndicador, 4 * 1000);
    }
}, grid);

function quitarIndicador() {
    iconFlecha.destroyFeatures();
}


/**
 * Agregar una fila
 */
function addFilaTablaReportes(hora, veh, evt, coord, dir, veloc) {

    var estructura = Ext.data.Record.create([{
        name: 'HORA'
    },{
        name: 'VEHICULO'
    },{
        name: 'EVENTO'
    },{
        name: 'COORDENADA'
    }, {
        name: 'DIRECCION'
    }, {
        name: 'VELOCIDAD'
    }]);

    strCoopCons.add(new estructura({
        HORA:hora,
        VEHICULO: veh,        
        EVENTO: evt,
        COORDENADA: coord,
        DIRECCION: dir,
        VELOCIDAD: veloc
    }));


    strCoopCons.sort('HORA', 'DESC');

}
