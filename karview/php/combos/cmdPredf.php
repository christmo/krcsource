<?php

    include '../login/isLogin.php';
    require_once('../../dll/conect.php');

    $consultaSql = "SELECT C.CMD_ID, c.CMD_DESC FROM CMD_PREDEFINIDOS C";

    consulta($consultaSql);
    $rstProp = variasFilas();

    $salida = "{\"p\": [";

    for ($i = 0; $i < count($rstProp); $i++) {

        $fila = $rstProp[$i];
        $idP = $fila["CMD_ID"];
        $nm = $fila["CMD_DESC"];

        if ($i > 0) {
            $salida .= ",";
        }

        $salida .= '{
                "id":"' . utf8_encode($idP) . '",
                "name":"' . utf8_encode($nm) . '"
            }';
    }

    $salida .="]}";
    echo $salida;

?>
