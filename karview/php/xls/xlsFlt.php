<?php

include('../login/isLogin.php');
require_once '../../dll/conect.php';
require_once 'Classes/PHPExcel.php';

extract($_GET);
$INI = $a;
$FIN = $b;
$VEHC = $c;

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

if (count($resulset) >= 1) {

    $datos = "";

    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set properties
    $objPHPExcel->getProperties()->setCreator("KRADAC")
            ->setLastModifiedBy("KRADAC")
            ->setTitle("Reporte Flota ")
            ->setSubject("Reporte Flota")
            ->setDescription("Reporte Flota desde $INI hasta $FIN ")
            ->setKeywords("reporte Flota")
            ->setCategory("reporte Flota");

    $objPHPExcel->setActiveSheetIndex(0);
    $sheet = $objPHPExcel->getActiveSheet();
    //Titulo
    $sheet->setCellValue('A2', 'REPORTE DE FLOTA ');
    $sheet->mergeCells('A2:D2');

    $stilo = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );

    $styleArray = array(
        'font' => array(
            'bold' => true
        ),
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );

    $stilo2 = array(
        'font' => array(
            'bold' => true
        )
    );

    $sheet->getStyle('A2:D2')->applyFromArray($styleArray);

    //Datos del Vehiculo
    $sheet
            ->setCellValue('B4', 'Vehic : ')
            ->setCellValue('C4', count($resulset))
            ->setCellValue('B5', 'Desde :')
            ->setCellValue('C5', $INI)
            ->setCellValue('B6', 'Hasta : ')
            ->setCellValue('C6', $FIN);

    $sheet->getStyle("C4")->applyFromArray($stilo);
    $sheet->getStyle('B4:B6')->applyFromArray($styleArray);

    $contFila = 8;

    $isIni = false;

    $sheet->getColumnDimension('B')->setWidth(15);

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


        $porcRodando = ($tiempoRodando * 100) / $segTotal;
        $porcDetenido = 100 - $porcRodando;

        //ini 8
        $auxInt = $contFila++ + 1;
        $auxInt2 = $auxInt + 1;
        $auxInt3 = $auxInt + 8;
        $sheet->getStyle("A$auxInt")->applyFromArray($stilo2);
        $sheet->getStyle("B$auxInt2:B$auxInt3")->applyFromArray($stilo2);

        $sheet->getStyle("B$auxInt")->applyFromArray($stilo);


        //TEST RECUPERACIÓN DE NOMBRE DE VEHICULO
        $sql2 = "
        SELECT CONCAT('No. ', NUM_VH, ' - ', PLACA_VH, ' - ', MODELO_VH) AS INFOVH
                  FROM VEHICULOS_PART VP
                  WHERE VP.ACT = 1 AND VP.ID_EQUIPO = $nunidad
                  LIMIT 1
        ";
        consulta($sql2);
        $data = unicaFila();



        $sheet
                ->setCellValue('A' . $contFila, 'Vehic : ')
                ->setCellValue('B' . $contFila, $data["INFOVH"]);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Distancia : ')
                ->setCellValue('C' . $contFila, $DIST);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Vel. Max : ')
                ->setCellValue('C' . $contFila, round($velMax * 100) / 100);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Vel. Promed : ')
                ->setCellValue('C' . $contFila, round($velAvg * 100) / 100);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Tmp Rodando : ')
                ->setCellValue('C' . $contFila, segundosFormat($tiempoRodando));

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Tmp Detenido : ')
                ->setCellValue('C' . $contFila, segundosFormat($tiempoDetenido));

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, 'Paradas : ')
                ->setCellValue('C' . $contFila, $numParadas);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, '% Rodando : ')
                ->setCellValue('C' . $contFila, round($porcRodando * 100) / 100);

        $contFila++;
        $sheet
                ->setCellValue('B' . $contFila, '% Detenido : ')
                ->setCellValue('C' . $contFila, round($porcDetenido * 100) / 100);

        $contFila = $contFila + 2;
    }//fin for
// Rename sheet
    $objPHPExcel->getActiveSheet()->setTitle('ReporteFlota');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

    $archivo = "Rpt_Flota.xlsx";

    $objWriter->save($archivo);

    if (file_exists($archivo)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . basename($archivo));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . filesize($archivo));
        ob_clean();
        flush();
        readfile($archivo);
        unlink($archivo);
        exit;
    }
}

function redir($rut) {

    //REDIRECCIONAR
    echo '<script type="text/javascript">';
    echo "window.location='$rut';";
    echo '</script>';
}

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