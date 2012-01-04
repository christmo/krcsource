<?php

/**
    NOTA: Este archivo es llamado en una página diferente
    en la cual no se necesita inicio de sesión.
**/

require_once('../../dll/conect.php');

$consultaSql = "
SELECT EQUIPO, TAXI, FH_CON, FH_DES, TMPCON, TMPDES,BATERIA, GSM, GPS2, ESTADO, FECHA_ESTADO, VEL, ING  FROM ESTADO_EQUIPOS;
";


$resulset = consultaJSON($consultaSql);
$arr = array();
while ($obj = mysql_fetch_object($resulset))
    $arr[] = $obj;
echo '' . json_encode($arr) . '';
?>
