/***********************************************************
* Create the database named pizzadb and all of its tables
************************************************************/

DROP DATABASE IF EXISTS pizzadb;

CREATE DATABASE pizzadb;

USE pizzadb;

CREATE TABLE PizzaOrder (
  UserID varchar(255) NOT NULL,
  PizzaSize VARCHAR(50),
  PizzaKind VARCHAR(50),
  PizzaQuantity INT,
  ExtraCheese BOOL
);