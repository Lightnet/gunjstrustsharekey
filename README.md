# gunjstrustsharekey

## Create by: Lightnet

## Credit:
 * Amark (https://github.com/amark/gun)

## License: MIT

## Status:
 * User function dis/trust (work in progress).
 * Nodejs (Not working atm)
 * Browser (Working)
 * v3 work in progress.

## To Do List:
 * Debug and errors check keys.
 * Need detail Docs.
 * Clean Up script.

## Information:
  This is just Gun chain share key, trust writable key, and encryption setup functions.

  Seajs has some basic call functions login/register user access for graph node to work with the script in gun chain calls. Each user graph can't be written but it can be read only.
  
  Once user login to their owning graph node that they can read, write, and edit. But can't edit other user graph node and read only. You can reference the user node. gun.user('public key').
  
  To grant and revoke owner user key graph node for users that has permission read only access data. There are some basic function calls to add and remove permission to users from owner root access. It used map table list that the owner has right top level graph access.
 
  The distrust and trust function is to allow owner user key graph grant access users write or edit key graph owner data value on reference graph node and path. As well encrypt put and decrypt once key value to encode and decode owner as well other user but permission access read and write. It used the graph table. As well users graph nodes to get the latest graph path data store.

  Please note this script is test simple functions.
 
 To learn how SEA.js (Security Encryption Authorization ) that works with gun.js.

 * https://gun.eco/docs/SEA

## Gun chain Features: 

User / Gun functions:
 - function grantkey (to allow owner user access to key graph value for other users. Check and create salt keys)
 - function revokekey (to owner revoke user access to key graph for user. Note it will break salt key if share with other users.)
  - Recreate new salt key and reencrypt value.(This break other salt keys are shared.)
 - function encryptput put value (allow owner user to encrypt key value when creating and check salt key)
 - function decryptvalue return value (allow owner user to decrypt key value)
 - function decryptdata (to allow other user to decrypt key value/data from gun or sea but not self)
  - `let to = gun.user(public key)`
 - function decryptonce (v3) (to allow other user to decrypt key value/data from user not gun.get('namespace'))


## Http server features:
 * Note sea.js is used encryption functions as well base user access graph.
 * Profile to create/edit alias name to encrypt string example.
 * Forgot passphrase hint example.
 * Add/remove contacts example.
 * Private message encrypt example.
 * Public Chat encrypt example.
 * Change passphrase example.
 * Passphrase hint example.
 * Private Chat example. (WIP)

## Install and Run:

command line:

```
  npm install
  npm start
```

## Design & Guide:
 gun.js is database graph. By using namespace graph to check type object reason is typescript code langugae need to check types. Gun key graph root is need to create unique key or id on namespace root graph to identify as json object.

 ```javascript
  //json object
  gun.get('test').put({foo:"bar"}) //new data
  gun.get('test').put({test:"bar"}) //new data merge 

  gun.get('foo').put({foo:'bar'})

  gun.get('random-id-key').put({foo:'bar'})

  gun.get('namespace-root').put({foo:'bar'})

 ```
 By default keys are generate by uuid to kept the database record revision key and value. If there another json or array it will create keys.

 sea.js addon layer of gun.js to build encrytion, security, and authorization. You can use gun or gun.user() for graph. But note if using gun graph for encrytion will not work since it filter on user is verify if user is login to write check root graph.
 
 To create share key to need to add sea.js to client browser.

 ```html
  <!--...-->
  <head>
  <!-- Required -->
  <script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
  <!-- optional -->
  <script src="https://cdn.jsdelivr.net/npm/gun/lib/then.js"></script>
  <!-- Required -->
  <script src="https://cdn.jsdelivr.net/npm/gun/sea.js"></script>
  </head>
  <!--...-->
 ```
  sea.js is add to gun.js for Security, Encryption, & Authorization - SEA. The reason is simple that encrypt and decrypt will not work when trying to read data without sea.js script to run correctly.

 https://gun.eco/docs/SEA

 Sea functions:
 ```
  SEA.pair()
  SEA.encrypt
  SEA.sign
  SEA.verify
  SEA.decrypt
  SEA.work
 ``` 

 Sea User functions:

 https://gun.eco/docs/User

```javascript
let user = gun.user();
//login
user.auth($('#alias').val(), $('#passphrase').val(),(ack)=>{
    if(ack.err){//check if error object exist will show
      console.log(ack.err);
    }else{//else it login
      console.log(ack);
      let pair = ack.sea;
    }
});

//create user
user.create($('#alias').val(), $('#passphrase').val(),(ack)=>{//create user and 
  if(ack.err){
    console.log(ack.err);//if user exist or error
  }else{
    console.log(ack);//pass if created
  }
});

user.leave(opt, cb); //does not work, not yet implementation
user.delete(alias, pass, cb) //does not work, not yet implementation
user.recall({sessionStorage:true}, cb) // work

user.trust(user) // not yet implementation
user.grant(user) // work
user.secret(value) // work
user.alive() // work ?
gun.user(publicKey).once(console.log)//get user data graph.
```

 Using the simple example gunjstrustsharekeyv1.js. To create those will need gun/lib/then for it work. One reason is to return value or data.

 It base on user root graph of sea.js. It is prevent write data but only user who login and access to read and write. For other user who can only read data if encrypt or not encrypt data. By using sea.js add layer of gun.js package npm or url package cdn.

 Example:

 ```javascript
  var gun = Gun();
 ```

 ```javascript
  //note user has to be created and login to work correct
  let user = gun.user();//current user that is login
  user.get('profile').put({foo:"bar"}); //edit and write
 ```

 ```javascript
  //need to create another user to work correctly.
  let to = gun.user('user-public-key'); //user read only
  to.get('profile').put({foo:"bar"}); //denied write not owner
 ```
 The graph sea.js create and auth has node security checks to prevent imposter editing it. But there is public access to read, write, edit, and delete(you can null them only for record history version). You can allow user to edit the owning user with permission with trust function (not yet implementation).

```javascript
 gun.get('namespace').get('child').put({foo:"bar"})
```

```javascript
  let user = gun.user();
  user.get('profile').put({foo:"bar"});
 ```

## Map/List
 gun has simalar to javascript object when getting key and value.

### object json
```javascript
var o={foo:"bar"}; //json object
for(let i in o){
  //key
  console.log("key ",i);
  //value
  console.log("value ",o[i]);
}
```
### gun json
```javascript
gun.get('o').put({foo:"bar"}); //json object
gun.get('o').map().once(function(value, key){
  console.log("value",value);
  console.log("key",key);
});
```
### gun set() function
```javascript
gun.get('o').set({foo:"bar"});
//by default key generate string text uuid
//by using map() to list key and data
gun.get('o').map().once(function(value, key){
  console.log("value",value);//{foo:"bar"}
  console.log("key",key);//key generate string text uuid
});
```

It be used as trust keys and public keys that store who own user root.

```
  user (root)(login)
    (trust) (map list)
      (user public key)
        (graph path )
          (data store)
  user (root)
    (public key)
      (path)
        (data)
  user (root)
    (public key)
      (path)
        (data)
  user (root)
    (public key)
      (path)
        (data)
```
  This how data is access. Login owner has right to edit but can't edit other users but reference them.


```javascript
async function createsharekeyy(){
  let user = gun.user();
  let pair = user._.sea;
  let enc,sec;
  //check if user create share key
  sec = user.get('privatechatroom').get('randomid').get('pubs').get(pair.pub).then();
  //if doesn't exist create share key
  if(!sec){//if key is null
    sec = Gun.text.random();
    //need to encode
    enc = await SEA.encrypt(sec, pair);
    //ownin user store encrypt data
    user.get('privatechatroom').get('randomid').get(pair.pub).put(enc);
  }
  sec = await SEA.decrypt(sec, pair);
  console.log(sec);
}
```
This setup share key for self.

```javascript
async function sharekey(to,cb){
  let user = gun.user();
  let pair = user._.sea;
  let enc,sec;
  //check if user create share key
  sec = user.get('privatechatroom').get('randomid').get('pubs').get(pair.pub).then();
  //if doesn't exist create share key
  if(!sec){//if key is null
    sec = Gun.text.random();
    //need to encode
    enc = await SEA.encrypt(sec, pair);
    //ownin user store encrypt data
    user.get('privatechatroom').get('randomid').get(pair.pub).put(enc);
  }
  sec = await SEA.decrypt(sec, pair);
  //setup variable
  let pub = await to.get('pub').then();
  let epub = await to.get('epub').then();
  //create secret code to and user to hash code
  let dh = await SEA.secret(epub, pair);
  // encode hash
  enc = await SEA.encrypt(sec, dh);
  //store to user to owner user graph
  user.get('privatechatroom').get('randomid').get('pubs').get(pub).put(enc, cb);
  console.log(sec);
}
```
This same setup but with grant other user for share key setup added.

work in progress...

## Grant and Revoke access functions:
 To grant and revoke access to users to read and write graph node. It used prefix name in the graph node, pathing and user root graph data.

```javascript
 user.get('grant').get('publickey').get('path').put('data');
```
  Only the owner has right to dis/allow access for read and write users.
```javascript
  // owner
  // namespace user
  // gun chain function
  //...
  let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
  gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
  //..
  user.get('grant').once().map().once(async (data,mkey)=>{//grant users
    if(data[path]){//check if path exist as well trust user
      //path graph
    }
  });
```
  The reason there map is that path is store in owner path graph. It make sure that grant prefix name has right access to user to read from owner. Users have to write this own graph node to be write able. But depend on the coding it be used on gun graph node.

```javascript
  // owner reference
  // namespace gun
  // gun chain function
  //...
  let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
  gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
  //...
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
    let pub = await to.get('pub').then();
    let mix = await SEA.secret(epub, pair);
    let pkey = await SEA.decrypt(enc1, mix);
    console.log(pkey);
    //...
  }
```
  When using the namespace on gun is tricky.

## Trust functions:
  It is base on grant and revoke access. It to add on to able to allow users to write new keys. It deal with the which graph is the latest node by the users. But it will require promise delay time to query and compare graph latest node. Since there no indexing list in graph. In case of someone trying to access to key. It will generate new key.
```javascript
 user.get('trust').get('publickey').get('path').put('data');  //list of user trust of path data graph
 user.get('key').get('publickey').get('path').put('data');    //store key

 let to = gun.user('publickey'); // reference user of owner read only
 to.get('key').get('public').get('path').once((ack)=>{
   console.log(ack);//data
 });
```


```javascript
  // owner reference
  // namespace gun
  // gun chain function
  //...
  let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
  gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
  //...
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
    let pub = await to.get('pub').then();
    let mix = await SEA.secret(epub, pair);
    let pkey = await SEA.decrypt(enc1, mix);
    console.log(pkey);
    //...
    to.get('trust').once().map().once(async (data,mkey)=>{//grant users
      if(data[path]){//check if path exist as well trust user
        let topub = gun.back(-1).user(mkey); //user public key
        //user data / get owner key
        topub.get('key').get(pub).once(async (Adata,Akey)=>{
          if( Adata['_']['>'][path] >= cat.timegraph){
            cat.timegraph = Adata['_']['>'][path];
            //...
          }
        });
      }
    });
  }
```
  The code above is does get the latest graph node. But require promise to work when doing to callback onces.

```javascript
  let gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
  gun.back(function(at){ if(at.is){ return } path += (at.get||'') });
  //...
  let promise = new Promise(function(resolve, reject) {
    let key;
    function setkey(_key){
      key = _key;
    }
    function getkey(_key){
      return key;
    }
    // add for wait time before it exit the promise
    // It depend on how many users before timeout
    setTimeout(() => resolve(getkey()), 1000); //1 second
    to.get('trust').once().map().once(async (data,mkey)=>{//trust users list
      if(data[path]){//check if path exist as well trust user
        let topub = gun.back(-1).user(mkey); //user public key
        //user data / get owner key
        topub.get('key').get(pub).once(async (Adata,Akey)=>{ // data
          if( Adata['_']['>'][path] >= cat.timegraph){ //timestamp
            cat.timegraph = Adata['_']['>'][path]; //update the timestamp
            let Bdata = await SEA.decrypt(Adata[path], pkey); //decode key
            console.log(Adata['_']['>'][path], Bdata);
            setkey(Bdata);
          }
        });
      }
    });
  });

  promise.then(
  function(result) { 
    /* handle a successful result */ 
    console.log(result);
    console.log("done here!");
    cb(result); //callback to top
  },
  function(error) { /* handle an error */ }
  );

```
THe code above will wait for the promise before timeout when variable store. It will get the latest graph node. It will do once callback.

