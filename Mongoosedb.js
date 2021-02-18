let config=require('./config');
config();
let mongoose=require('mongoose');
let schemaCart=new mongoose.Schema({
    name:String,
    email:String,
    items:{
        type:[mongoose.Schema.Types.Mixed],default:[]
    }
});
let schemaUser=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    profile_pic:String
});
let schemaProduct=new mongoose.Schema({
    Prod:String,
    Description:String,
    Price:String,
    TQuantity:String,
    image:String,
    ID:String,
    Quantity:String
});
let ModelUser=mongoose.model('user',schemaUser);
let ModelProd=mongoose.model('product',schemaProduct);
let ModelCart=mongoose.model('cart',schemaCart);

let methods = {
    newUser(obj,cb){
        let newUser = new ModelUser(obj);
        newUser.save(function(err, data) {
            if(err) {
                console.log(err);
                console.log("Unable to insert user credentials");
                cb(0);
            }
            else {
                console.log('Done -->Addition user credentials successfull');
                cb(1);
            }
        });
    },
    updateCart(obj,cb){
    ModelCart.findOneAndUpdate({name:obj.name,email:obj.email},obj, {
        returnOriginal: false
    }).then((data)=>{console.log('updated data ',data);}).catch(()=>{console.log('Err')});
    cb(0);
},
    getUser(obj,cb){
        ModelUser.findOne(obj, function(err, data) {
                if(err){
                    console.log('Err',err);
                }
                else{
                    if(data!==null)
                        cb(data.length,data);
                    else{
                        cb(1,[]);
                    }
                }
            });
    },
    initializeCart(obj,cb){
        let newCart = new ModelCart(obj);
        newCart.save(function(err, data) {
            if(err) {
                console.log(err);
                console.log("Unable to insert userCart");
                cb(1);
            }
            else {
                console.log('Done -->Addition user User Cart successfull');
                cb(0);
            }
        });
    },
    getProductsInCart(obj,cb){
        ModelCart.find(obj, function(err, data) {
            if(err){
                console.log('Err', err);
                cb(1,[]);
            }
            else{
                cb(0,data||[]);
            }
        });
        // mongodb.connect(url,function(err,db) {
        //     if (err) {
        //         console.log("Error Occured");
        //         cb(1,[]);
        //     } else {
        //         let selected_db = db.db("product");
        //         selected_db.collection('cart').find(obj).toArray((err,data)=>{
        //             db.close();
        //             console.log('DB closed');
        //             cb(0,data);
        //         });
        //     }
        // });
    },
    getProducts(obj,cb){
    ModelProd.find({}).exec().then((data)=>{cb(0,data||[])});
    },
    addProd(obj,cb){
        let newProd = new ModelProd(obj);
        newProd.save(function(err, data) {
            if(err) {
                console.log(err);
                console.log("Unable to insert Product");
               cb(1);
            }
            else {
                console.log('Done -->Addition Product successfull');
                cb(0);
            }
        });
    },
    delProd(obj,cb){
        ModelProd.remove(obj,
            function(err, data) {
                if(err){
                    console.log(err);
                    console.log('Unable to Delete Data');
                    cb(1);
                }
                else{
                    console.log('Done -->Deletion successfull');
                    cb(0);
                }
            });
    },
    updateProd(obj,cb){
        ModelProd.findOneAndUpdate({ID:obj.ID},obj, {
            returnOriginal: false
        }).then((data)=>{console.log('updated data ',data);cb(0);}).catch(()=>{cb(1)});
    }
};

exports.data = methods;