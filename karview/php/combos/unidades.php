<?php

    include "../login/isLogin.php";
    require_once('../../dll/conect.php');

    $salida = "{failure:true}";

    $consultaSql = "SELECT VP.PLACA_VH, VP.MARCA_VH, VP.MODELO_VH, VP.NUM_VH, VP.ID_EQUIPO, VP.PSEUDO_NOMB
    FROM VEHICULOS_PART VP, VEHICULOS_USUARIOS_PART VUP
    WHERE
    VP.ACT = 1 AND
    VUP.ID_USUARIO = " . $_SESSION["ID_USER"] . " AND VP.ID_VH = VUP.ID_VH
    ORDER BY VP.NUM_VH";

    consulta($consultaSql);

    $resulset = variasFilas();

    $salida = "{\"unidades\": [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
                \"id\":\"" . $fila["ID_EQUIPO"] . "\",
                \"name\":\" ".$fila["NUM_VH"]." - " . $fila["PLACA_VH"] . " - " . $fila["PSEUDO_NOMB"] . " - ". $fila["MARCA_VH"] . " - " . $fila["MODELO_VH"]  . "\"
            }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";

    echo $salida;
?>
