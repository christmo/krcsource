<?php

    include '../login/isLogin.php';
    require_once('../../dll/conect.php');

    $consultaSql = "
            SELECT T2.ID_EQUIPO, PLACA_VH, T2.NUM_VH, T2.PSEUDO_NOMB
            FROM VEHICULOS_USUARIOS_PART T1, VEHICULOS_PART T2
            WHERE 
            T2.ACT = 1 AND
            T1.ID_VH = T2.ID_VH AND
            T1.ID_USUARIO = " . $_SESSION["ID_USER"] . " ORDER BY T2.NUM_VH";

    consulta($consultaSql);
    $resulsetCoop = variasFilas();

    $salida = "{\"unidades\": [";

    for ($i = 0; $i < count($resulsetCoop); $i++) {

        $fila = $resulsetCoop[$i];

        $idEquipo = $fila["ID_EQUIPO"];
        $placa = $fila["PLACA_VH"];
        $numVh = $fila["NUM_VH"];
        $pseudName = $fila["PSEUDO_NOMB"];

        $salida .= "{
                \"value\":\"$idEquipo\",
                \"text\":\" No. $numVh - $placa - $pseudName\"
            }";
        if ($i != count($resulsetCoop) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";
    echo $salida;

?>
