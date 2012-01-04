<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

$consultaSql = "SELECT G.ID_GEOCERCA, G.NOMBRE_GEOC, G.DESC_GEOC
FROM VEHICULOS_GEOCERCAS VG, GEOCERCAS G, VEHICULOS_USUARIOS_PART VUP
WHERE VUP.ID_USUARIO = " . $_SESSION["ID_USER"] . "
AND VG.ESTADO != 'E'
AND VUP.ID_VH = VG.ID_VH
AND VG.ID_GEOCERCA = G.ID_GEOCERCA";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
if (count($resulset) >= 1) {
    $salida = '
        {"dt": [';
    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];

        $a = $fila["ID_GEOCERCA"];
        $b = $fila["NOMBRE_GEOC"];
        $c = $fila["DESC_GEOC"];

        if ($i > 0) {
            $salida .= ",";
        }
        $salida .= '{"a":"' . $a . '","b":"' . utf8_encode($b) . '","c":"' . utf8_encode($c) . '"}';

    }
    $salida .= ']}';
}
echo $salida;
?>



