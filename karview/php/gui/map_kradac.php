<?php

include "php/login/isLogin.php";

echo "

<script type='text/javascript'>
var controls;
var map;
var selectControl;
var clientesSelectControl;

// coordenadas para centrar Loja
var lat = - 3.9912;
var lon = - 79.20733;
var zoom = 13;
var id = 1;
var vectorLayerClientes;
var lienzoRecorridos;
var lienzoGeoCercas;

//Lienzos por Cooperativa
var CAR_Layer;
var iconFlecha;
var time;
var distanciaKM;
var lookup = {};
var context;

var drawControls;

function init(){

    var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(-94.68966,4.61535));
    extent.extend(new OpenLayers.LonLat(-65.35617, -17.51253));

    extent.transform( new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ));

    // Mapa
    var options = {
        controls : [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.LayerSwitcher()
        ],
        units: 'm',
        numZoomLevels : 19,
        maxResolution : 'auto',
        restrictedExtent : extent,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
            20037508.34, 20037508.34)
    };

    map = new OpenLayers.Map('map', options); ";

echo " var styleLienzo = new OpenLayers.StyleMap( {
        externalGraphic : '\${img}',
        graphicWidth : '\${wd}',
        graphicHeight : '\${hg}',
        fillOpacity : 0.85,
        id_taxi : '\${taxi}',
        velocidad : '\${velo}',

        dir : '\${dir}',
        std : '\${dir}',

        fecha : '\${fecha}',
        placa : '\${placa}',
        label : '..\${placa}',
        fontColor: '\${favColor}',
        fontSize: '12px',
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        labelAlign: '\${align}',
        labelOffset: new OpenLayers.Pixel(0,-20)
    }
    );
        var styleIndicador = new OpenLayers.StyleMap( {
        externalGraphic : 'img/localizacion.png',
        graphicWidth : 32,
        graphicHeight : 36
    }
    );

    stylePuntos = new OpenLayers.StyleMap( {
        fillOpacity : 0.7,
        pointRadius: 8,
        id_estado : '\${id_estado}',
        fecha : '\${fecha}',
        hora : '\${hora}',
        label : ' \${id_estado}',
        estTax : '\${estTax}',
        estTaxM : '\${estTaxM}',
        velo : '\${velo}',
        otroEstado : '\${otroEstado}',
        evt : '\${evt}',
        evtD : '\${evtD}',
        fono : '\${fono}',
        fontColor: 'white',
        fontSize: '12px',
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold'
    }
    );


    /* CREAR LIENZOS */
    CAR_Layer = new OpenLayers.Layer.Vector( 'Mis Vehiculos', {
        styleMap : styleLienzo
    }
    );
    CAR_Layer.id = 'CAR_Layer';

    iconFlecha = new OpenLayers.Layer.Vector( 'Flecha', {styleMap : styleIndicador});

    lienzoRecorridos = new OpenLayers.Layer.Vector('Recorridos');

    lienzoPuntos = new OpenLayers.Layer.Vector('Points', {
        styleMap: stylePuntos
    });

    markerInicioFin = new OpenLayers.Layer.Markers( 'Inicio-Fin' );


    lienzoGeoCercas = new OpenLayers.Layer.Vector('GeoCercas');

    /*******************************/
    context = function(feature) {
        return feature;
    }

    cargarColores();

    stylePuntos.addUniqueValueRules('default', 'state', lookup, context);
    /*******************************/

    /* AÑADIR CAPAS */

    var mapnik = new OpenLayers.Layer.OSM.Mapnik('OSM Map',{
    transitionEffect: 'resize'});
    var gmap = new OpenLayers.Layer.Google('Google Maps', {
        sphericalMercator:true
    });

    map.addLayers([mapnik, gmap]);
    map.addLayer( CAR_Layer );
    map.addLayer(lienzoRecorridos);
    map.addLayer(lienzoPuntos);
    map.addLayer(markerInicioFin);
    map.addLayer(iconFlecha);
    map.addLayer(lienzoGeoCercas);

    /* AÑADIR Y ACTIVAR EVENTOS */

    CAR_Layer.setVisibility(true);
    selectFeatures = new OpenLayers.Control.SelectFeature(
        [ lienzoPuntos, CAR_Layer ],
        {
            clickout: true,
            toggle: false,
            multiple: false,
            hover : false,
            onSelect : function(feature){
                var lPoint = lienzoPuntos.selectedFeatures;
                if (lPoint.length>0) {
                    onPuntoSelect(feature );
                }else{
                    onVehiculoSelect( feature );
                }
            },
            onUnselect : function(feature){
                var iden = feature.attributes.id_estado;
                if (iden != null) {
                    onPuntoUnselect(feature );
                }else{
                    onVehiculoUnselect( feature );
                }
            }
        }
        );

    map.addControl( selectFeatures );
    selectFeatures.activate();


    drawControls = {
                    polygon: new OpenLayers.Control.DrawFeature(
                    lienzoGeoCercas,
                    OpenLayers.Handler.Polygon,
                    {'featureAdded': funcion1})
                };

                for(var key in drawControls) {
                    var auxControl = drawControls[key];
                    map.addControl(auxControl);
                }








    /* OTRAS FUNCIONES */

    var lonLat = new OpenLayers.LonLat( lon, lat ).transform(
        new OpenLayers.Projection( 'EPSG:4326' ),
        map.getProjectionObject() );
    map.setCenter ( lonLat, zoom );

    map.events.register('zoomend', this, function() {
        if (map.getZoom() < 7)
        {
            map.zoomTo(7);
        }
    });
    graficarCoop();
    buscarAlerta();
 }


