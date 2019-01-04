const express = require('express')
const mysql = require('mysql')
var path =require('path')
var logger = require('morgan')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000
const DBPATH = process.env.DATABASE_URL || 'postgres://irjmfvxh:EAj3N4DcMuOt8QeZDpJtEufIytTbRN-F@elmer.db.elephantsql.com:5432/irjmfvxh'


//Create Connection
const db = mysql.createConnection({
    host : 'db4free.net',
    user: 'cysta123',
    password: 'cysta123',
    database: 'cysta_db'
});

db.connect((err) =>{
    if(err)
    {
        throw(err)
    }
    console.log('connected');
});
const app = express();


app.use(bodyParser({
    extended: true
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err)throw(err);
        console.log(result);
        res.send('database created');
    });
});

//Create Table Post name
app.get('/createtrialtable', (req,res) => {
    let sql = 'CREATE TABLE trialtable(id int AUTO_INCREMENT, name VARCHAR(255), primary key (id))';
    db.query(sql, (err, result) =>{
        if(err) throw(err);
        console.log(result);
        res.send('post table created');
    })
});


//Insert some data dynamic
app.get('/addname/:name',(req,res) => {
    let postname = {name : req.params.name};
    let sql = 'INSERT INTO trialtable SET ?';
    let query= db.query(sql, postname, (err, result) =>
    {
        if(err) throw(err);
        console.log(result);
        res.send('name' + req.params.name+ 'added');
    })

});

//Select All
app.get('/all',(req,res) => {
    let sql = 'SELECT * FROM trialtable';
    let query= db.query(sql, (err, results) =>
    {
        if(err) throw(err);
        console.log(results);
        // res.send('name' + req.params.name+ 'added');
        res.send("post fetched");
    })

});


//Select Single Post
app.get('/getone/:id',(req,res) => {
    // let sql = 'SELECT * FROM trialtable WHERE id = ${req.params.id}';
    let sql = `SELECT * FROM trialtable WHERE id = ${req.params.id}`;
    let query= db.query(sql, (err, result) =>
    {
        if(err) throw(err);
        console.log(result);
        // res.send('name' + req.params.name+ 'added');a
        res.send("fetched  " + req.params.id + "  ");
    })

});


//Update Post
app.get('/updateone/:id/:name',(req,res) => {
    let newname = {name: req.params.name};
    let sql = `UPDATE trialtable SET name =  '${req.params.name}' WHERE id = ${req.params.id}`;
    let query= db.query(sql, (err, result) =>
    {
        if(err) throw(err);
        console.log(result);
        // res.send('name' + req.params.name+ 'added');a
        res.send("Updated  " + req.params.id + "  ");
    })

});


//Delete Post
app.get('/deleteone/:id',(req,res) => {
    let sql = `DELETE FROM trialtable WHERE id = ${req.params.id}`;
    let query= db.query(sql, (err, result) =>
    {
        if(err) throw(err);
        console.log(result);
        // res.send('name' + req.params.name+ 'added');a
        res.send("Deleted  " + req.params.id + "  ");
    })

});

//route
app.get('/',(req,res) =>
{
    res.render('index',{title: 'Welcome'});
});

app.get('/login',(req,res) =>
{
    res.render('login',{title: 'Login'});
})


app.get('/signup',(req,res) =>
{
    res.render('signup',{title: 'SignUp'});
})

app.post('/addsignupdetails',(req,res) =>
{
    let name = req.body.names;
    let email = req.body.emails;
    let password = req.body.passwords;
    console.log(name);
    console.log(req.body);
    let sql = "INSERT INTO `login` (name, email, passwordd) VALUES ('" + name + "','" + email + "','" +password + "')";

    let query= db.query(sql, (err, result) =>
    {
        if(err) throw(err);
        console.log(result);
        res.render('login',{title: 'Login'})
    })
});



app.post('/checklogindetails',(req,res) =>
{
    let name = req.body.names;
    let email = req.body.email;
    let password = req.body.password;
    console.log(name);
    console.log(req.body); 
    let sql = "SELECT * FROM `login` WHERE email = '" + email + "'";

    let query= db.query(sql, (err, results, fields) =>
    {
    //     if(err) 
    //     {
    //         throw(err);
    //         // res.send("Nahi Mila");
    //     };
    //     console.log(result);
    //         if(result[0].passwordd == password)
    //         {
    //             res.send("mil gaya");
    //         // res.render('signup',{title: 'SignUp'});
    //         }
    //         else
    //         {
    //             res.send('pass not found');
    //         }
        

    if (err) {
        // console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        // console.log('The solution is: ', results);
        if(results.length >0){
          if(results[0].passwordd == password){
            res.send({
              "code":200,
              "success":"login sucessfull"
                });
          }
          else{
            res.send({
              "code":204,
              "success":"Email and password does not match"
                });
          }
        }
        else{
        
          res.send({
            "code":204,
            "success":"Email does not exits"
              });
        }
      }        
    })
});

app.listen(PORT, () => {
    console.log("Server Started on PORT " + PORT + " ...");
});