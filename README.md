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
 This is just Gun chain share key, trust writable key, and encryption setup functions. To grant and revoke owner user key graph for users access to able to read data value for share key access. To used share key to write encrypt data for other can only read. The distrust and trust function is to allow owner user key graph grant access users write or edit key graph owner data value. As well encryptput and decryptonce key value to encode and decode owner as well other user but permission access read and write.
 
 To learn how SEA.js 
 (Security Encryption Authorization ) that works with gun.js.

 * https://gun.eco/docs/SEA

## Features: 
```
User / Gun functions:
 - function grantkey (to allow owner user access to key graph value for other users. Check and create salt keys)
 - function revokekey (to owner revoke user access to key graph for user. Note it will break salt key if share with other users.)
  - Recreate new slat key and reencrypt value.(This break other salt keys are shared.)
 - function encryptput put value (allow owner user to encrypt key value when creating and check salt key)
 - function decryptvalue return value (allow owner user to decrypt key value)
 - function decryptdata (to allow other user to decrypt key value/data from gun or sea but not self)
  - `let to = gun.user(public key)`
 - function decryptonce (v3) (to allow other user to decrypt key value/data from user not gun.get('namespace'))
```

## Design & Guide:
 gun.js is database graph. By using namespace graph to check type object. That is need to create unique key or id on namespace root graph to identify as json object.

 ```javascript
  //json object
  gun.get('test').put({foo:"bar"}) //new data
  gun.get('test').put({test:"bar"}) //new data merge 

  gun.get('foo').put({foo:'bar'})

  gun.get('random-id-key').put({foo:'bar'})

  gun.get('namespace-root').put({foo:'bar'})

 ```
 By default keys are generate by uuid to kept the database record revision key and value. If there another json or array it will create keys.
 
 To create share key to need to add sea.js to client browser.

 ```html
  ...
  <head>
    <!-- Required -->
  <script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
    <!-- optional -->
  <script src="https://cdn.jsdelivr.net/npm/gun/lib/then.js"></script>
    <!-- Required -->
  <script src="https://cdn.jsdelivr.net/npm/gun/sea.js"></script>
  </head>
  ...
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

 Using the simple example gunjstrustsharekeyv1.js. To create those will need gun/lib/then for it work. One reason is to return value or data.

 It base on user root access. It is prevent write data but only user who login and access to read and write. For other user who can only read data if encrypt or not encrypt data. By using sea.js from gun.js package npm or url package cdn.

 Example:

 ```javascript
  let user = gun.user();//current user that is login
  user.get('profile').put({foo:"bar"}); //edit and write
 ```

 ```javascript
  let to = gun.user('user-public-key');//user read only
  to.get('profile').put({foo:"bar"});//denied write not owner
 ```
 The graph sea.js create and auth has key checks to prevent imposter editing it. But there is public access to read, write, edit, and delete. That is beside user.js is gun.js.

```javascript
 gun.get('namespace').get('child').put({foo:"bar"})
```

```javascript
  let user = gun.user();
  user.get('profile').put({foo:"bar"});
 ```

## Map/List
 gun has simalar to javascript object when getting key and value.

```javascript
var o={foo:"bar"}; //json object
for(let i in o){
  //key
  console.log("key ",i);
  //value
  console.log("value ",o[i]);
}
```

```javascript
gun.get('o').put({foo:"bar"}); //json object
gun.get('o').map().once(function(value, key){
  console.log("value",value);
  console.log("key",key);
});
```

It be used as trust keys and public keys that store who own user root.

work in progress...