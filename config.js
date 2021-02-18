let connection_string='mongodb://localhost:27017';
let options={
    useNewUrlParser:true,
    useUnifiedTopology:true
};
module.exports=function () {
    let mongoose=require('mongoose');
    mongoose.connect(connection_string,options);
    let db=mongoose.connection;
    db.on('error',(err)=>{
        console.log('Err',err);
    });
    db.on('open',()=>{
        console.log('We are Connected');
    });
}