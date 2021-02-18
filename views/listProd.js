const content=document.getElementById('content');
let request = new XMLHttpRequest();
let obj;
function DisplayProd(val,ind){
    let prod=`
<div class="boxSub" id="${ind}div">
    <img id="${ind}-img" width="100%" height="250px" src="${val.image}">
    <p>Product Name:<input id="${val.ID}-Name" value="${val.Prod}" ></p>
    <p>Product Description:<input id="${val.ID}-Description" value="${val.Description}"></p>
    <p>Product Price:<input value="${val.Price}" id="${val.ID}-Price"></p>
    <p>Quantity: <input value="${val.TQuantity}" id="${val.ID}-Quantity"></p>
    <button id="${ind}-del" class="btn btn-primary" type="submit">Delete</button>
    <button id="${ind}-upd" class="btn btn-primary" type="submit">Update</button>
</div>
`;
    let node=document.createElement("div");
    node.innerHTML=prod;
    content.append(node);
    document.getElementById(`${ind}-del`).addEventListener('click',(event)=>{
        let reqDel=new XMLHttpRequest();
        reqDel.open('POST','/delAdminProd');
        reqDel.setRequestHeader("Content-type","application/json");
        reqDel.addEventListener('load',()=>{
            console.log('Delete successful');
            location.reload();
        });
        // console.log(val._id);
        reqDel.send(JSON.stringify({ID: val.ID}));
    });
    document.getElementById(`${ind}-upd`).addEventListener('click',(event)=>{
        let reqUpdate=new XMLHttpRequest();
        reqUpdate.open('POST','/updAdminProd');
        reqUpdate.setRequestHeader("Content-type","application/json");
        reqUpdate.addEventListener('load',()=>{
            // console.log('Update successful');
            console.log(reqUpdate.responseText);
            location.reload();
        });
        let Name=document.getElementById(`${val.ID}-Name`).value;
        let Desc=document.getElementById(`${val.ID}-Description`).value;
        let Price=document.getElementById(`${val.ID}-Price`).value;
        let Quantity=document.getElementById(`${val.ID}-Quantity`).value;
        reqUpdate.send(JSON.stringify({ID:`${val.ID}`,TQuantity:Quantity,Price:Price,Description:Desc,Prod:Name}));
    });
}
function iter(val,ind,arr){
    console.log(val);
    DisplayProd(val, ind);
}
request.addEventListener('load',()=>{
    if(request.responseText.length!==0) {
        obj = JSON.parse(request.responseText);
        // console.log(obj);
        obj.forEach(iter);
    }
});
request.open('GET', '/displayProdAdmin');
request.send();