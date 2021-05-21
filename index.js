// logo
const logo = require("asciiart-logo");

// database and terminal
const mysql = require('mysql');
const inquirer = require('inquirer');

// sql 
const { conn, sqlSelect } = require('./assets/js/employeeDB.js');
 
//display logo and start the main prompt
function start() {
  console.log(logo({name:"Employee Manager"}).render());
  runSearch();
};

async function runSearch() {
  const mainQuestions = await inquirer.prompt({
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
        case 'View All Employees by Department':
          employeeDept(); 
          break;
        case 'View All Employees by Manager':
          employeeManager(); 
          break;           
         case 'View All Departments':
          render(0); 
          break;
        case 'View All Roles':
          render(1); 
          break;      

        // Add                  
        case 'Add Employee':
          addEmployee();
          break;
        case 'Add Department':
          addDept();
          break;
        case 'Add Roles':       
          addRole();
          break;     
          
        //Remove
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Remove Deaprtment':
          removeDept();
          break;
        case 'Remove Role':
          removeRole();
          break;

        //Update
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          updateEmployeeManager();
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
  conn.query(sqlSelect(num), (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};

const employeeDept = () =>{
  conn.query(sqlSelect(0), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which department would you like to see employees for?",
        name: "empdept",
        choices() {
          return res.map(x => x.dept)
        },
      }
    ])
    .then((answer) => {
        // id first name last name title    
       let xdept;

       res.forEach((d)=>{
         if (d.dept === answer.empdept) 
             xdept = d;
       });
       
       console.log(xdept.id);
       conn.query(sqlSelect(18), [xdept.id], (err, res) => {
          if (err) throw err;
          console.table(res);
          runSearch();
       });
    });

  }); 
};

const employeeManager = () =>{
  conn.query(sqlSelect(13), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee do you want to see direct reports for?",
        name: "empMnger",
        choices() {
          return res.map(e =>  `${e.first_name} ${e.last_name}`)
        },
      }
    ])
    .then((answer) => {

      let xMng;
      res.forEach((e)=>{
        if (`${e.first_name} ${e.last_name}`===answer.empMnger)
            xMng = e;
      });
       
      conn.query(sqlSelect(19), [xMng.id], (err, res) => {
          if (err) throw err;
          console.table(res);
          runSearch();
      });
    });

  });  
};

