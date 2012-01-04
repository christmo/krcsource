<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$consultaSql =
        "
SELECT B.N_UNIDAD, B.ID_EMPRESA, B.FECHA, B.HORA, B.LATITUD,
B.LONGITUD, B.G2, B.VELOCIDAD, B.G1, B.DIRECCION, EVTP.DESC_EVENTO
        FROM
  RECORRIDOS B, SKY_EVENTOS EVTP
WHERE
  (B.ID BETWEEN REPLACE('$fechaIni','-','') AND REPLACE('$fechaFin','-',''))
AND
(CONCAT(B.FECHA,B.HORA) BETWEEN '$fechaIni$horaIni' AND '$fechaFin$horaFin')
AND
  B.ID_EMPRESA = 'PT' AND B.N_UNIDAD = '$idVeh'
AND B.EVT = EVTP.CATEGORIA
AND B.PARM1 = EVTP.PARAM1
ORDER BY B.FECHA, B.HORA DESC;
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$estTemporal = "S/E";


$salida = "{failure:true}";
$datos = "";

if (count($resulset) >= 1) {

    $estadosFormat = "";
    $estActual = "S/E";
    $fono = "S/T";
    if (count($resulset) >= 1) {

        $estadosFormat = "";
        $estActual = "S/E";
        $fono = "S/T";

        for ($i = 0; $i < count($resulset); $i++) {

            $fila = $resulset[$i];
            $variosEstados = false;
            $estadosFormat = "";

            $datos .= $fila["LONGITUD"] . "%"
                    . $fila["LATITUD"] . "%"
                    . $fila["FECHA"] . "%"
                    . $fila["HORA"] . "%"
                    . $fila["VELOCIDAD"] . "%"
                    . utf8_encode($fila["DIRECCION"]) . "%"
                    . utf8_encode($fila["DESC_EVENTO"]) . "#";
        }
    }

    $salida = "{success:true,datos: { coordenadas: '$datos' }}";
}

echo $salida;

?>
