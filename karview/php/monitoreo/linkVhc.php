<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');


extract($_POST);

$sql = "START TRANSACTION ";
consulta($sql);

$sql = "
    DELETE FROM VEHICULOS_USUARIOS_PART 
    WHERE ID_VH = $linkVhList
    AND ID_USUARIO NOT IN ($itemsLinkVh)
    ";
consulta($sql);

if (mysql_errno() == 0) {
    $sql = "CALL SP_VINC_VEHIC('$itemsLinkVh',$linkVhList)";
    consulta($sql);
    if (mysql_errno() == 0) {
        $sql = "COMMIT";
        consulta($sql);
        echo "{success:true}";
    } else {
        $sql = "ROLLBACK";
        consulta($sql);
        echo "{success:false}";
    }
} else {
    $sql = "ROLLBACK";
    consulta($sql);
    echo "{success:false}";
}
?>
