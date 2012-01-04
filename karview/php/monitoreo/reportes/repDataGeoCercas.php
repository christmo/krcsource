<?php

include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_POST);

$IDVH = $gccIdVeh;
$IDGEO = $gccIdGcc;
$INI = $gccFI . " " . $gccHI;
$FIN = $gccFF . " " . $gccHF;

$consultaSql = " SELECT DISTINCT G.FECHA, G.ACCION
FROM GEOCERCAS_HISTORIAL G,
     VEHICULOS_PART VP
WHERE
VP.ACT = 1 AND
VP.ID_EQUIPO = $IDVH AND
G.ID_VH = VP.ID_VH
AND G.ID_GEOCERCA = $IDGEO
AND FECHA
BETWEEN '$INI'
AND '$FIN'
ORDER BY FECHA ASC";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{failure:true}";
$datos = "";

if (count($resulset) >= 1) {

    $salida = '
        {
        "success": true,
        "dt": [';

    $pPerdida = false;
    $isIni = false;
    $primerDato = true;

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];


        $acc = $fila["ACCION"];
        $fecha = $fila["FECHA"];

        $p1 = "--";
        $p2 = "--";
        $p3 = "--";

        if ($acc == 0 && !$isIni) {
            $p2 = $fecha;
        } else if ($acc == 0 && $isIni) {
            $tIni = strtotime($antFecha);
            $tFin = strtotime($fecha);
            $intSegundos = $tFin - $tIni;
            $horas = (int) ($intSegundos / 3600);
            $minutos = (int) ((($intSegundos / 3600) - $horas) * 60);
            $segundos = (int) ((((($intSegundos / 3600) - $horas) * 60) - $minutos) * 60);
            $tmPermanencia = completarDosDigitos($horas) . ":" .
                    completarDosDigitos($minutos) . ":" .
                    completarDosDigitos($segundos);
            $isIni = false;

            $p1 = $antFecha;
            $p2 = $fecha;
            $p3 = $tmPermanencia;
        } else if ($acc == 1 && !$isIni) {
            $isIni = true;
            $antFecha = $fecha;
        } else if ($acc == 1 && $isIni) {
            $p1 = $antFecha;
            $antFecha = $fecha;
        }



        if ($p1 != "--" || $p2 != "--" || $p3 != "--") {
            if (!$primerDato) {
                $salida .= ",";
            }
            $salida .='{ "i":"' . $p1 . '"' .
                    ', "o":"' . $p2 . '"' .
                    ', "t":"' . $p3 . '"' .
                    '}';
            $primerDato = false;
        }
    }

    //Caso especial cuando ultimo dato leído es
    //de entrada.

    if ($isIni) {

        if (!$primerDato) {
            $salida .= ",";
        }

        $salida .='{ "i":"' . $antFecha . '"' .
                ', "o":"--"' .
                ', "t":"--"' .
                '}';
    }

    $salida .= "]}";
}

echo $salida;

function segundosFormat($inSeg) {
    $h = (int) ($inSeg / 3600);
    $m = (int) ((($inSeg / 3600) - $h) * 60);
    $s = (int) ((((($inSeg / 3600) - $h) * 60) - $m) * 60);

    $time = "";
    $time = completarDosDigitos($h) . ":" .
            completarDosDigitos($m) . ":" .
            completarDosDigitos($s);
    return $time;
}

function completarDosDigitos($val) {
    if ($val < 10) {
        return "0" . $val;
    }
    return $val;
}

?>