function funcion1(fig) {

    trazando = 0;

    estadoControlD('polygon');

    var geom = fig.geometry; //figura
    var area = geom.getArea()/1000     //area km
    var vert = geom.getVertices();  //vertices

    area = Math.round(area*100)/100;

    g2Area.setValue(area + ' km2');
    
    var coordP = '';

    for(var i=0; i<vert.length; i++){
            vert[i] = vert[i].transform( new OpenLayers.Projection( 'EPSG:900913' ),
                new OpenLayers.Projection( 'EPSG:4326' ) );
            coordP += vert[i].x + ',' + vert[i].y;

            if (i != vert.length-1) {
                coordP += ';';
            }

    }

   vertPolygon = coordP;
   g2Win.show();
   
}

function estadoControlD(flag) {
    for(var key in drawControls) {
        var control = drawControls[key];
        if(flag == key) {
            if (control.active == null || !control.active) {
                control.activate();
                lienzoGeoCercas.destroyFeatures(); // borrar capa
            }else{
                control.deactivate();
            }
        }
    }
}



//**************************
//****  TESTING CARGA COLORES

function cargarColores() {
    Ext.Ajax.request({
        url: 'php/monitoreo/loadColors.php',
        method: 'POST',
        success: function(response, request){
            var dataServer = eval('(' + response.responseText + ')');
            tabla = '<TABLE id=\"tablestados\">';
            for(var i = 0; i< dataServer.d.length; i++){
                var auxEl = dataServer.d[i];
                lookup[auxEl.k] = {
                    fillColor: auxEl.v
                };
                var auxDesc = auxEl.de;
                if (auxEl.de == '') {
                    auxDesc = auxEl.k;   //eventos sin id
                }

                tabla +=  '<TR';
                if ((i%2)==0) {
                    tabla += ' class=\"alt\"'; //diseño
                }
                tabla +=  '> ' +
                '    <TD  align=\"center\"> ' +
                '       <div style =\"background-color:' + auxEl.v +
                '; color: ' + auxEl.v + '; width:15px\">. </div>'+
                '    </TD> ' +
                '    <TD align=\"left\">' + auxDesc +
                '    </TD> ' +
                '</TR> ';
            }

            tabla += '  <TR class=\"alt\"> ' +
            '     <TD> <IMG SRC=\"img/inicio.png\">' +
            '    </TD> ' +
            '    <TD align=\"left\">Inicio de Recorrido' +
            '    </TD> ' +
            ' </TR> ' +

            '  <TR > ' +
            '     <TD> <IMG SRC=\"img/fin.png\">' +
            '    </TD> ' +
            '    <TD align=\"left\">Fin de Recorrido' +
            '    </TD> ' +
            '  </TR> ' +

            ' </TABLE>';


            loadSimbologia();

        },
        failure: function(response, request){
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'No se pudieron cargar los colores de los estados',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        },
        timeout: 10000
    });
}


/**
 * Carga de Ventana Simbología
 */
function loadSimbologia() {
    panelEst = new Ext.FormPanel({
        labelAlign: 'center',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        autoScroll:true,
        labelWidth:60,
        width: 350,
        items: [{
            html: tabla,
            width:150
        }],

        buttons: [{
            text: 'OK',
            handler: function() {
                vSim.hide();
            }
        }]
    });
}


//Distancia entre dos puntos

