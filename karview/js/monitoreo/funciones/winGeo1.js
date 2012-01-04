
var g1ContenedorWin;
var g1Win;
var g1IdVehcPuntos;
//paramReporte
var g1Vehiculo;
var g1NumVehc;
//store Geocercas
var g1StoreGeo;

Ext.onReady(function(){


    var idGridSelect = -1;
    var idGeoRigthClic = -1;

    var strVhc = new Ext.data.JsonStore({
        url:'php/monitoreo/geoVhc.php',
        baseParams:{
            idgeo:99
        },
        root: 'dt',
        fields: [{
            name:'a'
        },{
            name:'b'
        },{
            name:'c'
        }]
    });

    //Menu clic derecho
    var mnuContextGrid = new Ext.menu.Menu({
        items: [{
            id: 'op1',
            text: 'Ver'
        }],
        listeners: {
            itemclick: function(item) {
                if (idGeoRigthClic!= -1) {
                    graficarGeoCerca(idGeoRigthClic);
                }
            }
        }
    });

    //funcional
    var g1Name = new Ext.form.TextField({
        fieldLabel:'Nombre',
        name:'g1Name',
        emptyText:'',
        id:"g1Name",
        readOnly: true,  //Deshabilitado el color debe ser cambiado para visualizarlo mejor
        width:150
    });

    //funcional
    var g1Desc = new Ext.form.TextArea({
        fieldLabel:'Descripción',
        name:'g1Desc',
        emptyText:'',
        id:"g1Desc",
        readOnly: true,
        width:150
    });

    //Grid Geocercas
    var g2GridGeo = new Ext.grid.GridPanel({
        store: auxStore,
        hideHeaders: true,
        title: "GeoCercas",
        columns: [
        {
            id:'an',
            hiden: true,
            dataIndex: 'a'  //------> correspondencia con el Store
        },
        {
            id:'bn',
            width: 130,
            sortable: false,
            dataIndex: 'b',  //------> correspondencia con el Store
            renderer: center
        },
        {
            id:'desc',
            dataIndex: 'c'  //------> correspondencia con el Store
        }
        ],
        stripeRows: true,
        height: 200,
        width: 150,
        stateful: true,
        stateId: 'g2GridGeo',
        listeners: {
            rowclick:function(grid, rowIndex, e) {

                //Captura de datos (fila)
                var dataG = grid.getStore().getAt(rowIndex)
                //Data
                idGridSelect = dataG.get('a');
                //Llenar formulario
                g1Name.setValue(dataG.get('b'));
                g1Desc.setValue(dataG.get('c'));
                //Cargar vehiculos
                strVhc.baseParams.idgeo = dataG.get('a');
                strVhc.reload();
            },
            rowcontextmenu: function(grid, row, e) {
                e.stopEvent();
                var posXY = new Array(2) ;
                posXY[0] = window.event.clientX ;
                posXY[1] = window.event.clientY ;
                Filag2GridGeo = g2GridGeo.getStore().getAt(row);
                idGeoRigthClic = Filag2GridGeo.get('a');
                mnuContextGrid.showAt(posXY);
            }
        }
    });
    //oculta la primer y tercer columna
    g2GridGeo.getColumnModel().setHidden(0, true);
    g2GridGeo.getColumnModel().setHidden(2, true);


    //funcional
    var g1GridVh = new Ext.grid.GridPanel({
        store: strVhc,
        hideHeaders: true,
        title: "Vehiculos",
        columns: [
        {
            id:'vh',
            width: 130,
            sortable: false,
            dataIndex: 'a',  
            renderer: center
        }
        ],
        stripeRows: true,
        height: 130,
        width: 150,
        stateful: true,
        stateId: 'g1GridVh'
    });

    //Panel Contenedor Principal
    g1ContenedorWin = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,
        items: [{
            layout:'column',
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                items: [g2GridGeo]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [
                g1Name, g1Desc, g1GridVh
                ]
            }]
        },
        ],
        buttons: [ {
            text: 'OK',
            handler: g1Clean
        },{
            text: 'Eliminar',
            handler: function() {
                lienzoGeoCercas.destroyFeatures();
                if (idGridSelect != -1) {
                    Ext.MessageBox.confirm("Confirmar","Esto borrará la geocerca del sistema.",
                        function(btn){
                            if(btn == 'yes'){
                                delGeoCerca(idGridSelect,strVhc, g1Name, g1Desc);
                                idGridSelect = -1;
                            }
                        });
                }
            }
        }]
    });
});

/* oculta la venta y limpia los datos no guardados */
function g1Clean(){

    lienzoGeoCercas.destroyFeatures();

    g1ContenedorWin.getForm().reset();
    if (g1Win != null) {
        g1Win.hide();
    }
    
}

function g1Window(){

    if(!g1Win){
        g1Win = new Ext.Window({
            layout:'fit',
            title:'Geocercas',
            resizable : false,
            width:500,
            height:325,
            closeAction:'hide',
            plain: true,
            items: [g1ContenedorWin],
            listeners: {
                hide:function(f) {
                    lienzoGeoCercas.destroyFeatures();
                }
            }
        });
    }
    g1Win.show(this);
}

/**
 * Grafica una geoCerca sobre el mapa
 * de acuerdo a su ID
 */
function graficarGeoCerca(idGeo) {

    lienzoGeoCercas.destroyFeatures();
    
    Ext.MessageBox.show({
        title:'Trazado de Geocerca',
        msg: 'GeoCerca',
        progressText: 'Trazando...',
        width:200,
        wait:true,
        waitConfig: {
            interval:200
        }
    });

    //Extraer puntos
    Ext.Ajax.request({
        url: 'php/monitoreo/geoPoints.php',
        method: 'POST',
        params :{
            g:idGeo
        },
        success: function(response){
            Ext.MessageBox.hide();
            var resultado = Ext.util.JSON.decode(response.responseText);
            var site_points = new Array();

            for(var i in resultado.d){
                if (resultado.d[i].l != undefined  &&
                    resultado.d[i].t != undefined) {
                    var point = new OpenLayers.Geometry.Point(resultado.d[i].l, resultado.d[i].t);
                    point.transform( new OpenLayers.Projection('EPSG:4326'),
                        new OpenLayers.Projection( 'EPSG:900913' ) );                        
                    site_points.push(point);
                }
            }
            site_points.push(site_points[0]);
            var linear_ring = new OpenLayers.Geometry.LinearRing(site_points);
            var polygonFeature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Polygon([linear_ring]), null, null);
                        
            lienzoGeoCercas.addFeatures([polygonFeature]);

            
            map.setCenter ( new OpenLayers.LonLat( site_points[0].x, site_points[0].y ), 13);

        },
        failure: function(){
            Ext.MessageBox.hide();
            Ext.MessageBox.show({
                title: 'Problemas',
                msg: 'No se pudo trazar la GeoCerca',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });

}

/**
* Elimina una geoCerca en base a su ID
*/
function delGeoCerca(idGeo,strVhc, g1Name, g1Desc) {
    $.post("php/monitoreo/geoVhcDel.php", {
        idgeo: idGeo
    },
    function(data){
        if (data == 1) {
            Ext.MessageBox.show({
                title: 'Eliminado',
                msg: 'GeoCerca Eliminada',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.OK
            });
            strVhc.removeAll(false);
            g1Name.setValue("");
            g1Desc.setValue("");
            auxStore.load();
            
        }else{
            Ext.MessageBox.show({
                title: 'Eliminado',
                msg: 'No se pudo eliminar la Geocerca',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}
