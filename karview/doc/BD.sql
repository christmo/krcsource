CREATE DATABASE  IF NOT EXISTS `karview_actual` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `karview_actual`;
-- MySQL dump 10.13  Distrib 5.1.40, for Win32 (ia32)
--
-- Host: localhost    Database: karview_actual
-- ------------------------------------------------------
-- Server version	5.1.36-community-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `geocerca_points`
--

DROP TABLE IF EXISTS `geocerca_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geocerca_points` (
  `id_geocerca` int(10) unsigned NOT NULL,
  `lat_geoc_point` double NOT NULL,
  `long_geoc_point` double NOT NULL,
  `orden` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_geocerca`,`lat_geoc_point`,`long_geoc_point`,`orden`),
  CONSTRAINT `FK_geoc_poit_geocerca` FOREIGN KEY (`id_geocerca`) REFERENCES `geocercas` (`id_geocerca`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `avisos`
--

DROP TABLE IF EXISTS `avisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avisos` (
  `ID_AVISO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_USUARIO_DESTINO` int(10) unsigned NOT NULL,
  `ID_USUARIO_ORIGEN` int(10) unsigned NOT NULL,
  `MENSAJE` varchar(255) NOT NULL,
  `OBSERVACIONES` varchar(255) NOT NULL,
  `FECHA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_AVISO`),
  KEY `FK_avisos_1` (`ID_USUARIO_DESTINO`),
  KEY `FK_avisos_2` (`ID_USUARIO_ORIGEN`),
  CONSTRAINT `FK_avisos_1` FOREIGN KEY (`ID_USUARIO_DESTINO`) REFERENCES `personas` (`ID_PER`),
  CONSTRAINT `FK_avisos_2` FOREIGN KEY (`ID_USUARIO_ORIGEN`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nombreequipos`
--

DROP TABLE IF EXISTS `nombreequipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nombreequipos` (
  `IDEQUIPO` varchar(45) NOT NULL,
  `NOMBRE` varchar(45) NOT NULL,
  PRIMARY KEY (`IDEQUIPO`,`NOMBRE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geocercas_historial`
--

DROP TABLE IF EXISTS `geocercas_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geocercas_historial` (
  `ID_HISTORICO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_GEOCERCA` int(10) unsigned NOT NULL,
  `ID_VH` int(10) unsigned NOT NULL,
  `ACCION` int(1) unsigned NOT NULL COMMENT 'valores: 1 (DENTRO) - 0 (FUERA)',
  `FECHA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `NOTIFICADA` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID_HISTORICO`),
  KEY `FK_geocercas_historial_geocerca` (`ID_GEOCERCA`),
  KEY `FK_geocercas_historial_vehiculo` (`ID_VH`),
  CONSTRAINT `FK_geocercas_historial_geocerca` FOREIGN KEY (`ID_GEOCERCA`) REFERENCES `geocercas` (`id_geocerca`),
  CONSTRAINT `FK_geocercas_historial_vehiculo` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`)
) ENGINE=InnoDB AUTO_INCREMENT=10046 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `privilegios_usuarios_historial`
--

DROP TABLE IF EXISTS `privilegios_usuarios_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `privilegios_usuarios_historial` (
  `ID_USUARIO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PRIVILEGIO` varchar(45) NOT NULL,
  `FECHA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ID_USUARIO_GRANT` int(10) unsigned NOT NULL,
  KEY `FK_privilegios_usuarios_1` (`ID_USUARIO`),
  KEY `FK_privilegios_usuarios_2` (`ID_USUARIO_GRANT`),
  CONSTRAINT `FK_privilegios_usuarios_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `personas` (`ID_PER`),
  CONSTRAINT `FK_privilegios_usuarios_2` FOREIGN KEY (`ID_USUARIO_GRANT`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `instalaciones`
--

DROP TABLE IF EXISTS `instalaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instalaciones` (
  `ID_INSTALACION` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_VH` int(10) unsigned NOT NULL,
  `TECNICO` varchar(125) NOT NULL,
  `ID_USUARIO_INGRESO` int(10) unsigned NOT NULL,
  `NUM_CHIP` varchar(15) NOT NULL,
  `OPERADORA_CHIP` varchar(45) NOT NULL,
  `IMEI` varchar(45) NOT NULL,
  `ID_PROP` int(10) unsigned NOT NULL,
  `LUGAR_INSTALACION` varchar(125) NOT NULL,
  `OBSERVACIONES` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_INSTALACION`),
  KEY `FK_instalaciones_1` (`ID_PROP`),
  KEY `FK_instalaciones_2` (`ID_VH`),
  KEY `FK_instalaciones_3` (`ID_USUARIO_INGRESO`),
  CONSTRAINT `FK_instalaciones_1` FOREIGN KEY (`ID_PROP`) REFERENCES `propietarios_part` (`ID_PROP`),
  CONSTRAINT `FK_instalaciones_2` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`),
  CONSTRAINT `FK_instalaciones_3` FOREIGN KEY (`ID_USUARIO_INGRESO`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `accesos`
--

DROP TABLE IF EXISTS `accesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accesos` (
  `IP` varchar(255) DEFAULT NULL,
  `HOST` varchar(255) DEFAULT NULL,
  `USUARIO` varchar(255) DEFAULT NULL,
  `FECHA` date DEFAULT NULL,
  `HORA` time DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estado_equipos_historico`
--

DROP TABLE IF EXISTS `estado_equipos_historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_equipos_historico` (
  `EQUIPO` varchar(25) CHARACTER SET latin1 DEFAULT NULL,
  `FH_UTL_TRAM` varbinary(19) DEFAULT NULL,
  `BATERIA` int(11) NOT NULL,
  `GSM` int(1) DEFAULT NULL,
  `GPS2` int(1) DEFAULT NULL,
  `VEL` double DEFAULT NULL,
  `ESTADO` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `FECHA_ESTADO` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blacklist` (
  `UNIDAD` varchar(10) NOT NULL,
  `FECHA_HORA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UNIDAD`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER UPDATE_BLACKLIST_OFF AFTER INSERT ON BLACKLIST

FOR EACH ROW BEGIN



UPDATE ESTADO_EQP

SET ACTIVO = 'OFF'

WHERE CONCAT(

SUBSTRING(TAXI,locate(';',TAXI)+1,length(TAXI)),

SUBSTRING(TAXI,1,locate(';',TAXI)-1))  = NEW.UNIDAD;



END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER UPDATE_BLACKLIST AFTER DELETE ON BLACKLIST

FOR EACH ROW BEGIN



UPDATE ESTADO_EQP

SET ACTIVO = 'ON'

WHERE CONCAT(

SUBSTRING(TAXI,locate(';',TAXI)+1,length(TAXI)),

SUBSTRING(TAXI,1,locate(';',TAXI)-1))  = OLD.UNIDAD;



END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `registro_env_nombre`
--

DROP TABLE IF EXISTS `registro_env_nombre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registro_env_nombre` (
  `idEquipo` varchar(45) NOT NULL,
  `nombreEquipo` varchar(45) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEquipo`,`nombreEquipo`,`fecha_hora`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sensores`
--

DROP TABLE IF EXISTS `sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensores` (
  `ID` int(12) DEFAULT NULL,
  `TIPO` varchar(45) NOT NULL,
  `NOMBRE` varchar(45) NOT NULL,
  `NUM_SENSOR` int(10) unsigned NOT NULL,
  `GALONES` double NOT NULL,
  `TEMP` double NOT NULL,
  `FECHA_HORA` datetime DEFAULT NULL,
  `INICIO` int(1) unsigned NOT NULL COMMENT '1 Inicio 0 Normal'
) ENGINE=InnoDB DEFAULT CHARSET=latin1
/*!50100 PARTITION BY HASH (ID)
PARTITIONS 365 */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comandos_at_historial`
--

DROP TABLE IF EXISTS `comandos_at_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comandos_at_historial` (
  `ID_REGISTRO_CMD` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int(10) unsigned NOT NULL,
  `ID_VH` int(10) unsigned NOT NULL,
  `COMANDO` varchar(45) NOT NULL,
  `RESPUESTA` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_REGISTRO_CMD`),
  KEY `FK_comandos_at_historial_1` (`ID_VH`),
  KEY `FK_comandos_at_historial_2` (`ID_USUARIO`),
  CONSTRAINT `FK_comandos_at_historial_1` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`),
  CONSTRAINT `FK_comandos_at_historial_2` FOREIGN KEY (`ID_USUARIO`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehiculos_geocercas`
--

DROP TABLE IF EXISTS `vehiculos_geocercas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehiculos_geocercas` (
  `id_geocerca` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_vh` int(10) unsigned NOT NULL,
  `estado` varchar(1) NOT NULL,
  `ultimo_estado` int(1) unsigned NOT NULL,
  PRIMARY KEY (`id_geocerca`,`id_vh`),
  KEY `FK_vehiculos_geocercas_veh` (`id_vh`),
  CONSTRAINT `FK_vehiculos_geocercas_geo` FOREIGN KEY (`id_geocerca`) REFERENCES `geocercas` (`id_geocerca`),
  CONSTRAINT `FK_vehiculos_geocercas_veh` FOREIGN KEY (`id_vh`) REFERENCES `vehiculos_part` (`ID_VH`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `borrar`
--

DROP TABLE IF EXISTS `borrar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `borrar` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `valor` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehiculos_part`
--

DROP TABLE IF EXISTS `vehiculos_part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehiculos_part` (
  `ID_VH` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PLACA_VH` varchar(10) NOT NULL,
  `ID_PROP` int(10) unsigned NOT NULL,
  `MODELO_VH` varchar(45) NOT NULL,
  `ANIO_VH` int(4) unsigned NOT NULL,
  `INF_ADICIONAL_VH` varchar(255) NOT NULL,
  `IMAGEN_VH` varchar(45) NOT NULL,
  `MARCA_VH` varchar(75) NOT NULL,
  `IMG_W_VH` int(2) unsigned NOT NULL,
  `IMG_H_VH` int(2) unsigned NOT NULL,
  `NUM_VH` int(5) unsigned NOT NULL,
  `PSEUDO_NOMB` varchar(125) NOT NULL,
  `ID_EQUIPO` int(11) unsigned NOT NULL,
  `ACT` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID_VH`,`PLACA_VH`,`ID_EQUIPO`) USING BTREE,
  UNIQUE KEY `IdEquipo_check` (`ID_EQUIPO`),
  KEY `FK_vehiculos_part_to_prop` (`ID_PROP`),
  CONSTRAINT `FK_veh_to_person` FOREIGN KEY (`ID_PROP`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sky_eventos`
--

DROP TABLE IF EXISTS `sky_eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sky_eventos` (
  `id_evento` int(10) unsigned NOT NULL,
  `categoria` int(3) DEFAULT NULL,
  `param1` int(3) DEFAULT NULL,
  `desc_evento` varchar(100) DEFAULT NULL,
  `observaciones_evento` varchar(255) DEFAULT NULL,
  `abv` varchar(45) NOT NULL,
  PRIMARY KEY (`id_evento`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estado_eqp`
--

DROP TABLE IF EXISTS `estado_eqp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_eqp` (
  `equipo` varchar(25) DEFAULT NULL,
  `taxi` varchar(25) DEFAULT NULL,
  `fecha_conex` date DEFAULT NULL,
  `hora_conex` time DEFAULT NULL,
  `fecha_ult_dato` date DEFAULT NULL,
  `hora_ult_dato` time DEFAULT NULL,
  `BATERIA` int(11) NOT NULL,
  `ESTADO` varchar(255) DEFAULT NULL,
  `FECHA_ESTADO` date DEFAULT NULL,
  `GSM` int(1) DEFAULT NULL,
  `GPS2` int(1) DEFAULT NULL,
  `VEL` double DEFAULT NULL,
  `ACTIVO` varchar(3) NOT NULL DEFAULT 'ON',
  `ING` int(1) unsigned DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `ID_ROL` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ROL_NOMBRE` varchar(45) NOT NULL,
  `ROL_DESCRIPCION` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_ROL`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehiculos_sensores`
--

DROP TABLE IF EXISTS `vehiculos_sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehiculos_sensores` (
  `ID_VH` int(10) unsigned NOT NULL,
  `NOMBRE_SENS` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_VH`,`NOMBRE_SENS`),
  CONSTRAINT `FK_VH_SENS_VEHIC` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bloqueos_historial`
--

DROP TABLE IF EXISTS `bloqueos_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloqueos_historial` (
  `ID_REGISTRO` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int(10) unsigned NOT NULL,
  `ID_VH` int(10) unsigned NOT NULL,
  `FECHA` varchar(45) NOT NULL,
  `ELEMENTO_VEH` varchar(45) NOT NULL,
  `ACCION` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_REGISTRO`),
  KEY `FK_bloqueos_historial_1` (`ID_VH`),
  KEY `FK_bloqueos_historial_2` (`ID_USUARIO`),
  CONSTRAINT `FK_bloqueos_historial_1` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`),
  CONSTRAINT `FK_bloqueos_historial_2` FOREIGN KEY (`ID_USUARIO`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehiculos_usuarios_part`
--

DROP TABLE IF EXISTS `vehiculos_usuarios_part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehiculos_usuarios_part` (
  `ID_USUARIO` int(10) unsigned NOT NULL,
  `ID_VH` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID_USUARIO`,`ID_VH`) USING BTREE,
  KEY `FK_vup_vh` (`ID_VH`),
  CONSTRAINT `FK_vup_user` FOREIGN KEY (`ID_USUARIO`) REFERENCES `personas` (`ID_PER`),
  CONSTRAINT `FK_vup_vh` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personas` (
  `ID_PER` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CEDULA_PROP` varchar(10) NOT NULL,
  `NOMBRES_PROP` varchar(45) NOT NULL,
  `APELLIDOS_PROP` varchar(45) NOT NULL,
  `DIRECCION_PROP` varchar(45) NOT NULL,
  `MAIL` varchar(45) NOT NULL,
  `FOTO` varchar(45) NOT NULL,
  `FECHA_NAC_PROP` date NOT NULL,
  `FONO1` int(10) unsigned NOT NULL,
  `FONO2` int(10) unsigned NOT NULL,
  `USUARIO` varchar(45) NOT NULL,
  `CLAVE` varchar(45) NOT NULL,
  `ESTADO` int(1) unsigned NOT NULL,
  `ID_ROL` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ID_PER`) USING BTREE,
  KEY `FK_ROL_PERSON` (`ID_ROL`),
  CONSTRAINT `FK_ROL_PERSON` FOREIGN KEY (`ID_ROL`) REFERENCES `roles` (`ID_ROL`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `color_estados`
--

DROP TABLE IF EXISTS `color_estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `color_estados` (
  `estado` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  PRIMARY KEY (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `revisiones`
--

DROP TABLE IF EXISTS `revisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revisiones` (
  `ID_REVISION` int(10) NOT NULL,
  `ID_VH` int(10) unsigned DEFAULT NULL,
  `TECNICO` varchar(120) DEFAULT NULL,
  `ID_USUARIO_INGRESO` int(10) unsigned DEFAULT NULL,
  `PROBLEMA` varchar(255) DEFAULT NULL,
  `FECHA` timestamp NULL DEFAULT NULL,
  `LUGAR_REVISION` varchar(255) DEFAULT NULL,
  `SOLICITANTE` varchar(150) DEFAULT NULL,
  `FECHA_PROX_REVISION` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID_REVISION`),
  KEY `FK_revisiones_1` (`ID_VH`),
  KEY `FK_revisiones_2` (`ID_USUARIO_INGRESO`),
  CONSTRAINT `FK_revisiones_1` FOREIGN KEY (`ID_VH`) REFERENCES `vehiculos_part` (`ID_VH`),
  CONSTRAINT `FK_revisiones_2` FOREIGN KEY (`ID_USUARIO_INGRESO`) REFERENCES `personas` (`ID_PER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recorridos`
--

DROP TABLE IF EXISTS `recorridos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recorridos` (
  `ID` int(12) DEFAULT NULL,
  `N_UNIDAD` int(11) NOT NULL,
  `ID_EMPRESA` varchar(10) NOT NULL,
  `LATITUD` double DEFAULT NULL,
  `LONGITUD` double DEFAULT NULL,
  `FECHA` date NOT NULL,
  `HORA` time NOT NULL,
  `VELOCIDAD` double DEFAULT NULL,
  `G1` int(1) unsigned DEFAULT NULL,
  `G2` int(1) unsigned DEFAULT NULL,
  `SAL` int(1) unsigned DEFAULT NULL,
  `BAT` int(2) unsigned DEFAULT NULL,
  `GPS1` int(1) unsigned DEFAULT NULL,
  `GSM` int(1) unsigned DEFAULT NULL,
  `GPS2` int(1) unsigned DEFAULT NULL,
  `ING` int(1) unsigned DEFAULT NULL,
  `DIRECCION` varchar(255) DEFAULT NULL,
  `EVT` int(3) DEFAULT NULL,
  `PARM1` int(5) DEFAULT NULL,
  `ODOM` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC
/*!50100 PARTITION BY HASH (ID)
PARTITIONS 400 */;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER EST_DISPOSITIVOS BEFORE INSERT ON RECORRIDOS
FOR EACH ROW
BEGIN
DECLARE ID_EQUIPO VARCHAR(25);
  DECLARE ID_EMP VARCHAR(25);
  DECLARE ID_REP VARCHAR(25);
  DECLARE DESC_EVT VARCHAR(100);
  SET ID_EQUIPO = SUBSTRING(NEW.ID_EMPRESA,LOCATE(";",NEW.ID_EMPRESA)+1,LENGTH(NEW.ID_EMPRESA));
  SET ID_EMP = SUBSTRING(NEW.ID_EMPRESA,1,LOCATE(";",NEW.ID_EMPRESA)-1);
  SET NEW.ID_EMPRESA = ID_EMP;
  SET ID_REP = CONCAT(NEW.N_UNIDAD,';',ID_EMP);
  UPDATE ESTADO_EQP
  SET
     TAXI = ID_REP,
      FECHA_ULT_DATO = NEW.FECHA,
      HORA_ULT_DATO = NEW.HORA,
      BATERIA = NEW.BAT,
      VEL = NEW.VELOCIDAD,
      GSM = NEW.GSM,
      GPS2 = NEW.GPS2,
      ING = NEW.ING
  WHERE STRCMP(EQUIPO, ID_EQUIPO)=0;

  #DESC_EVENTO
  SELECT SE.DESC_EVENTO
  INTO DESC_EVT
  FROM
  SKY_EVENTOS SE
  WHERE
     SE.CATEGORIA = NEW.EVT
     AND SE.PARAM1 = NEW.PARM1
  LIMIT 1;

  #DATOS A GRAFICAR EN EL MAPA
  CALL SP_ULTIMOS_GPS( ID_EMP,NEW.N_UNIDAD,NEW.LONGITUD,NEW.LATITUD,
                       NEW.VELOCIDAD,NEW.FECHA,NEW.HORA, NEW.DIRECCION,
                       DESC_EVT, NEW.G1, NEW.G2);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `geocercas`
--

DROP TABLE IF EXISTS `geocercas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geocercas` (
  `id_geocerca` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre_geoc` varchar(50) NOT NULL,
  `desc_geoc` varchar(125) NOT NULL,
  `area` double DEFAULT NULL,
  PRIMARY KEY (`id_geocerca`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ultimos_gps`
--

DROP TABLE IF EXISTS `ultimos_gps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ultimos_gps` (
  `ID_EMPRESA` varchar(10) NOT NULL,
  `N_UNIDAD` int(11) unsigned NOT NULL,
  `LONGITUD` double NOT NULL,
  `LATITUD` double NOT NULL,
  `VELOCIDAD` double NOT NULL,
  `FECHA_HORA` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `PLACA_VH` varchar(10) DEFAULT NULL,
  `DIRECCION` varchar(255) DEFAULT NULL,
  `DESC_EVENTO` varchar(100) DEFAULT NULL,
  `G1` int(1) unsigned DEFAULT NULL,
  `G2` int(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID_EMPRESA`,`N_UNIDAD`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `cantidad_equipos_x_coop`
--

DROP TABLE IF EXISTS `cantidad_equipos_x_coop`;
/*!50001 DROP VIEW IF EXISTS `cantidad_equipos_x_coop`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `cantidad_equipos_x_coop` (
  `ID_EMPRESA` varchar(10),
  `CANT` bigint(21)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `cantidad_tramas`
--

DROP TABLE IF EXISTS `cantidad_tramas`;
/*!50001 DROP VIEW IF EXISTS `cantidad_tramas`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `cantidad_tramas` (
  `EQUIPO` varchar(25),
  `TAXI` varchar(51),
  `CNTDATOS` bigint(21)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `estado_equipos`
--

DROP TABLE IF EXISTS `estado_equipos`;
/*!50001 DROP VIEW IF EXISTS `estado_equipos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `estado_equipos` (
  `EQUIPO` varchar(25),
  `TAXI` varchar(52),
  `FH_CON` varbinary(19),
  `FH_DES` varbinary(19),
  `TMPCON` bigint(21),
  `TMPDES` bigint(21),
  `BATERIA` int(11),
  `ESTADO` varchar(255),
  `FECHA_ESTADO` date,
  `GSM` int(1),
  `GPS2` int(1),
  `VEL` double,
  `ACTIVO` varchar(3),
  `ING` int(1) unsigned
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `cantidad_equipos_x_coop`
--

/*!50001 DROP TABLE IF EXISTS `cantidad_equipos_x_coop`*/;
/*!50001 DROP VIEW IF EXISTS `cantidad_equipos_x_coop`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `cantidad_equipos_x_coop` AS select `recorridos`.`ID_EMPRESA` AS `ID_EMPRESA`,count(distinct concat(`recorridos`.`N_UNIDAD`,`recorridos`.`ID_EMPRESA`)) AS `CANT` from `recorridos` where ((`recorridos`.`ID` = date_format(now(),'%Y%m%d')) and (concat(`recorridos`.`FECHA`,' ',`recorridos`.`HORA`) >= (now() + interval -(30) hour_minute))) group by `recorridos`.`ID_EMPRESA` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `cantidad_tramas`
--

/*!50001 DROP TABLE IF EXISTS `cantidad_tramas`*/;
/*!50001 DROP VIEW IF EXISTS `cantidad_tramas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `cantidad_tramas` AS select `e`.`equipo` AS `EQUIPO`,concat(substr(`e`.`taxi`,1,(locate(';',`e`.`taxi`) - 1)),' ',substr(`e`.`taxi`,(locate(';',`e`.`taxi`) + 1),length(`e`.`taxi`))) AS `TAXI`,(select count(`r`.`N_UNIDAD`) AS `COUNT(N_UNIDAD)` from `recorridos` `r` where ((`r`.`ID` >= replace(`e`.`fecha_conex`,'-','')) and (`r`.`N_UNIDAD` = substr(`e`.`taxi`,1,(locate(';',`e`.`taxi`) - 1))) and (`r`.`ID_EMPRESA` = substr(`e`.`taxi`,(locate(';',`e`.`taxi`) + 1),length(`e`.`taxi`))) and (concat(`r`.`FECHA`,`r`.`HORA`) >= concat(`e`.`fecha_conex`,`e`.`hora_conex`)))) AS `CNTDATOS` from `estado_eqp` `e` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `estado_equipos`
--

/*!50001 DROP TABLE IF EXISTS `estado_equipos`*/;
/*!50001 DROP VIEW IF EXISTS `estado_equipos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `estado_equipos` AS select `estado_eqp`.`equipo` AS `EQUIPO`,concat(substr(`estado_eqp`.`taxi`,(locate(';',`estado_eqp`.`taxi`) + 1),length(`estado_eqp`.`taxi`)),'  ',substr(`estado_eqp`.`taxi`,1,(locate(';',`estado_eqp`.`taxi`) - 1))) AS `TAXI`,concat(`estado_eqp`.`fecha_conex`,' ',`estado_eqp`.`hora_conex`) AS `FH_CON`,concat(`estado_eqp`.`fecha_ult_dato`,' ',`estado_eqp`.`hora_ult_dato`) AS `FH_DES`,timestampdiff(MINUTE,concat(`estado_eqp`.`fecha_conex`,' ',`estado_eqp`.`hora_conex`),now()) AS `TMPCON`,timestampdiff(MINUTE,concat(`estado_eqp`.`fecha_ult_dato`,' ',`estado_eqp`.`hora_ult_dato`),now()) AS `TMPDES`,`estado_eqp`.`BATERIA` AS `BATERIA`,`estado_eqp`.`ESTADO` AS `ESTADO`,`estado_eqp`.`FECHA_ESTADO` AS `FECHA_ESTADO`,`estado_eqp`.`GSM` AS `GSM`,`estado_eqp`.`GPS2` AS `GPS2`,`estado_eqp`.`VEL` AS `VEL`,`estado_eqp`.`ACTIVO` AS `ACTIVO`,`estado_eqp`.`ING` AS `ING` from `estado_eqp` order by timestampdiff(MINUTE,concat(`estado_eqp`.`fecha_conex`,' ',`estado_eqp`.`hora_conex`),now()) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping routines for database 'karview_actual'
--
/*!50003 DROP PROCEDURE IF EXISTS `SP_NUEVO_VEHC` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_NUEVO_VEHC`(

IN LSTPROP VARCHAR(10),
IN VHPLACA VARCHAR(10),
IN VHMODEL VARCHAR(45),
IN VHMARCA VARCHAR(75),
IN VHALIAS VARCHAR(125),
IN VHANIO  INT(4),
IN VHNUMER INT(5),
IN VHIDEQP INT(11),
IN VHINFOR VARCHAR(255),
IN VHIMG   VARCHAR(45),
IN VHIMGW  INT(2),
IN VHIMGH  INT(2),

OUT ESTADO INT(1)

)
BEGIN

  DECLARE AUX_ID_VH INT(10);

  START TRANSACTION;

        #INSERTA REGISTRO DE VEHICULO
        INSERT INTO VEHICULOS_PART(
        PLACA_VH, ID_PROP, MODELO_VH, ANIO_VH,
        INF_ADICIONAL_VH, IMAGEN_VH, MARCA_VH,
        IMG_W_VH, IMG_H_VH, NUM_VH, PSEUDO_NOMB,
        ID_EQUIPO)
        VALUES(
        VHPLACA, LSTPROP, VHMODEL, VHANIO,
        VHINFOR, VHIMG, VHMARCA,
        VHIMGW, VHIMGH, VHNUMER, VHALIAS,
        VHIDEQP);

        #EXTRAER ID DE VEHICULO

        SELECT ID_VH
        INTO AUX_ID_VH
        FROM VEHICULOS_PART
        WHERE PLACA_VH = VHPLACA
        AND MODELO_VH = VHMODEL
        LIMIT 1;

        #VINCULAR VEHICULO CON PROPIETARIO(USER)
        INSERT INTO VEHICULOS_USUARIOS_PART
        (ID_USUARIO, ID_VH)
        VALUES(LSTPROP, AUX_ID_VH);

        #TODO:
        #   POR DEFECTO TODO VEHICULO DEBERÍA SER
        #   AGREGADO A LA CUENTA DEL ADMINISTRADOR
       COMMIT;
       SET ESTADO = 1;

 END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_REGISTRO_ACT_ESTADO_GEOC` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_REGISTRO_ACT_ESTADO_GEOC`(

  IDGEO   INT(10),

  NOM_EQP VARCHAR(45),

  EST     VARCHAR(1)

)
BEGIN



  DECLARE IDVH VARCHAR(45);



  #Extraer ID del vehículo relacionado

  SELECT ID_VH

  INTO IDVH

  FROM VEHICULOS_PART

  WHERE ID_EQUIPO = SUBSTRING(NOM_EQP,1,2)

  LIMIT 1;



  #Actualizar estado registrado

  UPDATE VEHICULOS_GEOCERCAS

  SET ESTADO = EST

  WHERE ID_GEOCERCA = IDGEO

  AND ID_VH = IDVH;





END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_REGISTRO_EQ` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_REGISTRO_EQ`(

  EQ varchar(25),
  TX varchar(25),
  FC date,
  HC time,
  FU date,
  HU time,
  BT int,
  VL double
)
BEGIN
  DECLARE EXISTE INTEGER;
  #EXISTE EQUIPO
  SELECT COUNT(EQUIPO)
  INTO EXISTE
  FROM ESTADO_EQP
  WHERE STRCMP(EQUIPO, EQ)=0;
  
  #Valores de GSM y GPS2 est�n
  #quemados para la primer insersi�n
  #BATERIA lo est� en el c�digo
  #del servidor a 0
  
  IF (EXISTE > 0) THEN
    #ACTUALIZA
    UPDATE ESTADO_EQP
    SET TAXI = TX,
        FECHA_CONEX = FC,
        HORA_CONEX =HC,
        FECHA_ULT_DATO = FU,
        HORA_ULT_DATO = HU,
        BATERIA = BT,
		GSM = 0,
		GPS2 = 0,
        VEL = VL
    WHERE STRCMP(EQUIPO, EQ)=0;
  ELSE
    #INGRESA
    INSERT INTO ESTADO_EQP(EQUIPO, TAXI, FECHA_CONEX, HORA_CONEX, FECHA_ULT_DATO, HORA_ULT_DATO, BATERIA, GSM, GPS2, VEL)
    VALUES(EQ,TX,FC,HC,FU,HU,BT,0,0,VL);
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_REGISTRO_EVT_GEOCERCA` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_REGISTRO_EVT_GEOCERCA`(

  IDGEO INT(10),

  PLC   VARCHAR(45),

  ACC   INT(1),

  FH    VARCHAR(45)

)
BEGIN



  DECLARE IDVH VARCHAR(45);



  #Extraer ID del vehículo relacionado

  SELECT ID_VH

  INTO IDVH

  FROM VEHICULOS_PART

  WHERE ID_EQUIPO = SUBSTRING(PLC,1,2)

  LIMIT 1;



  #Registro de Evento de Geocercas

  INSERT INTO GEOCERCAS_HISTORIAL (ID_GEOCERCA, ID_VH, ACCION, FECHA)

  VALUES (IDGEO, IDVH, ACC, FH);



  #Actualizar ultimo estado registrado

  UPDATE VEHICULOS_GEOCERCAS

  SET ULTIMO_ESTADO = ACC

  WHERE ID_GEOCERCA = IDGEO

  AND ID_VH = IDVH;





END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_REPORTE_PARADAS` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_REPORTE_PARADAS`(

  NUMEQP    VARCHAR(45),

  IDEVT    VARCHAR(45),

  INI VARCHAR(20),

  FIN VARCHAR(20)

)
BEGIN





SELECT

  COUNT(R.ODOM) NUM_REPORT,

  MIN(CONCAT(R.FECHA, ' ', R.HORA)) DESDE,

  MAX(CONCAT(R.FECHA, ' ', R.HORA)) HASTA,

  TIMEDIFF(MAX(CONCAT(R.FECHA, ' ', R.HORA)), MIN(CONCAT(R.FECHA, ' ', R.HORA))) DURACION,

  LATITUD, LONGITUD, DIRECCION

FROM RECORRIDOS R, SKY_EVENTOS S

WHERE R.ID BETWEEN DATE_FORMAT(INI, '%Y%m%d') AND DATE_FORMAT(FIN, '%Y%m%d')

AND CONCAT(FECHA,' ',HORA) BETWEEN INI AND FIN

AND R.N_UNIDAD = NUMEQP

AND S.ID_EVENTO = IDEVT

AND R.EVT = S.CATEGORIA

AND R.PARM1 = S.PARAM1

GROUP BY ODOM

ORDER BY DESDE;



END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_ULTIMOS_GPS` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_ULTIMOS_GPS`(

          idempresa varchar(10),

          nunidad int(11),

          lon double,

          lat double,

          vel double,

          fec date,

          hor time,

          di varchar(255),

          desc_vt varchar(100),

          varG1 int(1),

          varG2 int(2)

)
BEGIN



  DECLARE existe int(1);

  DECLARE PL_VH VARCHAR(10);



  SELECT COUNT(ID_EMPRESA)

  INTO existe

  FROM ULTIMOS_GPS

  WHERE ID_EMPRESA = idempresa AND

        N_UNIDAD = nunidad;





  SELECT VP.PLACA_VH

  INTO PL_VH

  FROM VEHICULOS_PART VP

  WHERE VP.ID_EQUIPO = nunidad

  LIMIT 1;





  IF (existe = 0) THEN

    INSERT INTO ULTIMOS_GPS(ID_EMPRESA, N_UNIDAD, LONGITUD, LATITUD, VELOCIDAD, FECHA_HORA, DIRECCION, PLACA_VH, DESC_EVENTO, G1, G2)

    VALUES(idempresa, nunidad, lon, lat, vel, concat(fec,' ',hor), di, PL_VH, desc_vt, varG1, varG2);

  ELSE

    UPDATE ULTIMOS_GPS

    SET

      LONGITUD = lon,

      LATITUD = lat,

      VELOCIDAD = vel,

      FECHA_HORA = concat(fec,' ',hor),

      DIRECCION = di,

      PLACA_VH = PL_VH,

      DESC_EVENTO = desc_vt,

      G1 = varG1,

      G2 = varG2

    WHERE ID_EMPRESA = idempresa AND N_UNIDAD = nunidad

    AND concat(fec,' ',hor) > FECHA_HORA;

  END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_UPDATE_ESTADO_EQUIPOS` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_UPDATE_ESTADO_EQUIPOS`(
IN EST varchar(255),
FCH VARCHAR(25),
EQP VARCHAR(25))
BEGIN

    UPDATE ESTADO_EQP
    SET ESTADO = EST, FECHA_ESTADO = FCH
    WHERE EQUIPO = EQP;

    INSERT INTO ESTADO_EQUIPOS_HISTORICO
    SELECT EQUIPO, FH_DES, BATERIA, GSM, GPS2, VEL, ESTADO, FECHA_ESTADO  FROM ESTADO_EQUIPOS
    WHERE EQUIPO = EQP;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_VINC_VEHIC` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `SP_VINC_VEHIC`(

  LSTPERS VARCHAR(255),
  IDVH INT(10)

)
BEGIN

  DECLARE STOP_FLAG INT DEFAULT 0;
  DECLARE VALOR INT;
  DECLARE NEW_FLAG INT;

  #ELIMINAR RELACIONES QUE NO SE ENCUENTREN EN LA LISTA
  #DESDE PHP


  #EXTRACCIÓN DE ID INDIVIDUAL
  WHILE STOP_FLAG <> 1 DO

    #TERMINÓ LA LISTA ?
    IF INSTR(LSTPERS, ',') = 0 THEN
      SET VALOR = LSTPERS;
      SET STOP_FLAG = 1;
    ELSE
      #ITERO EL SIGUIENTE ELEMENTO
      SET VALOR = SUBSTRING(LSTPERS,1,INSTR(LSTPERS, ',')-1);
      SET LSTPERS = SUBSTRING(LSTPERS,INSTR(LSTPERS, ',')+1,LENGTH(LSTPERS));
    END IF;

    #LA DUPLA YA EXISTE ?
    SELECT COUNT(1)
    INTO NEW_FLAG
    FROM VEHICULOS_USUARIOS_PART VUP
    WHERE VUP.ID_VH = IDVH
    AND VUP.ID_USUARIO = VALOR;

    #INSERCIÓN DE NUEVO REGISTRO. SOLO CUANDO NO HA SIDO VINCULADO
    IF NEW_FLAG = 0 THEN
      INSERT INTO VEHICULOS_USUARIOS_PART(ID_USUARIO, ID_VH)
      VALUES(VALOR, IDVH);
    END IF;

  END WHILE;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-01-04 15:49:17
