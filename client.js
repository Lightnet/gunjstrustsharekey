
//===============================================
// CLEAR GUN DATABASE
localStorage.clear();
//===============================================
// INIT GUN DATABASE
let gunurl = window.location.origin+'/gun';
console.log(gunurl);

var gun = Gun(gunurl);
gun.on('hi', peer => {//peer connect
  console.log('connect peer to',peer);
  //console.log('peer connect!');
});
gun.on('bye', (peer)=>{// peer disconnect
  console.log('disconnected from', peer);
  //console.log('disconnected from peer!');
});

gun.get('mark').put({
  name: "Mark",
  email: "mark@gunDB.io",
});

let doc = document.getElementById('guntext');
gun.get('mark').on(function(data, key){
  console.log("update:", data);
  doc.innerText = data.name;
});

//===============================================
// LOGIN / REGISTER

$("#btngun").click(function(){
    console.log(gun);
});

$("#btnuser").click(function(){
    let user = gun.user();
    console.log(user);
});

$("#btnlogin").click(function(){
    let user = gun.user();
    user.auth($('#alias').val(), $('#passphrase').val(),(ack)=>{
        if(ack.err){
            console.log(ack.err);
        }else{
            console.log(ack);
            $("#login").hide();
            $("#profile").show();
            $('#username').text($('#alias').val());
            user.get('profile').get('alias').decryptvalue(ack=>{
                //console.log(ack);
                $('#inputalias').val(ack);
            });
            $('#aliaspublickey').val(ack.sea.pub);
        }
    });
});

$("#btnregister").click(function(){
    let user = gun.user();
    user.create($('#alias').val(), $('#passphrase').val(),(ack)=>{
        if(ack.err){
            console.log(ack.err);
        }else{
            console.log(ack);
        }
    });
});

//===============================================
// PROFILE

$("#profile").hide();

$('#copypublickey').click(function(){
    $('#aliaspublickey').select();
    document.execCommand('copy');
});

$("#inputalias").keyup(function() {
    let aliasval = $("#inputalias").val();
    console.log(aliasval);
    let user = gun.user();
    user.get('profile').get('alias').encryptput($("#inputalias").val());
});

$("#getalias").click(function(){
    let user = gun.user();
    user.get('profile').get('alias').decryptvalue(ack=>{
        console.log(ack);
    });
});

$("#grantkey").click(async function(){
    let user = gun.user();
    let key = $('#accesskey').val();
    if(key.length == 0){
        console.log("EMPTY!");
        return;
    }
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        user.get('profile').get('alias').grantkey(to);
    }else{
        console.log("FAIL");
    }
});

$("#revokekey").click(async function(){
    let user = gun.user();
    let key = $('#accesskey').val();
    if(key.length == 0){
        console.log("EMPTY!");
        return;
    }
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        user.get('profile').get('alias').revokekey(to);
    }else{
        console.log("FAIL");
    }
});

$("#accesskey").keyup(async function() {
    let key = $('#accesskey').val();
    if(key.length == 0){
        console.log("EMPTY!");
        return;
    }
    let to = gun.user(key);
    let who = await to.get('alias').then();
    if(who != null){
        $('#lookalias').text(who);
    }
});

//===============================================
// SEARCH

$("#inputsearchpublickey").keyup(async function() {
    let publickey = $("#inputsearchpublickey").val();
    let to = gun.user(publickey);
    //console.log(to);
    //let name = await to.get('profile').get('alias').then();
    //console.log(name);
    to.get('profile').get('alias').decryptdata(to,ack=>{
        console.log(ack)
        $('#dataalias').val(ack);
    },{sharetype:"user",sharekeytype:"path"})
});