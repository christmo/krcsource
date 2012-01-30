<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);


$valCmd = "";
if (isset($cmdEnvTxt)) {
    $valCmd = $cmdEnvTxt;
} else {
    //Extraer el comando relacionado
    $sql = "SELECT CMD_CMD CMD FROM CMD_PREDEFINIDOS C WHERE C.CMD_ID = $idCmd";
    consulta($sql);
    if (mysql_errno() == 0) {
        $regis = unicaFila();
        if ($regis["CMD"] != "") {
            $valCmd = $regis["CMD"];
        } else {
            echo "{success:false,d:'CMD vacío'}";
            return;
        }
    } else {
        echo "{success:false,d:'[" . mysql_errno() . "] No se pudo enviar el CMD'}";
        return;
    }
}

$consultaSql = "INSERT INTO COMANDOS_AT_HISTORIAL(ID_USUARIO, ID_EQP, CMD, STD, FECHA_CREAC)
                VALUES(" . $_SESSION["ID_USER"] . ",$idVhCmd,'" . utf8_decode($valCmd)
        . "',1,DATE_FORMAT(CURRENT_TIMESTAMP(),'%Y-%m-%d %H:%i:%s'))";

consulta($consultaSql);

if (mysql_errno() == 0) {
    echo "{success:true}";
} else {
    $salida = "{success:false,d:'[" . mysql_errno() . "] No se pudo enviar el CMD'}";
}
?>
