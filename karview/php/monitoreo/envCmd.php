<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$consultaSql = "INSERT INTO COMANDOS_AT_HISTORIAL(ID_USUARIO, ID_EQP, CMD, STD, FECHA_CREAC)
                VALUES(" . $_SESSION["ID_USER"] . ",$idVhCmd,'$cmdEnvTxt',1,DATE_FORMAT(CURRENT_TIMESTAMP(),'%Y-%m-%d %H:%i:%s'))";

consulta($consultaSql);

if (mysql_errno() == 0) {
    echo "{success:true}";
} else {
    $salida = "{success:false,d:'[" . mysql_errno() . "] No se pudo enviar el CMD'}";
}
?>
