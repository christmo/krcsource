<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_GET);

if (strlen($t) < 14 && $t != 0) {
    $t = "";
}
$consultaSql = "
        SELECT DISTINCT A.N_UNIDAD, A.LONGITUD, A.LATITUD, A.VELOCIDAD, A.FECHA_HORA,
        A.PLACA_VH,
        A.DESC_EVENTO, A.DIRECCION, VP.IMAGEN_VH, VP.IMG_W_VH, VP.IMG_H_VH
        FROM ULTIMOS_GPS A, VEHICULOS_USUARIOS_PART VUP, VEHICULOS_PART VP
        WHERE 
        VP.ACT = 1 AND
        VUP.ID_USUARIO = " . $_SESSION["ID_USER"] . "
        AND VUP.ID_VH = VP.ID_VH
        AND A.N_UNIDAD = VP.ID_EQUIPO
        AND A.FECHA_HORA > '$t'
        AND VP.PLACA_VH = A.PLACA_VH
        ORDER BY FECHA_HORA
    ";


consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$mayor = "";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    $salida .= $fila["N_UNIDAD"] . "%" .
            $fila["LONGITUD"] . "%" .
            $fila["LATITUD"] . "%" .
            $fila["VELOCIDAD"] . "%" .
            $fila["FECHA_HORA"] . "%" .
            $fila["PLACA_VH"] . "%" .
            $fila["DESC_EVENTO"] . "%" .
            $fila["DIRECCION"] . "%" .
            $fila["IMAGEN_VH"] . "%" .  
            $fila["IMG_W_VH"] . "%" .
            $fila["IMG_H_VH"] . "#";

    if ($fila["FECHA_HORA"] > $mayor) {
        $mayor = $fila["FECHA_HORA"];
    }
}


$obj = array("t" => $mayor, "d" => utf8_encode($salida));
echo "" . json_encode($obj) . "";
?>
