<?php

    include('../../login/isLogin.php');
    require_once('../../../dll/conect.php');

    extract($_POST);

    // PARAMETROS

    $IDVH = $OnIdVeh;
    $INI = str_replace("-","",$OnFchIni);
    $FIN = str_replace("-","",$OnFchFin);

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

    $salida = "{failure:true}";
    $datos = "";
    $tmpParada = 0;

    if (count($resulset) >= 1) {

        $isIni = false;
        $antFecha = "";
        $fecha = "";
        $acc = -1;

        $salida = '
        {
        "success": true,
        "dt": [';

        $auxF = "000";
        for ($i = 0; $i < count($resulset); $i++) {
            $fila = $resulset[$i];

            $a = $fila["FECHA"];
            $b = $fila["HORA"];
            $c = $fila["DIRECCION"];
            $ln = $fila["LATITUD"];
            $l = $fila["LONGITUD"];
            $f = $fila["ING"];

            if ($i > 0) {
                $salida .= ",";
            }

            if ($auxF != $a) {
                $salida .= '{ "a": "'.$a. '"';
                $auxF = $a;
            }else{
                $salida .= '{ "a": " "';
            }


            $salida .= ',"b": "'.$b. '"';
            $salida .= ',"c": "'. utf8_encode($c). '"';
            $salida .= ',"l": "'.$ln. '"';
            $salida .= ',"ln": "'.$l. '"';
            $salida .= ',"f": "'.$f. '"}';

        }

        $salida .= ']}';
    }

    echo $salida;

    function completarDosDigitos($val){
        if ($val < 10) {
            return "0".$val;
        }
        return $val;
    }

?>



