let pass=document.getElementById('Password');
let cnfmPs=document.getElementById('ConfirmPassword');
let submit_form=document.getElementById('submit-form');
function check(event){
    if(pass.value===cnfmPs.value)
        event.submit();
    else{
        alert('Please check your password!');
    }
}