function distancia (lon1, lat1, lon2,lat2){

    var punto1 = new OpenLayers.LonLat( lon1, lat1 );

    var punto2 = new OpenLayers.LonLat( lon2, lat2 );

    var distanciaKM =  OpenLayers.Util.distVincenty ( punto1, punto2 );

    return distanciaKM;

}



function coordenadas(){
    if (time == null || time==0) {
        time = 0;
    }

    //Esta capa no tiene elementos ? Entonces asumo
    //que es la primera vez q la visualizamos.
    var estaCapa;
    if (cantElementos()==0) {
        estaCapa = 0;
    }else{
        estaCapa = time;
    }
    $.ajax( {
        url : 'php/monitoreo/ultimosGPS.php?t=' + estaCapa ,
        type : 'GET',
        async : true,
        success : function( datos ){

            var obj = eval('(' + datos + ')');

            if (obj.t != 0) {
                time = obj.t;
            }                       
            if (obj.d.length > 0) {
                graficarVehiculos2(obj.d);
            }
        }
    }
    );

}



/**
 * Cantidad de Elementos dentro del Vector
 */
function cantElementos(){
    return CAR_Layer.features.length;
}

//Verifica si la capa está activa

function estaActivo(){
    return CAR_Layer.getVisibility();
}



//grafica las unidades
function graficarCoop(){

    if (estaActivo()) {
        coordenadas();
    }
    // Volvemos a comprobar datos a los 5 segundos
    setTimeout( function(){
        graficarCoop(  )
    }
    , 5 * 1000 );
}


//Grafica los vehiculos luego de consultar a la BD
function graficarVehiculos2(cordGrap){

    var filas = cordGrap.split( '#' );
    // Se concatena al final dos signos raros
    // por eso resto uno ( 1 )

    for ( var i = 0;  i < filas.length - 1; i ++ ){

        // Extraigo columnas
        var columnas = filas[i].split( '%' );
        var idtaxiBD = 'T' + columnas[0];
        var taxiFeature = null;

        //Extracción dependiendo del Layer
        taxiFeature = CAR_Layer.getFeatureById( idtaxiBD );

        addFilaTablaReportes(
            columnas[4],
            columnas[5],
            columnas[6],
            columnas[2]+','+columnas[1],
            columnas[7],
            redondear(columnas[3]*1.852,2)
            );

        //CREA UN NUEVO ELEMENTO PARA EL TAXI PORQUE NO EXISTE
        if ( taxiFeature == null ){

            // Coordenadas
            var x = columnas[1];
            var y = columnas[2];

            // Posici�n lon : lat
            var point = new OpenLayers.Geometry.Point( x, y );
            // Transformaci�n de coordendas
            point.transform( new OpenLayers.Projection( 'EPSG:4326' ),
                new OpenLayers.Projection( 'EPSG:900913' ) );

            taxiFeature = new OpenLayers.Feature.Vector( point, {
                img: 'img/' + columnas[8],
                wd: columnas[9],
                hg: columnas[10],
                taxi : columnas[0],
                velo : columnas[3],
                fecha : columnas[4],

                dir : columnas[7],
                std : columnas[6],

                placa : columnas[5],
                favColor : 'blue',
                align: 'lt',
                poppedup : false
            }
            );

            // Se coloca el ID de veh�culo a la imagen
            taxiFeature.id = 'T' + columnas[0];

            //Se añade a la capa que corresponda
            CAR_Layer.addFeatures( [taxiFeature] );

        }else{
            // Comprobar si los datos graficados estan desactualizados
            if ( taxiFeature.attributes.fecha != columnas[4] ){

                var poppedup
                if (taxiFeature == null){
                    poppedup = false;
                }else{
                    poppedup = taxiFeature.attributes.poppedup;
                }

                //var
                if ( poppedup == true ) {
                    selectControl.unselect( taxiFeature );
                }
                // Coordenadas
                x = columnas[1];
                y = columnas[2];

                // Nuevo punto
                var newPoint = new OpenLayers.LonLat( x, y );
                newPoint.transform( new OpenLayers.Projection( 'EPSG:4326' ),
                    new OpenLayers.Projection( 'EPSG:900913' ) );
                // Movemos el vehiculo
                taxiFeature.move( newPoint );

                // Actualizamos Fecha y Hora
                taxiFeature.attributes.fecha = columnas[4];
                taxiFeature.attributes.dir = columnas[7];
                taxiFeature.attributes.std = columnas[6];

                if (seguirVehiculo) {
                    centrarMapa(newPoint.lon, newPoint.lat, zoom);
                }

                if ( poppedup == true ) {
                    selectControl.select( taxiFeature );
                }
            }
        } //FIN DE ELSE DEL OBJETO NULO
    }
}


