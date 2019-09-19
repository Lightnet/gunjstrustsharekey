https://gun.eco/docs/Cartoon-Cryptography


```
@Lightnet each.pub case handles user profiles (the root of the profile: the public key).
so that is basically when pubkey === pubkey basically (probably + a ~)
```

```javascript
let user = gun.user();
let pub = user.is.pub;
let sec = await SEA.work('foo', 'bar');
let enc = await SEA.encrypt('shared data',sec);
user.get('sharedata').get(pub).get('token').put(enc);

//var to_pair = await SEA.pair(); //random generate keys
//to_pub = to_pair.pub; //example user._.sea  == to_pair;
let publickey = "";
let to = gun.user(publickey);
let pubshare = to.get('sharedata').get(pub).get('token').once();

```

```javascript
//nope idea
user.get('sharedata').get('token').put(enc);

let pub = user.is.pub;
let to = gun.user(publickey);
let sec = await SEA.work('foo', 'bar');
let enc = await SEA.encrypt('shared data',sec);
user.get('sharedata').get('pub'+pub+'token').put(enc);
user.get('sharedata').get('pub'+to.pub+'token').put(enc);
user.get('sharedata').get('user'+to.pub+'token').put(true);

```

```javascript
@Dletta  @amark @lightnet
This is my easiest setup for a quick and dirty mix function.
The output is added below:
me 
Object { _: {…}, is: {…} }

bob 
Object { _: {…} }

me 
Object { _: {…}, name: "hello" }

bob 
Object { _: {…}, name: "world" }
async function getLatest (path,pubkeyOther) {
  var path = path;
  var refMe = gun.user();
  var refBob = gun.user(pubkeyOther);
  console.log('me', refMe);
  console.log('bob', refBob);
  while(path.length>0){
    var step = path.shift();
    refMe = refMe.get(step);
    refBob = refBob.get(step);
  }
  var me = await refMe.promOnce();
  console.log('me', me.data);
  var bob = await refBob.promOnce();
  console.log('bob', bob.data);
  return Gun.state.node(me.data, bob.data);
}

Jachen Duschletta @Dletta 21:33
If you keep a list of pubkeys you are collaborating with you can loop over, gather each result and then call Gun.state.node on two results at a time until all results have been compared to each other to return the latest update performed
```

```javascript
me //user root
Object { _: {…}, is: {…}, 
    pubs{
        {bob(public key),path{write:true}}//public , path <-check || null to stop writable
    }
}

bob //user root
Object { _: {…} }

me // user name graph
Object { _: {…}, name: "hello" }

bob // user name graph
Object { _: {…}, name: "world" }
```

```
var array = [];
gun.user().get('pubs').map().once((data, key)=>{
array.push(await getLatest(path, data))
})
then the array needs to be compared
array[1] -> array[2] = Gun.node.state(array[1], array[2]) => 12
array[3] -> array[4] = Gun.node.state(array[3], array[4]) => 34
//later
12 -> 34 = Gun.node.state(array[12], array[34])
etc
until last is responded

Lightnet @Lightnet 22:19
oh right there map list loading checks i guess need to account the delay checks
```