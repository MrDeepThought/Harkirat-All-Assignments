const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET = require('crypto').randomBytes(64).toString('hex');
const app = express();

// ************************* Middlewares ************************* //
app.use(express.json());

function loginUser(userType){
  return (req,res,next) => {
    let userArray = userType === "ADMINS" ? ADMINS : USERS;
    let {username,password} = req.headers;
    let ind = userArray.findIndex(user => {return user.username === username});
    if (ind !== -1 && userArray[ind]['password'] === password){
      req.user = userArray[ind];
      next();
    }
    else res.status(401).send("Unauthorized Access");
  }
}

function isAuthenticated(req,res,next){
  // Is this header set by the JWT api or we have to follow these standards from the client side?
  const authToken = req.headers.authorization.split(' ')[1]; //{ 'Authorization': 'Bearer jwt_token_here' }
   if (!authToken){
    res.status(404).json({"message":"Token needs to be provided!"});
   }
   let userData = jwt.verify(authToken,SECRET);
   let userArray = userData.userType === "ADMIN" ? ADMINS : USERS;
   const user = userArray.find((obj) => {return obj.username == userData.username});
   req.user = user;
   next();

}
// ************************* Middlewares End ************************** //

let ADMINS = [];
let USERS = [];
let COURSES = [];
let COURSEID = 1;

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
    const token = jwt.sign({'username': username,"userType": "ADMIN"},SECRET,{"expiresIn":"1h"});
    ADMINS.push(adminObj);
    res.status(201).json({"mesage" : "Admin created successfully", "token":token});
  }
  else res.status(400).send(`400 Bad Request! The username: ${username} already exists`);
});

app.post('/admin/login', loginUser("ADMINS"), (req, res) => {
  // logic to log in admin
  const token = jwt.sign({"username":req.user.username,"userType":"ADMIN"},SECRET,{"expiresIn":"1h"});
  res.status(200).json({"message" : "Logged in successfully!", "token":token});
  
});

app.post('/admin/courses', isAuthenticated, (req, res) => {
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
  res.status(200).json({
    'message': "Course created successfully",
    'courseId' : course.courseId
  });
});

app.put('/admin/courses/:courseId', isAuthenticated, (req, res) => {
  // logic to edit a course
  let courseId = +req.params.courseId;
  let index = COURSES.findIndex((course) => {return course.courseId === courseId});
  if (index === -1) res.status(404).send({"message":`Coudn't find the requested course : ${courseId}`});
  else{
    for (let prop in req.body){
      COURSES[index][prop] = req.body[prop];
    }
    res.status(202).json({"message":"Course updated successfully"});
  }
});

app.get('/admin/courses', isAuthenticated, (req, res) => {
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
    const token = jwt.sign({"username":username, "userType":"USER"},SECRET,{"expiresIn":"1h"});
    USERS.push(userObj);
    res.status(201).json({"mesage" : "User created successfully", "token": token});
  }
  else res.status(400).send(`400 Bad Request! The username: ${username} already exists`);
});

app.post('/users/login', loginUser("USERS"), (req, res) => {
  // logic to log in user
  const token = jwt.sign({"username":req.user.username,"userType":"USER"},SECRET,{"expiresIn":"1h"});
  res.status(200).json({"message" : "Logged in successfully!", "token":token});
});

app.get('/users/courses', isAuthenticated, (req, res) => {
  // logic to list all courses
  res.status(200).json({"courses":COURSES});
});

app.post('/users/courses/:courseId', isAuthenticated, (req, res) => {
  // logic to purchase a course
  let user = req.user;
  let courseId = +req.params.courseId;
  let index = COURSES.findIndex((course => {return course.courseId === courseId}));
  if (index != -1){
    user.purchasedCourses.push(COURSES[index]);
    res.status(200).json({"message":"Course purchased successfully"});
  }
  else res.status(404).json({"message":`Couldn't find course with course ID : ${courseId}`});
});

app.get('/users/purchasedCourses', isAuthenticated, (req, res) => {
  // logic to view purchased courses
  let user = req.user;
  res.status(200).json({"purchasedCourses":user.purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
