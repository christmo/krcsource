<?php
    include '../login/isLogin.php';
    require_once('../../dll/conect.php');

    extract($_GET);

    $salida = "{failure:true}";

    $consultaSql = "
    SELECT
      DISTINCT G.ID_GEOCERCA, G.NOMBRE_GEOC
    FROM
      GEOCERCAS G,
      VEHICULOS_GEOCERCAS VG,
      VEHICULOS_PART VP
    WHERE
      VP.ACT = 1
      AND VP.ID_EQUIPO = $e AND
      VG.ID_VH = VP.ID_VH AND
      VG.ID_GEOCERCA = G.ID_GEOCERCA";

    consulta($consultaSql);

    $resulset = variasFilas();

    $salida = "{\"d\": [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
                \"id\":\"" . $fila["ID_GEOCERCA"] . "\",
                \"name\":\"" . $fila["NOMBRE_GEOC"] . "\"
            }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";

    echo $salida;
?>
