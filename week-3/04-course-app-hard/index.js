const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const SECRET = require('crypto').randomBytes(64).toString('hex');

const app = express();

app.use(express.json());

// *********************** Define Mongoose Schemas & Models ****************************** //

const UserSchema = new mongoose.Schema({
  username : String,
  password : String,
  purchasedCourses : [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const AdminSchema = new mongoose.Schema({
  username : String,
  password : String
});

const CourseSchema = new mongoose.Schema({
  title : String,
  description : String,
  price : Number,
  imageLink : String,
  published : Boolean
});

const USER = mongoose.model('User',UserSchema);
const ADMIN = mongoose.model('Admin',AdminSchema);
const COURSE = mongoose.model('Course',CourseSchema);

// *********************** Define Mongoose Schemas & Models END **********************************//

// *********************** Middleware Functions *************************** //

function loginUser(userType){
  return async (req,res,next) => {
    let roleModel = userType === "ADMINS" ? ADMIN : USER;
    const user = await roleModel.findOne(req.body);
    if (user){
      req.user = user;
      next();
    }
    else res.status(403).send("Invalid Username or Password!");
  }
}

async function authenticateJwt(req,res,next){
  // Is this header set by the JWT api or we have to follow these standards from the client side?
  const authToken = req.headers.authorization.split(' ')[1]; //{ 'Authorization': 'Bearer jwt_token_here' }
   if (!authToken){
    res.status(404).json({"message":"Token needs to be provided!"});
   }
   try{
    let userData = jwt.verify(authToken,SECRET);
    let roleModel = userData.userType === "ADMIN" ? ADMIN : USER;
    const user = await roleModel.findOne({username: userData.username});
    req.user = user;
    next();
   }
   catch (err){
    if (err.name === "JsonWebTokenError") res.status(403).json({"message":"Invalid Token Provided"});
    else if (err.name === "TokenExpiredError") res.status(403).json({"message":"Token has already expired"});
   }
}

// *********************** Middleware Functions END*************************** //

// ********************** Admin routes *************************** //
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username,password} = req.body;
  const admin = await ADMIN.findOne({username});
  if (admin){
    res.status(403).json({"message":"Admin already exists!"});
  }
  else{
    const newAdmin = ADMIN({username ,password});
    await newAdmin.save();
    const token = jwt.sign({"username":username,"role":"ADMIN"},SECRET,{expiresIn:'1h'});
    res.status(201).json({"message":"Admin created successfully", token});
  }
});

app.post('/admin/login', loginUser("ADMINS"), (req, res) => {
  // logic to log in admin
  const token = jwt.sign({"username":req.user.username,"userType":"ADMIN"},SECRET,{"expiresIn":"1h"});
  res.status(200).json({"message" : "Logged in successfully!", token});
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to create a course
  let course = COURSE(req.body);
  await course.save();
  res.status(201).json({"message":"Course created successfully", "courseId":course.id});
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const course = COURSE.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
  if (course){
    res.status(200).json({mesage:"Course updated successfully"})
  }
  else{
    res.status(404).json({message: "Course could not be found!"});
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to get all courses
  let courses = await COURSE.find({});
  res.status(200).json({courses: courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username,password} = req.body;
  const user = await USER.findOne({username});
  if (user){
    res.status(403).json({"message":"Admin already exists!"});
  }
  else{
    const newUser = USER({username ,password});
    await newUser.save();
    const token = jwt.sign({"username":username,"role":"ADMIN"},SECRET,{expiresIn:'1h'});
    res.status(201).json({"message":"User created successfully", token});
  }
});

app.post('/users/login', loginUser("USERS"), (req, res) => {
  // logic to log in user
  const token = jwt.sign({"username":req.user.username,"userType":"USER"},SECRET,{"expiresIn":"1h"});
  res.status(200).json({"message" : "Logged in successfully!", token});
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await COURSE.find({published:true});
  res.status(200).json({courses});
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to purchase a course
  const course = await COURSE.findById(req.params.courseId);
  if (course){
    let user = await USER.findOne({username: req.user.username});
    if (user){
      user.purchasedCourses.push(course);
      await user.save();
      res.status(200).json({message:"Course purchased successfully"})
    }
    else res.status(403).json({mesage:"User could not be found!"})
  }
  else res.status(403).json({message:"Course could not be found!"});

});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await USER.findOne({username: req.user.username}).populate('purchasedCourses');
  if (user){
    res.json({purchasedCourses: user.purchasedCourses || []});
  }
  else res.status(403).json({message:"User could not be found!"});
});

// starting HTTP server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
// connect to mongo DB server
mongoose.connect("mongodb+srv://mrdeepthought:2TJUF51NkapSA5v0@cluster0.rparoue.mongodb.net/",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })
  .then(() => {
    console.log("Connection with database done!");
  });
