/*
    Self contain Sandbox Gun Module:
    
    version: 2.0

    Created by: Lightnet

    Credit: amark ( https://github.com/amark/gun)

    License: MIT

    Gun Notes:
     * Test build.
     * sea.js and gun.js are buggy with auth checks.
    
    Information: To create share keys from User or Gun Graph. By creating trust map list and 
    key by default when encrypt function are call. Users are store in get('trust') map
    and you can change the key name in opt config to make it harder.

    User trust map store in child of root graph key. The trust store where graph path in user root.

    user.get(trust).get(publickey).get(pathnode).put('saltkey')
    
    Gun graph path is independent of created key root is base where graph call encryptput function
    but not the root graph node. It base on where the key root child graph location to generate 
    keys and trust map graph id to identify the keys and value. Simple example is tree node that
    each reference with ID that can't be same tree node. Each tree graph node has trust list if
    exist to share key who the owner to create it.

    Share Key config that support Gun and User that will detect type of root for User and Gun object.
    But can't be root graph when key are made will give errors.

    If get an error that object can't be used as text or string that root graph has to be json object.

    ```
    var object={// root id Object
        node:{// sub child 
            trust:[], //note is just example reference. `[]` it can't be used as graph. // sub child
            value:"key", //sub child
        }
    }
    // example
    let trust = get('trust');
    trust.get('publickey1').put('secret key');
    trust.get('publickey2').put('secret key');
    gun.get('object').put({trust:trust,value:"key"}); //json object
    ```
    This is json object format. Example how share key works. Name can be config.

    var object="key" //incorrect format
    //example
    gun.get('object').put('key') ///incorrect format, not json object

    //gun.get('foo').get('trust') //not here
    //user.get('trust') // since it root as well user own this graph
    gun.get('foo').get('something').encryptput('bar'); //create share key and create list
    gun.get('foo').get('something').get('trust') //it store users trust list on where encryptput graph.
    
    It the best to Share Key Genarete Salt Key by default to let know anyone to your keys.

    Random key used from:
     - SEA.random(16).toString();
     - Gun.text.random(16);
    
    User / Gun:
     - function grantkey (to allow owner user access to key graph value for other users. Check and create salt keys)
     - function revokekey (to owner revoke user access to key graph for user. Note it will break salt key if share with other users.)
      - Recreate new salt Share Key and reencrypt value.(This break other salt keys are shared.)
     - function encryptput put value (allow owner user to encrypt key value when creating and check salt key)
     - function decryptvalue return value (allow owner user to decrypt key value)
     - function decryptdata (to allow other user to decrypt key value/data from gun or sea but not self)
      - `let to = gun.user(public key)`
     
    User and Gun function for encrypt, decrypt and config key graph.
    sharekeyvalue:"value"; //default  //change to assign random secret key id
    sharekeytrust:"trust"; //default
    (gun/user).get('any').decryptvalue(cb,{sharekeyvalue:"value",sharekeytrust:"trust",sharekeydebug:false})
    (gun/user).get('any').encryptput(data,cb,{sharekeyvalue:"value",sharekeytrust:"trust",sharekeydebug:false})
    (gun/user).get('any').(grantkey|revokekey|decryptdata)(to,cb,{sharekeyvalue:"value",sharekeytrust:"trust",sharekeydebug:false})

    {sharekeybbase:true}  - This is for gun and not user graph.
    {sharekeydebug:false} - Debug key, value, and secret sea

    Notes:
     - Not tested large scale.
     - Not work on debug fails and checks. (work in progress)
     - Grant/Revoke self share key break share keys.
     - User encrypt json format will do fine. Gun encrypt root need to string and not json.
     - Need to fix which is user or gun root check for easy access when call function.
     - when user is store in root but when get from `let to = gun.user('key')` will not auto detect as user but gun object.
*/
(function() {
    var Gun = (typeof window !== "undefined")? window.Gun : require('gun/gun');
    
    Gun.on('opt', function(context) {
        //context.opt.sharekeytype="path";// path for user //This will auto check default for gun and user
        //context.opt.sharekeytype="graph"; //gun graph sea key will be convert to string and base (bug).
        context.opt.sharekeydebug = true;
        context.opt.sharekeyvalue = 'value';
        context.opt.sharekeytrust = 'trust';
        context.opt.sharekeybbase = true; //btoa, atob //base64 ecode and decode
        this.to.next(context);
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
    
        opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
        opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
        opt.sharekeytrust = opt.sharekeytrust ||  gun._.root.opt.sharekeytrust;
        opt.sharekeybbase = opt.sharekeybbase ||  gun._.root.opt.sharekeybbase;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            //console.log("User PASS");
            opt.sharekeytype = "path";
        }else{
            //console.log("Gun PASS");
            opt.sharekeytype = "graph";
        }
    
        (async function(){
            if(opt.sharekeydebug){
                console.log("opt.sharekeytype: ",opt.sharekeytype);
            }
            let enc, sec;
            if(opt.sharekeytype == "path"){
                sec = await user.get(opt.sharekeytrust).get(pair.pub).get(path).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                sec = await SEA.decrypt(sec, pair);
                if(!sec){
                    //console.log("CREATE SALT KEY")
                    sec = SEA.random(16).toString();
                    if(opt.sharekeydebug){
                        console.log("CREATE SECRET: ",sec);
                    }
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get(opt.sharekeytrust).get(pair.pub).get(path).put(enc);
                }
            }
            if(opt.sharekeytype == "graph"){
                sec = await gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                if(sec !=null){
                    if(opt.sharekeybbase){
                        sec = window.atob(sec);
                    }
                    sec = JSON.parse(sec);
                }
                sec = await SEA.decrypt(sec, pair);
                if(!sec){
                    //console.log("CREATE SALT KEY")
                    sec = SEA.random(16).toString();
                    if(opt.sharekeydebug){
                        console.log("CREATE SECRET: ",sec);
                    }
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    enc = JSON.stringify(enc);//need to be string bug root gun
                    if(opt.sharekeybbase){
                        enc = window.btoa(enc);
                    }
                    //console.log(enc);
                    gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).put(enc);
                }
            }
    
            let pub = await to.get('pub').then();
            let epub = await to.get('epub').then();
            pub = await pub; epub = await epub;
            let dh = await SEA.secret(epub, pair);
            enc = await SEA.encrypt(sec, dh);
            if(opt.sharekeytype == "path"){
                if(opt.sharekeydebug){
                    console.log("TO sec: ",enc);
                }
                user.get(opt.sharekeytrust).get(pub).get(path).put(enc, cb);
            }
            if(opt.sharekeytype == "graph"){
                enc = JSON.stringify(enc);
                if(opt.sharekeybbase){
                    enc = window.btoa(enc);
                }
                //console.log(enc);
                if(opt.sharekeydebug){
                    console.log("TO sec: ",enc);
                }
                gun.get(opt.sharekeytrust).get(pub).get(gun._.get).put(enc, cb);
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
    
        opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
        opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
        opt.sharekeytrust = opt.sharekeytrust ||  gun._.root.opt.sharekeytrust;
        opt.sharekeybbase = opt.sharekeybbase ||  gun._.root.opt.sharekeybbase;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            //console.log("User PASS");
            opt.sharekeytype = "path";
        }else{
            //console.log("Gun PASS");
            opt.sharekeytype = "graph";
        }
        (async function(){
            if(opt.sharekeydebug){
                console.log("opt.sharekeytype: ",opt.sharekeytype);
            }
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
                sec = await user.get(opt.sharekeytrust).get(pair.pub).get(path).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                sec = await SEA.decrypt(sec, pair);
                key = await gun.once().then();
                value = await SEA.decrypt(key, sec);
            }
            if(opt.sharekeytype == "graph"){
                sec = await gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                if(sec !=null){
                    if(opt.sharekeybbase){
                        sec = window.atob(sec);//decode
                    }
                    sec = JSON.parse(sec);
                }
                sec = await SEA.decrypt(sec, pair);
                key = await gun.get(opt.sharekeyvalue).once().then();
                if(opt.sharekeybbase){
                    key = window.atob(key);//decode
                }
                key = JSON.parse(key);
                value = await SEA.decrypt(key, sec);
            }
            if(opt.sharekeydebug){
                console.log("VALUE: ",value);
            }
            // Create New Salt Key
            sec = SEA.random(16).toString();
            //sec = Gun.text.random(16);
            enc = await SEA.encrypt(sec, pair);
            if(opt.sharekeytype == "path"){
                user.get(opt.sharekeytrust).get(pair.pub).get(path).put(enc);
                pub = await to.get('pub').then();//revoke user
                user.get(opt.sharekeytrust).once().map().once(async (data,mkey)=>{//trust users
                    let uname;
                    if(opt.sharekeydebug){
                        uname = await gun.back(-1).user(mkey).get('alias').then();
                    }
                    if(pair.pub != mkey){//check self user to be resalt
                        if(pub == mkey){ //check user to be revoke
                            //do nothing??? (revoke user)
                            if(opt.sharekeydebug){
                                console.log(uname, "FAIL");
                            }
                        }else{
                            let ckey = await user.get(opt.sharekeytrust).get(mkey).get(path).then();
                            if(opt.sharekeydebug){
                                console.log(uname, "PASS");
                            }
                            if(ckey != "null"){//Check if there user are revoke key if they are null should be ignore.
                                if(opt.sharekeydebug){
                                    console.log(uname, "CREATE NEW SALT SHARE KEY ");
                                }
                                let mto = gun.back(-1).user(mkey);
                                let mpub = await mto.get('pub').then();
                                let mepub = await mto.get('epub').then();
                                let dh = await SEA.secret(mepub, pair);
                                let menc = await SEA.encrypt(sec, dh);
                                //NEW SALT KEY
                                if(opt.sharekeydebug){
                                    console.log("NEW SHARE KEY: ",menc);
                                }
                                user.get(opt.sharekeytrust).get(mpub).get(path).put(menc);
                            }
                        }
                    }
                });
            }
            if(opt.sharekeytype == "graph"){
                enc = JSON.stringify(enc);//need to be string bug root gun
                enc = window.btoa(enc);
                gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).put(enc);
                pub = await to.get('pub').then();
    
                gun.get(opt.sharekeytrust).map().once(async (data,mkey)=>{//trust users
                    let uname;
                    if(opt.sharekeydebug){
                        uname = await gun.back(-1).user(mkey).get('alias').then();
                    }
                    if(pair.pub != mkey){//check self user
                        if(pub == mkey){ //check user to be revoke
                            //do not here?(ban user)
                            if(opt.sharekeydebug){
                                console.log(uname, "FAIL");
                            }
                        }else{
                            let ckey = await gun.get(opt.sharekeytrust).get(key).get(gun._.get).then();
                            if(opt.sharekeydebug){
                                console.log(uname, "PASS");
                            }
                            if(ckey != "null"){//Check if there user are revoke key if they are null.
                                if(opt.sharekeydebug){
                                    console.log(uname, "NEW SHARE KEY!");
                                }
                                let mto = gun.back(-1).user(mkey);
                                let mpub = await mto.get('pub').then();
                                let mepub = await mto.get('epub').then();
                                let dh = await SEA.secret(mepub, pair);
                                //NEW SHARE KEY
                                let menc = await SEA.encrypt(sec, dh);
                                menc = JSON.stringify(menc);
                                if(opt.sharekeybbase){
                                    menc = window.btoa(menc);
                                }
                                if(opt.sharekeydebug){
                                    console.log("NEW SHARE KEY: ",menc);
                                }
                                gun.get(opt.sharekeytrust).get(mpub).get(gun._.get).put(menc);
                            }
                        }
                    }
                })
            }
            //encrypt Value
            let v = await SEA.encrypt(value, sec);
            if(opt.sharekeytype == "path"){
                gun.put(v, cb);
            }
            if(opt.sharekeytype == "graph"){
                v = JSON.stringify(v);
                if(opt.sharekeybbase){
                    v = window.btoa(v);
                }
                gun.get(opt.sharekeyvalue).put(v, cb);
            }
            // REMOVE SHARE KEY
            pub = await to.get('pub').then();
            if(opt.sharekeytype == "path"){
                user.get(opt.sharekeytrust).get(pub).get(path).put("null", cb);//REMOVE SECRET KEY
            }
            if(opt.sharekeytype == "graph"){
                gun.get(opt.sharekeytrust).get(pub).get(gun._.get).put("null", cb);//REMOVE SECRET KEY
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

        opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
        opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
        opt.sharekeytrust = opt.sharekeytrust ||  gun._.root.opt.sharekeytrust;
        opt.sharekeybbase = opt.sharekeybbase ||  gun._.root.opt.sharekeybbase;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            //console.log("User PASS");
            opt.sharekeytype = "path";
        }else{
            //console.log("Gun PASS");
            opt.sharekeytype = "graph";
        }
        //console.log(Gun.is(gun));//check if gun is object match

        (async function(){
            if(opt.sharekeydebug){
                console.log("opt.sharekeytype: ",opt.sharekeytype);
            }
            let enc, sec;
            if(opt.sharekeytype == "path"){
                sec = await user.get(opt.sharekeytrust).get(pair.pub).get(path).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                sec = await SEA.decrypt(sec, pair);
                if(!sec){
                    sec = SEA.random(16).toString();
                    if(opt.sharekeydebug){
                        console.log("CREATE SECRET: ",sec);
                    }
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get(opt.sharekeytrust).get(pair.pub).get(path).put(enc);
                }
                enc = await SEA.encrypt(data, sec);
                gun.put(enc, cb);//PUT ENCRYPT DATA
            }
            
            if(opt.sharekeytype == "graph"){
                sec = await gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                if(sec !=null){
                    if(opt.sharekeybbase){
                        sec = window.atob(sec);
                    }
                    sec = JSON.parse(sec);
                    sec = await SEA.decrypt(sec, pair);
                }
                if(!sec){
                    sec = SEA.random(16).toString();
                    if(opt.sharekeydebug){
                        console.log("CREATE SECRET: ",sec);
                    }
                    enc = await SEA.encrypt(sec, pair);
                    enc = JSON.stringify(enc);//need to be string bug root gun
                    if(opt.sharekeybbase){
                        enc = window.btoa(enc);
                    }
                    if(opt.sharekeydebug){
                        console.log("SECRET ENC: ",enc);
                    }
                    gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).put(enc);
                }
                if(opt.sharekeydebug){
                    console.log("DATA: ",data);
                }
                enc = await SEA.encrypt(data, sec);
                enc = JSON.stringify(enc);
                if(opt.sharekeybbase){
                    enc = window.btoa(enc);
                }
                //gun put need be child key value
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
    
        opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
        opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
        opt.sharekeytrust = opt.sharekeytrust ||  gun._.root.opt.sharekeytrust;
        opt.sharekeybbase = opt.sharekeybbase ||  gun._.root.opt.sharekeybbase;
    
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });

        if (gun._.$ instanceof Gun.User){//check gun node is user object
            //console.log("User PASS");
            opt.sharekeytype = "path";
        }else{
            //console.log("Gun PASS");
            opt.sharekeytype = "graph";
        }
        
        (async function(){
            if(opt.sharekeydebug){
                console.log("opt.sharekeytype: ",opt.sharekeytype);
            }
            let sec, key;
            if(opt.sharekeytype == "path"){
                sec = await user.get(opt.sharekeytrust).get(pair.pub).get(path).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                if(!sec){
                    cb(null);
                    return gun;
                }
                sec = await SEA.decrypt(sec, pair);
                key = await gun.then();
            }
            if(opt.sharekeytype == "graph"){
                sec = await gun.get(opt.sharekeytrust).get(pair.pub).get(gun._.get).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",sec);
                }
                if(!sec){
                    cb(null);
                    return gun;
                }
                if(opt.sharekeybbase){
                    sec = window.atob(sec);
                }
                sec = JSON.parse(sec);
                sec = await SEA.decrypt(sec, pair);
                key = await gun.get(opt.sharekeyvalue).then();//default 'value'
                if(opt.sharekeydebug){
                    console.log("VALUE SEC: ",key);
                }
                if(key !=null){
                    if(opt.sharekeybbase){
                        key = window.atob(key);
                    }
                    key = JSON.parse(key);
                }
            }
            let mvalue = await SEA.decrypt(key, sec);
            if(opt.sharekeydebug){
                console.log("VALUE: ", mvalue);
            }
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
        //opt.sharekeytype = opt.sharekeytype || gun._.root.opt.sharekeytype;
        opt.sharekeydebug = opt.sharekeydebug ||  gun._.root.opt.sharekeydebug;
        opt.sharekeyvalue = opt.sharekeyvalue ||  gun._.root.opt.sharekeyvalue;
        opt.sharekeytrust = opt.sharekeytrust ||  gun._.root.opt.sharekeytrust;
        opt.sharekeybbase = opt.sharekeybbase ||  gun._.root.opt.sharekeybbase;
        if(!to){
            cb({err:"User not set!"});
            console.log("User graph net set!");
            return gun;
        }
        console.log(opt.sharekeydebug);

        if (gun._.$ instanceof Gun.User){//check gun node is user object
            //console.log("User PASS");
            opt.sharekeytype = opt.sharekeytype || "path";
        }else{
            //console.log("Gun PASS");
            opt.sharekeytype = opt.sharekeytype || "graph";
        }
    
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        (async function(){
            if(opt.sharekeydebug){
                console.log("opt.sharekeytype: ",opt.sharekeytype);
            }
            //KEY SALT
            let enc1
            if(opt.sharekeytype == "path"){
                enc1 = await to.get('trust').get(pair.pub).get(path).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",enc1);
                }
            }
            if(opt.sharekeytype == "graph"){
                enc1 = await gun.get('trust').get(pair.pub).get(gun._.get).then();
                if(opt.sharekeydebug){
                    console.log("SECRET: ",enc1);
                }
                if(enc1 !=null){
                    if(enc1 == "null"){
                        console.log("Error Null || Denied!");
                        cb(null);
                        return gun;
                    }
                    if(opt.sharekeybbase){
                        enc1 = window.atob(enc1);
                    }
                    enc1 = JSON.parse(enc1);
                }
            }
            if(!enc1){
                console.log("Error Null || Denied!");
                cb(null);
                return gun;
            }
            let epub = await to.get('epub').then();
            //PAIR SHARE
            let mix = await SEA.secret(epub, pair);
            //KEY SHARE
            let key = await SEA.decrypt(enc1, mix);
            if(opt.sharekeydebug){
                console.log("key: ",key);
            }
            //VALUE
            let enc2 
            if(opt.sharekeytype == "path"){
                enc2 = await gun.then();
                if(opt.sharekeydebug){
                    console.log("VALUE sec: ",enc2);
                }
            }
            if(opt.sharekeytype == "graph"){
                enc2 = await gun.get(opt.sharekeyvalue).then();
                if(opt.sharekeydebug){
                    console.log("VALUE sec: ",enc2);
                }
                if(opt.sharekeybbase){
                    enc2 = window.atob(enc2);
                }
                enc2 = JSON.parse(enc2);
            }
            let dvalue = await SEA.decrypt(enc2, key);
            if(opt.sharekeydebug){
                console.log("VALUE: ",dvalue);
            }
            cb(dvalue);
        }());
        return gun;
    }
    //this deal with gun root function call
    Gun.chain.decryptdata = decryptdata;
    
}());