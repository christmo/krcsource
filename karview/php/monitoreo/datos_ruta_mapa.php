<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$consultaSql =
        "
SELECT B.N_UNIDAD, B.ID_EMPRESA, B.FECHA, B.HORA, B.LATITUD,
B.LONGITUD, B.G2, (B.VELOCIDAD * 1.852) AS VELOCIDAD, B.G1, SK.ABV, SK.ID_EVENTO
        FROM
  RECORRIDOS B, SKY_EVENTOS SK
WHERE
(B.ID BETWEEN REPLACE('$fechaIni','-','') AND REPLACE('$fechaFin','-',''))
AND
(CONCAT(B.FECHA,B.HORA) BETWEEN '$fechaIni$horaIni' AND '$fechaFin$horaFin')
AND
  B.ID_EMPRESA = 'PT' AND B.N_UNIDAD = '$idVeh'
AND
  SK.CATEGORIA = B.EVT
AND
  SK.PARAM1 = B.PARM1
ORDER BY B.FECHA, B.HORA;
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

    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $variosEstados = false;
        $estadosFormat = "";

        $datos .= $fila["LONGITUD"] . "%" . $fila["LATITUD"] . "%" .
                $fila["FECHA"] . "%" . $fila["HORA"] . "%" .
                round($fila["VELOCIDAD"],2) . "%" . $fila["ID_EVENTO"] . 
                "%". $fila["ABV"]. "#";
    }

    $salida = "{success:true,datos: { coordenadas: '$datos' }}";
}

echo $salida;

?>
