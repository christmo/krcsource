<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>KRADAC - Rastreo Satelital</title>
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="css/css_index.css"/>

        <script language="javascript" type="text/javascript" src="js/jquery/jquery-1.4.2.min.js"></script>

        <script type='text/javascript'>
            function valIn() {
                var u = $("#tus").val();
                var p = $("#pas").val();

                if (u.length<3 || p.length<3) {
                    $("#msj").html("Datos incompletos");

                    $("#tus").removeAttr('disabled');
                    $("#pas").removeAttr('disabled');
                    $("#btnIn").removeAttr('disabled');
                }else{

                    $("#msj").html("Verificando...");                    
                    $("#tus").attr("disabled", "disabled");
                    $("#pas").attr("disabled", "disabled");

                    $("#btnIn").attr("disabled", "disabled");
                    
                    $.post("php/login/login.php",
                    {   us: u,
                        ps: p
                    },function(data){
                        if (data == 0) {
                            $("#msj").html("Usuario o Password incorrectos");
                            $("#tus").removeAttr('disabled');
                            $("#pas").removeAttr('disabled');
                            $("#btnIn").removeAttr('disabled');
                        }else{
                            location.href="index_kradac.php";
                        }
                    }
                );
                }
            }            
            function identify(){
                if (window.event.keyCode == 13) {
                    valIn();
                }
            }
        </script>

    </head>

    <body>
        <center>
            <div id ="imgPortada"><img src="img/portada.png" alt="Kradac"/>
            </div>


            <div id="login">
                <div class="usuario">
                    <div class="error" id="msj"></div>
                    <div class="texto">Usuario:</div><input type="text" name="txtUsuario" id="tus" onkeypress="identify()"/><br/>
                    <div class="texto">Clave:</div><input type="password" name="txtClave" id="pas" onkeypress="identify()"/>
                </div>
                <div class="botones">
                    <input class="txtBoton" type="button" name="btnEntrar" value="Entrar" id ="btnIn" onclick="valIn()"/>
                </div>
            </div>
        </center>
    </body>
</html>
