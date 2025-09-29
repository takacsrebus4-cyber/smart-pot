create database smart_pot
character set utf8;

use smart_pot;

create table if not exists plants_data(
  id INT NOT NULL AUTO_INCREMENT primary key,
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150) NOT NULL,
  min_light INT NOT NULL,
  max_light INT NOT NULL,
  min_moisture INT NOT NULL,
  max_moisture INT NOT NULL,
  min_temperature INT NOT NULL,
  max_temperature INT NOT NULL,
  min_humidity INT NOT NULL,
  max_humidity INT NOT NULL
);

create table if not exists weekly_data(
  id INT NOT NULL AUTO_INCREMENT primary key,
  light INT NOT NULL,
  moisture INT NOT NULL,
  temperature INT NOT NULL,
  humidity INT NOT NULL,
  plants_data_id INT NOT NULL,
  constraint fk_plants_data_id
  foreign key (plants_data_id) references plants_data(id)
);

create table if not exists current_data(
  id INT NOT NULL AUTO_INCREMENT primary key,
  light INT NOT NULL,
  moisture INT NOT NULL,
  temperature INT NOT NULL,
  humidity INT NOT NULL,
  plants_data_id INT NOT NULL,
  constraint fk_plants_data_id2
  foreign key (plants_data_id) references plants_data(id)
);


INSERT INTO plants_data (name, scientific_name, min_Light, max_Light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
VALUES ("Tulipán", "Tulis Panus", 10, 30, 20, 50, 15, 30, 50, 65)


INSERT INTO plants_data (humidity,light,moisture,temperature,plants_data_id)
VALUES (10,12,20,30,
       (SELECT id
        from plants_data
        where valtozo = name)
);