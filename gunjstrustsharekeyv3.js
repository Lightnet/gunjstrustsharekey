/*
    Self contain Sandbox Gun Module chain for auth sea.js:
    Created by: Lightnet
    License: MIT
    Version: 3.0
    Last Update:2019.09.24

    Credit: amark ( https://github.com/amark/gun)

    Status(Work in progress!):
     * Working on trust public key will conflict with share key functions!
     * Work in progress to test dis/trust public key.
     * encryptput not working to...get(...).encryptput() NO! Mismatched owner on 'ct'. 

    Information: This is addon chain to sea.js for user to test functions of acess write and read
    in encryption. It is base on sea.js user functions that is current not improve yet.

    Gun functions:
     * trustkey(to, cb, opt) - writable: allow, public key (wip)
     * distrustkey(to, cb, opt) - writable: denied, public key (wip)
     * grantkey(to, cb, opt) - readable: allow, share key (working for user root)
     * revokekey(to, cb, opt) - readable: denied, share key (working for user root / wip trust key)
     * encryptput(data, cb, opt) - encrypt: value (working for user root / wip trust key)
     * decryptonce( cb, opt) - decrypt: value (working for user root / wip trust key)
     
    dis/trustkey:
      The owner user key graph to dis/allow for other users write access of the value or data.

      The writable key user public key is store in put(data | value) 

      Example:
      gun.get('namespace').get('foo').put({SEA{ct:"",iv:"",s:""},~@publickey1,~@publickey2}); //does not work

      Example put:(wip might not work)
       * sea: "SEA{ct: "...",iv: "...",s: "..."}}"
       * ~@publickey1:{'#': ~@publickey1}
       * ~@publickey2:{'#': ~@publickey2}
       * _:{...}
      To create public key map list that is to need encrypt data and then alias list.

      Note: 
       * This part of sea.js function security call/filter check for sea key and alias public keys.
       * This base on understanding of security node checks.

    grantkey/revokekey:
     To able to dis/allow user share key access to read data. The share key are store in user trust map key and path.

    Gun Notes:
     * sea.js and gun.js are buggy with auth checks.
     * There is a bug in gun.user('publickey') will return as gun not user object.
*/
(function() {

    var Gun = (typeof window !== "undefined")? window.Gun : require('gun/gun');

    Gun.on('opt', function(context) {
        context.opt.sharekeydebug = true;
        context.opt.sharekeyvalue = 'value';
        context.opt.sharekeytrust = 'trust';
        context.opt.sharekeybbase = true; //btoa, atob //base64 ecode and decode
        this.to.next(context);
    });

    function trustlist(cb, opt){
        console.log("`.trustlist` PROTOTYPE API DO NOT USE, TESTING!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            //make sure that user root
            if(sharetype == "user"){
                //let data = await gun.then();
                //console.log(data);
                //let index = 0;
                user.get('trust').get(path).once().map().once(async (data,key)=>{
                    //index++;
                    //console.log("trust");
                    //console.log("data",data);
                    //console.log("key",key);
                    let to = gun.user(key);
                    let who = await to.get('alias').then();
                    console.log("who: ", who);

                    //Gun.node.is(data, async function(v, k){
                        //console.log(v)
                        //console.log(k)
                    //});
                    //user.get('trust').get(path).get('index').put(index);
                    //console.log(index);
                });
            }
            //if(sharetype == "gun"){}
        }());
        return gun;
    }

    function trustindex(cb, opt){
        console.log("`.trustlist` PROTOTYPE API DO NOT USE, TESTING!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            //make sure that user root
            if(sharetype == "user"){
                let index = await user.get('trust').get(path).get('index').then();
                return index;
            }else{
                return null;
            }
        }());
    }

    function trustkey(to, cb, opt){
        console.log("`.trustkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //let debug = opt.debug || gun._.root.opt.sharekeydebug;
        //let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        //let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        //let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        let each = {};
        (async function(){

            if(sharetype == "user"){
                //console.log(gun);
                //sea.js
                //line 792
                //root.get(tmp = '~'+act.pair.pub).put(act.data); // awesome, now we can actually save the user with their public key as their ID.
                //root.get('~@'+alias).put(Gun.obj.put({}, tmp, Gun.val.link.ify(tmp))); // next up, we want to associate the alias with the public key. So we add it to the alias list.
                //let tmp = '~'+pair.pub;
                //tmp = Gun.val.link.ify(tmp);
                //tmp = Gun.obj.put({}, tmp, Gun.val.link.ify(tmp));
                //console.log(tmp);

                let who = await to.get('alias').then();
                if(who!=null){
                    let pub = await to.get('pub').then();
                    user.get('trust').get(path).get(pub).put({write:true},ack=>{
                        console.log("trust");
                        console.log(ack);
                    });

                    //note this might break code if there take long if more then 100 alias users
                    //update sync error not working.
                    //if other user has not added key value will not work
                    let index = 0;
                    user.get('trust').get(path).once().map().once((data,key)=>{
                        index++;
                        user.get('trust').get(path).get('index').put(index);
                        console.log(index);
                    });
                    console.log("done!");
                }
            }
                
            //if(sharetype == "gun"){}
        }());
        return gun;
    }

    function distrustkey(to, cb, opt){
        console.log("`.distrustkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        let debug = opt.debug || gun._.root.opt.sharekeydebug;
        let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        let each = {};
        (async function(){
            if(sharetype == "user"){
                let who = await to.get('alias').then();
                if(who!=null){
                    console.log("FOUND!",who);
                    let pub = await to.get('pub').then();
                    user.get('trust').get(path).get(pub).put({write:false},ack=>{
                        console.log("trust");
                        console.log(ack);
                    });
                }
            }

            if(sharetype == "gun"){

            }
        }());
        return gun;
    }

    function grantkey(to, cb, opt){
        console.log("`.grantkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //let debug = opt.debug || gun._.root.opt.sharekeydebug;
        //let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        //let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        //let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            if(sharetype == "user"){
                let enc, sec = await user.get('grant').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                if(!sec){
                    sec = SEA.random(16).toString();
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get('grant').get(pair.pub).get(path).put(enc);
                }
                let pub = await to.get('pub').then();
                let epub = await to.get('epub').then();
                pub = await pub; epub = await epub;
                let dh = await SEA.secret(epub, pair);
                enc = await SEA.encrypt(sec, dh);
                user.get('grant').get(pub).get(path).put(enc, cb);
            }
        }());
        return gun;
    }

    function revokekey(to, cb, opt){
        console.log("`.revokekey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //let debug = opt.debug || gun._.root.opt.sharekeydebug;
        //let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        //let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        //let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            if(sharetype == "user"){
                let alias = await to.get("alias").then();
                if(!alias){
                    cb({err:'Error alias not found!'});
                    return gun;
                }
                let enc, sec;
                sec = await user.get('grant').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                let key = await gun.once().then();
                //GET VALUE
                let value = await SEA.decrypt(key, sec);
                // CREATE SHARE KEY
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                enc = await SEA.encrypt(sec, pair);
                //ENCRYPT KEY
                user.get('grant').get(pair.pub).get(path).put(enc);
                let pub = await to.get('pub').then();
                console.log("pub",pub);
                console.log("path: ",path)
                user.get('grant').once().map().once(async (data,mkey)=>{//grant users
                    //console.log(data)
                    //let p = await user.get('grant').get(mkey).then();
                    //console.log(p)
                    let uname;
                    uname = await gun.back(-1).user(mkey).get('alias').then();
                    //console.log("mkey",mkey);
                    uname = await gun.back(-1).user(mkey).get('alias').then();
                    if(pair.pub != mkey){//check self user to be resalt
                        if(pub == mkey){ //check user to be revoke
                            //do nothing??? (revoke user)
                            console.log(uname, "REVOKE USER!");
                        }else{
                            console.log(uname, "PASS");
                            //let op = await user.get('trust').get(mkey).then();
                            //for (var p in op) {
                                //console.log(p);
                            //}
                            let ckey = await user.get('grant').get(mkey).get(path).then();
                            if(ckey != "null"){//Check if there user are revoke key if they are null should be ignore.
                                //console.log(uname, "CREATE NEW SALT SHARE KEY ");
                                let mto = gun.back(-1).user(mkey);
                                let mpub = await mto.get('pub').then();
                                let mepub = await mto.get('epub').then();
                                let dh = await SEA.secret(mepub, pair);
                                let menc = await SEA.encrypt(sec, dh);
                                //NEW SALT KEY
                                //console.log( uname,"NEW SHARE KEY: ",menc);
                                user.get('grant').get(mpub).get(path).put(menc);
                            }
                        }
                    }
                });
                //ENCRYPT VALUE
                let v = await SEA.encrypt(value, sec);
                gun.put(v, cb);
                // Remove Salt Key
                //let pub = await to.get('pub').then();
                user.get('grant').get(pub).get(path).put("null", cb);//remove key
            }
        }());
        return gun;
    }

    function encryptput(data, cb, opt){
        console.log("`.encryptput` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //let debug = opt.debug || gun._.root.opt.sharekeydebug;
        //let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        //let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        //let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            let enc, sec;
            console.log(gun);
            if(sharetype == "user"){
                sec = await user.get('grant').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                //console.log(sec);
                if(!sec){
                    console.log("CREATE SHARE KEY!");
                    sec = SEA.random(16).toString();
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get('grant').get(pair.pub).get(path).put(enc);
                }
                enc = await SEA.encrypt(data, sec);
                let enc2 = await gun.then();
                // value enc and public keys from current gun graph
                //need to be convert into array not string 'SEA{...}' > {...}
                let tmpp=enc;//json object
                //tmpp=
                //for(o in enc2){
                    //if("~" == o.slice(0,1)){
                        //console.log("FOUND PUB KEY");
                        //let tmppub = o;
                        //console.log(tmppub);
                        //tmpp = Gun.obj.put(tmpp, tmppub, Gun.val.link.ify(tmppub))
                        //console.log(tmpp);
                    //}
                //}
                gun.put(tmpp, cb);
                //console.log("enc",enc);
                //gun.put(enc, cb);
            }
            //if user is not root graph
            if(sharetype == "gun"){
                let countmax = 10;//limit back to root loop
                let root;
                for(let i=0;i<countmax;i++){//look for user soul root from let to = gun.user('key');
                    let tmp = gun.back(i);//loop to find user root
                    if(tmp._.soul){
                        console.log("FOUND SOUL!");
                        root = tmp;
                        break;
                    }
                }
                if(root !=null){
                    let to = root;//user root graph
                    let enc1 = await to.get('grant').get(pair.pub).get(path).then();
                    let epub = await to.get('epub').then();
                    let mix = await SEA.secret(epub, pair);
                    let key = await SEA.decrypt(enc1, mix);//SECRET
                    //console.log(key);
                    //GET VALUE AND SHARE KEYS
                    let enc2 = await gun.then();
                    console.log(enc2);
                    //ENCRYPT VALUE
                    let enc3 = await SEA.encrypt(data, key);
                    console.log(enc3);
                    let enc0 = enc3;
                    console.log(enc0);
                    //enc0 = tmpp;
                    //gun.back().get('any'+user._.sea.pub+'alias').put(enc0);
                    //gun.back().get('alias').put(enc0);
                    gun.put(enc0, cb);
                    //gun.put(enc, cb);
                }
            }
        }());
        return gun;
    }

    function graphpath( cb, opt){
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //(async function(){
        //}());
        //return gun;
        return path;
    }

    function decryptonce( cb, opt){
        console.log("`.decryptonce` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        //console.log(user);
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //let debug = opt.debug || gun._.root.opt.sharekeydebug;
        //let valueid = opt.valueid || gun._.root.opt.sharekeyvalue;
        //let trustid = opt.trustid || gun._.root.opt.sharekeytrust;
        //let bbase = opt.bbase || gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            //console.log(sharetype);
            if(sharetype == "user"){
                let sec = await user.get('grant').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                let key = await gun.then();
                //console.log(key);
                if(key === undefined){
                    //console.log("FOUND NULL");
                    cb(undefined);
                    return gun;
                }
                //if(key.sea === undefined){
                    //cb(undefined);
                    //return gun;
                //}
                //key = key.sea;//TESTING....
                let value = await SEA.decrypt(key, sec);
                cb(value);
            }
            //console.log(gun);
            if(sharetype == "gun"){
                //console.log(gun);
                let countmax = 10;
                let root;
                //need to work this fixed later
                for(let i=0;i<countmax;i++){//look for user soul root from let to = gun.user('key');
                    let tmp = gun.back(i);//loop to find user root
                    if(tmp._.soul){
                        console.log("FOUND SOUL!");
                        root = tmp;
                        break;
                    }
                }
                if('~' === root._.soul.slice(0,1)){//public key
                    //let soul;// = root._.soul.slice(0,1);
                    //console.log(SEA.opt.pub(root._.soul));
                    //soul=SEA.opt.pub(root._.soul);
                    //let to = gun.user(soul);
                    let to = root;//user root graph
                    let enc1 = await to.get('grant').get(pair.pub).get(path).then();
                    let epub = await to.get('epub').then();
                    let mix = await SEA.secret(epub, pair);
                    let key = await SEA.decrypt(enc1, mix);
                    //console.log(key);
                    let enc2 = await gun.then();
                    if(enc2 === undefined){
                        //console.log("FOUND NULL");
                        cb(undefined);
                        return gun;
                    }
                    //if(enc2.sea === undefined){
                        //cb(undefined);
                        //return gun;
                    //}
                    //console.log(enc2);
                    //enc2 = enc2.sea;//TESTING....
                    console.log(enc2);
                    //enc2 = "SEA"+ JSON.stringify(enc2);
                    let value = await SEA.decrypt(enc2, key);
                    //console.log(value);
                    cb(value);
                }
            }
        }());
        return gun;
    }
    //SETUP FUNCTION for GUN
    Gun.chain.trustkey = trustkey;
    Gun.chain.distrustkey = distrustkey;
    Gun.chain.grantkey = grantkey;
    Gun.chain.revokekey = revokekey;
    Gun.chain.encryptput = encryptput;
    Gun.chain.decryptonce = decryptonce;
    //TESTING...
    Gun.chain.trustlist = trustlist;
    Gun.chain.trustindex = trustindex;
    Gun.chain.graphpath = graphpath;
}());
