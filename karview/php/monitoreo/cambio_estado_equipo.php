<?php

/**
    NOTA: Este archivo es llamado en una página diferente
    en la cual no se necesita inicio de sesión.
**/

session_start();
require_once('../../dll/conect.php');

extract($_POST);

$campo = "'$dateEstado'";

if ($dateEstado == '') {
    $campo = "null";
}

$consultaSql = "
    UPDATE ESTADO_EQP
    SET ESTADO = '$estado', FECHA_ESTADO = $campo
    WHERE EQUIPO = '$eqp';
";

consulta($consultaSql);

echo "{success:true}";

?>
