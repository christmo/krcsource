<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);
/**
 * $v : valor devuelto desde el cliente indicando
 *      el ID de la persona
 */

$consultaSql = "
SELECT
    P.CEDULA_PROP,
    P.NOMBRES_PROP,
    P.APELLIDOS_PROP,
    P.DIRECCION_PROP,
    P.MAIL,
    P.FOTO,
    P.FECHA_NAC_PROP,
    P.FONO1,
    P.FONO2,
    P.USUARIO,
    P.ID_ROL
FROM PERSONAS P
WHERE P.ID_PER = $v LIMIT 1";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$mayor = "";

$salida = '{"d":[ ';
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    /*

    P.CEDULA_PROP,  -- a
    P.NOMBRES_PROP, -- b
    P.APELLIDOS_PROP, -- c
    P.DIRECCION_PROP, -- d
    P.MAIL, -- e
    P.FOTO, -- f
    P.FECHA_NAC_PROP, -- g
    P.FONO1, -- h
    P.FONO2, -- i
    P.USUARIO, -- j
    P.ID_ROL -- k

     */

    $salida .= '{ "a":"' . utf8_encode($fila["CEDULA_PROP"]) .
              '", "b":"' . utf8_encode($fila["NOMBRES_PROP"]) .
              '", "c":"' . utf8_encode($fila["APELLIDOS_PROP"]) .
              '", "d":"' . utf8_encode($fila["DIRECCION_PROP"]) .
              '", "e":"' . utf8_encode($fila["MAIL"]) .
              '", "f":"' . utf8_encode($fila["FOTO"]) .
              '", "g":"' . utf8_encode($fila["FECHA_NAC_PROP"]) .
              '", "h":"' . utf8_encode($fila["FONO1"]) .
              '", "i":"' . utf8_encode($fila["FONO2"]) .
              '", "j":"' . utf8_encode($fila["USUARIO"]) .
              '", "k":"' . utf8_encode($fila["ID_ROL"]) .
              '"}';
}
$salida .= "]}";

echo $salida;
?>
