-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 28-03-2022 a las 13:19:39
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `tkride`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `LOAD_SESSION`(IN `user_` VARCHAR(50))
    READS SQL DATA
BEGIN
	DECLARE id_ INT default 0;
        DECLARE logged_ TINYINT default 0;
        
	SELECT `id`, `logged` INTO id_, logged_
        FROM `users`
        WHERE `user`=user_;
        
        IF logged_ = 1 THEN
        	SELECT * FROM `sessions` WHERE `id_user`=id_;
	ELSE
        	SELECT 'error';
        END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `LOAD_USER_PATTERNS`(IN `user_` VARCHAR(50))
    NO SQL
    DETERMINISTIC
BEGIN
	DECLARE id_user_ INT(11) DEFAULT 0;
        
	SELECT id INTO id_user_ FROM users WHERE user = user_;
	SELECT * FROM patterns WHERE id_user = id_user_;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UNLOG_USER`(IN `user_` VARCHAR(50), IN `pass_` VARCHAR(15), IN `ip_` VARCHAR(15))
    NO SQL
BEGIN
	DECLARE key_crypt_ VARCHAR(15) DEFAULT NULL;
        
        SELECT value INTO key_crypt_ FROM system WHERE name LIKE 'key_crypt';
        
	UPDATE users SET logged = 0
        WHERE user = user_
        AND DECODE(pass, key_crypt_) LIKE pass_
        AND ip LIKE ip_;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `CHECK_USER_LOGGED`(`user_` VARCHAR(50), `ip_` VARCHAR(15), `login_time_` VARCHAR(17)) RETURNS tinyint(1)
    NO SQL
BEGIN
        DECLARE priv_ TINYINT(1) DEFAULT -1;
        DECLARE format_time_ DATETIME DEFAULT NULL;
        
        SELECT STR_TO_DATE(login_time_, '%d/%m/%Y %H:%i:%s') INTO format_time_;
        
	SELECT priviledges
        INTO priv_
        FROM users
        WHERE user = user_
        AND logged = 1
        AND ip = ip_
        AND login_time = format_time_;
        
        RETURN priv_;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `DELETE_PATTERN`(`user_` VARCHAR(50), `name_` VARCHAR(50)) RETURNS tinyint(1)
    NO SQL
BEGIN

	DECLARE id_user_ INT(11) DEFAULT 0;
        
        SELECT id INTO id_user_ FROM users WHERE user = user_;
        DELETE FROM patterns WHERE id_user = id_user_ AND name = name_;
        RETURN ROW_COUNT();
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `LOGIN_USER`(`user_` VARCHAR(50), `pass_` VARCHAR(15), `ip_` VARCHAR(15), `login_time_` VARCHAR(17)) RETURNS tinyint(1)
    NO SQL
    DETERMINISTIC
BEGIN
	DECLARE key_crypt_ VARCHAR(50) DEFAULT NULL;
        DECLARE priv_ TINYINT(1) DEFAULT -1;
        DECLARE format_time_ DATETIME DEFAULT NULL;
        
        SELECT value INTO key_crypt_ FROM system WHERE name LIKE 'key_crypt';
        
        SELECT STR_TO_DATE(login_time_, '%d/%m/%Y %H:%i:%s') INTO format_time_;
        
        UPDATE users SET logged = 1, ip = ip_, login_time = format_time_
        WHERE user LIKE user_
        AND DECODE(pass, key_crypt_) LIKE pass_;
        
        SELECT CHECK_USER_LOGGED(user_, ip_, login_time_) INTO priv_;
        
        return priv_;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `SAVE_PATTERN`(`user_` VARCHAR(50), `name_` VARCHAR(50), `values_` VARCHAR(255)) RETURNS tinyint(1)
    NO SQL
    DETERMINISTIC
BEGIN
	DECLARE id_user_ INT(11) DEFAULT 0;
        
        SELECT id INTO id_user_ FROM users WHERE user = user_;
        IF id_user_ > 0 THEN
		INSERT INTO patterns (id_user, name, `values`)
                VALUES (id_user_, name_, values_)
                ON DUPLICATE KEY UPDATE
                	`values` = values_;

                return 1;
        ELSE
        	return 0;
        END IF;
	
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patterns`
--

CREATE TABLE IF NOT EXISTS `patterns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `values` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_PATTERNS` (`name`,`id_user`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=96 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `n_chart` tinyint(4) NOT NULL,
  `id_chart` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `system`
--

CREATE TABLE IF NOT EXISTS `system` (
  `name` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pass` varchar(15) NOT NULL,
  `logged` tinyint(4) NOT NULL DEFAULT '0',
  `login_time` datetime NOT NULL,
  `ip` varchar(15) NOT NULL,
  `priviledges` tinyint(1) NOT NULL DEFAULT '3',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
