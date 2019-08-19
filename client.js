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
//gun.get('~@test').map(function(data,key){//user
    //console.log("data",data);
//});
//===============================================
// TESTING LOGIN / DO NOT USED PRODUCTION!
var users=[];
users.push({index:0,value:"beta",passphrase:"test"});
users.push({index:1,value:"sss",passphrase:"test"});
users.push({index:2,value:"bbb",passphrase:"test"});
users.push({index:3,value:"test",passphrase:"test"});
$("#users").change(function(){
    //console.log("selected");
    let idx=$(this).val();
    //console.log(idx);
    if(users[idx]!=null){
        $('#alias').val(users[idx].value);
        $('#passphrase').val(users[idx].passphrase);
    }
});
function addusers(index, data) {
    //console.log("index",index);console.log("value",data);
    $('#users').append($('<option/>', { 
        value: index,
        text : data.value 
    }));
}
$.each(users,addusers);
//===============================================
// TEST GUN / USER
$("#btngun").click(function(){
    console.log(gun);
});
$("#btnuser").click(function(){
    let user = gun.user();
    console.log(user);
});
function setClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}
$("#aliaskeycopy").click(function(){
    let user = gun.user();
    if(!user.is)return;
    //console.log(user.is.pub);
    setClipboard(user.is.pub);
});
//===============================================
// LOGIN
$("#btnlogin").click(function(){
    let user = gun.user();
    user.auth($('#alias').val(), $('#passphrase').val(),(ack)=>{//user login username and password
        if(ack.err){
            console.log(ack.err);
            modalmessage(ack.err);
        }else{
            //console.log(ack);
            //modalmessage(ack);
            $("#login").hide();
            //$("#profile").show();
            //$("#messages").show();
            //$("#publicchat").show();
            $("#privatechat").show();
            $('#username').text($('#alias').val());
            $('#aliaskeycopy').text("Alias:"+$('#alias').val()+" (Key Copy)");
            user.get('profile').get('alias').decryptonce(ack=>{//get user profile alias key for value
                //console.log(ack);
                $('#inputalias').val(ack);
            });
            $('#aliaspublickey').val(ack.sea.pub);
            updateContacts();
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
    user.create($('#alias').val(), $('#passphrase').val(),(ack)=>{//create user and password
        if(ack.err){
            console.log(ack.err);//if user exist or error
        }else{
            console.log(ack);//pass if created
            modalmessage("Created " + $('#alias').val() + "!");
        }
    });
});
//===============================================
// FORGOT
$("#btnforgothint").click(async function(){
    //let user = gun.user();
    let alias = $('#falias').val();
    alias = await gun.get('~@'+alias).then();//reused variable
    if(!alias){//check user exist if not return false.
        modalmessage('Not Found Alias!');
        return;
    }
    let publickey;
    for(let obj in alias){//object 
        //console.log(obj);
        publickey = obj;//property name for public key
    }
    publickey = SEA.opt.pub(publickey);//check and convert to key or null?
    //console.log(publickey);
    let q1 = ($('#fquestion1').val() || '').trim(); //get id fquestion1 input
    let q2 = ($('#fquestion2').val() || '').trim(); //get id fquestion2 input
    if((!q1)||(!q2)){
        //console.log('Q Empty!');
        modalmessage('"Question (1 || 2) Empty!"');
        return;
    }
    let to = gun.user(publickey);//get user alias graph
    let hint = await to.get('hint').then();//get encrypt hint key graph
    let dec = await Gun.SEA.work(q1,q2);//get fquestion1 and fquestion2 string to mix key
    hint = await Gun.SEA.decrypt(hint,dec);//get hint and key decrypt message
    //console.log(hint);
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
$('#copypublickey').click(function(){//select input text and copy command to clipboard
    $('#aliaspublickey').select();
    document.execCommand('copy');
});
$("#inputalias").keyup(function() {
    let aliasval = $("#inputalias").val();
    //console.log(aliasval);
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
        modalmessage("Grant access:" + who);
        user.get('profile').get('alias').grantkey(to);//grant key
    }else{
        console.log("FAIL");
        modalmessage("Grant access fail!");
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
        user.get('profile').get('alias').revokekey(to);//revoke key
        modalmessage("Revoke access:" + who);
    }else{
        console.log("FAIL");
        modalmessage("Revoke access fail!");
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
});
$("#putvalue").click(async function(){
    let key = $('#inputsearchpublickey').val(); //public key
    let keyvalue = $('#dataalias').val();// input text
    keyvalue="helloworld";
    console.log(keyvalue);
    if(key.length == 0){console.log("EMPTY!");return;}
    let to = gun.user(key);
    let who = await to.get('alias').then();
    //console.log(who);
    if(who != null){
        console.log("PASS");
        to.get('profile').get('alias').encryptput(keyvalue);// encrypt value | data
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
    let who = await to.get('alias').then();
    if(!who){
        who = "null";
    }
    $('#searchalias').text(' Alias: '+who);
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
    $("#publicchat").hide();
    $("#privatechat").hide();
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
$('#btnpublicchat').click(function(){
    hidediv();
    InitChat();
    $("#publicchat").show();
});
$('#btnprivatechat').click(function(){
    hidediv();
    $("#privatechat").show();
    //initPrivateChat();
    updateprivatechatlist();
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
    let q1 = $('#question1').val(); //get input id question 1
    let q2 = $('#question2').val(); //get input id question 2
    let hint = $('#hint').val(); //get input id hint
    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);//mix key to decrypt
    let enc_q1 = await Gun.SEA.encrypt(q1, sec);//encrypt q1
    user.get('forgot').get('q1').put(enc_q1);//set hash q1 to user data store
    let enc_q2 = await Gun.SEA.encrypt(q2, sec);//encrypt q1
    user.get('forgot').get('q2').put(enc_q2); //set hash q2 to user data store
    sec = await Gun.SEA.work(q1,q2);//encrypt key
    //console.log(sec);
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
    let sec = await Gun.SEA.secret(user.is.epub, user._.sea);//mix key to decrypt
    question1 = await user.get('forgot').get('q1').then();
    question1 = await Gun.SEA.decrypt(question1, sec);//decrypt question1
    question2 = await user.get('forgot').get('q2').then();
    question2 = await Gun.SEA.decrypt(question2, sec);//decrypt question2
    $('#question1').val(question1);//set input text
    $('#question2').val(question2);//set input text
    sec = await Gun.SEA.work(question1,question2);//encrypt key
    //console.log(sec);
    hint = await user.get('hint').then();//get encrypt hint 
    hint = await Gun.SEA.decrypt(hint, sec);//decrypt hint
    //console.log(hint);
    $('#hint').val(hint);
});
//===============================================
// MESSAGES
$('#btnadduser').click(async function(){
    let publickey = ($('#mpublickey').val() || '').trim();
    if(!publickey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let to = gun.user(publickey);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){console.log("No Alias!");return;}
    user.get("contacts").get(publickey).put({alias:who.alias});
    updateContacts();
});
$('#btnremoveuser').click(async function(){
    let publickey = ($('#mpublickey').val() || '').trim();
    if(!publickey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let to = gun.user(publickey);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){console.log("No Alias!");return;}
    user.get("contacts").get(publickey).put(null);
    updateContacts();
});
function updateContacts(){
    $('#usercontacts').empty();
    $('#usercontacts').append($('<option selected disabled>-- Select User --</option>'));
    let user = gun.user();
    user.get("contacts").once().map().once(function(data,key){
        //console.log("data",data);
        //console.log("key",key);
        if($("#" + key).length){
        }else{
            if(data !=null){
                addusercontact(key, data);
            }
        }
    });
    console.log("update contacts");
}
function addusercontact(index, data) {
    //console.log("index",index);console.log("value",data);
    //console.log($("#" + index).length)
    let bfound=false;
    $("#usercontacts option").each(function(idx) {//loop option
        if($(this).val() == index){//if key value exist
            bfound=true;
            return;
        }
        //$(this).siblings('[value="'+ val +'"]').remove();
    });
    if(!bfound){//if not found add option for user contacts
        if($("#" + index).length){
            console.log("NONE?")
        }else{
            $('#usercontacts').append($('<option/>', { 
                //id: index,
                value: index,
                text : data.alias 
            }));
        }
    }
}
$("#usercontacts").change(function(){
    //console.log("selected");
    let idx=$(this).val();
    //console.log(idx);
    $('#mpublickey').val(idx);
    viewprivatemessages();
});
var messages=[];
var UIdec;
function CleanMessages(){
    $('#messagelist').empty();
}
async function sendprivatemessage(){
    let msg = ($('#inputmessagechat').val() || '').trim();
    let publickey = ($('#mpublickey').val() || '').trim();
    if(!msg){console.log("Message EMPTY!");return;}
    if(!publickey){console.log("Public Key EMPTY!");return;}
    let user = gun.user();
    let to = gun.user(publickey);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){console.log("No Alias!");return;}
    let sec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
    let enc = await Gun.SEA.encrypt(msg, sec); //encrypt message
    user.get('messages').get(publickey).set(enc);
    console.log("finish...");
}
async function viewprivatemessages(){
    let user = gun.user();
    if(!user.is){ return }//check if user exist
    //messages = [];
    CleanMessages();
    let pub = ($('#mpublickey').val() || '').trim();
    if(!pub) return;//check if not id empty
    let to = gun.user(pub);//get alias
    let who = await to.then() || {};//get alias data
    if(!who.alias){
        console.log("No Alias!");
        $('#mwho').text("who?");
        return;
    }
    $('#mwho').text(who.alias);
    UIdec = await Gun.SEA.secret(who.epub, user._.sea); // Diffie-Hellman
    user.get('messages').get(pub).map().once((data,id)=>{
        UI(data,id,user.is.alias)
    });
    to.get('messages').get(user._.sea.pub).map().once((data,id)=>{
        UI(data,id,who.alias)
    });
}
async function UI(say, id, alias){
    say = await Gun.SEA.decrypt(say, UIdec);
    //messages.push({id:id,alias:alias,message:say});
    if($("#" + id).length){
        //console.log("found!?");
    }else{
        $('#messagelist').append($('<div/>', { 
            id: id,
            text : alias + ": " + say
        }));
    }
    let element = document.getElementById("messagelist");
    element.scrollTop = element.scrollHeight;
}
$("#mpublickey").keyup(async function(e) {
    viewprivatemessages();
})
$("#inputmessagechat").keyup(async function(e) {
    //console.log(e);
    //console.log($('#inputmessagechat').val());
    if(e.key == "Enter"){
        //console.log("Enter");
        sendprivatemessage();
    }
});
function MessagesResize(){
    let height = $(window).height(); - $('#messages').offset().top;
    //$('#messages').height(height);
    $('#messages').css('height', height - 50);
    //console.log(height);
    //console.log($('#messages').offset().top);
    height = $('#messages').height();
    //console.log(height);
    $('#messagelist').css('height', height - 44);
}
$(window).resize(function() {
    MessagesResize();
});
MessagesResize();
//===============================================
// PUBLIC CHAT
var gunchat;
function timestamp(){
    let currentDate = new Date();
    //console.log(currentDate);
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let hour = ("0" +currentDate.getHours()).slice(-2);
    let minute = ("0" +currentDate.getMinutes()).slice(-2);
    let second = ("0" +currentDate.getSeconds()).slice(-2);
    let millisecond = currentDate.getMilliseconds();
    return year + "/" + (month) + "/" + date + ":" + hour+ ":" + minute+ ":" + second+ ":" + millisecond;        
}
function scrollPublicMessage(){
    let element = document.getElementById("publicchatlist");
    element.scrollTop = element.scrollHeight;
}
$("#inputpublicchat").keyup(async function(e) {
    if(e.key == "Enter"){
        //console.log("Enter");
        let user = gun.user();
        if(!user.is){ return }//check if user exist
        let msg = ($('#inputpublicchat').val() || '').trim();
        if(!msg) return;//check if not id empty
        
        let encmsg = await SEA.work("public","chat");//encrypttion key default?
        //console.log(encmsg);
        let enc = await SEA.encrypt(msg,encmsg);
        //console.log(enc);
        let who = await user.get('alias').then();
        //console.log(who);
        //console.log(typeof enc)
        enc = window.btoa(enc);
        gun.get('chat').get(timestamp()).put({
            alias:who,
            message:enc
        });
        console.log("send message...");
    }
});
//https://gun.eco/docs/RAD
async function InitChat(){
    console.log("Init Chat...")
    $('#publicchatlist').empty();
    let encmsg = await SEA.work("public","chat"); //encrypttion key default?
    async function qcallback(data,key){
        console.log('incoming messages...')
        //console.log("key",key);
        console.log("data",data);
        if(data == null)return;
        if(data.message != null){
            let message = window.atob(data.message);
            //console.log(message);
            let dec = await SEA.decrypt(message,encmsg);
            //console.log(dec)
            if(dec!=null){
                $('#publicchatlist').append($('<div/>', { 
                    id: key,
                    text : data.alias + ": " + dec
                }));
                scrollPublicMessage();
            }
        }
    }
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let timestring = year + "/" + month + "/" + date + ":";
    console.log(timestring);
    if(gunchat !=null){
        gunchat.off()
    }
    gunchat = gun.get('chat');
    //gunchat.get({'.': {'*': '2019/08/'}}).map().once(qcallback);
    //gunchat.get({'.': {'*': timestring}}).map().once(qcallback);
    gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
}
function PublicChatResize(){
    let height = $(window).height(); - $('#publicchat').offset().top;
    $('#publicchat').css('height', height - 50);
    height = $('#publicchat').height();
    $('#publicchatlist').css('height', height - 44);
}
$(window).resize(function() {
    PublicChatResize();
});
PublicChatResize();
//===============================================
// PRIVATE CHAT
var privatechatkey="";
var gunprivatechat;
var privatesharekey="";
function CleanPrivateChatMessages(){
    $('#privatechatlist').empty();
}
function scrollPrivateMessage(){
    let element = document.getElementById("privatechatlist");
    element.scrollTop = element.scrollHeight;
}
function PrivateChatResize(){
    let height = $(window).height(); - $('#privatechat').offset().top;
    $('#privatechat').css('height', height - 50);
    height = $('#privatechat').height();
    $('#privatechatlist').css('height', height - 44);
}
$(window).resize(function() {
    PrivateChatResize();
});
PrivateChatResize();
$("#inputprivatechat").keyup(async function(e) {
    if(e.key == "Enter"){
        //console.log("Enter");
        let user = gun.user();
        if(!user.is){ return }//check if user exist
        let msg = ($('#inputprivatechat').val() || '').trim();
        if(!msg) return;//check if not id empty
        let who = await user.get('alias').then();
        if(gunprivatechat !=null){
            let enc = await SEA.encrypt(msg, privatesharekey);
            enc = window.btoa(enc);//gun graph need to be string not SEA{} that will reject that is not soul of user
            gunprivatechat.get('message').get(timestamp()).put({
                alias:who,
                message:enc
            });
        }
        console.log("send private chat...");
    }
});
async function initPrivateChat(){
    //updateprivatechatlist();
    CleanPrivateChatMessages();
    let privatekey = ($('#privatechatkey').val() || "").trim();
    if(!privatekey)return;
    console.log("init chat...");
    //Need to fail checks!
    console.log(privatekey);
    privatechatkey = privatekey;
    let user = gun.user();
    let pair = user._.sea;
    //GET ENC SHARE KEY
    let pub = await gun.get(privatechatkey).get('info').get('pub').then();
    let title = await gun.get(privatechatkey).get('info').get('name').then();
    if(pub == user.is.pub){
        $('#ppublickey').show();
        $('#btnprivatechatgrant').show();
        $('#btnprivatechatrevoke').show();
    }else{
        $('#ppublickey').hide();
        $('#btnprivatechatgrant').hide();
        $('#btnprivatechatrevoke').hide();
    }
    $('#btnprivatechatcreate').hide();
    $('#privatechatroom').hide();
    $('#privatechatkey').hide();

    $('#btnprivatechatjoin').hide();
    $('#btnprivatechatadd').hide();
    $('#btnprivatechatremove').hide();

    $('#btnprivatechatname').text(title);
    let to = gun.user(pub);
    let epub =await to.get('epub').then();
    let encsharekey = await to.get('privatechatroom').get(privatechatkey).get('pub').get(pair.pub).then();
    console.log(encsharekey);
    //let dh = await SEA.secret(pair.epub, pair);
    let dh = await SEA.secret(epub, pair);
    let dec = await SEA.decrypt(encsharekey, dh);
    console.log(dec);
    if(dec==null){
        console.log("NULL SHARE KEY!");
        return;
    }
    privatesharekey = dec;
    if(gunprivatechat !=null){
        gunprivatechat.off();
    }
    gunprivatechat = gun.get(privatekey);
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let timestring = year + "/" + month + "/" + date + ":";

    async function qcallback(data,key){
        console.log('incoming messages...')
        //console.log("key",key);
        //console.log("data",data);
        if(data == null)return;
        if(data.message != null){
            let message = window.atob(data.message);
            //let message = data.message;
            //console.log(message);
            let decmsg = await SEA.decrypt(message,privatesharekey);
            //let dec = message;
            //console.log(dec)
            if(decmsg!=null){
                $('#privatechatlist').append($('<div/>', { 
                    id: key,
                    text : data.alias + ": " + decmsg
                }));
                scrollPrivateMessage();
            }
        }
    }
    gunprivatechat.get('message').get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
}
async function addPrivateChat(index, data){
    let user = gun.user();
    console.log("add chat room list");
    console.log(index);
    console.log(data);
    let name = await user.get('privatechatroom').get(index).get('info').get('name').then();
    $('#privatechatroom').append($('<option/>', { 
        //id: index,
        value: index,
        text : name
    }));
}
function updateprivatechatlist(){
    $('#privatechatroom').empty();
    $('#privatechatroom').append($('<option selected disabled> -- Select Private Chat -- </option>'));
    let user = gun.user();
    user.get('privatechatroom').once().map().once(function(data,key){
        if(data !=null){
            addPrivateChat(key,data);
        }
    });
}
$('#btnprivatechatcreate').click(async function(){
    console.log("btnprivatechatcreate");
    let user = gun.user();
    let pair = user._.sea;
    let genprivatechatid = Gun.text.random();
    let gensharekey = Gun.text.random();
    let pname = "private chat "+genprivatechatid;
    let pdescription= "private chat";
    let enc = await SEA.encrypt(gensharekey, pair);

    user.get('privatechatroom')
    .get(genprivatechatid).get('pri').put(enc);

    let dh = await SEA.secret(pair.epub, pair);
    enc = await SEA.encrypt(gensharekey, dh);

    user.get('privatechatroom')
    .get(genprivatechatid).get('pub').get(pair.pub).put(enc);

    user.get('privatechatroom')
    .get(genprivatechatid)
    .get('info')
    .put({
        pub:pair.pub,
        name:pname,
        description:pdescription,
        date:timestamp()
    });
    gun.get(genprivatechatid)
        .get('info')
        .put({
            pub:pair.pub,
            name:pname,
            description:pdescription,
            date:timestamp()
        });
});
$('#btnprivatechatjoin').click(function(){
    console.log("btnprivatechatjoin");
    initPrivateChat();
});
$('#btnprivatechatadd').click(async function(){
    console.log("btnprivatechatadd");
    let user = gun.user();
    if(!user.is)return;
    let privatekey = ($('#privatechatkey').val() || "").trim() ;
    if(!privatekey)return;
    let gkey = await gun.get(privatekey).then();
    //console.log(gkey);
    if(gkey == undefined){
        console.log("NOT FOUND!");
        return;
    }
    let guninfo = gun.get(privatekey).get('info');
    let pub = await guninfo.get('pub').then();
    let title = await guninfo.get('name').then();
    let description = await guninfo.get('description').then();
    let date = await guninfo.get('date').then();
    //console.log(pub);console.log(title);console.log(date);
    user.get('privatechatroom').get(privatekey).get('info').put({
        pub:pub,
        name: title,
        description:description,
        date:date
    });
});
$('#btnprivatechatremove').click(async function(){
    console.log("btnprivatechatremove");
    let user = gun.user();
    if(!user.is)return;
    let privatekey = ($('#privatechatkey').val() || "").trim();
    if(!privatekey)return;
    let gkey = await gun.get(privatekey).then();
    if(gkey == undefined){
        console.log("NOT FOUND!");
        return;
    }
    user.get('privatechatroom').get(privatekey).put(null);
});
$('#btnprivatechatgrant').click(async function(){
    console.log("btnprivatechatgrant");
    let ppublickey = ($('#ppublickey').val() || "").trim();
    if(!ppublickey)return;
    let pkey = (privatesharekey || "").trim();
    //check user pub key owner
    let pownid = await gun.get(privatechatkey).get('info').get('pub').then();
    //console.log(pownid);
    //console.log(ppublickey);
    if(pownid == ppublickey){
        console.log("owner");
        return;
    }
    let user = gun.user();
    let pair = user._.sea;
    let to = gun.user(ppublickey);

    let who = await to.get('alias').then();
    if(!who)return;
    
    if(!pkey)return;
    let pub = await to.get('pub').then();
    let epub = await to.get('epub').then();
    let dh = await SEA.secret(epub, pair);
    let enc = await SEA.encrypt(pkey, dh);

    user.get('privatechatroom')
        .get(privatechatkey)
        .get('pub')
        .get(pub).put(enc);

    console.log(pkey);
    console.log("finish grant!");
});
$('#btnprivatechatrevoke').click(async function(){
    console.log("btnprivatechatrevoke");
    let ppublickey = ($('#ppublickey').val() || "").trim();
    if(!ppublickey)return;
    let pkey = (privatesharekey || "").trim();
    //check user pub key owner
    let pownid = await gun.get(privatechatkey).get('info').get('pub').then();
    if(pownid == ppublickey){
        console.log("owner");
        return;
    }
    let user = gun.user();
    let pair = user._.sea;
    let to = gun.user(ppublickey);
    let who = await to.get('alias').then();
    if(!who)return;
    if(!pkey)return;
    //need to generate new share key
    //user.get('privatechatroom')
        //.get(privatechatkey)
        //.get('pub').map().once(function(data,key){});

    let pub = await to.get('pub').then();
    user.get('privatechatroom')
        .get(privatechatkey)
        .get('pub')
        .get(pub).put(null);
    console.log(pkey);
    console.log("finish revoke!");
});
$('#privatechatroom').change(function(){
    console.log("privatechatroom");
    let idx=$(this).val();
    console.log(idx);
    $('#privatechatkey').val(idx);
});

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