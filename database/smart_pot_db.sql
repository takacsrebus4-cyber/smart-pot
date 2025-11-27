-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 27. 17:31
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `smart_pot_db`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `current_plants`
--

CREATE TABLE `current_plants` (
  `id` int(11) NOT NULL,
  `plant_name` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `current_plants`
--

INSERT INTO `current_plants` (`id`, `plant_name`, `user_id`) VALUES
(3, 'Tulipán', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `plants_data`
--

CREATE TABLE `plants_data` (
  `name` varchar(100) NOT NULL,
  `scientific_name` varchar(150) NOT NULL,
  `min_light` int(11) NOT NULL,
  `max_light` int(11) NOT NULL,
  `min_moisture` int(11) NOT NULL,
  `max_moisture` int(11) NOT NULL,
  `min_temperature` int(11) NOT NULL,
  `max_temperature` int(11) NOT NULL,
  `min_humidity` int(11) NOT NULL,
  `max_humidity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `plants_data`
--

INSERT INTO `plants_data` (`name`, `scientific_name`, `min_light`, `max_light`, `min_moisture`, `max_moisture`, `min_temperature`, `max_temperature`, `min_humidity`, `max_humidity`) VALUES
('nárcisz', 'narusz ciszusz', 10, 20, 10, 20, 10, 20, 20, 10),
('pitypang', 'pityus pangus', 11, 66, 22, 77, 55, 88, 44, 33),
('százszorszép', 'legusz szebbusz', 11, 66, 22, 77, 55, 88, 44, 33),
('százszorszép2', 'legusz szebbusz', 11, 66, 22, 77, 55, 88, 44, 33),
('Tulipán', 'Tulis Panus', 10, 30, 20, 50, 15, 30, 50, 65);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `password`) VALUES
(1, 'Peti', '12345'),
(5, 'Peti1', '$2b$10$SGrkHHr0JYOHdCPrcNogk.cDf7ssVCAEefovOpWmX1.q93fgugESa');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weekly_data`
--

CREATE TABLE `weekly_data` (
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `light` float NOT NULL,
  `moisture` int(11) NOT NULL,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `current_plant_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `weekly_data`
--

INSERT INTO `weekly_data` (`timestamp`, `light`, `moisture`, `temperature`, `humidity`, `current_plant_id`) VALUES
('2025-11-26 07:06:46.984000', 90, 80, 70, 60, 3),
('2025-11-26 09:10:12.964000', 24, 52, 61, 78, 3),
('2025-11-26 17:47:36.690000', 34, 454, 56, 546, 3),
('2025-11-27 15:29:49.966000', 3424, 334, 4324, 434, 3);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `current_plants`
--
ALTER TABLE `current_plants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_current_plants_plants_data` (`plant_name`),
  ADD KEY `fk_current_plants_users` (`user_id`);

--
-- A tábla indexei `plants_data`
--
ALTER TABLE `plants_data`
  ADD PRIMARY KEY (`name`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `weekly_data`
--
ALTER TABLE `weekly_data`
  ADD PRIMARY KEY (`timestamp`),
  ADD KEY `fk_weekly_data_current_plants` (`current_plant_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `current_plants`
--
ALTER TABLE `current_plants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `current_plants`
--
ALTER TABLE `current_plants`
  ADD CONSTRAINT `fk_current_plants_plants_data` FOREIGN KEY (`plant_name`) REFERENCES `plants_data` (`name`),
  ADD CONSTRAINT `fk_current_plants_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `weekly_data`
--
ALTER TABLE `weekly_data`
  ADD CONSTRAINT `fk_weekly_data_current_plants` FOREIGN KEY (`current_plant_id`) REFERENCES `current_plants` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
