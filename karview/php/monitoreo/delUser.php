<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$consultaSql = "
    UPDATE PERSONAS
    SET ESTADO = 0
    WHERE ID_PER = $v";

consulta($consultaSql);

if (mysql_errno() == 0) {
    echo "{success:true}";
} else {
    $salida = "{success:false,d:'[" . mysql_errno() . "] No se pudo eliminar el Usuario'}";
}

?>
