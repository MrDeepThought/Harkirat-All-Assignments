const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


const FILESDIR = path.resolve('02-course-app-easy','files');
let ADMINS = [];
let USERS = [];
let COURSES = [];
let COURSEID;


app.use(express.json());
// ************************ Utility Functions ****************************
async function readFiles(){
  const files = fs.readdirSync(FILESDIR, 'utf-8');
  for (let file of files){
    console.log(`Contents of file: ${file} are being fetched!`);
    let contents = await fs.promises.readFile(path.join(FILESDIR,file), 'utf-8');
    contents = JSON.parse(contents);
    let arrayName = file.split('.')[0].toUpperCase();
    switch (arrayName) {
        case "COURSES":
            COURSES = contents;
            break;
        case "ADMINS":
            ADMINS = contents;
            break;
        case "USERS":
            USERS = contents;
            break;
    }
  }   
  if (COURSES.length === 0) return 1;
  COURSEID = Math.max(...COURSES.map((course) => {return course.courseId}))+1; 
}

function writeToFile(filename,data){
  fs.writeFile(path.join(FILESDIR,filename), data, (err) => {
    if (err){
      console.log(err);
      return;
    }
  })
}
// ***************************** Utility Functions ******************************

// ADMIN authentication middleware
function isAuthenticated(userType){
  return (req,res,next) => {
    /*
    This middleware function validates the user based on username and password
    */
    let userArray = userType === "ADMINS" ? ADMINS : USERS;
    let {username,password} = req.headers;
    // console.log(USERS,ADMINS);
    let ind = userArray.findIndex(user => {return user.username === username});
    if (ind !== -1 && userArray[ind]['password'] === password){
      req.user = userArray[ind];
      next();
    }
    else res.status(401).send("Unauthorized Access");
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username,password} = req.body;
  let index = ADMINS.findIndex((admin) => { return admin.username === username});
  if (index == -1){
    let adminObj = {
      'username': username,
      'password': password,
    };
    ADMINS.push(adminObj);
    writeToFile('admins.json',JSON.stringify(ADMINS));
    res.status(201).json({"mesage" : "Admin created successfully"});
  }
  else res.status(400).send(`400 Bad Request! The username: ${username} already exists`);
});

app.post('/admin/login', isAuthenticated("ADMINS"), (req, res) => {
  // logic to log in admin
  res.status(200).json({"message" : "Logged in successfully!"});
});

app.post('/admin/courses', isAuthenticated("ADMINS"), (req, res) => {
  // logic to create a course
  let course = {
    'title' : req.body.title,
    'description' : req.body.description,
    'price' : req.body.price,
    'imageLink' : req.body.imageLink,
    'published' : req.body.published,
    'courseId' : COURSEID,
  }
  COURSEID++;
  COURSES.push(course);
  writeToFile('courses.json',JSON.stringify(COURSES));
  res.status(200).json({
    'message': "Course created successfully",
    'courseId' : course.courseId
  });

});

app.put('/admin/courses/:courseId', isAuthenticated("ADMINS"), (req, res) => {
  // logic to edit a course
  let courseId = +req.params.courseId;
  let index = COURSES.findIndex((course) => {return course.courseId === courseId});
  if (index === -1) res.status(404).send({"message":`Coudn't find the requested course : ${courseId}`});
  else{
    for (let prop in req.body){
      COURSES[index][prop] = req.body[prop];
    }
    writeToFile('courses.json', JSON.stringify(COURSES));
    writeToFile('users.json', JSON.stringify(USERS));
    res.status(202).json({"message":"Course updated successfully"});
  }
});

app.get('/admin/courses', isAuthenticated("ADMINS"), (req, res) => {
  // logic to get all courses
  res.status(200).json({"courses":COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username,password} = req.body;
  let index = USERS.findIndex((user) => { return user.username === username});
  if (index == -1){
    let userObj = {
      'username': username,
      'password': password,
      'purchasedCourses': []
    };
    USERS.push(userObj);
    writeToFile('users.json',JSON.stringify(USERS));
    res.status(201).json({"mesage" : "User created successfully"});
  }
  else res.status(400).send(`400 Bad Request! The username: ${username} already exists`);
});

app.post('/users/login', isAuthenticated("USERS"), (req, res) => {
  // logic to log in user
  res.status(200).json({"message" : "Logged in successfully!"});
});

app.get('/users/courses', isAuthenticated("USERS"), (req, res) => {
  // logic to list all courses
  res.status(200).json({"courses":COURSES});
});

app.post('/users/courses/:courseId', isAuthenticated("USERS"), (req, res) => {
  // logic to purchase a course
  let user = req.user;
  let courseId = +req.params.courseId;
  let index = COURSES.findIndex((course => {return course.courseId === courseId}));
  if (index != -1){
    user.purchasedCourses.push(COURSES[index]);
    writeToFile('users.json',JSON.stringify(USERS));
    res.status(200).json({"message":"Course purchased successfully"});
  }
  else res.status(404).json({"message":`Couldn't find course with course ID : ${courseId}`});
});

app.get('/users/purchasedCourses', isAuthenticated("USERS"), (req, res) => {
  // logic to view purchased courses
  let user = req.user;
  res.status(200).json({"purchasedCourses":user.purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

readFiles();