const mysql = require('mysql');
const config = require('./config.js');

//display console.table(c)
const cTable = require('console.table'); 

//connection to the database mysql : config file
const conn = mysql.createConnection(config);

let data = [1];

// sql statement
const sqlSelect = (type)=>{
   switch (type) {

     case 0 :  // all department
      return `select name as dept 
              from department`;
     case 1 : // all roles
      return `select r.title as role, CONCAT('$ ', FORMAT(r.salary, 0)) as salary, ifnull(d.name, '') as dept 
              from role as r
              left join department as d on department_id = d.id`;
     case 2 :  // all employees
      return  `select e.first_name as name, e.last_name as 'last name', r.title as role, ifnull(m.first_name,'') as manager 
               from employee as e 
               left join role as r on e.role_id = r.id 
               left join employee as m on e.manager_id = m.id`;
     case 3 :
       return `insert into department (name) value (?)`;
     case 4 :
        return `insert into role (title, salary, department_id) 
                value (?, ?, ?)`;
     case 5 :
        return  `insert into employee (first_name, last_name, role_id, manager_id)
                 value (?, ?, ?, ?)`; 
     case 6 :
         return `UPDATE employee
                 SET rol = ?
                 WHERE id = ?`;
     case 7 :
       return  `UPDATE employee
                SET manager = ?
                WHERE id = ?`;

   }
  }

//query select in the db
const renderQuery = (str, data) => {
    conn.query(str, data, (err, res) => {
      if (err) throw err;
      console.table(res);
      conn.end();
    });
};

//query update/inserte/delete 
// data : { manager_id : x } or [{department_id:1},{role_id:1}]
const alterQuery = (str, data) => { 
  conn.query(str, data, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} were altered!\n`);
      readProducts();
      conn.end();
    });
};

// no index column
// const transformTable = (acc) =>{
//  return acc.reduce((tmp, {index, ...x}) => { tmp[index] = x; return tmp}, {});
// }

// Connect to the DB
conn.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${conn.threadId}\n`);
  //requested operation 
  renderQuery(sqlSelect(0),data);
});
