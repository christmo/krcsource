<?php

include('../login/isLogin.php');
require_once '../../dll/conect.php';
require_once 'Classes/PHPExcel.php';

extract($_GET);

// PARAMETROS

$IDVH = $p1;
$INI = str_replace("-", "", $p2);
$FIN = str_replace("-", "", $p3);


//RECUPERACIÓN DE NOMBRE DE VEHICULO
$sql2 = "
SELECT CONCAT('No. ', NUM_VH, ' - ', PLACA_VH, ' - ', MODELO_VH) AS INFOVH
                  FROM VEHICULOS_PART VP
                  WHERE VP.ACT = 1 AND VP.ID_EQUIPO = $IDVH
                   LIMIT 1
";
consulta($sql2);
$dVh = unicaFila();

$consultaSql = "(SELECT
TBL1.LATITUD, TBL1.LONGITUD, TBL1.FECHA, TBL1.HORA, TBL1.DIRECCION, TBL1.ING
FROM RECORRIDOS TBL1,
(SELECT
  MIN(CONCAT(FECHA,' ',HORA)) DT
FROM RECORRIDOS
WHERE
  ID BETWEEN $INI AND $FIN
  AND N_UNIDAD = $IDVH
  AND ING = 1
GROUP BY ID, ING) AS TBL2
WHERE
  TBL1.ID BETWEEN $INI AND $FIN
  AND TBL1.N_UNIDAD = $IDVH
  AND CONCAT(TBL1.FECHA,' ',TBL1.HORA) = TBL2.DT ) UNION (
SELECT TBL1.LATITUD, TBL1.LONGITUD, TBL1.FECHA, TBL1.HORA, TBL1.DIRECCION, TBL1.ING
FROM RECORRIDOS TBL1,
(SELECT
  MAX(CONCAT(FECHA,' ',HORA)) DT
FROM RECORRIDOS
WHERE
  ID BETWEEN $INI AND $FIN
  AND N_UNIDAD = $IDVH
  AND ING = 0
GROUP BY ID, ING) AS TBL2
WHERE
  TBL1.ID BETWEEN $INI AND $FIN
  AND TBL1.N_UNIDAD = $IDVH
  AND CONCAT(TBL1.FECHA,' ',TBL1.HORA) = TBL2.DT )
ORDER BY FECHA, ING DESC";

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) >= 1) {

    $datos = "";
    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set properties
    $objPHPExcel->getProperties()->setCreator("KRADAC")
            ->setLastModifiedBy("KRADAC")
            ->setTitle("Reporte Encd/Apgd ")
            ->setSubject("Reporte Encd/Apgd")
            ->setDescription("Reporte Encd/Apgd desde $INI hasta $FIN ")
            ->setKeywords("reporte Encd/Apgd")
            ->setCategory("reporte Encd/Apgd");

    $objPHPExcel->setActiveSheetIndex(0);
    $sheet = $objPHPExcel->getActiveSheet();
    //Titulo
    $sheet->setCellValue('A2', 'REPORTE DE ENCENDIDO DE VEHICULO ');
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
            ->setCellValue('C4', $dVh["INFOVH"])
            ->setCellValue('B5', 'Desde :')
            ->setCellValue('C5', $p2)
            ->setCellValue('B6', 'Hasta : ')
            ->setCellValue('C6', $p3);

    $sheet->getStyle("C4")->applyFromArray($stilo);
    $sheet->getStyle('B4:B6')->applyFromArray($styleArray);
    $sheet->getStyle('A8:F8')->applyFromArray($styleArray);

    $contFila = 8;


    //Encabezado de tabla
    $sheet
            ->setCellValue('A' . $contFila, 'FECHA')
            ->setCellValue('B' . $contFila, 'HORA')
            ->setCellValue('C' . $contFila, 'DIRECCION')
            ->setCellValue('D' . $contFila, 'LAT')
            ->setCellValue('E' . $contFila, 'LON')
            ->setCellValue('F' . $contFila, 'ESTADO');

    $sheet->getColumnDimension('A')->setWidth(10);
    $sheet->getColumnDimension('B')->setWidth(8);
    $sheet->getColumnDimension('C')->setWidth(52);
    $sheet->getColumnDimension('D')->setWidth(8);
    $sheet->getColumnDimension('E')->setWidth(8);
    $sheet->getColumnDimension('F')->setWidth(11);

    $contFila++;
    
    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        
        $a = $fila["FECHA"];
        $b = $fila["HORA"];
        $c = $fila["DIRECCION"];
        $ln = $fila["LATITUD"];
        $l = $fila["LONGITUD"];
        $f = $fila["ING"];

        if ($auxF != $a) {
            $sheet->setCellValue('A' . $contFila, $a);
            $auxF = $a;
        }

        echo $b;

        $sheet
                ->setCellValue('B' . $contFila, $b)
                ->setCellValue('C' . $contFila, utf8_encode($c))
                ->setCellValue('D' . $contFila, $l)
                ->setCellValue('E' . $contFila, $ln);

        if ($f=="1") {
            $sheet->setCellValue('F' . $contFila, "ENCENDIDO");
        }  elseif ($f == "0") {
            $sheet->setCellValue('F' . $contFila, "APAGADO");
        }
        $contFila++;
        
    }//fin for

    //
// Rename sheet
    $objPHPExcel->getActiveSheet()->setTitle('ReporteEncendApg');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

    $archivo = "Rpt_OnOff.xlsx";

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