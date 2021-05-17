# Employee Tracker

To architect and build a solution, **C**ontent **M**anagement **S**ystems for managing a company's employees using node, inquirer, and MySQL.

## Instructions

1. database schema containing three tables:

![Database Schema](assets/images/page.gif)

* **department**: id, name

* **role**: id, title, salary, department_id

* **employee**: id, first_name, last_name, role_id, manager_id

* **seed.sql**: pre-populate your database

Run a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


## Features

To organize and plan the business using a system to view and manage the departments, roles, and employees in the company

## Portfolio

![Employee Tracker](Assets/employee-tracker.gif)


## Links

* [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

* [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.



