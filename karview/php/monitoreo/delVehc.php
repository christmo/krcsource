<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$consultaSql = "
    UPDATE VEHICULOS_PART
    SET ACT = 0
    WHERE ID_EQUIPO = $v";

consulta($consultaSql);

if (mysql_errno() == 0) {
    echo "{success:true}";
} else {
    $salida = "{success:false,d:'[" . mysql_errno() . "] No se pudo eliminar el Vehiculo'}";
}

?>
