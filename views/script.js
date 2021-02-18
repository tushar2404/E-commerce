const content=document.getElementById('content');
const display=document.getElementById('userdip');
let request = new XMLHttpRequest();
let obj;
let name;
function DisplayProd(val,ind){
   let prod=`
<div class="boxSub">
    <img id="${ind}-img" width="100%" height="250px" src="${val.image}">
    <h3>${val.Prod}</h3>
    <p>${val.Price}</p>
    <button id="${ind}-add" class="btn btn-primary">Add To Cart</button>
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
    document.getElementById(`${ind}-add`).addEventListener('click',(event)=>{
    let addRequest=new XMLHttpRequest();
    addRequest.addEventListener('load',()=>{
      console.log(addRequest.responseText);
    });
       addRequest.open('POST','/addprod');
        let obj={ID:val.ID};
        console.log(JSON.stringify(obj));
       addRequest.send(JSON.stringify(obj));
   });
}

function iter(val,ind,arr){
    if(ind===0){
        name=val.name;
        console.log(display);
        display.innerHTML="Hello "+name;
    }else{
        DisplayProd(val,ind);
    }
}
request.addEventListener('load',()=>{
   obj=JSON.parse(request.responseText);
   console.log(obj);
   obj.forEach(iter);
});
request.open('GET', '/home');
request.send();