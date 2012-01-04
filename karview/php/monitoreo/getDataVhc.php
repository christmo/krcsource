<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$consultaSql = "
SELECT
  VP.PLACA_VH,
  VP.ID_PROP,
  VP.MODELO_VH,
  VP.ANIO_VH,
  VP.MARCA_VH,
  VP.PSEUDO_NOMB,
  VP.INF_ADICIONAL_VH,
  VP.IMAGEN_VH,
  VP.NUM_VH
FROM
  VEHICULOS_PART VP
WHERE
  VP.ACT = 1 AND
  VP.ID_EQUIPO = $v LIMIT 1";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$mayor = "";

$salida = '{"d":[ ';
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    /*

      VP.PLACA_VH,   -- a
      VP.ID_PROP,-- b
      VP.MODELO_VH,-- c
      VP.ANIO_VH,-- d
      VP.MARCA_VH,-- e
      VP.PSEUDO_NOMB,-- f
      VP.INF_ADICIONAL_VH,-- g
      VP.IMAGEN_VH,-- h
      VP.NUM_VH-- i

     */

    $salida .= '{ "a":"' . $fila["PLACA_VH"] .
              '", "b":"' . $fila["ID_PROP"] .
              '", "c":"' . $fila["MODELO_VH"] .
              '", "d":"' . $fila["ANIO_VH"] .
              '", "e":"' . $fila["MARCA_VH"] .
              '", "f":"' . $fila["PSEUDO_NOMB"] .
              '", "g":"' . $fila["INF_ADICIONAL_VH"] .
              '", "h":"' . $fila["IMAGEN_VH"] .
              '", "i":"' . $fila["NUM_VH"] .
              '"}';
}
$salida .= "]}";

echo $salida;
?>
