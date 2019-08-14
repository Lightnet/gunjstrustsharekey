/*
    Self contain Sandbox Gun Module for auth sea.js:
    Created by: Lightnet
    License: MIT
    Version: 3.0
    Last Update:2019.08.14

    Credit: amark ( https://github.com/amark/gun)

    Information: Work in progress to test dis/trust public key.

    gun functions:
     * trustkey(to, cb, opt) - writable: allow, public key (not working yet)
     * distrustkey(to, cb, opt) - writable: denied, public key (not working yet)
     * grantkey(to, cb, opt) - readable: allow, share key (working for user root)
     * revokekey(to, cb, opt) - readable: denied, share key (working for user root)
     * encryptput(data, cb, opt) - encrypt: value (working for user root)
     * decryptonce( cb, opt) - decrypt: value (working for user root)
     
    dis/trust:
      This deal with owner graph to dis/allow for other users write access.

    grantkey/revokekey:
     To able to dis/allow user share key access to read data.

    Gun Notes:
     * Work in progress!
     * sea.js and gun.js are buggy with auth checks.

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

    function trustlist(to, cb, opt){
        console.log("`.trustlist` PROTOTYPE API DO NOT USE, TESTING!");
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
            //make sure that user root
            if(sharetype == "user"){
                //console.log(gun);
                //sea.js
                //line 792
                //root.get(tmp = '~'+act.pair.pub).put(act.data); // awesome, now we can actually save the user with their public key as their ID.
                //root.get('~@'+alias).put(Gun.obj.put({}, tmp, Gun.val.link.ify(tmp))); // next up, we want to associate the alias with the public key. So we add it to the alias list.
                //let tmp = '~'+pair.pub;
                gun.map(function(data,key){
                    console.log(data)
                    console.log(key)
                });

                each.nodetest = function(node, soul){
                    //console.log("node",node);
                    //console.log("soul",soul);
                    //if(Gun.obj.empty(node, '_')){ return check['node'+soul] = 0 } // ignore empty updates, don't reject them.
                    //Gun.obj.map(node, each.way, {soul: soul, node: node});
                };
                //Gun.obj.map(gun, each.nodetest);
                Gun.obj.map(gun._.put, each.nodetest);
                //console.log(gun)
                //let s = Gun.node.soul(gun._.put);
                //console.log(s);
                //console.log("done!");
            }
            //if(sharetype == "gun"){}
        }());
        return gun;
    }

    function trustkey(to, cb, opt){
        console.log("`.trustkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
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
            //make sure that user root
            if(sharetype == "user"){
                console.log(gun);
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
                    console.log("FOUND!",who);
                    let pub = await to.get('pub').then();
                    let tagpub = '~'+pub;
                    console.log(tagpub);
                    gun.put(Gun.obj.put({}, tagpub, Gun.val.link.ify(tagpub))); // next up, we want to associate the alias with the public key. So we add it to the alias list.
                }

                let s = Gun.node.soul(gun)
                console.log(s);

                //each.node = function(node, soul){
                    //console.log("soul",soul)
                    //if(Gun.obj.empty(node, '_')){ return check['node'+soul] = 0 } // ignore empty updates, don't reject them.
                    //Gun.obj.map(node, each.way, {soul: soul, node: node});
                //};
                //Gun.obj.map(gun, each.nodetest);
                console.log("done!");
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

        }());
        return gun;
    }

    function grantkey(to, cb, opt){
        console.log("`.grantkey` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        let debug = opt.debug ||  gun._.root.opt.sharekeydebug;
        let valueid = opt.valueid ||  gun._.root.opt.sharekeyvalue;
        let trustid = opt.trustid ||  gun._.root.opt.sharekeytrust;
        let bbase = opt.bbase ||  gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            if(sharetype == "user"){
                let enc, sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                if(!sec){
                    sec = SEA.random(16).toString();
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get('trust').get(pair.pub).get(path).put(enc);
                }
                let pub = await to.get('pub').then();
                let epub = await to.get('epub').then();
                pub = await pub; epub = await epub;
                let dh = await SEA.secret(epub, pair);
                enc = await SEA.encrypt(sec, dh);
                user.get('trust').get(pub).get(path).put(enc, cb);
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
        let debug = opt.debug ||  gun._.root.opt.sharekeydebug;
        let valueid = opt.valueid ||  gun._.root.opt.sharekeyvalue;
        let trustid = opt.trustid ||  gun._.root.opt.sharekeytrust;
        let bbase = opt.bbase ||  gun._.root.opt.sharekeybbase;
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
                sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                let key = await gun.once().then();
                //GET VALUE
                let value = await SEA.decrypt(key, sec);
                // CREATE SHARE KEY
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                enc = await SEA.encrypt(sec, pair);
                //ENCRYPT KEY
                user.get('trust').get(pair.pub).get(path).put(enc);
                let pub = await to.get('pub').then();
                console.log("pub",pub);
                console.log("path: ",path)
                user.get('trust').once().map().once(async (data,mkey)=>{//trust users
                    //console.log(data)
                    //let p = await user.get('trust').get(mkey).then();
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
                            let op = await user.get('trust').get(mkey).then();
                            for (var p in op) {
                                console.log(p);
                            }
                            let ckey = await user.get('trust').get(mkey).get(path).then();
                            
                            if(ckey != "null"){//Check if there user are revoke key if they are null should be ignore.
                                //console.log(uname, "CREATE NEW SALT SHARE KEY ");
                                let mto = gun.back(-1).user(mkey);
                                let mpub = await mto.get('pub').then();
                                let mepub = await mto.get('epub').then();
                                let dh = await SEA.secret(mepub, pair);
                                let menc = await SEA.encrypt(sec, dh);
                                //NEW SALT KEY
                                //console.log( uname,"NEW SHARE KEY: ",menc);
                                user.get('trust').get(mpub).get(path).put(menc);
                            }
                        }
                    }
                });
        
                //ENCRYPT VALUE
                let v = await SEA.encrypt(value, sec);
                gun.put(v, cb);
                // Remove Salt Key
                //let pub = await to.get('pub').then();
                user.get('trust').get(pub).get(path).put("null", cb);//remove key
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
        let debug = opt.debug ||  gun._.root.opt.sharekeydebug;
        let valueid = opt.valueid ||  gun._.root.opt.sharekeyvalue;
        let trustid = opt.trustid ||  gun._.root.opt.sharekeytrust;
        let bbase = opt.bbase ||  gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            let enc, sec;
            if(sharetype == "user"){
                sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                //console.log(sec);
                if(!sec){
                    console.log("CREATE SHARE KEY!");
                    sec = SEA.random(16).toString();
                    //sec = Gun.text.random(16);
                    enc = await SEA.encrypt(sec, pair);
                    user.get('trust').get(pair.pub).get(path).put(enc);
                }
                enc = await SEA.encrypt(data, sec);
                console.log("enc",enc);
                gun.put(enc, cb);
            }
            //if user is not root graph
            if(sharetype == "gun"){
                let countmax = 10;
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
                    let enc1 = await to.get('trust').get(pair.pub).get(path).then();
                    let epub = await to.get('epub').then();
                    let mix = await SEA.secret(epub, pair);
                    let key = await SEA.decrypt(enc1, mix);//SECRET
                    console.log(key);
                    let enc = await SEA.encrypt(data, key);
                    gun.put(enc, cb);
                }
            }
        }());
        return gun;
    }

    function decryptonce( cb, opt){
        console.log("`.decryptonce` PROTOTYPE API MAY BE CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        opt = opt || {};
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        console.log(user);
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        let debug = opt.debug ||  gun._.root.opt.sharekeydebug;
        let valueid = opt.valueid ||  gun._.root.opt.sharekeyvalue;
        let trustid = opt.trustid ||  gun._.root.opt.sharekeytrust;
        let bbase = opt.bbase ||  gun._.root.opt.sharekeybbase;
        let sharetype;
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = "user";
        }else{
            sharetype = "gun";
        }
        (async function(){
            console.log(sharetype);
            if(sharetype == "user"){
                let sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                let key = await gun.then();
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
                    let soul;// = root._.soul.slice(0,1);
                    //console.log(SEA.opt.pub(root._.soul));
                    soul=SEA.opt.pub(root._.soul);
                    //let to = gun.user(soul);
                    let to = root;//user root graph
                    let enc1 = await to.get('trust').get(pair.pub).get(path).then();
                    let epub = await to.get('epub').then();
                    let mix = await SEA.secret(epub, pair);
                    let key = await SEA.decrypt(enc1, mix);
                    let enc2 = await gun.then();
                    //enc2 = "SEA"+ JSON.stringify(enc2);
                    let value = await SEA.decrypt(enc2, key);
                    console.log(value);
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
    
}());