<?php
include '../login/isLogin.php';
require_once('../../dll/conect.php');

$salida = "{failure:true}";
$consultaSql = "SELECT ID_EVENTO, DESC_EVENTO FROM SKY_EVENTOS";

consulta($consultaSql);
$resulset = variasFilas();
$salida = "{\"eventos\": [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"id\":\"" . $fila["ID_EVENTO"] . "\",
            \"name\":\"" . $fila["DESC_EVENTO"] . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";
echo $salida;
?>
