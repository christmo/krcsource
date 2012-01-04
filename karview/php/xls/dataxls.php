<?php

include('../login/isLogin.php');
require_once '../../dll/conect.php';
require_once 'Classes/PHPExcel.php';


extract($_GET);

$consultaSql =
        "
SELECT B.N_UNIDAD, B.ID_EMPRESA, B.FECHA, B.HORA, B.LATITUD,
B.LONGITUD, B.G2, B.VELOCIDAD, B.G1, B.DIRECCION, EVTP.DESC_EVENTO
        FROM
  RECORRIDOS B, SKY_EVENTOS EVTP
WHERE
  (B.ID BETWEEN REPLACE('$fi','-','') AND REPLACE('$ff','-',''))
AND
  (CONCAT(B.FECHA,B.HORA) BETWEEN '$fi$hi' AND '$ff$hf')
AND
  B.ID_EMPRESA = 'PT' AND B.N_UNIDAD = '$vh' ";

if (isset($evtid)) {
    $consultaSql .= " AND EVTP.ID_EVENTO = $evtid ";
}

$consultaSql .= " AND B.EVT = EVTP.CATEGORIA
AND B.PARM1 = EVTP.PARAM1
ORDER BY B.FECHA, B.HORA;
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "";
$estTemporal = "S/E";


$salida = "{failure:true}";

if (count($resulset) >= 1) {

    $estadosFormat = "";
    $estActual = "S/E";
    $fono = "S/T";

    // Create new PHPExcel object
    $objPHPExcel = new PHPExcel();
    // Set properties
    $objPHPExcel->getProperties()->setCreator("KRADAC")
            ->setLastModifiedBy("KRADAC")
            ->setTitle($tipoReporte)
            ->setSubject($tipoReporte)
            ->setDescription("Reporte Recorridos desde $fi  $hi hasta $ff  $hf ")
            ->setKeywords("reporte recorridos")
            ->setCategory("reporte recorridos");

    $contFila = 1;

    $objPHPExcel->setActiveSheetIndex(0);

    $sheet = $objPHPExcel->getActiveSheet();

    //Titulo
    $sheet
            ->setCellValue('A' . $contFila, $tr . $nv);

    $contFila++;

    $sheet->mergeCells('A1:I1');

    //Datos del Vehiculo
    $sheet
            ->setCellValue('B3', 'Vehiculo : ')
            ->setCellValue('C3', $nv)
            ->setCellValue('B4', 'Desde :')
            ->setCellValue('C4', $fi . '  ' . $hi)
            ->setCellValue('B5', 'Hasta : ')
            ->setCellValue('C5', $ff . '  ' . $hf)
            ->setCellValue('B6', 'Total : ')
            ->setCellValue('C6', count($resulset));

    $contFila = 7;



    //Encabezado de tabla
    $sheet
            ->setCellValue('A' . $contFila, 'Fecha')
            ->setCellValue('B' . $contFila, 'Hora')
            ->setCellValue('C' . $contFila, 'Longitud')
            ->setCellValue('D' . $contFila, 'Latitud')
            ->setCellValue('E' . $contFila, 'Velocidad')
            ->setCellValue('F' . $contFila, 'Direccion')
            ->setCellValue('G' . $contFila, 'Evento');

    //g -> e
    $sheet->getColumnDimension('A')->setWidth(12);
    $sheet->getColumnDimension('F')->setWidth(48);
    $sheet->getColumnDimension('G')->setWidth(24);

    $contFila++;


    $styleArray = array(
        'font' => array(
            'bold' => true
        ),
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );
    $sheet->getStyle('A1:I1')->applyFromArray($styleArray);
    $sheet->getStyle('A7:I7')->applyFromArray($styleArray);
    $sheet->getStyle('B2:B6')->applyFromArray($styleArray);


    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $variosEstados = false;
        $estadosFormat = "";
        $estadosV = getVariosEstados($cp, $vh, $fila["FECHA"], $fila["HORA"]);

        $rep = count($estadosV);

        $varAuxVeloc = $fila["VELOCIDAD"] * 1.852;
// Add some data
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $contFila, $fila["FECHA"])
                ->setCellValue('B' . $contFila, $fila["HORA"])
                ->setCellValue('C' . $contFila, $fila["LONGITUD"])
                ->setCellValue('D' . $contFila, $fila["LATITUD"])
                ->setCellValue('E' . $contFila, round($varAuxVeloc, 2))
                ->setCellValue('F' . $contFila, utf8_encode($fila["DIRECCION"]))
                ->setCellValue('G' . $contFila, utf8_encode($fila["DESC_EVENTO"]));

        $contFila++;
    }
}

// Rename sheet
$objPHPExcel->getActiveSheet()->setTitle('Datos');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

$archivo = $tr . $nv . '.xlsx';

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

function redir($rut) {

    //REDIRECCIONAR
    echo '<script type="text/javascript">';
    echo "window.location='$rut';";
    echo '</script>';
}

/* Devuelve todos los estados que existan para
 * un determinado vehiculo
 * en un determinado tiempo
 */

function getVariosEstados($cp, $nu, $fecha, $hora) {
    $conSql = "SELECT ESTADO, FONO
               FROM  ASIGNADOS_$cp
               WHERE ID = REPLACE('$fecha','-','')
                AND N_UNIDAD = $nu
               AND STRCMP ( CONCAT(FECHA,SUBSTRING(HORA,1,5)),
                            CONCAT('$fecha',SUBSTRING('$hora',1,5))
                          ) = 0";
    consulta($conSql);
    $conjuntoEstados = variasFilas();
    return $conjuntoEstados;
}

//Comprobando en los últimos 7 días
function getUltimoEstado($f, $h, $n, $c, $val) {

    $sql = "SELECT ESTADO FROM ASIGNADOS_$c
            WHERE ID = DATE_FORMAT(DATE_SUB('$f',INTERVAL $val DAY),'%Y%m%d')
            AND HORA = (
            SELECT max(HORA) FROM ASIGNADOS_$c
            WHERE ID = DATE_FORMAT(DATE_SUB('$f',INTERVAL $val DAY),'%Y%m%d')
            AND HORA < '$h'
            AND N_UNIDAD = $n
            ) AND N_UNIDAD = $n LIMIT 1";

    consulta($sql);
    $RstEst = unicaFila();
    $est = $RstEst["ESTADO"];
    return $est;
}

function getUltimoEstadoSemana($f, $h, $n, $c) {

    for ($i = 0; $i < 7; $i++) {
        if ($i > 0) {
            $h = "23:59:59";
        }
        $estado = getUltimoEstado($f, $h, $n, $c, $i);
        if ($estado != null) {
            return $estado;
            break;
        }
    }
    return null;
}

function getValor($val) {
    if ($val == null || $val == 'null' || $val == '') {
        $val = "LIBRE";
    } else {
        if ($val == 1) {
            $val = "LIBRE";
        } else {
            $val = "OCUPADO";
        }
    }
    return $val;
}

?>