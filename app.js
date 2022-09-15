const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-sessions');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const app = express();
const port = process.env.PORT || 3000;
var username = "";
var password = "";

require('dotenv').config();

app.use(express.urlencoded( { extended: true} ));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(cookieParser());

/*app.use(cookieParser('KnittingSecure'));
app.use(session({
  secret:'KnittingSecretSession',
  saveUninitialized:true,
  resave:true
}));

app.use(flash());*/

app.set('layout' , './layouts/main');
app.set('view engine', 'ejs');
app.set("layout login", false);

const master=require('./server/routes/master.js');
const operator=require('./server/routes/operator.js');
const order=require('./server/routes/order.js');

app.get("/",function(req,res){
  if(req.cookies.name=="Dinesh" || req.cookies.name=="Testuser"){
    console.log('Cookies: ', req.cookies.name);
    res.render('home',{currentuser:req.cookies.name});
    app.use('/api/v1/master', master);
    app.use('/api/v1/operator', operator);
    app.use('/api/v1/order', order);
    
  }
  else{
  res.render('login',{layout:'login',validuser:'yes'});
  }
})

app.post("/",function(req,res){
  username = req.body.username;
  password = req.body.password;
 
  if((username=='Dinesh' || username=="Testuser") && password=="password"){
    res.cookie('name', username);
    console.log("current user",req.cookies.name);
    app.use('/api/v1/master', master);
    app.use('/api/v1/operator', operator);
    app.use('/api/v1/order', order);
    res.redirect('/');
  }
  else{
    res.render('login',{layout:'login',validuser:'no'});
  }
})

app.post("/logout",function(req,res){
  res.render('login',{layout:'login',validuser:'yes'});
})




app.listen(port , () => console.log('Listening to port ${port}'));
