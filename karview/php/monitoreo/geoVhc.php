<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$consultaSql = "SELECT CONCAT(V.NUM_VH,'_',V.PLACA_VH,'_',V.PSEUDO_NOMB) 
    AS DT FROM VEHICULOS_PART V, VEHICULOS_GEOCERCAS VG
    WHERE V.ACT = 1 AND VG.ID_GEOCERCA = $idgeo
    AND VG.ID_VH = V.ID_VH";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
if (count($resulset) >= 1) {
    $salida = '
        {"dt": [';
    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];

        $a = $fila["DT"];

        if ($i > 0) {
            $salida .= ",";
        }
        $salida .= '{"a":"' . $a . '"}';

    }
    $salida .= ']}';
}
echo $salida;
?>



