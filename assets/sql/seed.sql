insert into department
(name)
values 
('Board'),
('Production'),
('Marketing'),
('Finance');

insert into role
(title, salary, department_id)
values 
('Product Manager', 120, 1),
('Director', 200, 0),
('Developer-I', 90, 1),
('Developer-II', 110, 1);

insert into employee
(first_name, last_name, role_id, manager_id)
values 
('Allen','Francis', 0, 1),
('Booth','Kathleen' 1, null),
('Cerf','Vinton', 2, 0),
('Cook','Stephen', 3, 0);
