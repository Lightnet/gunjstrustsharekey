/*
    Self contain Sandbox Gun Module:
    
    version: 1.0

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
     
    User function encrypt / decrypt key node value prototype.

    Gun:
     - function decryptdata
    
    Gun function decrypt node value prototype.

    Notes:
     - Please note this simple build test. 
     - Not yet tested full if there key are not random hash that just keyword.
     - Not work debug fails and checks.
     - Not tested outside of node key graph beside user root node.

*/
(function() {
    var Gun = (typeof window !== "undefined")? window.Gun : require('../gun');
    
    /*
        //user...grantkey(to);
        let user = gun.user();
        let to = gun.user(publickey);
        user.get('profile').get('alias').grantkey(to);
    */
    function grantkey(to, cb){
        // added new user to key to share current graph key
        console.log("`.grantkey` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //console.log(path);
        (async function(){
            //console.log(gun)
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
        }());
        return gun;
    }
    
    /*
        //- Recreated new salt key to share.
        //- reencrypt key value on new salt
        //user...revokekey(to);
        let user = gun.user();
        let to = gun.user(publickey);
        user.get('profile').get('alias').revokekey(to);
    */
    function revokekey(to, cb){
        // recreated new salt key share current graph key
        console.log("`.revokekey` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //console.log(path);
        if(!to){console.log("to User not set!");}
    
        (async function(){
            let alias = await to.get("alias").then();
            //console.log(alias);
            if(!alias){
                cb({err:'Error alias not found!'});
                return gun;
            }
            //GET Salt Key
            let enc, sec;
            sec = await user.get('trust').get(pair.pub).get(path).then();
            //console.log(sec);
            //sec = "SEA"+ JSON.stringify(sec);
            sec = await SEA.decrypt(sec, pair);
            //console.log(sec);
            let key = await gun.once().then();
            //console.log(key);
            //sec = "SEA"+ JSON.stringify(sec);
            let value = await SEA.decrypt(key, sec);
            //console.log(value);

            // Create New Salt Key
            sec = SEA.random(16).toString();
            //sec = Gun.text.random(16);
            enc = await SEA.encrypt(sec, pair);
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
    
            //encrypt Value
            let v = await SEA.encrypt(value, sec);
            gun.put(v, cb);
            // Remove Salt Key
            //let pub = await to.get('pub').then();
            user.get('trust').get(pub).get(path).put("null", cb);//remove key
        }());
        return gun;
    }
    
    /*
        //user...encryptput(value);
        let user = gun.user();
        user.get('profile').get('alias').encryptput("name");
    */
    function encryptput(data, cb){
        // encrypt key > put value
        console.log("`.encryptput` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //console.log(path);
        (async function(){
            //console.log("path==============",path);
            let enc, sec = await user.get('trust').get(pair.pub).get(path).then();
            //console.log("sec1",sec);
            //sec = "SEA"+ JSON.stringify(sec);
            //console.log("sec2",sec);
            sec = await SEA.decrypt(sec, pair);
            //console.log("MESSAGE:",sec);
            if(!sec){
                //console.log("IF HASH NOT GEN, CREATE IT!");
                sec = SEA.random(16).toString();
                //sec = Gun.text.random(16);
                //console.log("sec RANDOM",sec);
                enc = await SEA.encrypt(sec, pair);
                //console.log("enc",enc);
                user.get('trust').get(pair.pub).get(path).put(enc);
            }
            //console.log("sec=====================",sec);
            //console.log("data",data)
            enc = await SEA.encrypt(data, sec);
            //console.log("enc=============",enc);
            gun.put(enc, cb);
        }());
        return gun;
    }
    /*
        user...decryptvalue(cb);
        let user = gun.user();
        user.get('profile').get('alias').decryptvalue(ack=>{
            //console.log(ack);
        });
    */
    function decryptvalue(cb){
        //get decrypt key to return value
        console.log("`.decryptvalue` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        //console.log(path);
        (async function(){
            let sec = await user.get('trust').get(pair.pub).get(path).then();
            //sec = "SEA"+ JSON.stringify(sec);
            //console.log(sec);
            sec = await SEA.decrypt(sec, pair);
            //console.log("sec===========",sec);
            let key = await gun.then();
            //console.log(key);
            let mvalue = await SEA.decrypt(key, sec);
            //console.log(mvalue);
            cb(mvalue);
        }());
        return gun;
    }
    
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
    function decryptdata(to, cb){
        // gun graph to decrypt key to return value
        console.log("`.decryptdata` PROTOTYPE API MAY BE DELETED OR CHANGED OR RENAMED USE!");
        cb = cb || function(ctx) { return ctx };
        let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
    
        if(!to){
            //cb({err:"User not set!"});
            console.log("User graph net set!");
            return gun;
        }
    
        gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
        (async function(){
            //console.log(path);
            //KEY SALT
            let enc1 = await to.get('trust').get(pair.pub).get(path).then();
            if(!enc1){
                console.log("Error Null || Denied!");
                cb(null);
                //console.log("KEEP GOING?");
                return gun;
            }
            //var enc1 = await user.get('trust').get(publickey).get(path).then(); // nope
            //console.log(enc1);
            //enc1 = "SEA"+ JSON.stringify(enc1);
            //console.log(enc1);
            let epub = await to.get('epub').then();
            //console.log(epub);
            //PAIR SHARE
            let mix = await SEA.secret(epub, pair);
            //console.log(dh);
            //KEY SHARE
            let key = await SEA.decrypt(enc1, mix);
            //console.log(key);
            //VALUE
            let enc2 = await gun.then();
            //console.log(enc);
            enc2 = "SEA"+ JSON.stringify(enc2);
            //console.log(enc);
            //console.log(gun);
            let dvalue = await SEA.decrypt(enc2, key);
            //console.log(dvalue);
    
            cb(dvalue);
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