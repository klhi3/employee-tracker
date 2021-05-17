drop database if exists employeeDB;

create database employeeDB;

use employeeDB;

create table department (
    id int not null auto_increment,
    name varchar(30) not null,  -- dept name
    primary key(id)
);

create table role (
    id int not null auto_increment,
    title varchar(30) not null,  -- role title
    salary decimal(10,2),  -- role salary
    department_id int,  -- department role belongs to
    primary key (id)
);

create table employee (
    id int not null auto_increment,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,  -- role employee has
    manager_id int null,  -- can be null if no manager
    primary key(id)
);


