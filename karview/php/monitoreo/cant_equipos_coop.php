<?php

/**
    NOTA: Este archivo es llamado en una página diferente
    en la cual no se necesita inicio de sesión.
**/

require_once('../../dll/conect.php');

$consultaSql = "
SELECT ID_EMPRESA, CANT FROM CANTIDAD_EQUIPOS_X_COOP;
";

$resulset = consultaJSON($consultaSql);
$arr = array();
while ($obj = mysql_fetch_object($resulset))
    $arr[] = $obj;
echo '' . json_encode($arr) . '';
?>
