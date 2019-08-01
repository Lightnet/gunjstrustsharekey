/*
    Self contain Sandbox Gun Module:
    

    Created by: Lightnet

    Credit: amark ( https://github.com/amark/gun)

    License: MIT
    
    Information: It base on user path with get('trust') list map. From amark example login access.
    
    To develop salt share key that where to put your keys in user root or gun graph? Salt 
    share keys are store in trust list.

    User trust list store in user root graph key with path of the graph to identify the 
    graph key root. Simple example how graph. You can think tree node that each reference
    with ID that can't be same tree node.

    user.get(trust).get(publickey).get(pathnode).put('saltkey')

    Gun graph can be store in in sub root that can be config to `sharekeytype="graph"`
    But can't be root graph. There is bug on encrypt bug for gun root has to be string 
    not json object. It will store as string but not json that work on user root.

    If get an error that object can't be used as text or string.

    ```
    var object={// root id Object
        node:{// sub child 
            trust:[], //note is just example reference. `[]` it can't be used as graph. // sub child
            value:"key", //sub child
        }
    }
    ```
    This is json object format. Example how share key works. Name can be config. (work in progress)

    var object="key" //incorrect format

    //gun.get('foo').get('trust') //not here
    gun.get('foo').get('something').encryptput('bar'); //right way
    gun.get('foo').get('something').get('trust') //it store users list on where encryptput graph.
    
    gun.get('foo').encryptput('bar'); // wrong way root require object not variable.
    
    It the best to salt share key genarete by default to let know anyone to your keys.

    Random key used from:
     - SEA.random(16).toString();
     - Gun.text.random(16);

    By Default sharekeytype="path" is for user path. For gun sharekeytype="graph" independent graph.
    Need to check what ever need to do checks.
    
    User / Gun:
     - function grantkey (to allow owner user access to key graph value for other users. Check and create salt keys)
     - function revokekey (to owner revoke user access to key graph for user. Note it will break salt key if share with other users.)
      - Recreate new slat key and reencrypt value.(This break other salt keys are shared.)
     - function encryptput put value (allow owner user to encrypt key value when creating and check salt key)
     - function decryptvalue return value (allow owner user to decrypt key value)
     - function decryptdata (to allow other user to decrypt key value/data from gun or sea but not self)
      - `let to = gun.user(public key)`
     
    User and Gun function for encrypt and decrypt key graph value.

    Notes:
     - Not tested large scale.
     - Not work on debug fails and checks.
     - Grant self share public key break salt key.
     - path work with user root level.
     - Function conflict that no checks that override trust list.
     - User encrypt json format will do fine. Gun encrypt root need to string.
     - Trust list resalt share keys work in progress.

*/
(function() {
var Gun = (typeof window !== "undefined")? window.Gun : require('gun/gun');

/*
    work in progress...
*/
Gun.on('opt', function(context) {
    context.opt.sharekeytype="path";//path working
    //context.opt.sharekeytype="graph";//prototype party working sea will convert to string.
    context.opt.sharekeydebug = false;
    context.opt.sharekeyvalue = 'value';
    this.to.next(context);
    //console.log(context);
});

/*
    //user...grantkey(to);
    let user = gun.user();
    let to = gun.user(publickey);
    user.get('profile').get('alias').grantkey(to);
*/
var grantkey = Gun.User.prototype.grantkey=async function(to, cb, opt){
    // added new user to key to share current graph key
    console.log("`.grantkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
    cb = cb || function(ctx) { return ctx };
    opt = opt || {};
    let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
    gun.back(function(at){ if(at.is){ return } path += (at.get||'') });

    opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;
    opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
    opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;

    //console.log(path);
    (async function(){
        //console.log(gun);
        let enc, sec;
        if(opt.sharekeytype == "path"){
            sec = await user.get('trust').get(pair.pub).get(path).then();
            sec = await SEA.decrypt(sec, pair);
            if(!sec){
                //console.log("CREATE SALT KEY")
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                enc = await SEA.encrypt(sec, pair);
                user.get('trust').get(pair.pub).get(path).put(enc);
            }
        }
        if(opt.sharekeytype == "graph"){
            sec = await gun.get('trust').get(pair.pub).get(gun._.get).then();
            if(sec !=null){
                sec = window.atob(sec);
                sec = JSON.parse(sec);
            }
            sec = await SEA.decrypt(sec, pair);
            if(!sec){
                //console.log("CREATE SALT KEY")
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                enc = await SEA.encrypt(sec, pair);
                enc = JSON.stringify(enc);//need to be string bug root gun
                enc = window.btoa(enc);
                //console.log(enc);
                gun.get('trust').get(pair.pub).get(gun._.get).put(enc);
            }
        }

        let pub = await to.get('pub').then();
        let epub = await to.get('epub').then();
        pub = await pub; epub = await epub;
        let dh = await SEA.secret(epub, pair);
        enc = await SEA.encrypt(sec, dh);
        if(opt.sharekeytype == "path"){
            user.get('trust').get(pub).get(path).put(enc, cb);
        }
        if(opt.sharekeytype == "graph"){
            enc = JSON.stringify(enc);
            enc = window.btoa(enc);
            //console.log(enc);
            gun.get('trust').get(pub).get(gun._.get).put(enc, cb);
        }
    }());
    return gun;
}
Gun.chain.grantkey = grantkey;
/*
    //- Recreated new salt key to share.
    //- reencrypt key value on new salt
    //user...revokekey(to);
    let user = gun.user();
    let to = gun.user(publickey);
    user.get('profile').get('alias').revokekey(to);
*/
var revokekey = Gun.User.prototype.revokekey=async function(to, cb, opt){
    // recreated new salt key share current graph key
    console.log("`.revokekey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
    cb = cb || function(ctx) { return ctx };
    opt = opt || {};
    let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
    gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
    //console.log(path);
    if(!to){console.log("to User not set!");}

    opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;
    opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
    opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;

    (async function(){
        let alias = await to.get("alias").then();
        let pub;
        //console.log(alias);
        if(!alias){
            cb({err:'Error alias not found!'});
            return gun;
        }
        //GET Salt Key
        let enc, sec, key, value;
        if(opt.sharekeytype == "path"){
            sec = await user.get('trust').get(pair.pub).get(path).then();
            sec = await SEA.decrypt(sec, pair);
            key = await gun.once().then();
            value = await SEA.decrypt(key, sec);
        }
        if(opt.sharekeytype == "graph"){
            sec = await gun.get('trust').get(pair.pub).get(gun._.get).then();
            if(sec !=null){
                sec = window.atob(sec);//decode
                sec = JSON.parse(sec);
            }
            sec = await SEA.decrypt(sec, pair);
            key = await gun.get(opt.sharekeyvalue).once().then();
            key = window.atob(key);//decode
            key = JSON.parse(key);
            value = await SEA.decrypt(key, sec);
        }
        console.log("value",value);
        // Create New Salt Key
        sec = SEA.random(16).toString();
        //sec = Gun.text.random(16);
        enc = await SEA.encrypt(sec, pair);
        if(opt.sharekeytype == "path"){
            user.get('trust').get(pair.pub).get(path).put(enc);
            pub = await to.get('pub').then();//revoke user
            console.log("==================================");
            user.get('trust').once().map().once(async (data,mkey)=>{//trust users
                let uname = await gun.back(-1).user(mkey).get('alias').then();
                //let ukey = await user.get('trust').get(mkey).get(path).then();
                //console.log(uname, ukey);
                if(pair.pub != mkey){//check self user to be resalt
                    console.log(mkey);
                    if(pub == mkey){ //check user to be revoke
                        //do nothing??? (revoke user)
                        console.log(uname, "FAIL");
                    }else{
                        let ckey = await user.get('trust').get(mkey).get(path).then();
                        console.log(uname, "PASS");
                        if(ckey != "null"){//Check if there user are revoke key if they are null should be ignore.
                            console.log(uname, "CREATE NEW SALT SHARE KEY ");
                            let mto = gun.back(-1).user(mkey);
                            //let name = await mto.get('alias').then();
                            //console.log(name);
                            let mpub = await mto.get('pub').then();
                            let mepub = await mto.get('epub').then();
                            let dh = await SEA.secret(mepub, pair);
                            let menc = await SEA.encrypt(sec, dh);
                            //NEW SALT KEY
                            //console.log("menc",menc);
                            user.get('trust').get(mpub).get(path).put(menc);
                            //console.log(usec);
                        }
                    }
                }
            });
        }
        if(opt.sharekeytype == "graph"){
            enc = JSON.stringify(enc);//need to be string bug root gun
            enc = window.btoa(enc);
            gun.get('trust').get(pair.pub).get(gun._.get).put(enc);
            pub = await to.get('pub').then();

            gun.get('trust').map().once(async (data,mkey)=>{//trust users
                let uname = await gun.back(-1).user(mkey).get('alias').then();
                //console.log(data,key);
                if(pair.pub != mkey){//check self user
                    console.log(mkey);
                    if(pub == mkey){ //check user to be revoke
                        //do not here?(ban user)
                        console.log(uname, "FAIL");
                    }else{
                        //console.log("checking....")
                        let ckey = await gun.get('trust').get(key).get(gun._.get).then();
                        //console.log("mkey",mkey);
                        console.log(uname, "PASS");
                        if(ckey != "null"){//Check if there user are revoke key if they are null.
                            console.log("REASSIGN SALT KEYS");
                            
                            let mto = gun.back(-1).user(mkey);
                            //let name = await mto.get('alias').then();
                            //console.log(name);
                            let mpub = await mto.get('pub').then();
                            let mepub = await mto.get('epub').then();
                            let dh = await SEA.secret(mepub, pair);
                            let menc = await SEA.encrypt(sec, dh);
                            menc = JSON.stringify(menc);
                            menc = window.btoa(menc);
                            //NEW SALT KEY
                            console.log("menc:",menc);
                            gun.get('trust').get(mpub).get(gun._.get).put(menc);
                            //console.log(usec);
                        }
                    }
                }
                
            })
        }
        //console.log("value",value);
        //encrypt Value
        let v = await SEA.encrypt(value, sec);
        if(opt.sharekeytype == "path"){
            //console.log("VALUE SEC:",v);
            gun.put(v, cb);
        }
        if(opt.sharekeytype == "graph"){
            v = JSON.stringify(v);
            v = window.btoa(v);
            gun.get(opt.sharekeyvalue).put(v, cb);
        }
        // Remove Salt Key
        pub = await to.get('pub').then();
        if(opt.sharekeytype == "path"){
            user.get('trust').get(pub).get(path).put("null", cb);//remove key
        }
        if(opt.sharekeytype == "graph"){
            gun.get('trust').get(pub).get(gun._.get).put("null", cb);//remove key
        }

    }());
    return gun;
}
Gun.chain.revokekey = revokekey;
/*
    //user...encryptput(value);
    let user = gun.user();
    user.get('profile').get('alias').encryptput("name");
*/
var encryptput = Gun.User.prototype.encryptput = function(data, cb, opt){
    // encrypt key > put value
    console.log("`.encryptput` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
    cb = cb || function(ctx) { return ctx };
    opt = opt || {};
    let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
    let rootgun = this;
    gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
    opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;//Check sharekey type
    opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
    opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
    (async function(){
        //console.log("path",path);
        let enc, sec;        
        //console.log("sharekeytype: ", opt.sharekeytype);
        if(opt.sharekeytype == "path"){
            sec = await user.get('trust').get(pair.pub).get(path).then();
            sec = await SEA.decrypt(sec, pair);
            if(!sec){
                //console.log("CREATE SECRET!");
                //console.log("IF SALT KEY DOES NOT EXIST, CREATE IT!");
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                enc = await SEA.encrypt(sec, pair);
                user.get('trust').get(pair.pub).get(path).put(enc);
            }
            enc = await SEA.encrypt(data, sec);
            //console.log("enc",enc);
            gun.put(enc, cb);//PUT ENCRYPT DATA
        }
        
        if(opt.sharekeytype == "graph"){
            sec = await gun.get('trust').get(pair.pub).get(gun._.get).then();
            console.log("SECRET RAW: ",sec);
            if(sec !=null){
                //console.log(typeof sec);
                sec = window.atob(sec);
                //console.log("sec",sec);
                sec = JSON.parse(sec);
                //sec = JSON.parse(sec);
                sec = await SEA.decrypt(sec, pair);
            }
            console.log("SECRET: ",sec);
            if(!sec){
                console.log("CREATE!");
                sec = SEA.random(16).toString();
                enc = await SEA.encrypt(sec, pair);
                enc = JSON.stringify(enc);//need to be string bug root gun
                enc = window.btoa(enc);
                console.log("SECRET",enc);
                gun.get('trust').get(pair.pub).get(gun._.get).put(enc);
            }
            console.log("data",data)
            enc = await SEA.encrypt(data, sec);
            enc = JSON.stringify(enc);
            enc = window.btoa(enc);
            //console.log("enc: ",enc);
            //console.log("opt.sharekeyvalue: ",opt.sharekeyvalue);
            //default value
            //gun.put({value:enc}, cb);//PUT ENCRYPT DATA
            gun.get(opt.sharekeyvalue).put(enc, cb);//PUT ENCRYPT DATA
        }
    }());
    return gun;
}

Gun.chain.encryptput = encryptput;
/*
    user...decryptvalue(cb);
    let user = gun.user();
    user.get('profile').get('alias').decryptvalue(ack=>{
        //console.log(ack);
    });
*/
var decryptvalue = Gun.User.prototype.decryptvalue = function(cb,opt){
    //get decrypt key to return value
    console.log("`.decryptvalue` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
    cb = cb || function(ctx) { return ctx };
    opt = opt || {};
    let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';

    opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;
    opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
    opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
    //console.log(opt.sharekeytype);

    gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
    
    (async function(){
        let sec, key;
        if(opt.sharekeytype == "path"){
            //console.log(path);
            //SECRET
            sec = await user.get('trust').get(pair.pub).get(path).then();
            if(!sec){
                cb(null);
                return gun;
            }
            //console.log("sec",sec);
            sec = await SEA.decrypt(sec, pair);
            //console.log("sec",sec);
            key = await gun.then();
            //console.log("key",key);
        }
        if(opt.sharekeytype == "graph"){
            console.log("graph!");
            //SECRET
            sec = await gun.get('trust').get(pair.pub).get(gun._.get).then();
            //console.log("sec:",sec);
            if(!sec){
                cb(null);
                //console.log("sec:",sec);
                return gun;
            }
            console.log("SEC1: ",sec);
            sec = window.atob(sec);
            console.log("SEC2: ",sec);
            sec = JSON.parse(sec);
            //console.log("sec",sec);
            sec = await SEA.decrypt(sec, pair);
            //VALUE
            //key = await gun.get('value').then();
            //console.log("opt.sharekeyvalue: ",opt.sharekeyvalue);
            key = await gun.get(opt.sharekeyvalue).then();//default 'value'
            key = window.atob(key);
            console.log("KEY: ",key);
            //key = await gun.then();
            key = JSON.parse(key);
            //console.log("key",key);
        }
        //console.log(key);
        let mvalue = await SEA.decrypt(key, sec);
        console.log(mvalue);
        cb(mvalue);
    }());
    return gun;
}
Gun.chain.decryptvalue = decryptvalue;
//working to decrypt data??
/*
    //user...decryptdata(to,db);
    //gun...decryptdata(to,db);
    let user = gun.user();
    let to = gun.user(publickey);
    to.get("profile").get("alias").decryptdata(to,ack=>{
        console.log(ack);
    });
*/
var decryptdata = Gun.User.prototype.decryptdata = function(to, cb, opt){
    // gun graph to decrypt key to return value
    console.log("`.decryptdata` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
    cb = cb || function(ctx) { return ctx };
    opt = opt || {};
    let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
    opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;
    opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
    opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
    if(!to){
        cb({err:"User not set!"});
        console.log("User graph net set!");
        return gun;
    }

    gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
    (async function(){
        //KEY SALT
        let enc1
        if(opt.sharekeytype == "path"){
            enc1 = await to.get('trust').get(pair.pub).get(path).then();
        }
        if(opt.sharekeytype == "graph"){
            enc1 = await gun.get('trust').get(pair.pub).get(gun._.get).then();
            if(enc1 !=null){
                //console.log("enc1",enc1);
                if(enc1 == "null"){
                    console.log("Error Null || Denied!");
                    cb(null);
                    return gun;
                }
                enc1 = window.atob(enc1);
                enc1 = JSON.parse(enc1);
            }
            //console.log(enc1);
        }
        //console.log("enc1",enc1);
        if(!enc1){
            console.log("Error Null || Denied!");
            cb(null);
            return gun;
        }
        //enc1 = "SEA"+ JSON.stringify(enc1);
        //console.log(enc1);
        let epub = await to.get('epub').then();
        //console.log("epub",epub);
        //PAIR SHARE
        let mix = await SEA.secret(epub, pair);
        //console.log("mix",mix);
        //KEY SHARE
        let key = await SEA.decrypt(enc1, mix);
        console.log("key",key);
        //VALUE
        let enc2 
        if(opt.sharekeytype == "path"){
            enc2 = await gun.then();
        }
        if(opt.sharekeytype == "graph"){
            enc2 = await gun.get(opt.sharekeyvalue).then();
            enc2 = window.atob(enc2);
            enc2 = JSON.parse(enc2);
        }
        //console.log(enc2);
        //enc2 = "SEA"+ JSON.stringify(enc2);
        //console.log(enc);
        //console.log(gun);
        let dvalue = await SEA.decrypt(enc2, key);
        //console.log(dvalue);
        cb(dvalue);
    }());
    return gun;
}
//this deal with gun root function call
Gun.chain.decryptdata = decryptdata;

}());