const addEmployee =  () => {
 
  const choice = inquirer.prompt([
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
  ])
  .then((answer1) => {

      conn.query(sqlSelect(14), async (err, res) => {
        const choice1  = await inquirer.prompt([
          {
            type: "list",
            name: "roleChoice",
            message: "What is the employee's role?",
            choices: res.map(r => r.title)
          }
        ])
        .then((answer) => {
            let xRole;

            res.forEach((r)=>{
              if (r.title === answer.roleChoice)
                  xRole = r;
            });
            
            conn.query(sqlSelect(13), async (err, res) => {
              const choice2 = await inquirer.prompt([
                {
                  type: "list",
                  name: "mngChoice",
                  message: "Who is the employee's manager?",
                  choices: res.map(e => `${e.first_name} ${e.last_name}`)
                }
              ])
              .then((answer) => {

                let xMng;
                res.forEach((e)=>{
                    if (`${e.first_name} ${e.last_name}`===answer.mngChoice)
                       xMng = e;
                });
                 
                conn.query(sqlSelect(5), [answer1.firstname, answer1.lastname, xRole.id, xMng.id], (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${answer1.firstname} ${answer1.lastname} to the database!`)
                    runSearch();
                });
              });
            });
          });

      });
  });                  
};              


const addDept = () =>{
    const choice = inquirer.prompt([
      {
        type: "input",
        message: "Which department do you want to add?",
        name: "dept",
      }
    ])
    .then((answer) => {

      conn.query(sqlSelect(3), [answer.dept], (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.dept} to the database!`);
          runSearch();
      });
    });
};

const addRole = () =>{
  const choice =  inquirer.prompt([
    {
      type: "input",
      message: "Which title do you want to add for the role?",
      name: "xrole",
    },
    {
      type: "input",
      message: "Which salary do you want to add for the role?",
      name: "xsalary",
    }
  ])
  .then((answer1) => {

    conn.query(sqlSelect(0), async (err, res) => {
      if (err) throw err;
      const chosenEmployee = await inquirer.prompt([
        {
          type: "list",
          message: "Which department do you want to add for the role?",
          name: "xdept",
          choices() {
            return res.map(d =>  d.dept)
          },
        }
      ])
      .then((answer) => {
          let xDept;

          res.forEach((d)=>{
            if (d.dept === answer.xdept)
                xDept = d;
          });
  
        conn.query(sqlSelect(4), [answer1.xrole, answer1.xsalary, xDept.id ], (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer1.xrole} to the database!`)
            runSearch();
        });
      });
    });

  });
};


const removeEmployee = () =>{
  conn.query(sqlSelect(13), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee do you want to remove?",
        name: "remEmp",
        choices() {
          return res.map(e =>  `${e.first_name} ${e.last_name}`)
        },
      }
    ])
    .then((answer) => {

      let xEmp;
      res.forEach((e)=>{
        if (`${e.first_name} ${e.last_name}`===answer.remEmp)
            xEmp = e;
      });
       
      conn.query(sqlSelect(11), [xEmp.id], (err, res) => {
          if (err) throw err;
          console.log(`Removed the employee from the database!`)
          runSearch();
      });
    });

  });  
};

const removeDept = () =>{
  conn.query(sqlSelect(0), async (err, res) => {
    if (err) throw err;
    const chosenEmployee = await inquirer.prompt([
      {
        type: "list",
        message: "Which department do you want to remove?",
        name: "remDept",
        choices() {
          return res.map(d =>  d.dept)
        },
      }
    ])
    .then((answer) => {

      conn.query(sqlSelect(9), [answer.dept], (err, res) => {
          if (err) throw err;
          console.log(`Removed the department from the database!`)
          runSearch();
      });
    });
  });  
};



const removeRole = () =>{
  conn.query(sqlSelect(14), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which role do you want to remove?",
        name: "remRole",
        choices() {
          return res.map(r =>  r.title)
        },
      }
    ])
    .then((answer) => {

      conn.query(sqlSelect(10), [answer.remRole], (err, res) => {
          if (err) throw err;
          console.log(`Removed the role from the database!`)
          runSearch();
      });
    });

  });  
};

const updateEmployeeManager =  () => {

  conn.query(sqlSelect(13), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's manager do you want to update?",
        name: "upEmp",
        choices() {
          return res.map(e =>  `${e.first_name} ${e.last_name}`)
        },
      }
    ])
    .then((answer) => {

      let xEmp;
      res.forEach((e)=>{
        if (`${e.first_name} ${e.last_name}`===answer.upEmp)
            xEmp = e;
      });
       
      conn.query(sqlSelect(15), [xEmp.id],async (err, res) => {
        if (err) throw err;
        const choice = await inquirer.prompt([
          {
            type: "list",
            message: "Which employee do you want to set as manager for the selected employee?",
            name: "upMng",
            choices() {
              return res.map(e =>  `${e.first_name} ${e.last_name}`)
            },
          }
        ])
        .then((answer) => {
    
          let yEmp;
          res.forEach((e)=>{
            if (`${e.first_name} ${e.last_name}`===answer.upMng)
                yEmp = e;
          });
       
          
          conn.query(sqlSelect(7), [yEmp.id, xEmp.id], (err, res) => {
            if (err) throw err;
            console.log(`Updated employee's manager!`);
            runSearch();
          });

        });
      });

    });  
  });

}


const updateEmployeeRole =  () => {

  conn.query(sqlSelect(13), async (err, res) => {
    if (err) throw err;
    const choice = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        name: "upEmp",
        choices() {
          return res.map(e =>  `${e.first_name} ${e.last_name}`)
        },
      }
    ])
    .then((answer) => {

      let xEmp;
      res.forEach((e)=>{
        if (`${e.first_name} ${e.last_name}`===answer.upEmp)
            xEmp = e;
      });
       
      conn.query(sqlSelect(14), async (err, res) => {
        if (err) throw err;
        const choice = await inquirer.prompt([
          {
            type: "list",
            message: "Which role do you want to set for the selected employee?",
            name: "upRole",
            choices: res.map(r =>  r.title)
          }
        ])
        .then((answer) => {
    
          let xRole;
          res.forEach((r)=>{
            if (r.title===answer.upRole)
                 xRole = r;
          });
       
          
          conn.query(sqlSelect(6), [xRole.id, xEmp.id], (err, res) => {
            if (err) throw err;
            console.log(`Updated employee's role!`);
            runSearch();
          });

        });
      });

    });  
  });

}



// connect to mysql server and sql database

conn.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${conn.threadId}\n`);
  //run to start function after the connection is made to prompt the user
  start();
});
