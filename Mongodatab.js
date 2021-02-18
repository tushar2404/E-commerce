const mongodb=require('mongodb').MongoClient;
let url='mongodb://localhost:27017';
let methods = {
    createDB(name,prod){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                selected_db.createCollection(name, (collection_err, collection) => {
                    if (collection_err) {
                        console.log("Collection error");
                        console.log(collection_err);
                    } else {
                        console.log("Collection created");
                        selected_db.collection(name).insertOne(prod,(err,response)=>{
                            if(err){
                                console.log('Unable to insert Data');
                            }else{
                                console.log(response);
                            }
                            db.close();
                            console.log("DB Closed");
                        });
                    }
                });
            }
        });
    },
    newUser(obj,cb){
        mongodb.connect(url,function(err,db) {
                if (err) {
                    console.log("Error Occured");

                } else {
                    let selected_db = db.db("product");
                    selected_db.collection('users').insertOne(obj,(err,response)=>{
                        if(err){
                            console.log("Unable to insert user credentials");
                            cb(0);
                        } else{
                            console.log('Done -->Addition successfull');
                            cb(1);
                        }
                        db.close();
                        console.log("DB Closed");
                    })
                }
            });
        },
    getUser(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");

            } else {
                let selected_db = db.db("product");
                selected_db.collection('users').find(obj).toArray((err,data)=>{
                    db.close();
                    console.log('DB closed');
                    cb(!data.length,data);
                });
            }
        });
    },
    updateCart(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                let updated={
                    $set:obj
                };
                selected_db.collection("cart").updateOne({name:obj.name,email:obj.email},updated,(err,response)=>{
                    if(err){
                        console.log('Unable to insert Data');
                        console.log(err);
                        cb(1);
                    }else{
                        console.log('Done -->Addition successfull');
                        cb(0);
                    }
                    db.close();
                    console.log("DB Closed");
                });
            }
        });
    }
    ,
    initializeCart(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                selected_db.collection("cart").insertOne(obj,(err,response)=>{
                    if(err){
                        console.log('Unable to insert Data');
                        cb(1);
                    }else{
                        console.log('Done -->Addition successfull');
                        cb(0);
                    }
                    db.close();
                    console.log("DB Closed");
                });
            }
        });
    }
    ,
    getProductsInCart(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
                cb(1,[]);
            } else {
                let selected_db = db.db("product");
                selected_db.collection('cart').find(obj).toArray((err,data)=>{
                    db.close();
                    console.log('DB closed');
                    cb(0,data);
                });
            }
        });
    }
    ,
    getProducts(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
                cb(1,[]);
            } else {
                let selected_db = db.db("product");
                selected_db.collection('products').find(obj).toArray((err,data)=>{
                   db.close();
                   console.log('DB closed');
                   cb(0,data);
                });
            }
        });
    },
    addProd(obj,res){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                selected_db.collection("products").insertOne(obj,(err,response)=>{
                    if(err){
                        console.log('Unable to insert Data');
                        res.end('Failed');
                    }else{
                        console.log('Done -->Addition successfull');
                        res.sendFile(__dirname+'/views/admin.html');
                    }
                    db.close();
                    console.log("DB Closed");
                });
            }
        });
    },
    delProd(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                console.log("Obj------",obj);
                selected_db.collection("products").deleteOne(obj,(err,response)=>{
                    if(err){
                        console.log('Unable to Delete Data');
                        cb(1);
                    }else{
                        console.log('Done -->Deletion successfull');
                        cb(0);
                    }
                    db.close();
                    console.log("DB Closed");
                });
            }
        });
    },
    updateProd(obj,cb){
        mongodb.connect(url,function(err,db) {
            if (err) {
                console.log("Error Occured");
            } else {
                let selected_db = db.db("product");
                let updated={
                    $set:obj
                };
                selected_db.collection('products').updateOne({ID:obj.ID},updated,(err,response)=>{
                    if(err){
                        console.log('Cannot update');
                        cb(1);
                    }else{
                        console.log('Updated successfully');
                        cb(0);
                    }
                    db.close();
                    console.log('DB closed');
                });
            }
        });
    }
};
exports.data = methods;