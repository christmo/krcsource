<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);

if (strlen($t) < 14 ) {
    $t = date('Y-m-d H:i:s', time());
}

$consultaSql = "

SELECT
      GH1.ACCION, GH1.FECHA, 
      CONCAT(VP.PLACA_VH,'  ',VP.PSEUDO_NOMB) VH,
      G.NOMBRE_GEOC
FROM
      GEOCERCAS_HISTORIAL GH1, (
              SELECT GH.ID_VH, MAX(GH.FECHA) FH
              FROM GEOCERCAS_HISTORIAL GH
              GROUP BY GH.ID_VH
              HAVING FH > '$t'

              AND GH.ID_VH IN (
                SELECT V.ID_VH FROM VEHICULOS_USUARIOS_PART v
                WHERE ID_USUARIO = " . $_SESSION["ID_USER"] . "
              )

              ORDER BY GH.FECHA) AS GH2,
      VEHICULOS_PART VP,
      GEOCERCAS G
WHERE
      VP.ACT = 1
      AND GH1.ID_VH = GH2.ID_VH
      AND GH1.FECHA = GH2.FH
      AND VP.ID_VH = GH1.ID_VH
      AND G.ID_GEOCERCA = GH1.ID_GEOCERCA

ORDER BY FECHA
    ";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$mayor = $t;

$sld = '{"d":[';

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    $acc = $fila["ACCION"];
    $fh = $fila["FECHA"];
    $vh = $fila["VH"];
    $geo = $fila["NOMBRE_GEOC"];

    if ($fh > $mayor) {
        $mayor = $fh;
    }

    if ($i != 0) {
        $sld.= ",";
    }

    $sld .= '{"a":"' . $acc . '",
             "f":"' . $fh . '",
             "v":"' . $vh . '",
             "g":"' . $geo . '"}';
}

$sld .= '],"t":"' . $mayor . '"}';

echo $sld;

?>
