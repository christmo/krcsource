
<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

/**
 * Estados:
 *         - 1 Tipo incorrecto
 *         - 2 Tamaño demaciado grande
 *         - 3 Error al cargar
 *         - 4 Error al copiar archivo al servidor
 *         - 5 Imagen con ancho o alto demaciado grande >50px
 */
if ($_FILES["newVhImg"]["error"] != 0) {
    $salida = "{success:false,d:'[3] No se pudo cargar la imagen'}";
    echo $salida;
} else if ($_FILES["newVhImg"]["type"] != "image/png") {
    $salida = "{success:false,d:'[1] La imagen debe ser .png'}";
    echo $salida;
} else if ($_FILES["newVhImg"]["size"] > 102400) {
    $salida = "{success:false,d:'[2] Imagen demaciado grande'}";
    echo $salida;
} else {
    //proceso normal
    $nameTmp = date('YnjGis');
    $infoImg = getimagesize($_FILES['newVhImg']['tmp_name']);

    //verificar que icono no sea mayor a 50px por lado.
    if ($infoImg[0] > 50 || $infoImg[1] > 50) {
        $salida = "{success:false,d:'[5] Imagen con Ancho/Alto demaciado grande'}";
        echo $salida;
    } else {

        $std = @move_uploaded_file($_FILES['newVhImg']['tmp_name'],
                        "../../img/$nameTmp.png");

        //Imagen de miniatura
        $newW = 15;
        $newH = 15;
        $img = imagecreatefrompng("../../img/$nameTmp.png");
        $tmp_img = imagecreatetruecolor(15, 15);
        imagecopyresampled($tmp_img, $img, 0, 0, 0, 0, $newW, $newH, $infoImg[0], $infoImg[1]);
        imagepng($tmp_img, '../../img/' . $nameTmp . '_mini.png');


        if ($std != 1) {

            $salida = "{success:false,d:'[4] No se pudo cargar la imagen al Servidor'}";
            echo $salida;
            
        } else {

            $sql = "CALL SP_NUEVO_VEHC($newVhPropLst,'$newVhPlc','$newVhMdl',
          '$newVhMrc','$newVhpsd',$newVhAn,$newVhNumV,$newVhidEqp,'$newVhInfAdc',
          '$nameTmp.png',$infoImg[0],$infoImg[1],@STD)";
            
            consulta($sql);
            $sql = "SELECT @STD AS STD";
            consulta($sql);
            $std = unicaFila();

            if ($std["STD"] == 1) {
                $salida = "{success:true}";
            } else {
                $salida = "{success:false,d:'Registro no creado' }";
            }
            echo $salida;
        }
    }
}
?>



