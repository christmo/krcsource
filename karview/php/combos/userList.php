<?php

include '../login/isLogin.php';
require_once('../../dll/conect.php');
extract($_POST);

/**
 * Si es Administrado puede ver Administradores(1), Tecnicos(2) y Usuarios(3) (todos)
 * Si es Tecnico puede ver a el mismo y todos los usuarios
 * Si es usuario puede ver a el mismo.
 */
$sql1 = "SELECT P.ID_PER, CONCAT(P.APELLIDOS_PROP, ' ' ,P.NOMBRES_PROP) AS NOMB, P.CEDULA_PROP FROM PERSONAS P WHERE P.ESTADO = 1 ";
$sql2 = "SELECT COUNT(1) AS TOTAL FROM PERSONAS P ";

$flagEnd = false;
$sql3 = "";

switch ($_SESSION["ROL"]) {
    case 1:
        $sql3 = " WHERE P.ESTADO = 1";
        break;
    case 2:
        $sql3 = " WHERE P.ID_PER = " . $_SESSION["ID_USER"] . " AND P.ID_ROL IN(3) AND P.ESTADO = 1";
        break;
    case 3:
        $sql3 = " WHERE P.ID_PER = " . $_SESSION["ID_USER"] . " AND P.ESTADO = 1";
        break;
    default:
        $flagEnd = true;
        break;
}


if (!$flagEnd) {

    $sql2 .= $sql3;
   
    consulta($sql2);
    if (mysql_errno() == 0) {

        //extraer Total
        $registro = unicaFila();
        $tot = $registro["TOTAL"];
        $sql1 .= " ORDER BY P.APELLIDOS_PROP LIMIT $start, $limit";

        consulta($sql1);

        if (mysql_errno() == 0) {
            $rstRol = variasFilas();
            $salida = "{\"t\": \"$tot\",\"p\": [";

            for ($i = 0; $i < count($rstRol); $i++) {
                $fila = $rstRol[$i];
                $rlId = $fila["ID_PER"];
                $rlName = $fila["NOMB"];
                $rlCed = $fila["CEDULA_PROP"];

                if ($i > 0) {
                    $salida .= ",";
                }
                $salida .= '{
                "id":"' . utf8_encode($rlId) . '",
                "name":"' . utf8_encode($rlName) . '",
                "ced":"' . utf8_encode($rlCed) . '"
            }';
            }
            $salida .="]}";
            echo $salida;
        } else {
            echo "{\"t\": \"\",\"p\":[]}";
        }
    } else {
        echo "{\"t\": \"\",\"p\":[]}";
    }
} else {
    echo "{\"t\": \"\",\"p\":[]}";
}
?>
