<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$consultaSql =
        "
SELECT B.FECHA, B.HORA, B.LATITUD,
B.LONGITUD, B.G2, B.VELOCIDAD, B.G1, B.DIRECCION, EVTP.DESC_EVENTO
        FROM
  RECORRIDOS B, SKY_EVENTOS EVTP
WHERE
  (B.ID BETWEEN REPLACE('$fechaIniEvt','-','') AND REPLACE('$fechaFinEvt','-',''))
AND
(CONCAT(B.FECHA,B.HORA) BETWEEN '$fechaIniEvt$horaIniEvt' AND '$fechaFinEvt$horaFinEvt')
AND
  B.ID_EMPRESA = 'PT' AND B.N_UNIDAD = '$idVeh'
AND EVTP.ID_EVENTO = '$IdEvento'
AND B.EVT = EVTP.CATEGORIA
AND B.PARM1 = EVTP.PARAM1
ORDER BY B.FECHA, B.HORA DESC
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";

$salida = "{failure:true}";
$datos = "";

if (count($resulset) >= 1) {
    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $datos .= $fila["LONGITUD"] . "%"
                . $fila["LATITUD"] . "%"
                . $fila["FECHA"] . "%"
                . $fila["HORA"] . "%"
                . $fila["VELOCIDAD"] . "%"
                . utf8_encode($fila["DIRECCION"]) . "%"
                . utf8_encode($fila["DESC_EVENTO"]) . "#";
    }
    $salida = "{success:true,datos: { coordenadas: '$datos' }}";
}

echo $salida;
?>