//idVeh, coordPuntos
function lienzosRecorridoHistorico(idVeh, coordPuntos){
    //buscar DIV y colocar identificador
    var idVehiculoR = document.getElementById('idVeh');
    idVehiculoR.innerHTML = 'Vehiculo : ' + idVeh;

    lienzoPuntos.destroyFeatures();

    var features = new Array();

    //Recuperar posiciones del recorrido
    var fil = coordPuntos.split('#');
    var cantPuntos = 0;

    //PUNTOS PARA RUTA
    var puntosRuta = new Array();

    //punto Inicial y Final

    var size = new OpenLayers.Size(32, 32);
    var iconIni = new OpenLayers.Icon(
        'img/inicio.png',
        size, null, 0);

    var iconFin = new OpenLayers.Icon(
        'img/fin.png',
        size, null, 0);


    var filIni = fil[0].split('%');

    markerInicioFin.clearMarkers();

    var pInicio = new OpenLayers.LonLat(filIni[0],filIni[1]);
    pInicio.transform(new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ) );

    var data = new OpenLayers.Marker(pInicio, iconIni);
    markerInicioFin.addMarker(data);


    var filFin = fil[fil.length-2].split('%');


    var pFin = new OpenLayers.LonLat(filFin[0],filFin[1]);
    pFin.transform(new OpenLayers.Projection( 'EPSG:4326' ),
        new OpenLayers.Projection( 'EPSG:900913' ) );
    markerInicioFin.addMarker(new OpenLayers.Marker(pFin, iconFin));


    var lonIni;
    var latIni;
    var lonFin;
    var latFin;

    distanciaKM = 0;

    for ( i=0; i<fil.length-1; i++ ) {

        var col = fil[i].split('%');
        var evtparm1 = col[5];

        var pt = new OpenLayers.Geometry.Point(col[0],col[1]);
        pt.transform( new OpenLayers.Projection( 'EPSG:4326' ),
            new OpenLayers.Projection( 'EPSG:900913' ) );

        //Cargar punto de inicio
        if (i==0) {
            lonIni = col[0];
            latIni = col[1];
        }else{
            var tramo = distancia(lonIni, latIni, col[0], col[1]);
            distanciaKM += tramo;
            lonIni = col[0];
            latIni = col[1];
        }

        puntosRuta.push(pt);

        var puntoMap = new OpenLayers.Feature.Vector( pt, {
            id_estado : i,
            fecha : col[2],
            hora : col[3],
            velo : col[4],
            poppedup : false,
            evt: evtparm1,
            evtD: col[6]
        }
        );

        puntoMap.id = i;

        puntoMap.state = evtparm1;  //para que los puntos tengan color

        features.push(puntoMap);

        cantPuntos++;
    }

    if (puntosRuta.length > 0){

        var ruta = new OpenLayers.Geometry.LineString(puntosRuta);

        //Estilo de Linea de Recorrido
        var style = {
            strokeColor: '#0000ff',
            strokeOpacity: 0.3,
            strokeWidth: 5
        };

        var lineFeature = lienzoRecorridos.getFeatureById( 'trazado' );
        if (lineFeature != null){
            lineFeature.destroy();
        }

        lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
        lineFeature.id = 'trazado';
        lienzoRecorridos.addFeatures([lineFeature]);

        var context = function(feature) {
            return feature;
        }

        stylePuntos.addUniqueValueRules('default', 'state', lookup, context);
        lienzoPuntos.addFeatures(features);

        centrarMapa(pInicio.lon, pInicio.lat, zoom - 1);


    }else{
        alert ('NO HAY REGISTROS ENTRE ESA FECHA Y HORA');
    }

}

