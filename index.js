const mysql = require('mysql');
const inquirer = require('inquirer');

const { data, conn, init, sqlSelect, returnQuery, renderQuery, alterQuery  } = require('./assets/js/employeeDB.js');
// const { PRIORITY_ABOVE_NORMAL } = require('node:constants');
var figlet = require('figlet');
 

figlet(`Employee\nManager`, function(err, data) {
  if (err) {
      console.log('Figlet has a problem..');
      console.dir(err);
      return;
  }
  console.log(data);
  
  init()
  runSearch();
});

const runSearch = () => {
  inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View Budget by departments',
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'View All Departments',
        'View All Roles',
        'Add Employee',
        'Add Department',
        'Add Roles',
        'Remove Employee' ,
        'Remove Deaprtment' ,
        'Remove Role' ,
        'Update Employee Role' ,
        'Update Employee Manager' ,
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View Budget by departments':
          render(12); 
          break;
        case 'View All Employees':
          render(2); 
          break;
        case 'View All Departments':
          render(0); 
          break;
        case 'View All Roles':
          render(1); 
          break;                        
        case 'Add Employee':
          addEmployee();
          break;
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Remove Deaprtment':
          removeDept();
          break;
        case 'Remove Role':
          removeRole();
          break;
        case 'Exit':
          conn.end();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          conn.end();
          break;
      }   
      
    });  
};


const render = (num) => {
  conn.query(sqlSelect(num), async (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};


const addEmployee = async () => {

  const chosenEmployee = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "firstname",
    },
    {
      type: "input",
      message: "What is the employee's last name",
      name: "lastname",
    }
  ]);

  const firstName = chosenEmployee.firstname;
  const lastName = chosenEmployee.lastname;
  let roleid;
  let managerid;

  conn.query(sqlSelect(17), async (err, roles) => {
    const chosenRole = await inquirer.prompt([
      {
        type: "list",
        name: "roleChoice",
        choices: roles.map(r => `${r.title}`)
      }
    ]);
    console.log(chosenRole.roleChoice);
    const xxx = conn.query(sqlSelect(16), chosenRole.roleChoice, async (err, res) => {
      if (err) throw err; 
      // roleid = res.id;
      console.log("roleIDxxxx:"+xxx);
      console.log("roleIDxrrrx:"+res);
    });
    console.log("out.roleID:"+xxx);

    // conn.query(sqlSelect(13), async (err, employees) => {
    //   const chosenManager = await inquirer.prompt([
    //     {
    //       type: "list",
    //       message: "What is the employee's manager",
    //       name: "manager",
    //       choices: employees.map(e => `${e.first_name} ${e.last_name}`)
    //     }
    //   ]);
  
    //   const e_first_name = chosenManager.manager.split(' ')[0];
    //   const e_last_name = chosenManager.manager.split(' ')[1];
      
    //   const empID = conn.query(sqlSelect(15), [e_first_name, e_last_name],  (err, res) => {
    //     if (err) throw err;
    //     managerid  =  res.id;
    //   });
    //   console.log("magID:"+managerid);

      // console.log([firstName,  lastName, roleID, empID]);
    // });

    
  });

   
  //  conn.query(sqlSelect(14), [firstname, lastname, roleID, empID], (err, res) => {
  //   if (err) throw err;
  //   console.log(res.affectedRows+" added x x to the database!");
  //   runSearch();
  // });

}

const updateEmployeeManager = () => {

  const chosenEmployee = inquirer.prompt([
    {
      type: "input",
      message: "Which employee's managet do you want to update?",
      name: "employee",
    },
    {
      type: "input",
      message: "WHich employee do youwant to set as manager for the selected employee?",
      name: "manager",
    },
  ]);
  const e_first_name = chosenEmployee.employeeChoice.split(' ')[0];
  const e_last_name = chosenEmployee.employeeChoice.split(' ')[1];
  // const sqlq = mysql.format(sqlSelect(14), [e_first_name, e_last_name]);
  conn.query(sqlSelect(14), [e_first_name, e_last_name], (err, res) => {
    if (err) throw err;
    console.log(res.affectedRows+" updated employee's manager!");
    runSearch();
  });

}



const removeEmployee = () => {
  conn.query(sqlSelect(13), async (err, employees) => {
    const chosenEmployee = await inquirer.prompt([
      {
        type: "list",
        name: "employeeChoice",
        choices: employees.map(e => `${e.first_name} ${e.last_name}`)
      }
    ]);
    const e_first_name = chosenEmployee.employeeChoice.split(' ')[0];
    const e_last_name = chosenEmployee.employeeChoice.split(' ')[1];
    // const sqlq = mysql.format(sqlSelect(14), [e_first_name, e_last_name]);
    conn.query(sqlSelect(14), [e_first_name, e_last_name], (err, res) => {
      if (err) throw err;
      console.log(res.affectedRows+" employee was deleted!");
      runSearch();
    });
  });
}

const removeDept= () => {
  conn.query(sqlSelect(0), async (err, depts) => {
    const chosenDept = await inquirer.prompt([
      {
        type: "list",
        name: "departmentChoice",
        choices: depts.map(d => `${d.dept}`)
      }
    ]);
  conn.query(sqlSelect(9),chosenDept.departmentChoice, (err, res) => {
      if (err) throw err;
      console.log(res.affectedRows+" department was deleted!");
      runSearch();
    });
  });
}

const removeRole= () => {
  conn.query(sqlSelect(1), async (err, roles) => {
    const chosenRole = await inquirer.prompt([
      {
        type: "list",
        name: "roleChoice",
        choices: roles.map(r => `${r.role}`)
      }
    ]);
    conn.query(sqlSelect(10),chosenRole.roleChoice, (err, res) => {
      if (err) throw err;
      console.log(res.affectedRows+" department was deleted!");
      runSearch();
    });
  });
}
