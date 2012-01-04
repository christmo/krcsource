<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


$consultaSql = "  SELECT CE.ESTADO, CE.COLOR, SE.DESC_EVENTO FROM COLOR_ESTADOS CE LEFT JOIN SKY_EVENTOS SE ON CE.ESTADO = SE.ID_EVENTO";

consulta($consultaSql);
$resulset = variasFilas();

$salida = '{ "d": [ ';
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    if ($i > 0) {
        $salida.= ",";
    }
    $salida.= '{"k": "' . $fila["ESTADO"] . '",';
    $salida.= '"v": "' . $fila["COLOR"] . '",';
    $salida.= '"de": "' . $fila["DESC_EVENTO"] . '"}';
}
$salida.= "]}";

echo $salida;


?>
