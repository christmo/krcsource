
<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

/**
 * Estados:
 *         - 1 Tipo incorrecto
 *         - 2 Tamaño demaciado grande
 *         - 3 Error al cargar  :: Producido cuando la imagen es una ya existente
 *         - 4 Error al copiar archivo al servidor
 *         - 5 Imagen con ancho o alto demaciado grande >50px
 *
 */
$flagOpt = 0;

if ($_FILES["edVhImg"]["error"] == 0) {
    $flagOpt = 1;
    if ($_FILES["edVhImg"]["type"] != "image/png") {
        $flagOpt = 2;
        $salida = "{success:false,d:'[1] La imagen debe ser .png'}";
        echo $salida;
    } else if ($_FILES["edVhImg"]["size"] > 102400) {
        $flagOpt = 2;
        $salida = "{success:false,d:'[2] Imagen demaciado grande'}";
        echo $salida;
    } else {
        //proceso normal
        $nameTmp = date('YnjGis');
        $infoImg = getimagesize($_FILES['edVhImg']['tmp_name']);

        //verificar que icono no sea mayor a 50px por lado.
        if ($infoImg[0] > 50 || $infoImg[1] > 50) {
            $flagOpt = 2;
            $salida = "{success:false,d:'[5] Imagen con Ancho/Alto demaciado grande'}";
            echo $salida;
        } else {

            $std = @move_uploaded_file($_FILES['edVhImg']['tmp_name'],
                            "../../img/$nameTmp.png");

            //Imagen de miniatura
            $newW = 15;
            $newH = 15;
            $img = imagecreatefrompng("../../img/$nameTmp.png");
            $tmp_img = imagecreatetruecolor(15, 15);
            imagecopyresampled($tmp_img, $img, 0, 0, 0, 0, $newW, $newH, $infoImg[0], $infoImg[1]);
            imagepng($tmp_img, '../../img/' . $nameTmp . '_mini.png');


            if ($std != 1) {
                $flagOpt = 2;
                $salida = "{success:false,d:'[4] No se pudo cargar la imagen al Servidor'}";
                echo $salida;
            }
        }
    }
}

// codes for $flagOpt
// 0 = no hay imagen
// 1 = hay imagen
// 2 = hay imagen pero hay error al subirla
$sql = "UPDATE
            VEHICULOS_PART
        SET
            PLACA_VH = '$edVhPlaca',
            ID_PROP = $edVhPropLst,
            MODELO_VH = '$edVhModel',
            ANIO_VH = $edVhAn,
            INF_ADICIONAL_VH = '$edVhInfo',
            MARCA_VH = '$edVhMarca',
            NUM_VH = $edVhNum,
            PSEUDO_NOMB = '$edVhAlias'";

if ($flagOpt == 0) {
    $sql .= " WHERE ID_EQUIPO = $edVhEqp";
    consulta($sql);
    if (mysql_errno() == 0) {
        echo "{success:true}";
    } else {
        $salida = "{success:false,d:'[" . mysql_errno() . "] Registro no creado'}";
    }
} else if ($flagOpt == 1) {
    $sql .= ",IMAGEN_VH = '$nameTmp.png',
            IMG_W_VH = $infoImg[0],
            IMG_H_VH = $infoImg[1]
        WHERE ID_EQUIPO = $edVhEqp";
    consulta($sql);
    if (mysql_errno() == 0) {
        echo "{success:true}";
    } else {
        $salida = "{success:false,d:'[" . mysql_errno() . "] Registro no creado'}";
    }
} else {
    echo "<BR/>ocurrio un error que ya fue notificado";
}
?>



