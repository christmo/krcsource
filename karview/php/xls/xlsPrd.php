<?php

include('../login/isLogin.php');
require_once '../../dll/conect.php';
require_once 'Classes/PHPExcel.php';

extract($_GET);

$NUMEQP = $a;
$IDEVT = $b;  //<-- dinámico
$INI = $c;
$FIN = $d;
$VHC = $f;


$consultaSql = " CALL SP_REPORTE_PARADAS($NUMEQP, $IDEVT, '$INI', '$FIN') ";

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) >= 1) {

    $datos = "";

    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set properties
    $objPHPExcel->getProperties()->setCreator("KRADAC")
            ->setLastModifiedBy("KRADAC")
            ->setTitle("Reporte Parada ")
            ->setSubject("Reporte Parada")
            ->setDescription("Reporte Parada desde $INI hasta $FIN ")
            ->setKeywords("reporte parada")
            ->setCategory("reporte parada");

    $contFila = 1;
    $objPHPExcel->setActiveSheetIndex(0);
    $sheet = $objPHPExcel->getActiveSheet();
    //Titulo
    $sheet->setCellValue('A' . $contFila, 'REPORTE DE PARADAS');
    $contFila++;
    $sheet->mergeCells('A1:F1');
    //Datos del Vehiculo
    $sheet
            ->setCellValue('B3', 'Vehic : ')
            ->setCellValue('C3', $VHC)
            ->setCellValue('B4', 'Desde :')
            ->setCellValue('C4', $INI)
            ->setCellValue('B5', 'Hasta : ')
            ->setCellValue('C5', $FIN)
            ->setCellValue('B6', 'Total : ')
            ->setCellValue('C6', count($resulset));

    $contFila = 7;

    $stilo = array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
    $sheet->getStyle('C6')->applyFromArray($stilo);

    //Encabezado de tabla
    $sheet
            ->setCellValue('A' . $contFila, 'Inicio')
            ->setCellValue('B' . $contFila, 'Fin')
            ->setCellValue('C' . $contFila, 'Duracion')
            ->setCellValue('D' . $contFila, 'Direccion')
            ->setCellValue('E' . $contFila, 'Latitud')
            ->setCellValue('F' . $contFila, 'Longitud');

    $sheet->getColumnDimension('A')->setWidth(19);
    $sheet->getColumnDimension('B')->setWidth(19);
    $sheet->getColumnDimension('C')->setWidth(15);
    $sheet->getColumnDimension('D')->setWidth(45);
    $sheet->getColumnDimension('E')->setWidth(12);
    $sheet->getColumnDimension('F')->setWidth(12);

    $contFila++;


    $styleArray = array(
        'font' => array(
            'bold' => true
        ),
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );
    $sheet->getStyle('A1:F1')->applyFromArray($styleArray);
    $sheet->getStyle('A7:F7')->applyFromArray($styleArray);
    $sheet->getStyle('B2:B6')->applyFromArray($styleArray);


    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];

        //asignar duracion a quienes tengan valor cero o 1
        $dur = $fila["DURACION"];
        if ($fila["NUM_REPORT"] == 1 || $dur == "00:00:00") {
            $dur = "00:10:00";
            $tmpParada += 600;
        } else {
            //transformar horas a segundos
            list($h, $m, $s) = explode(":", $dur);
            $auxSg = ($h * 60 * 60) + ($m * 60) + $s;
            $tmpParada += $auxSg;
        }

        // Add some data
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $contFila, $fila["DESDE"])
                ->setCellValue('B' . $contFila, $fila["HASTA"])
                ->setCellValue('C' . $contFila, $dur)
                ->setCellValue('D' . $contFila, utf8_encode($fila["DIRECCION"]))
                ->setCellValue('E' . $contFila, $fila["LATITUD"])
                ->setCellValue('F' . $contFila, $fila["LONGITUD"]);
        
        $sheet->getStyle('C' . $contFila)->applyFromArray($stilo);


        $contFila++;
    }



// Rename sheet
    $objPHPExcel->getActiveSheet()->setTitle('ReporteParada');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

    $archivo = "Prd_$VHC.xlsx";

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

//}

function redir($rut) {

    //REDIRECCIONAR
    echo '<script type="text/javascript">';
    echo "window.location='$rut';";
    echo '</script>';
}

?>