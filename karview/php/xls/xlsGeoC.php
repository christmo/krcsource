<?php

include('../login/isLogin.php');
require_once '../../dll/conect.php';
require_once 'Classes/PHPExcel.php';

extract($_GET);

// PARAMETROS
$IDGEO = $a;
$IDVH = $b;
$VHC = $c;
$INI = $d;
$FIN = $e;
$GEONAME = $f;


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

if (count($resulset) >= 1) {

    $datos = "";

    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set properties
    $objPHPExcel->getProperties()->setCreator("KRADAC")
            ->setLastModifiedBy("KRADAC")
            ->setTitle("Reporte Geocerca ")
            ->setSubject("Reporte Geocerca")
            ->setDescription("Reporte Geocerca desde $INI hasta $FIN ")
            ->setKeywords("reporte Geocerca")
            ->setCategory("reporte Geocerca");

    $contFila = 1;
    $objPHPExcel->setActiveSheetIndex(0);
    $sheet = $objPHPExcel->getActiveSheet();
    //Titulo
    $sheet->setCellValue('A' . $contFila, 'REPORTE DE GEOCERCA: ' . $GEONAME);
    $contFila++;
    $sheet->mergeCells('A1:F1');
    //Datos del Vehiculo
    $sheet
            ->setCellValue('B3', 'Vehic : ')
            ->setCellValue('C3', $VHC)
            ->setCellValue('B4', 'Desde :')
            ->setCellValue('C4', $INI)
            ->setCellValue('B5', 'Hasta : ')
            ->setCellValue('C5', $FIN);

    $contFila = 7;

    $stilo = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );

    //Encabezado de tabla
    $sheet
            ->setCellValue('A' . $contFila, 'Entrada')
            ->setCellValue('B' . $contFila, 'Salida')
            ->setCellValue('C' . $contFila, 'Tiempo Dentro');

    $sheet->getColumnDimension('A')->setWidth(19);
    $sheet->getColumnDimension('B')->setWidth(19);
    $sheet->getColumnDimension('C')->setWidth(19);

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


    $isIni = false;

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

            // Add some data
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('A' . $contFila, $p1)
                    ->setCellValue('B' . $contFila, $p2)
                    ->setCellValue('C' . $contFila, $p3);

            $sheet->getStyle("A$contFila:C$contFila")->applyFromArray($stilo);

            $contFila++;
        }
    }//fin for

    if ($isIni) {
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $contFila, $fecha)
                ->setCellValue('B' . $contFila, '--')
                ->setCellValue('C' . $contFila, '--');
        $sheet->getStyle("A$contFila:C$contFila")->applyFromArray($stilo);
    }




// Rename sheet
    $objPHPExcel->getActiveSheet()->setTitle('ReporteGeocerca');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

    $archivo = "Geo_$VHC.xlsx";

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

function completarDosDigitos($val) {
    if ($val < 10) {
        return "0" . $val;
    }
    return $val;
}

?>