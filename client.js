//===============================================
// CLEAR GUN DATABASE
localStorage.clear();
//===============================================
// INIT GUN DATABASE
let gunurl = window.location.origin+'/gun';
//console.log(gunurl);
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
  //console.log("update:", data);
  doc.innerText = data.name;
});
//console.log("test");
//gun.get('~@test').map(function(data,key){//user
    //console.log("data",data);
//});
//console.log("test");
$("#btngun").click(function(){
    console.log(gun);
});
$("#btnuser").click(function(){
    let user = gun.user();
    console.log(user);
});
//===============================================
// LOGIN
$("#btnlogin").click(function(){
    let user = gun.user();
    user.auth($('#alias').val(), $('#passphrase').val(),(ack)=>{
        if(ack.err){
            console.log(ack.err);
            modalmessage(ack.err);
        }else{
            //console.log(ack);
            //modalmessage(ack);
            $("#login").hide();
            $("#profile").show();
            $('#username').text($('#alias').val());
            user.get('profile').get('alias').decryptonce(ack=>{
                //console.log(ack);
                $('#inputalias').val(ack);
            });
            $('#aliaspublickey').val(ack.sea.pub);
            $("#navmenu").show();
        }
    });
});
$("#btnforgot").click(function(){
    $('#login').hide();
    $('#forgot').show();
});
//===============================================
// REGISTER
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
// FORGOT
$("#btnforgothint").click(async function(){
    //let user = gun.user();
    let alias = $('#falias').val();
    alias = await gun.get('~@'+alias).then();
    if(!alias){
        modalmessage('Not Found Alias!');
        return;
    }
    let publickey;
    for(let obj in alias){
        //console.log(obj);
        publickey = obj;
    }
    publickey = SEA.opt.pub(publickey);//check and convert to key or null?
    //console.log(publickey);
    let q1 = ($('#fquestion1').val() || '').trim(); //get q1 input
    let q2 = ($('#fquestion2').val() || '').trim(); //get q2 input
    if((!q1)||(!q2)){
        //console.log('Q Empty!');
        modalmessage('"Question (1 || 2) Empty!"');
        return;
    }
    let to = gun.user(publickey);
    let hint = await to.get('hint').then();
    let dec = await Gun.SEA.work(q1,q2);//get q1 and q2 string to key hash
    hint = await Gun.SEA.decrypt(hint,dec);//get hint and key decrypt message
    console.log(hint);
    if(hint !=null){//check if hint is string or null
        $('#fhint').val(hint);
    }else{
        modalmessage("Fail Decrypt!");
    }
});
$("#btnbacklogin").click(function(){
    $('#login').show();
    $('#forgot').hide();
});
//===============================================
// PROFILE
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
    user.get('profile').get('alias').decryptonce(ack=>{
        console.log(ack);
    });
});
$("#grantkey").click(async function(){
    let user = gun.user();
    let key = $('#accesskey').val();
    if(key.length == 0){console.log("EMPTY!");return;}
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
    if(key.length == 0){console.log("EMPTY!");return;}
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
$("#trustkey").click(async function(){
    let user = gun.user();
    let key = $('#accesskey').val();
    if(key.length == 0){console.log("EMPTY!");return;}
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        user.get('profile').get('alias').trustkey(to);
    }else{
        console.log("FAIL");
    }
});
$("#distrustkey").click(async function(){
    let user = gun.user();
    let key = $('#accesskey').val();
    if(key.length == 0){console.log("EMPTY!");return;}
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        user.get('profile').get('alias').distrustkey(to);
    }else{
        console.log("FAIL");
    }
});
$("#trustlist").click(async function(){
    let user = gun.user();
    user.get('profile').get('alias').trustlist();
    //let a = user.get('profile').get('alias');
    //console.log(a);
});
$("#putvalue").click(async function(){
    let user = gun.user();
    //user.get('profile').get('alias').trustlist();
    let key = $('#inputsearchpublickey').val();
    if(key.length == 0){console.log("EMPTY!");return;}
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        to.get('profile').get('alias').encryptput("to");
    }else{
        console.log("FAIL");
    }
});
$("#accesskey").keyup(async function() {
    let key = $('#accesskey').val();
    if(key.length == 0){console.log("EMPTY!");return;}
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
    if(publickey.length==0){console.log("NONE");return;}
    to.get('profile').get('alias').decryptonce(ack=>{
        console.log(ack)
        $('#dataalias').val(ack);
    },{sharetype:"user",sharekeytype:"path"})
});
//===============================================
// BUTTON NAV MENU
function hidediv(){
    $("#profile").hide();
    $("#changepassphrase").hide();
    $("#passphrasehint").hide();
    $("#messages").hide();
    $("#chat").hide();
}
$('#btnprofile').click(function(){
    hidediv();
    $("#profile").show();
});
$('#btnchangepassphrase').click(function(){
    hidediv();
    $("#changepassphrase").show();
});
$('#btnpassphrase').click(function(){
    hidediv();
    $("#passphrasehint").show();
});
$('#btnmessage').click(function(){
    hidediv();
    $("#messages").show();
});
$('#btnchat').click(function(){
    hidediv();
    $("#chat").show();
});
//===============================================
// CHANGE PASSPHRASE
$('#btnchangepassphraseapply').click(function(){
    let user = gun.user();
    //console.log($('#oldpassphrase').val());console.log($('#newpassphrase').val());console.log("btnchangepassphraseapply");
    user.auth(user.is.alias, $('#oldpassphrase').val(), (ack) => {//user auth call
        //console.log(ack);
        let status = ack.err || "Saved!";//check if there error else saved message.
        console.log(status);
        modalmessage(status);
    }, {change: $('#newpassphrase').val()});//set config to change password
});
//===============================================
// PASSPHRASE HINT
$('#btnapplypassphrasehint').click(async function(){
    //console.log($('#question1').val());console.log($('#question2').val());console.log($('#hint').val());console.log("btnapplypassphrase");
    let user = gun.user();
    let q1 = $('#question1').val(); //get input q1
    let q2 = $('#question2').val(); //get input q2
    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);//get user for encrypt message
    let enc_q1 = await Gun.SEA.encrypt(q1, sec);//encrypt q1
    user.get('forgot').get('q1').put(enc_q1);//set hash q1 to user data store
    let enc_q2 = await Gun.SEA.encrypt(q2, sec);//encrypt q1
    user.get('forgot').get('q2').put(enc_q2); //set hash q2 to user data store
    sec = await Gun.SEA.work(q1,q2);//encrypt key
    console.log(sec);
    let enc = await Gun.SEA.encrypt(hint, sec);//encrypt hint
    //console.log(enc);
    user.get('hint').put(enc,ack=>{//set hash hint
        //console.log(ack);
        if(ack.err){
            //console.log("Error!");
            modalmessage(ack.err);
            return;
        }
        if(ack.ok){
            //console.log('Hint Apply!');
            modalmessage('Hint Apply!');
        }
    });
});

