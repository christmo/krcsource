<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);

/*
  $idVhInst:1
  $regInsChip:1212121221
  $regInsTec:asdf
  $regInsOp:1
  $regInsCel:121212122
  $regInsIMEI:121212
  $regInsLug:1212
  $regInsObs:asdf
 *
 */
$sql = "
INSERT INTO INSTALACIONES
(ID_VH,
TECNICO,
ID_USUARIO_INGRESO,
NUM_CHIP,
NUM_CEL,
OPERADORA_CHIP,
IMEI,
LUGAR_INSTALACION,
OBSERVACIONES)
VALUES(
    $idVhInst,
    '$regInsTec',
    " . $_SESSION["ID_USER"] . ",
    '$regInsChip',
    '$regInsCel',
    '$regInsOp',
    '$regInsIMEI',
    '$regInsLug',
    '$regInsObs'
)
";

consulta($sql);

if (mysql_errno() == 0) {
    echo "{success:true}";
} else {
    $salida = "{success:false,d:'[" . mysql_errno() . "] No se pudo guardar los datos'}";
}
?>
