<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$g2VehList = str_replace("-1,", "", $g2VehList);
$g2VehList = str_replace(",-1", "", $g2VehList);
$g2VehList = str_replace("-1", "", $g2VehList);

$coord = explode(";", $g2Coord);

$g2Area = substr($g2Area, 0, strlen($g2Area) - 4);

$est = pasosInsersion($g2Name, $g2Desc, $g2Area, $g2VehList, $coord);

if ($est == 0) {
    echo "{success:false}";
} else {
    echo "{success:true}";
}

function pasosInsersion($g2Name, $g2Desc, $g2Area, $g2VehList, $coord) {
    //Extracción de ID
    $sql = "SELECT MAX(ID_GEOCERCA) AS M FROM GEOCERCAS";
    consulta($sql);
    $id = unicaFila();
    $idGeo = $id["M"];
    $idGeo++;

    //Inserción de GeoCerca. Datos iniciales
    $sql = " INSERT INTO GEOCERCAS(ID_GEOCERCA, NOMBRE_GEOC, DESC_GEOC, AREA)
    VALUES($idGeo, '$g2Name', '$g2Desc', $g2Area) ";
    $val = consulta($sql);

    if ($val == 0) {
        return 0;
    }

    //Vinculación de Vehículos
    $vehVector = explode(",", $g2VehList);
    for ($i = 0; $i < count($vehVector); $i++) {

        //Extracción ID de vehículo según ID de equipo
        $sql = "SELECT DISTINCT ID_VH FROM VEHICULOS_PART
                WHERE ACT = 1 AND ID_EQUIPO = $vehVector[$i]
                LIMIT 1";
        consulta($sql);
        $idVh = unicaFila();
        $idVh = $idVh["ID_VH"];


        $sql = " INSERT INTO VEHICULOS_GEOCERCAS (ID_GEOCERCA, ID_VH, ESTADO, ULTIMO_ESTADO)
                VALUES($idGeo, $idVh, 'C', 0)";
        $val = consulta($sql);
        if ($val == 0) {
            return 0;
        }
    }

    //Vinculación de Puntos a la GeoCerca
    for ($i = 0; $i < count($coord); $i++) {
        $xy = explode(",", $coord[$i]);
        $sql = "INSERT GEOCERCA_POINTS(ID_GEOCERCA, LAT_GEOC_POINT, LONG_GEOC_POINT, ORDEN)
    VALUES($idGeo, $xy[1], $xy[0], " . ($i + 1) . ")";
        $val = consulta($sql);
        if ($val == 0) {
            return 0;
        }
    }
    return 1;
}
?>