function redondear(num, dec){
    num = parseFloat(num);
    dec = parseFloat(dec);
    dec = (!dec ? 2 : dec);
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function buscarVehiculo(numVeh){

    var lienzoB = map.getLayer('CAR_Layer');

    if (lienzoB == null){
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'Par&aacute;metros no v&aacute;lidos',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });

        return null;

    }else{

        if (lienzoB.getVisibility()){

            var vehiculo = lienzoB.getFeatureById( numVeh );

            if (vehiculo == null){

                Ext.MessageBox.show({

                    title: 'Error...',

                    msg: 'Veh&iacute;culo no encontrado',

                    buttons: Ext.MessageBox.OK,

                    icon: Ext.MessageBox.ERROR

                });

                return null;

            }else{

                //onFeatureSelect(vehiculo); //Activar Globo
                centrarMapa(vehiculo.geometry.x,vehiculo.geometry.y, 17);

            }

        }else{

            Ext.MessageBox.show({

                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa <br>en la parte derecha (+)',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
    }
}

function centrarMapa(ln, lt, zoom){

    //zoom max = 18

    var nivelZoom = zoom;

    var lonlatCenter = new OpenLayers.LonLat(ln,lt);

    map.setCenter ( lonlatCenter, nivelZoom );

}

/*********** ACCIONES DE FEATURES ***********/
//Acciones de los Puntos de Recorridos
function onPopupPuntoClose( feature ) {
    //Ocultar Información
    var div1 = document.getElementById('infor');
    div1.style.display = 'none';
}

function onPuntoUnselect( feature ) {
    //Ocultar la tabla de Información
    var div1 = document.getElementById('infor');
    div1.style.display = 'none';
}

function onPuntoSelect( feature ) {

    var id = feature.id;
    //Cargar contenido en la tabla
    var factor = [-1,0,1];
    var i;

    for (i=0; i<3; i++){
        var idP = id+factor[i];
        var puntoInfo = lienzoPuntos.getFeatureById(idP);
        var fecP = '';
        var horP = '';
        var otroP = '';
        var evtP = '';

        if (puntoInfo!=null){
            fecP = puntoInfo.attributes.fecha;
            horP = puntoInfo.attributes.hora;
            otroP = puntoInfo.attributes.velo;
            otroP =  redondear(otroP, 2);
            evtP = puntoInfo.attributes.evtD;
        }else{
            idP = '';
        }

        //Añadirlos a la tabla
        var idPos = i + 1;

        var numX = document.getElementById('num'+idPos);
        numX.innerHTML = idP;

        var fechaX = document.getElementById('fecha'+idPos);
        fechaX.innerHTML = fecP;

        var horaX = document.getElementById('hora'+idPos);
        horaX.innerHTML = horP;

        var otrX = document.getElementById('otr'+idPos);
        otrX.innerHTML = otroP;

        var eventoId = document.getElementById('evt'+idPos);
        eventoId.innerHTML = evtP;

        //Cargar Distancia
        var distX = document.getElementById('distKM');
        distX.innerHTML =   redondear(distanciaKM, 2);

    }

    //Visualizar la tabla de Información
    var div1 = document.getElementById('infor');
    div1.style.display = '';

}

//Acciones Vehiculos
function onVehiculoSelect( feature ) {

    var placa = feature.attributes.placa;
    var fec = feature.attributes.fecha;
    var dir = feature.attributes.dir;
    var std = feature.attributes.std;
    var veloc = feature.attributes.velo;

    var p1 = new OpenLayers.Geometry.Point(feature.geometry.x , feature.geometry.y);

    // Transformaci�n de coordendas
    p1.transform( new OpenLayers.Projection( 'EPSG:900913' ),
        new OpenLayers.Projection( 'EPSG:4326' ) );

//FramedCloud
    var popup = new OpenLayers.Popup.AnchoredBubble( null,
        new OpenLayers.LonLat( feature.geometry.x, feature.geometry.y ),
        null,

            '<div style=\'font-size:.8em; width:150px\'> <BR> <b>Veh:  </b> <div style=\'padding:0px 0px 0px 15px\'>'
            + placa + '</div><b><BR> Dir:  </b> <div style=\'padding:0px 0px 0px 15px\'>'
            + dir + '</div><b><BR> Estd: </b> <div style=\'padding:0px 0px 0px 15px\'>'
            + std + '</div><b> <BR> Vel: </b> '
            + redondear(veloc*1.852,2) + ' km/h <b> <BR> Fecha: </b> <div style=\'padding:0px 0px 0px 15px\'>' + fec +  '</div><b></b></div>'
        ,
        null, true,  function () {
            onVehiculoClose( feature )
        }
        );
        popup.autoSize= true;
        popup.setBackgroundColor('#E8FFD4');

    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup( popup );
}

function onVehiculoClose( feature ) {
    selectFeatures.unselect( feature );
}

function onVehiculoUnselect( feature ) {
    map.removePopup( feature.popup );
    feature.popup.destroy();
    feature.attributes.poppedup = false;
    feature.popup = null;
}

</script>
";
?>