$('#btngetpassphrasehint').click(async function(){
    let user = gun.user();
    let question1,question2,hint;
    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);//get user for encrypt message
    //console.log(sec);
    //console.log(user.is.epub);
    question1 = await user.get('forgot').get('q1').then();
    question1 = await Gun.SEA.decrypt(question1, sec);//encrypt hint
    question2 = await user.get('forgot').get('q2').then();
    question2 = await Gun.SEA.decrypt(question2, sec);//encrypt hint
    $('#question1').val(question1);
    $('#question2').val(question2);
    sec = await Gun.SEA.work(question1,question2);//encrypt key
    console.log(sec);
    hint = await user.get('hint').then();
    //console.log(hint);
    hint = await Gun.SEA.decrypt(hint, sec);//encrypt hint
    //console.log(hint)
    $('#hint').val(hint);
});
//===============================================
// 
//===============================================
// 
//===============================================
// DIALOG MESSAGE
function modalmessage(_text){
    $("#dialogmessage").text(_text);
    $("#Modal").show();
}
$('#btndialogokay').click(function(){
    //console.log("dialog hide");
    $("#Modal").hide();
});
$('#btnshowmodal').click(function(){
    //console.log("dialog hide");
    $("#Modal").show();
});
//===============================================
// SETUP 
hidediv();
$("#navmenu").hide();
$("#forgot").hide();