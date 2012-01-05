
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
//Indicador de que existe imagen que subir $i = 0 (no existe)  $i = 1 (existe)
$dirImgPer = "../../img/per/";
//Hubo un error en la carga ?
if ($i == 1 && $_FILES["newUsImg"]["error"] != 0) {
    $salida = "{success:false,d:'[3] No se pudo cargar la imagen'}";
    echo $salida;
} else {

    if ($i == 1) {
        $typeImg = explode("/", $_FILES["newUsImg"]["type"]);
        $typeImgSub = $typeImg[count($typeImg) - 1];
    }
    //Es una imagen ?
    if (($i == 0) || ($typeImgSub == 'bmp' || $typeImgSub == 'gif' || $typeImgSub == 'jpeg' || $typeImgSub == 'png')) {
        //La imagen es mayor de 5mb ?
        if (($i == 1) && $_FILES["newUsImg"]["size"] > 5242880) {
            $salida = "{success:false,d:'[2] Imagen demaciado grande >5MB'}";
            echo $salida;
        } else {
            //Guardar imagen
            $std = 1;
            $valName = "";
            if ($i == 1) {
                //extraer extensión
                $nameImgOrg = $_FILES['newUsImg']['name'];
                $auxName = explode(".", $_FILES['newUsImg']['name']);
                //generar nuevo nombre
                $valName = date('YnjGis') . '.' . $auxName[count($auxName) - 1];
                //mover al servidor
                $std = @move_uploaded_file($_FILES['newUsImg']['tmp_name'],
                                $dirImgPer . $valName);
            }

            if ($std != 1) {
                $salida = "{success:false,d:'[4] No se pudo cargar la imagen al Servidor'}";
                echo $salida;
            } else {

                //Validar Cedula no exista en la BD.
                $sql = "SELECT F_GET_IDPER_BY_CEDULA('$newUsCed') AS ID";
                consulta($sql);
                $std = unicaFila();

                if ($std["ID"] != "") {
                    $salida = "{success:false,d:'[5] La cédula ya existe'}";
                    echo $salida;
                } else {
                    //Validar que USER NO exista
                    $sql = "SELECT F_GET_IDPER_BY_USUARIO('$newUsUs') AS ID";
                    consulta($sql);
                    $std = unicaFila();
                    if ($std["ID"] != "") {
                        $salida = "{success:false,d:'[6] El usuario ya existe'}";
                        echo $salida;
                    } else {

                        //Encriptar clave
                        $newPass = encryptClave($newUsCl);

                        $sql = "INSERT INTO PERSONAS
                                (
                                    CEDULA_PROP,
                                    NOMBRES_PROP,
                                    APELLIDOS_PROP,
                                    DIRECCION_PROP,
                                    MAIL,
                                    FOTO,
                                    FECHA_NAC_PROP,
                                    FONO1,
                                    FONO2,
                                    USUARIO,
                                    CLAVE,
                                    ESTADO,
                                    ID_ROL
                                )
                                VALUES
                                (
                                    '$newUsCed',
                                    '$newUsName',
                                    '$newUsApel',
                                    '$newUsDir',
                                    '$newUsEm',
                                    '$valName',
                                    '$newUsFe',
                                    '$newUsFn1',
                                    '$newUsFn2',
                                    '$newUsUs',
                                    '$newPass',
                                    '1',
                                    '$newUsRol'
                                )";
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
            }
        }
    } else {
        $salida = "{success:false,d:'[1] Tipo de Archivo no soportado'}";
        echo $salida;
    }
}
?>



