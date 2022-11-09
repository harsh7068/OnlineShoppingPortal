const express = require('express');
const path = require('path');
const session = require("express-session");
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 8080;
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));


app.get('/register', (req, res) =>{
    // res.render('base', { title : "Login System"});
    res.sendFile(__dirname+"/index1.html")
})


//api for login
app.post('/login_submit', (req, res) => {
    console.log("Login Request -");
    console.log(req.body.email);
    console.log(req.body.password);
    MongoClient.connect(url, function (err, db) {
  if (err) throw err;
   var dbo = db.db("mydb");
    dbo.collection("DATA").find({ "email": req.body.email }).toArray(function (err, result) {
        if (err) {
            res.status(400).send("Error fetching  Names!");
        } else {
       console.log("Entry Found - ")
       console.log(result);
       console.log("---------------------------------------------");

            if (result[0].password == req.body.password)
            res.sendFile(__dirname+"/home.html");
            else
                res.end("Login Not Successful...!");
               }
            });
    });
});

//api for register
app.post('/register_submit', (req, res) => {
    console.log("Registration API called-");
    console.log(req.body.text)
    console.log(req.body.email);
    console.log(req.body.password);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("DATA").insertOne({ name: req.body.text, email: req.body.email, password: req.body.password }, function (err, res) {
        });
    });
    console.log("User Registered with email " + req.body.email);
    console.log("---------------------------------------------");
    res.sendFile(__dirname+"/index1.html");
});

//api for Contact US
app.post('/contact_submit', (req, res) => {
    console.log("Contact us form API called-");
    console.log(req.body.email)
    console.log(req.body.name)
    console.log(req.body.textarea);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("CONTACT").insertOne({ email:req.body.email, name: req.body.name, textarea: req.body.textarea}, function (err, res) {
        });
    });
    console.log("User Contact us Request Received with email " + req.body.email);
    console.log("---------------------------------------------");
    res.sendFile(__dirname+"/contactus.html");
});



//route for logout
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        console.log("Log out api called-");
        if (err) {
            console.log(err);
            res.send("Error")
        } else {
            res.send("logout Successfully...!" );
            console.log("---------------------------------------------");
            console.log("logout Successfully...!");
        }
        
    })
})

function createDatabase() {
    MongoClient.connect(url, function (err, db) {            // Creating DataBase
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
    MongoClient.connect(url, function (err, db) {         // Creating Collection
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection("CONTACT", function (err, res) {
            if (err) throw err;
            console.log("Collection created! - Database Created ");
            db.close();
        });
    });
    MongoClient.connect(url, function (err, db) {         // Creating Collection
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection("DATA", function (err, res) {
            if (err) throw err;
            console.log("Collection created! - Database Created ");
            db.close();
        });
    });
}
//createDatabase();


app.listen(port, ()=>{ console.log("Running on http://localhost:8080")});


