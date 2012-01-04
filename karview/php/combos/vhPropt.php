<?php

    include '../login/isLogin.php';
    require_once('../../dll/conect.php');


    //TODO: PERMITIR VER TODOS LOS USUARIOS
    //      CUANDO EL ROL SEA ADMINISTRADOR

    $idUserNormal = 3;

    $consultaSql = "SELECT P.ID_PER,
        CONCAT(P.CEDULA_PROP,' | ',CONCAT (P.NOMBRES_PROP,' ',P.APELLIDOS_PROP)
        ) AS NAME  FROM PERSONAS P
        wHERE
        P.ID_ROL = $idUserNormal";

    consulta($consultaSql);
    $rstProp = variasFilas();

    $salida = "{\"p\": [";

    for ($i = 0; $i < count($rstProp); $i++) {

        $fila = $rstProp[$i];
        $idP = $fila["ID_PER"];
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
