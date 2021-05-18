const mysql = require('mysql');
// const util=require('util');
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
      return `select id, name as dept 
              from department`;
     case 1 : // all roles
      return `select r.id, r.title as role, CONCAT('$ ', FORMAT(r.salary, 0)) as salary, ifnull(d.name, '') as dept 
              from role as r
              left join department as d on department_id = d.id`;
     case 2 :  // all employees
      return  `select e.id, e.first_name, e.last_name, r.title, d.name as dept, 
               CONCAT('$ ', FORMAT(r.salary, 0)) as salary, ifnull(m.first_name,'') as manager 
               from employee as e 
               left join role as r on e.role_id = r.id 
               left join department as d on r.department_id = d.id
               left join employee as m on e.manager_id = m.id;`;
     case 3 :  // add dept
       return `insert into department (name) value (?)`;
     case 4 :  // add role
        return `insert into role (title, salary, department_id) 
                value (?, ?, ?)`;
     case 5 :  // add employee
        return  `insert into employee (first_name, last_name, role_id, manager_id)
                 value (?, ?, ?, ?)`; 
     case 6 :  // update employee role
         return `UPDATE employee
                 SET role_id = ?
                 WHERE id = ?`;
     case 7 :  // update employee manager
       return  `UPDATE employee
                SET manager_id = ?
                WHERE id = ?`;
     case 8 :  // all employees
        return  `select e.id, e.first_name as name, e.last_name as 'last name', r.title as role, ifnull(m.first_name,'') as manager 
                  from employee as e 
                  left join role as r on e.role_id = r.id 
                  left join employee as m on e.manager_id = m.id
                  where e.manager_id = ?`;
     case 9 :  // delete dept
        return `delete from department 
                where id = ?`;
     case 10 : // delete role
        return `delete from role 
                where id = ?`;
     case 11 :  // delete employee
        return  `delete from employee
                 where id = ?`;
     case 12 :  // Budget by dept and total in the last row
        return  `select 
                  case grouping(d.name) when 1 then 'Total' else d.name end as dept, 
                  CONCAT('$ ', FORMAT(sum(r.salary), 0)) as budget
                  from employee as e 
                  left join role as r on e.role_id = r.id 
                  left join department as d on d.id = r.department_id
                  group by d.name
                  with rollup ;`;
     case 13 :  // all employees' name 
        return  `select *  from employee`;                 
     case 14 :  // all roles 
        return  `select * from role`;          
   } 
  }

//query select in the db
const renderQuery = (str, data) => {
    console.log('1xxxx\n');
    conn.query(str, data, async (err, res) => {
      if (err) throw err;
      console.log('2xxxx\n');
      console.table(res);
      console.log('3xxxx\n');
      // conn.end();
    });
    console.log('4xxxx\n');
};

const returnQuery = (str) => {
 
  conn.query(str, data, (err, res) => {
    console.log(res);
    if (err) throw err;
    return res;    
    // conn.end();    
  });
};

//query update/inserte/delete 
// data : { manager_id : x } or [{department_id:1},{role_id:1}]
const alterQuery = (str, data) => { 
  conn.query(str, data, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} were altered!\n`);
      readProducts();
      // conn.end();
    });
};

// no index column
// const transformTable = (acc) =>{
//  return acc.reduce((tmp, {index, ...x}) => { tmp[index] = x; return tmp}, {});
// }

// Connect to the DB
const init = (()=>{
  conn.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${conn.threadId}\n`);
  });
});


module.exports = { data, conn, init, sqlSelect, returnQuery, renderQuery, alterQuery  };
