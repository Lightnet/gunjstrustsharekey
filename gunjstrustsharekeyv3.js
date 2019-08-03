/*
    Self contain Sandbox Gun Module:
    Created by: Lightnet
    License: MIT
    Version: 3.0
    Credit: amark ( https://github.com/amark/gun)

    Gun Notes:
     * Work in progress
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
            let enc, sec;
            if(sharetype == "user"){
                sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
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
        }());
        return gun;
    }

    function decryptvalue( cb, opt){
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
                let sec = await user.get('trust').get(pair.pub).get(path).then();
                sec = await SEA.decrypt(sec, pair);
                let key = await gun.then();
                let value = await SEA.decrypt(key, sec);
                cb(value);
            }
        }());
        return gun;
    }

    function decryptdata(to, cb, opt){
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
        if(!to){
            cb({err:"User not set!"});
            console.log("User graph net set!");
            return gun;
        }
        if (gun._.$ instanceof Gun.User){//check gun node is user object
            sharetype = opt.sharetype || "user";
        }else{
            sharetype = opt.sharetype || "gun";
        }
        (async function(){
            if(sharetype == "user"){
                let enc1 = await to.get('trust').get(pair.pub).get(path).then();
                if(!enc1){
                    console.log("Error Null || Denied!");
                    cb(null);
                    //console.log("KEEP GOING?");
                    return gun;
                }
                let epub = await to.get('epub').then();
                let mix = await SEA.secret(epub, pair);
                let key = await SEA.decrypt(enc1, mix);
                let enc2 = await gun.then();
                //enc2 = "SEA"+ JSON.stringify(enc2);
                let value = await SEA.decrypt(enc2, key);
                cb(value);
            }

        }());
        return gun;
    }
    //SETUP FUNCTION for GUN
    Gun.chain.grantkey = grantkey;
    Gun.chain.revokekey = revokekey;
    Gun.chain.encryptput = encryptput;
    Gun.chain.decryptvalue = decryptvalue;
    Gun.chain.decryptdata = decryptdata;
}());