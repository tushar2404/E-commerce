const content=document.getElementById('content');
const dipName=document.getElementById('dispNmae');
let request = new XMLHttpRequest();
let obj;


function DisplayProd(val,ind){
    let prod=`
<div class="boxSub" id="${ind}div">
    <img id="${ind}-
    img" width="100%" height="250px" src="${val.image}">
    <h3>${val.Prod}</h3>
    <p>Price: ${val.Price}</p>
    <p>
    Quantity: <span id="${ind}-Qua">${val.Quantity}</span>
    <button class="btn btn-success" id="${ind}+">+</button><button id="${ind}-" style="margin-left:5px;"class="btn btn-danger">-</button>
    </p>
    <button id="${ind}-del" class="btn btn-primary">Delete</button>
    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#${ind}myModal">View Description</button>
<div class="modal fade" id="${ind}myModal" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">${val.Prod}</h4>
            </div>
            <div class="modal-body">
             <img align="center" id="${ind}-img2" width="200px" src="${val.image}">
                <p>${val.Description}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
`;
    let node=document.createElement("div");
    node.innerHTML=prod;
    content.append(node);
    let comp=document.getElementById(`${ind}-Qua`);
    document.getElementById(`${ind}+`).addEventListener('click',(event)=>{
        comp.innerHTML=Number(comp.innerHTML)+1;
        let reqAdd=new XMLHttpRequest();
        reqAdd.open('POST','/Quantity');
        reqAdd.addEventListener('load',()=>{
           console.log('Addition successful');
        });
        reqAdd.send(JSON.stringify({'ID':`${val.ID}`,'Quantity':comp.innerHTML}));
    });
    document.getElementById(`${ind}-`).addEventListener('click',(event)=>{
        if(Number(comp.innerHTML)>1) {
            comp.innerHTML = Number(comp.innerHTML) - 1;
            let reqSub=new XMLHttpRequest();
            reqSub.open('POST','/Quantity');
            reqSub.addEventListener('load',()=>{
                console.log('Subtraction successful');
            });
            reqSub.send(JSON.stringify({ID:`${val.ID}`,'Quantity':comp.innerHTML}));
        }
    });
    document.getElementById(`${ind}-del`).addEventListener('click',(event)=>{
       document.getElementById(`${ind}div`).remove();
       obj.splice(ind, 1);
        let delRequest=new XMLHttpRequest();
        delRequest.addEventListener('load',()=>{
            console.log(delRequest.responseText);
        });
        delRequest.open('POST','/delprod');
        delRequest.send(JSON.stringify({ID:`${val.ID}`}));
    });

}
function iter(val,ind,arr){
    if(ind===0){
        dipName.innerHTML="Hello "+val.name;
    }else {
        DisplayProd(val, ind);
    }
}
request.addEventListener('load',()=>{
    if(request.responseText.length!==0) {
        obj = JSON.parse(request.responseText);
        console.log(obj);
        obj.forEach(iter);
    }
});
request.open('GET', '/Cart');
request.send();
console.log('Hello');
// let getProfileReq=new XMLHttpRequest();
// getProfileReq.addEventListener("load",()=>{
//     if(getProfileReq.responseText.length!==0) {
//      console.log(getProfileReq.responseText);
//      document.getElementById('img_pro').src=getProfileReq.responseText;
//     }
// });
// getProfileReq.open('GET', '/Profile');
// getProfileReq.send();