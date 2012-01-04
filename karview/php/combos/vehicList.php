<?php

    include '../login/isLogin.php';
    require_once('../../dll/conect.php');

    $consultaSql = "SELECT V.ID_VH, CONCAT(V.PLACA_VH, ' | ',
        V.PSEUDO_NOMB,' | ', V.MODELO_VH) AS NAME FROM VEHICULOS_PART V WHERE V.ACT = 1";

    consulta($consultaSql);
    $rstProp = variasFilas();

    $salida = "{\"p\": [";

    for ($i = 0; $i < count($rstProp); $i++) {

        $fila = $rstProp[$i];
        $idP = $fila["ID_VH"];
        $nm = $fila["NAME"];

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
