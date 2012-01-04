<?php

    include('../../login/isLogin.php');
    require_once('../../../dll/conect.php');

    extract($_POST);

    $INI = $fltFchIni . " " . $fltHoraIni;
    $FIN = $fltFchFin . " " . $fltHoraFin;
    $VEHC = $vehList;

    
    //CONSTANTES
    $LIMITE_ODOM = "4000000000";
    $KM_EQV = 1.852;
    $TMP_REPORTE_PARADA = 10 * 60; //segundos
    $EVT_PARADA = 12;


    //Tiempo total
    $tIni = strtotime($INI);
    $tFin = strtotime($FIN);
    $segTotal = $tFin - $tIni;

    $sql = "
        SELECT
      DISTINCT A.N_UNIDAD, D.MINODOM, E.MAXODOM, MAXVELOCIDAD, NUMPARADAS, VELAVG
    FROM
        #consulta 1
        (SELECT N_UNIDAD, MAX(VELOCIDAD) MAXVELOCIDAD
         FROM RECORRIDOS
         WHERE
         ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
         AND CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND '$FIN'
         GROUP BY N_UNIDAD
         HAVING N_UNIDAD IN ($VEHC)) AS A,

        #consulta 2
        (SELECT N_UNIDAD, AVG(VELOCIDAD) VELAVG
         FROM RECORRIDOS
         WHERE

         ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
         AND CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND '$FIN'

         AND VELOCIDAD > 0
         GROUP BY N_UNIDAD
         HAVING N_UNIDAD IN ($VEHC)) AS B,

        #consulta 3
        (SELECT N_UNIDAD, COUNT(DISTINCT ODOM) NUMPARADAS
         FROM RECORRIDOS R, SKY_EVENTOS S
         WHERE

         ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
         AND CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND '$FIN'

         AND S.ID_EVENTO = $EVT_PARADA
         AND R.EVT = S.CATEGORIA
         AND R.PARM1 = S.PARAM1
         GROUP BY N_UNIDAD
         HAVING R.N_UNIDAD IN ($VEHC)) AS C,

        #consulta 4
            ( SELECT RC4.N_UNIDAD, RC4.ODOM AS MINODOM
         FROM RECORRIDOS RC4,
            (
             SELECT R2.N_UNIDAD, MIN(CONCAT(R2.FECHA, ' ',HORA)) AS FH
             FROM RECORRIDOS R2
             WHERE
             ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
             AND CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND '$FIN'
             AND R2.N_UNIDAD IN ($VEHC)
             GROUP BY R2.N_UNIDAD
            ) AS R3
         WHERE
         RC4.ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
         AND CONCAT(RC4.FECHA,' ',RC4.HORA) BETWEEN '$INI' AND '$FIN'
         AND RC4.N_UNIDAD = R3.N_UNIDAD
         AND CONCAT(RC4.FECHA,' ',RC4.HORA) = R3.FH
     ORDER BY RC4.N_UNIDAD) AS D,

        #consulta 5
             ( SELECT RC5.N_UNIDAD, RC5.ODOM AS MAXODOM
         FROM RECORRIDOS RC5,
            (
             SELECT R2.N_UNIDAD, MAX(CONCAT(R2.FECHA, ' ',HORA)) AS FH
             FROM RECORRIDOS R2
             WHERE
             R2.ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
             AND CONCAT(R2.FECHA,' ',R2.HORA) BETWEEN '$INI' AND '$FIN'
             AND R2.N_UNIDAD IN ($VEHC)
             GROUP BY R2.N_UNIDAD
            ) AS R3
         WHERE
         RC5.ID BETWEEN DATE_FORMAT('$INI', '%Y%m%d') AND DATE_FORMAT('$FIN', '%Y%m%d')
         AND CONCAT(RC5.FECHA,' ',RC5.HORA) BETWEEN '$INI' AND '$FIN'
         AND RC5.N_UNIDAD = R3.N_UNIDAD



         AND CONCAT(RC5.FECHA,' ',RC5.HORA) = R3.FH
     ORDER BY RC5.N_UNIDAD) AS E

    WHERE A.N_UNIDAD = B.N_UNIDAD
    AND B.N_UNIDAD = C.N_UNIDAD
    AND C.N_UNIDAD = D.N_UNIDAD
    AND D.N_UNIDAD = E.N_UNIDAD";

    consulta($sql);
    $resulset = variasFilas();

    $salida = "{failure:true}";
    $datos = "";

    if (count($resulset) >= 1) {

        $salida = '
        {
        "success": true,
        "dt": [';

        for ($i = 0; $i < count($resulset); $i++) {
            $fila = $resulset[$i];

            $nunidad = $fila["N_UNIDAD"];
            $odoMin = $fila["MINODOM"];
            $odoMax = $fila["MAXODOM"];
            $velAvg = $fila["VELAVG"];
            $velMax = $fila["MAXVELOCIDAD"];
            $numParadas = $fila["NUMPARADAS"];

            //## Calculo de Distancia
            $DIST = 0;
            if ($odoMin > $odoMax) {
                $DIST = ($LIMITE_ODOM - $odoMin) + $odoMax;
            } else {
                $DIST = $odoMax - $odoMin;
            }
            //Transformar a Km.
            $DIST = $DIST / 1000;
            $DIST = round($DIST * 100) / 100; //redondeo

            //Transformar Velocidades nudos a km
            $velAvg = $velAvg * $KM_EQV;
            $velMax = $velMax * $KM_EQV;

            $tiempoDetenido = $numParadas * $TMP_REPORTE_PARADA;
            $tiempoRodando = $segTotal - $tiempoDetenido;


            $porcRodando = ($tiempoRodando * 100)/$segTotal;
            $porcDetenido = 100 - $porcRodando;

            if ($i > 0) {
                $salida .= ",";
            }

            $salida .='{ "a":'. $nunidad .
            ', "b":' .  $DIST .
            ', "c":' . round($velMax * 100) / 100 .
            ', "d":' . round($velAvg * 100) / 100 .
            ', "e": "' . segundosFormat($tiempoRodando) . '"' .
            ', "f": "' . segundosFormat($tiempoDetenido) . '"' .
            ', "g":' . $numParadas .
            ', "h":' . round($porcRodando * 100) / 100 .
            ', "i":' . round($porcDetenido * 100) / 100 .
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

    function completarDosDigitos($val){
        if ($val < 10) {
            return "0".$val;
        }
        return $val;
    }
?>
