<?php

include '../../login/isLogin.php';
require_once('../../../dll/conect.php');
extract($_POST);

$sql = "SELECT
                P.USUARIO,
                C.CMD,
                C.RTA,
                C.FECHA_CREAC,
                C.FECHA_ENVIO,
                CASE C.STD
                 WHEN 1 THEN 'NO ENVIADO'
                 WHEN 2 THEN 'SIN RESPUESTA'
                 WHEN 3 THEN 'COMPLETADO'
                END AS STD
         FROM
            COMANDOS_AT_HISTORIAL C,
            PERSONAS P
         WHERE 
            C.ID_USUARIO = P.ID_PER AND
            ID_EQP = $id AND
            C.FECHA_CREAC BETWEEN '$fi' AND '$ff'
         LIMIT $start, $limit
";

$sqlTotal = "
         SELECT
            COUNT(1) AS T
         FROM
            COMANDOS_AT_HISTORIAL C,
            PERSONAS P
         WHERE
            C.ID_USUARIO = P.ID_PER AND
            ID_EQP = $id AND
            C.FECHA_CREAC BETWEEN '$fi' AND '$ff'
    ";


consulta($sqlTotal);
if (mysql_errno() == 0) {

    //extraer Total
    $registro = unicaFila();
    $tot = $registro["T"];

    consulta($sql);
    if (mysql_errno() == 0) {
        $rstRol = variasFilas();
        $salida = "{\"t\": \"$tot\",\"p\": [";

        for ($i = 0; $i < count($rstRol); $i++) {
            $fila = $rstRol[$i];
            //variables
            $us = $fila["USUARIO"];
            $cmd = $fila["CMD"];
            $rta = $fila["RTA"];
            $fc = $fila["FECHA_CREAC"];
            $fe = $fila["FECHA_ENVIO"];
            $std = $fila["STD"];

            if ($i > 0) {
                $salida .= ",";
            }

            //comillas dobles a

            $salida .= '{
                "u":"'  . utf8_encode(str_replace('"','\\"',$us)) . '",
                "c":"'  . utf8_encode(str_replace('"','\\"',$cmd)) . '",
                "r":"'  . utf8_encode(str_replace('"','\\"',$rta)) . '",
                "fc":"' . utf8_encode(str_replace('"','\\"',$fc)) . '",
                "fe":"' . utf8_encode(str_replace('"','\\"',$fe)) . '",
                "s":"'  . utf8_encode(str_replace('"','\\"',$std)) . '"
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
?>
