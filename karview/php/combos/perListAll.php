<?php

include '../login/isLogin.php';
require_once('../../dll/conect.php');

extract($_POST);
// $std si = 1 extraer todos los que NO han sido seleccionados
// $std si = 0 extraer todos los que YA tiene vinculados

$add = "NOT";
if ($std == 0) {
    $add = "";
}

$consultaSql = "

 SELECT P.ID_PER, CONCAT(P.APELLIDOS_PROP,' ',P.NOMBRES_PROP) AS NAME
 FROM PERSONAS P
 WHERE P.ID_PER $add IN
   (
    SELECT VUP.ID_USUARIO
    FROM VEHICULOS_USUARIOS_PART VUP
    WHERE VUP.ID_VH = $idvh
   )
 ORDER BY P.APELLIDOS_PROP, P.NOMBRES_PROP

";

consulta($consultaSql);
$rsPersons = variasFilas();

$salida = "{\"d\": [";

for ($i = 0; $i < count($rsPersons); $i++) {

    $fila = $rsPersons[$i];

    $idUser = $fila["ID_PER"];
    $name = $fila["NAME"];

    $salida .= "{
                \"value\":\"" . utf8_encode($idUser) . "\",
                \"text\":\"" . utf8_encode($name) . "\"
            }";
    if ($i != count($rsPersons) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";
echo $salida;
?>
