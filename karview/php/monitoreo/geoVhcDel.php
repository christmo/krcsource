<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

extract($_POST);

$consultaSql = "UPDATE VEHICULOS_GEOCERCAS VG
SET VG.ESTADO = 'E'
WHERE ID_GEOCERCA = $idgeo";

echo consulta($consultaSql);

?>



