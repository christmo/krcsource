<?php

    include 'php/login/isLogin.php';
    require_once('dll/conect.php');


    echo "<style type=\"text/css\">
    body {
        font-family:'lucida grande',tahoma,arial,sans-serif;
        font-size:11px;
    }
    a {
        color:#15428B;
    }
    a:link, a:visited {
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
    #header {
        background: #7F99BE url(js/monitoreo/layout/images/layout-browser-hd-bg.gif) repeat-x center;
    }
    #header h1 {
        font-size: 16px;
        color: #fff;
        font-weight: normal;
        padding: 5px 10px;
    }
    #start-div h2 {
        font-size: 12px;
        color: #555;
        padding-bottom:5px;
        border-bottom:1px solid #C3D0DF;
    }
    #start-div p {
        margin: 10px 0;
    }
    #details-panel h2 {
        padding:10px 10px 0;
        font-size:12px;
        color:#15428B;
    }
    #details-panel p {
        padding:10px 10px 0;
    }
    #details-panel pre {
        border-top:1px dotted #ddd;
        border-bottom:1px dotted #ddd;
        margin-top:10px;
        padding:0 5px;
        background:#f5f5f5;
    }
    #details-panel .details-info {
        margin:15px;
        padding:15px;
        border:1px dotted #999;
        color:#555;
        background: #f9f9f9;
    }
    .x-tab-panel-header-plain .x-tab-strip-top {
        background: #DFE8F6 url(css/resources/images/default/tabs/tab-strip-bg.gif) repeat-x scroll center bottom !important;
    }
    .custom-accordion .x-panel-body{
        background:#ffe;
        text-align:center;
    }
    .custom-accordion .x-panel-body p {
        font-family:georgia,serif;
        padding:20px 80px !important;
        font-size:18px;
        color:#15428B;
    }
    .custom-accordion .x-panel-header-text {
        font-weight:bold;
        font-style:italic;
        color:#555;
    }
    #form-panel .x-panel-footer {
        background:#DFE8F6;
        border-color:#99BBE8;
        border-style:none solid solid;
        border-width:0pt 1px 1px;
    }
    #table-panel .x-table-layout {
        padding:5px;
    }
    #table-panel .x-table-layout td {
        vertical-align:top;
        padding:5px;
        font-size: 11px;
    }
    .icon-send {
        background-image:url(js/monitoreo/layout/images/email_go.png) !important;
    }
    .icon-save {
        background-image:url(js/monitoreo/layout/images/disk.png) !important;
    }
    .icon-print {
        background-image:url(js/monitoreo/layout/images/printer.png) !important;
    }
    .icon-spell {
        background-image:url(js/monitoreo/layout/images/spellcheck.png) !important;
    }
    .icon-attach {
        background-image:url(js/monitoreo/layout/images/page_attach.png) !important;
    }
    .email-form .x-panel-mc .x-panel-tbar .x-toolbar {
        border-top:1px solid #C2D6EF;
        border-left:1px solid #C2D6EF;
        border-bottom:1px solid #99BBE8;
        margin:-5px -4px 0;
    }
    .inner-tab-custom .x-border-layout-ct {
        background: #fff;
    }

    .cars{
        background-image: url(img/";
        echo  "vicky_mini.png) !important;
    }

    .coopIco{
        background-image: url(img/centIco.png) !important;
    }";

    echo loadImagePanelTree() . "</style>";

    function loadImagePanelTree() {

        $consultaSql = " SELECT DISTINCT(VP.ID_EQUIPO), VP.IMAGEN_VH
                         FROM VEHICULOS_PART VP, VEHICULOS_USUARIOS_PART VUP
                         WHERE VP.ACT = 1 AND VP.ID_VH = VUP.ID_VH
                         AND VUP.ID_USUARIO = " . $_SESSION["ID_USER"];

        consulta($consultaSql);
        $resulset = variasFilas();

        $salida = "";
        $datos = "";
        if (count($resulset) >= 1) {
            for ($i = 0; $i < count($resulset); $i++) {
                $fila = $resulset[$i];
                $datos = "\n.C".$fila["ID_EQUIPO"] . "{ background-image: url(img/".
                substr($fila["IMAGEN_VH"], 0, strrpos($fila["IMAGEN_VH"], '.', 0)) . '_mini'
                . substr($fila["IMAGEN_VH"], strrpos($fila["IMAGEN_VH"], '.', 0), strlen($fila["IMAGEN_VH"])) . ") !important }\n ";
                $salida .= $datos;
            }
        }
        return $salida;
    }

?>
