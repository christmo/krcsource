<?php

    include('../../login/isLogin.php');
    require_once('../../../dll/conect.php');

    extract($_POST);

    $NUMEQP = $prdIdVeh;
    $IDEVT = 12;  //<-- dinámico
    $INI = $prdFchIni . " " . $prdHoraIni;
    $FIN = $prdFchFin . " " . $prdHoraFin;


    $consultaSql = " CALL SP_REPORTE_PARADAS($NUMEQP, $IDEVT, '$INI', '$FIN') ";

    consulta($consultaSql);
    $resulset = variasFilas();

    $salida = "{failure:true}";
    $datos = "";
    $tmpParada = 0;

    if (count($resulset) >= 1) {

        $salida = '{"success": true, "dt": [ ';

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

            if ($i > 0) {
                $salida.= ',';
            }
            $salida .= '{"id": ' . $i . ', "i": "' . $fila["DESDE"]
                    . '", "f": "' . $fila["HASTA"]
                    . '", "d": "' . $dur
                    . '", "l": "' . $fila["LATITUD"]
                    . '", "ln": "' . $fila["LONGITUD"]
                    . '", "di": "' . utf8_encode($fila["DIRECCION"])
                    . '"}';
        }

        //Calcular porcentaje
        $tIni = strtotime($INI);
        $tFin = strtotime($FIN);
        $intSegundos = $tFin - $tIni;
        $porcentaje = ($tmpParada*100)/$intSegundos;
        $porcentaje = round($porcentaje * 100) / 100;

        $salida .= '],"p": "'. $porcentaje .'"}';

    }

    echo $salida;
?>
