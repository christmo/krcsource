
<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');
require_once ('../login/encript.php');

extract($_POST);

/**
 * Estados:
 *         - 1 Tipo incorrecto
 *         - 2 Tamaño demaciado grande
 *         - 3 Error al cargar
 *         - 4 Error al copiar archivo al servidor
 *         - 5 Cedula existe
 *         - 6 Usuario existe
 *         - 7 Error al insertar registro a la BD
 */
//4 no hay img
if ($_FILES["editUsImg"]["error"] == 4) {
    $i = 0;
} else {
    $i = 1;
}
//Indicador de que existe imagen que subir $i = 0 (no existe)  $i = 1 (existe)
$dirImgPer = "../../img/per/";
//Hubo un error en la carga ?
if ($i == 1 && $_FILES["editUsImg"]["error"] != 0) {
    $salida = "{success:false,d:'[3] No se pudo cargar la imagen'}";
    echo $salida;
} else {

    if ($i == 1) {
        $typeImg = explode("/", $_FILES["editUsImg"]["type"]);
        $typeImgSub = $typeImg[count($typeImg) - 1];
    }
    //Es una imagen ?
    if (($i == 0) || ($typeImgSub == 'bmp' || $typeImgSub == 'gif' || $typeImgSub == 'jpeg' || $typeImgSub == 'png')) {
        //La imagen es mayor de 5mb ?
        if (($i == 1) && $_FILES["editUsImg"]["size"] > 5242880) {
            $salida = "{success:false,d:'[2] Imagen demaciado grande >5MB'}";
            echo $salida;
        } else {
            //Guardar imagen
            $std = 1;
            $valName = "";
            if ($i == 1) {

                /**
                 * Extraer nombre de img anterior
                 * Borrar img anterior
                 */
                $sql = "SELECT P.FOTO FROM PERSONAS P WHERE P.ID_PER = " . $id;
                consulta($sql);
                $std = unicaFila();


                if (mysql_errno() != 0) {
                    $salida = "{success:false,d:'[1] No se pudo crear el registro'}";
                    echo $salida;
                    return;
                } else {
                    if (strlen($std["FOTO"]) > 4) {
                        //borrar img
                        $dirImgPer = "../../img/per/";
                        echo $dirImgPer . $std["FOTO"];
                        @unlink($dirImgPer . $std["FOTO"]);
                    }

                    //extraer extensión
                    $nameImgOrg = $_FILES['editUsImg']['name'];
                    $auxName = explode(".", $_FILES['editUsImg']['name']);
                    //generar nuevo nombre
                    $valName = date('YnjGis') . '.' . $auxName[count($auxName) - 1];
                    //mover al servidor
                    $std = @move_uploaded_file($_FILES['editUsImg']['tmp_name'],
                                    $dirImgPer . $valName);
                }
            }

            if ($std != 1) {
                $salida = "{success:false,d:'[4] No se pudo cargar la imagen al Servidor'}";
                echo $salida;
            } else {
                //UPDATE DATA
                $sql = "
                        UPDATE PERSONAS
                        SET
                            NOMBRES_PROP = '". utf8_decode($editUsName) ."',
                            APELLIDOS_PROP = '". utf8_decode($editUsApel) ."',
                            DIRECCION_PROP = '". utf8_decode($editUsDir)."',
                            MAIL = '". utf8_decode($editUsEm). "',
                        ";

                if ($i == 1) {
                    $sql .= " FOTO = '$valName', ";
                }

                if (strlen($editUsCl) > 3) {
                    //Encriptar clave
                    $newPass = encryptClave($editUsCl);
                    $sql .= " CLAVE = '$newPass', ";
                }

                $sql .= " FECHA_NAC_PROP = '$editUsFe',
                            FONO1 = '$editUsFn1',
                            FONO2 = '$editUsFn2',
                            USUARIO = '$editUsUs',
                            ID_ROL = '$editUsRol'
                        WHERE ID_PER = $id";

                consulta($sql);
                //se pudo guardar?
                if (mysql_errno() == 0) {
                    $salida = "{success:true}";
                } else {
                    $salida = "{success:false,d:'[1] No se pudo crear el registro'}";
                }
                echo $salida;
            }
        }
    } else {
        $salida = "{success:false,d:'[1] Tipo de Archivo no soportado'}";
        echo $salida;
    }
}
?>



