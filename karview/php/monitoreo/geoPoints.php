<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$consultaSql = "SELECT LAT_GEOC_POINT, LONG_GEOC_POINT FROM GEOCERCA_POINTS
                WHERE ID_GEOCERCA = $g
                ORDER BY ORDEN";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$mayor = "";

$salida = '{"d":[ ';
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    if ($i != 0) {
        $salida .= ",";
    }
    $salida .= '{"t":' . $fila["LAT_GEOC_POINT"] . ', "l":' . $fila["LONG_GEOC_POINT"] . '}';
}
$salida .= "]}";

echo $salida;

?>
