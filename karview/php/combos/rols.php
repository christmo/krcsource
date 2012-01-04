<?php

include '../login/isLogin.php';
require_once('../../dll/conect.php');

// *-*-*-*-*-*-*-*-*-*-*
// Lista de roles según
// el rol actual del usuario loggeado
// $_SESSION["ROL"]
// *-*-*-*-*-*-*-*-*-*-*

$listaRoles = "3";

//solo técnicos o administradores
if ($_SESSION["ROL"] == 1 || $_SESSION["ROL"] == 2) {

    $sql = " SELECT
                R.ID_ROL,
                R.ROL_NOMBRE
             FROM
                ROLES R ";
    if ($_SESSION["ROL"] == 2) {
        $sql .= " WHERE R.ID_ROL IN ($listaRoles) ";
    }

    consulta($sql);

    if (mysql_errno() == 0) {

        $rstRol = variasFilas();
        $salida = "{\"p\": [";

        for ($i = 0; $i < count($rstRol); $i++) {
            $fila = $rstRol[$i];
            $rlId = $fila["ID_ROL"];
            $rlName = $fila["ROL_NOMBRE"];

            if ($i > 0) {
                $salida .= ",";
            }
            $salida .= '{
                "id":"' . utf8_encode($rlId) . '",
                "name":"' . utf8_encode($rlName) . '"
            }';
        }
        $salida .="]}";
        echo $salida;
    } else {
        echo "{\"p\":[]}";
    }
} else {
    echo "{\"p\":[]}";
}
?>
