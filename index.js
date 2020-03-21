const ex = require("express");
const app = ex();
const bp = require("body-parser");
var mysql = require('mysql');
const mongodb = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";


app.use(bp.urlencoded({extended:true}));
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"project"
});
app.use(ex.static(__dirname+"/statics"));


app.get("/",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/home.html");
});

app.get("/reg",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/reg.html");
});

app.get("/log",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/login.html");
});
app.get("/uad",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/useradd.html");
});
app.get("/ulg",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/userlog.html");
});
app.get("/order",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/order.html");
});
app.get("/contact",function(req,res)
{
    res.sendFile(__dirname + "/htmlpages/contact.html");
});

//for welcome with the help of ejs

app.set('views','./view');
app.set('view engine', 'ejs');

//admin panel by sql(wamp)    
app.post("/ch",function(req,res){
    
        let pe = req.body.i1;
        let em = req.body.i2;
        let ag = req.body.i3;
        let pw = req.body.i4;
        con.connect(function(err){
            if (err) throw err;
            console.log("connected");
            var sql ="INSERT INTO info (company, type, price, rating) VALUES ('"+pe+"','"+em+"','"+ag+"','"+pw+"')";
            con.query(sql, function(err,result){
                if (err) throw err;
            });
        });
        res.send("Inserted");
    });
    app.post("/log" ,function(req,res)
{
    let c = req.body.i1;
    let pw = req.body.i2;

    
    
        con.query("SELECT * FROM admin WHERE name = '"+c+"' and password = '"+pw+"'", function (err, result) {
          if (err) throw err;
          else
          var sql = "SELECT * FROM info";
        con.query(sql,function(err,result){
            if(err) throw err;
            else
            res.render('print',{data:result});
        });
         // res.render('welcome' , {title:'hey' , Name:c});
        });
      });

app.get('/list' , function(req,res){
   
        var sql = "SELECT * FROM info";
        con.query(sql,function(err,result){
            if(err) throw err;
            else
            res.render('print',{data:result});
        });
    });

    app.get("/edit",function(req,res)
{
            con.query("SELECT * FROM info WHERE id="+req.query["id"], function (err1, result) {
          if (err1) throw err1;
          else
          res.render('editd',{data:result});
        });
      });

      app.post("/upload",function(req,res){
        let c = req.body.i1;
        let em = req.body.i2;
        let mb = req.body.i3;
        let pw = req.body.i4;
        let id = req.body.t0;
        
            var sql = "update info set company='"+c+"',type='"+em+"',price='"+mb+"',rating='"+pw+"' where id="+id;
            con.query(sql,function(err,result){
                if(err) throw err;
                else
                {
                    var sql = "SELECT * FROM info";
                    con.query(sql,function(err,result){
                        if(err) throw err;
                        else
                        res.render('print',{data:result});
                    });
                }
            });
    });


app.get("/del",function(req,res)
{

    var sql = "delete from info where id="+req.query["id"];
    con.query(sql,function(err,result){
        if(err) throw err;
        else
        var sql = "SELECT * FROM info";
        con.query(sql,function(err,result){
            if(err) throw err;
            else
            res.render('print',{data:result});
        });
    });
});
//admin complete

//user panel by Mongodb
app.post("/uad",function(req,res){
    let n = req.body.i1;
    let em = req.body.i2;
    let ag = req.body.i3;
    let dob = req.body.i4
    
        MongoClient.connect("mongodb://localhost:27017/mydb",function(err,db){
            if (err) throw err;
            var dbo =db.db("mydb");
            var myobj = {name: n, email: em, age: ag, date_of_birth: dob};
            dbo.collection("register").insertOne(myobj, function(err, res){
                if (err) throw err;
                console.log("A doc inserted");
                db.close();
            });
        });

    
    res.send("data is inserted");

});
app.post("/ulg" ,function(req,res)
{
    let c = req.body.i1;
    let em = req.body.i2;
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { name: c, email: em };
        dbo.collection("register").find(query).toArray(function(err, result) {
          if (err) throw err;
          res.sendFile(__dirname + "/htmlpages/order.html");
          db.close();
        });
      });
      });


app.listen(3010,function(req,res)
{
    console.log("server is running");
});