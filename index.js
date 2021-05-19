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
  console.log("3 >>>>>>");
  runSearch();
  console.log("4 >>>>>>");
});

const runSearch = () => {
  console.log("6 >>>>>>");
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
      console.log("7 >>>>>>");
      switch (answer.action) {
        case 'View Budget by departments':
          console.log("c12 >>>>>>");
          render(12); 
          break;
        case 'View All Employees':
          console.log("c13 >>>>>>");
          render(13); 
          break;
        case 'View All Departments':
          console.log("c0 >>>>>>");
          render(0); 
          break;
        case 'View All Roles':
          console.log("c14 >>>>>>");
          render(14); 
          break;            
            
        case 'Remove Employee':
          removeEmployee();
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
    console.log("9 >>>>>>");
    
    console.log("11 >>>>>>");
};


const render = (num) => {
  console.log("10 >>>>>>");
  conn.query(sqlSelect(num), async (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};


const removeEmployee = () => {
  conn.query(sqlSelect(13), async (err, employees) => {

    const chosenEmployee = await inquirer.prompt([
      {
        type: "list",
        name: "employeeChoice",
        choices: employees.map(({ first_name }) => first_name)
      }
    ])
  })
}

// const removeEmployee = () => {
//   conn.connect();

//   // get employees and choice one
//   conn.query(`select *  from employee`, (err, employees) => {
    
    
//     console.log(employees);
//     // console.log({ employees });
  
//     const employee = inquirer.prompt([
//       {
//         type: 'list',
//         message: "Which employee do you want to remove?",
//         name: 'selectedValue',
//         choices: 
//         employees.map(
//           employee =>
//             `${employee.id} ${employee.first_name} ${employee.last_name}`,
//         ),

//       },
//     ]);
//     // console.log({ employee });
//     const employeeId = employee.selectedValue.split(' ')[0];

//     // remove employee 
//     const removeResult = conn.query(
//       sqlSelect(11), [employeeId],
//     );
//   console.log({ removeResult });


//   });
  
  

//   return Promise.resolve();

// };

// removeEmployee()
//   .then((value) => {
//     console.log('removeEmployee() is done. Run to mainMenu'+value);
//     runSearch();
//   })
//   .catch(err => {
//     console.error('Error :', { err });
//   });


// const updateEmployeeRole = async () => {
//   // get employees and choice one
//   const employees = await conn.query(sqlSelect(13));
//   // console.log({ employees });
//   const employee = await inquirer.prompt([
//     {
//       type: 'list',
//       message: "Which employee's role would you like to update?",
//       name: 'selectedValue',
//       choices: employees.map(
//         e => `${e.id} ${e.first_name} ${e.last_name}`,
//       ),
//     },
//   ]);
//   // console.log({ employee });
//   const employeeId = employee.selectedValue.split(' ')[0];

//   // get roles and choice one
//   const roles = await conn.query(sqlSelect(14));
//   console.log({ roles });
//   const newRole = inquirer.prompt([
//     {
//       type: 'list',
//       message: "What is the employee's new role?",
//       name: 'selectedValue',
//       choices: roles.map(r => `${r.id} ${r.title}`),
//     },
//   ]);
//   // console.log({ newRole });
//   const roleId = newRole.selectedValue.split(' ')[0];

//   // update employee role
//   const updateResult = await connection.query(
//     sqlSelect(7), [roleId, employeeId],
//   );
//   console.log({ updateResult });

//   return Promise.resolve();
// };

// updateEmployeeRole()
//   .then((value) => {
//     console.log('updateEmployeeRole() is done. Run to mainMenu'+value.sql);
//     runSearch();
//   })
//   .catch(err => {
//     console.error('Error: ', { err });
//   });



// const artistSearch = () => {
//   inquirer
//     .prompt({
//       name: 'artist',
//       type: 'input',
//       message: 'What artist would you like to search for?',
//     })
//     .then((answer) => {
//       const query = 'SELECT position, song, year FROM top5000 WHERE ?';
//       connection.query(query, { artist: answer.artist }, (err, res) => {
//         if (err) throw err;
//         res.forEach(({ position, song, year }) => {
//           console.log(
//             \`Position: \${position} || Song:\${song} || Year: \${year}\`
//           );
//         });
//         runSearch();
//       });
//     });
// };

// const multiSearch = () => {
//   const query =
//     'SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1';
//   connection.query(query, (err, res) => {
//     if (err) throw err;
//     res.forEach(({ artist }) => console.log(artist));
//     runSearch();
//   });
// };

// const rangeSearch = () => {
//   inquirer
//     .prompt([
//       {
//         name: 'start',
//         type: 'input',
//         message: 'Enter starting position: ',
//         validate(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         },
//       },
//       {
//         name: 'end',
//         type: 'input',
//         message: 'Enter ending position: ',
//         validate(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         },
//       },
//     ])
//     .then((answer) => {
//       const query =
//         'SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?';
//       connection.query(query, [answer.start, answer.end], (err, res) => {
//         if (err) throw err;
//         res.forEach(({ position, song, artist, year }) =>
//           console.log(
//             \`Position: \${position} || Song: \${song} || Artist: \${artist} || Year: \${year}\`
//           )
//         );
//         runSearch();
//       });
//     });
// };

// const songSearch = () => {
//   inquirer
//     .prompt({
//       name: 'song',
//       type: 'input',
//       message: 'What song would you like to look for?',
//     })
//     .then((answer) => {
//       console.log(\`You searched for "\${answer.song}"\`);
//       connection.query(
//         'SELECT * FROM top5000 WHERE ?',
//         { song: answer.song },
//         (err, res) => {
//           if (err) throw err;
//           if (res[0]) {
//             console.log(
//               \`\Position: \${res[0].position} || Song: \${res[0].song} || Artist: \${res[0].artist} || Year: \${res[0].year}\`
//             );
//             runSearch();
//           } else {
//             console.error('Song not found :(\n');
//             runSearch();
//           }
//         }
//       );
//     });
// };



