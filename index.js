const express=require('express');
const path =require('path');
const body_parser=require("body-parser");
const session=require("express-session");
const app=express();
const multer = require("multer");
const fs=require('fs');
const models=require('./Mongoosedb').data;
// const Mongo = require('./Mongodatab.js').data;
let sess;
multer_storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__dirname+'/upload');
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});
let uploader=multer({
        storage:multer_storage,
        fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
        } else {
            cb( new Error('I don\'t have a clue!'));}
        }
}).single('custom_file');
function isLogin(req,res,file){
    sess = req.session;
    console.log(sess.email);
    return !!sess.email;
}
function readFile(fileN,callback){
    fs.readFile(path.join(__dirname+fileN),(err,data)=>{
        if(err)console.log('Error',"in"+path.join(__dirname+fileN));
        callback(data);
    });
}
function writeTask(file,task ,callback) {
    fs.writeFile(file, task ,function(err)
    {
        if(err)
        {
            throw err;
        }
        callback();
    })
}
function ReadJSON(req,callback){
    let body='';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let data = JSON.parse(body);
        callback(data);
    });
}
app.set("view engine","ejs");
app.use(session({
    secret:"Hello World",
    resave:false,
    saveUninitialized: false
}));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

//Api's Start
app.get('/',(req,res)=>{
    if(isLogin(req,res))
        res.sendFile(__dirname+'/views/home.html');
    else
        res.sendFile(__dirname+'/views/index.html');
});
app.get('/logout',(req,res) => {
    req.session.destroy((err)=>{
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});
app.get('/invalid',(req,res)=>{
    if(sess.invalid_reason===1)
    {
        res.write("Email or Password invalid.");
        res.end();
    }else{
        res.write("No such user Exists Please signup!");
        res.end();
    }
});
//Admin
app.get('/admin',(req,res)=>{
    if(isLogin(req,res)){
        res.sendFile(__dirname+'/views/admin.html');
    }else{
        res.sendFile(__dirname+'/views/adminlogin.html');
    }
});
app.post('/authenticateadmin',(req,res)=>{
    if(req.body.password==='admin@123'&&req.body.email==='admin@123') {
        sess = req.session;
        sess.email='admin@123';
        sess.name='admin@123';
        console.log(sess.name,sess.email);
    }
    res.redirect('/admin');
});
app.get('/displayProdAdmin',(req,res)=>{
    models.getProducts({},(err,data)=> {
        res.write(JSON.stringify(data), (err2) => {
            if (err2) {
                console.log('Err');
            } else {
                res.end();
            }
        })
    });
});
app.get('/addProdAdmin',(req,res)=>{
    models.addProd(req.query,(err)=>{
        if(err){
            res.end('err')
        }else{
            res.sendFile(__dirname+'/views/admin.html');
        }
    });
});
app.post('/delAdminProd',(req,res)=>{
    models.delProd(req.body,(err)=>{
        if(err){
            console.log("error");
            res.send('err');
        }
        else{
            res.sendFile(__dirname+'/views/listProd.html');
        }
    });
});
app.post('/updAdminProd',(req,res)=>{
    models.updateProd(req.body,(err)=>{
        if(err){
            console.log('err');
            res.end('err');
        }
        else res.end('Success');
    });
});
//new user
app.post('/loginuser',(req,res)=>{
    models.getUser(req.body,(err,data)=>{
        if(err){
            sess = req.session;
            sess.invalid_reason=1;
            res.sendFile(__dirname+'/views/invalid.html');
        }else{
            sess = req.session;
            sess.email = req.body.email;
            sess.name = data.name;
            sess.profile_pic=data.profile_pic;
            res.redirect('/');
        }
    });
});
app.post('/newuser',(req,res)=>{
    uploader(req,res,(err)=>{
        if(err) {
            return res.end("some error");
        }else{
        ReadJSON(req,(err,data)=>{
            let obj=data;
            const newObj={name:obj.name,email:obj.email,password:obj.password,profile_pic:'Profile.jpg'};
            models.newUser(newObj,(err)=>{
                if(err===1){
                    models.initializeCart({name:obj.name,email:obj.email},(err)=>{
                        if(err){
                            res.end('Err');
                        }else {
                            res.sendFile(__dirname + "/views/login.html");
                        }
                    });
                }else {
                    res.end('Something went wrong');
                }
            });
        });
            const obj = JSON.parse(JSON.stringify(req.query));
            console.log(obj);
            // const newObj={name:obj.name,email:obj.email,password:obj.password,profile_pic:req.file.originalname};
            const newObj={name:obj.name,email:obj.email,password:obj.password,profile_pic:req.file.originalname};
            models.newUser(newObj,(err)=>{
                if(err===1){
                    models.initializeCart({name:obj.name,email:obj.email},(err)=>{
                        if(err){
                            res.end('Err');
                        }else {
                            res.sendFile(__dirname + "/views/login.html");
                        }
                    });
                }else {
                    res.end('Something went wrong');
                }
            });
        }
    });
});
//Main site
app.get('/home',(req,res)=>{
    if(isLogin(req,res)) {
        models.getProducts({},(err,data)=>{
            res.write(JSON.stringify([{'name': sess.name}].concat(data)),(err2)=>{
                if(err2){
                    console.log('Err');
                }else{
                    res.end();
                }
            });
        });
    }else{
        res.redirect('/');
    }
});
app.get('/cart',(req,res)=>{
    if(isLogin(req,res)){
        models.getProductsInCart({email:sess.email,name:sess.name},(err,data)=>{
            if(err){
                console.log(err);
                res.end('err');
            }else{
                res.write(JSON.stringify([{'name': sess.name}].concat(data[0].items)));
                res.end();
            }
        });
    }
    else {
        res.redirect('/');
    }
});
app.get('/Profile',(req,res)=>{
    if(isLogin(req,res)){
        res.write("../upload/"+sess.profile_pic);
        res.end();
    }else{
        res.redirect('/');
    }
});
app.post('/Quantity',(req,res)=>{
    if(isLogin(req,res)){
    ReadJSON(req,(data)=>{
        models.getProductsInCart({name:sess.name,email:sess.email},(err,dataC)=>{
            if(err){console.log('Err');res.end('Err');}
            else{
                dataC=dataC[0];
                let items=dataC.items;
                let newItems=[];
                items.forEach((val)=>{
                    if(val.ID!==data.ID){
                        newItems.push(val);
                    }else{
                        val.Quantity=data.Quantity;
                        newItems.push(val);
                    }
                });
                dataC.items=newItems;
                models.updateCart(dataC,(err)=>{
                    if(err){
                        console.log('Err');
                        res.end('Err');
                    }
                    else res.end('Success');
                });
            }
        });
    });
    }else{
        res.redirect('/');
    }
});
app.post('/delprod',(req,res)=>{
    ReadJSON(req,(data)=>{
        models.getProductsInCart({name:sess.name,email:sess.email},(err,dataC)=>{
            if(err){
                res.end('Err');
            }else{
                dataC=dataC[0];
                let items=dataC.items;
                let newItems=[];
                items.forEach((val)=>{
                    if(val.ID!==data.ID){
                        newItems.push(val);
                    }
                });
                dataC.items=newItems;
                models.updateCart(dataC,(err)=>{
                    if(err){
                        console.log('Err');
                        res.end('Err');
                    }
                    else res.end('Success');
                });
            }
        });
    });
});
app.post('/addprod',(req,res)=>{
    if(isLogin(req,res)) {
        ReadJSON(req, (data) => {
            console.log(data);
            let obj = {name: sess.name, email: sess.email};
            models.getProductsInCart(obj, (err, dataC) => {
                if (err) console.log('Err');
                else {
                    let items = dataC[0].items;
                    let flag = 1;
                    items.forEach((val) => {
                        if (val.ID === data.ID) {
                            flag = 0;
                        }
                    });
                    if (flag) {
                        models.getProducts(data,(err,Item)=>{
                            if(err){
                                console.log('Err');
                            }else{
                                Item[0].Quantity=1;
                                items.push(Item[0]);
                                dataC[0].items=items;
                                models.updateCart(dataC[0],(err)=>{
                                    if(err){
                                        console.log(err)
                                    }else {
                                        res.end('Success');
                                    }
                                });
                            }
                        });
                    }else{
                        res.send('Item already present');
                    }
                }
            });
         });
    }else{
        res.redirect('/');
    }
});
app.use(express.static("views"));
app.use(express.static('upload'));
app.listen(8000);