

```
https://jsbin.com/zupadojipa/edit?js,console
 * work test.
@Lightnet I made a function recently for @Dletta to make it easier to merge 2 nodes in to 1 new node: https://github.com/amark/gun/blob/master/lib/mix.js

https://gun.eco/docs/User#getting-a-user-via-alias
```

```javascript
//line 792
root.get(tmp = '~'+act.pair.pub).put(act.data); // awesome, now we can actually save the user with their public key as their ID.
root.get('~@'+alias).put(Gun.obj.put({}, tmp, Gun.val.link.ify(tmp))); // next up, we want to associate the alias with the public key. So we add it to the alias list.
```

```javascript
@Lightnet all data yeah is signed with some special stuff, the (1) (2) (3) organization has to do with handling special namespaces in GUN's universal graph.

@Lightnet apologies if I'm light on details this time (gotta run, kids!) but something like user.get('myTrustedFriendsForDocA').get(BobPubKey).put(true) (obviously you'd want better naming structure)
```

```javascript
 GUN has storage adapters for plain files, redis, S3, etc., as long as there are multiple peers connected in the network, GUN will retrieve from multiple machines (even browsers!) directly OR indirectly (daisy chain). So honestly, it doesn't really matter if some of those machines use S3 or not, I don't consider this a problem - this would only be a problem if ALL the machines use S3.
lol, I'm sure it would be easy to add an adapter for some blockchain stuff to, but they're just so slow they'll likely be dropped by DAM (the daisy chain system) because other peers that respond faster.
DAM has this cool internal deduplication mechanism, that if 2 peers in the daisy happen to both reply with the same data, it only chooses the fastest.
TBH, though it might sound tacky, this algorithm was inspired by photon's particle behavior in quantum mechanics.
super old talk of mine on this: https://youtu.be/5BuoDqVxvOM
BBL
```


https://github.com/amark/gun/blob/9ac94db8b3c3ad28dcf59356f44ce56dc4d14a1f/sea.js#L1239

@Lightnet I had it figured out but forgot, let me look at code again

Lightnet @Lightnet 15:11
ok

Jachen Duschletta @Dletta 15:24
the root key is '~pubkey'

Lightnet @Lightnet 15:24
how?
I know that @amark said not sure how setup


gun.get('any'+user._.sea.pub+'keyName').get(something).put(something)
[3:37 PM] Dletta: Then if you are logged in but are not the owner of that path, it will not let you write to it

```javascript
SEA.opt.pub();
Gun.obj.empty(node, '_')
Gun.obj.map(node, each.way, {soul: soul, node: node});

line 792
root.get(tmp = '~'+act.pair.pub).put(act.data); // awesome, now we can actually save the user with their public key as their ID.
root.get('~@'+alias).put(Gun.obj.put({}, tmp, Gun.val.link.ify(tmp)));
```

```javascript
You would have bob.get('sharedData').get('aliceKey').path.put(data) and same on alice side. Then when your UI looks at the data it needs to realize it's shared data with alice and retrieve the same path for both you (bob) and alice and use gun.mix(aliceNode, bobNode) is what the ui shows

No, just a common path, bob in this example is gun.user().get('sharedData')
```

```
let data ="test"
let alice =alice.get('sharedData').get('aliceKey').get('profile').get('alias').put(data)
data ="test2"
let bob = bob.get('sharedData').get('aliceKey').get('profile').get('alias').put(data)

 gun.mix(aliceNode, bobNode)
```

Symmetric, so bob has shareddata/groupkey or shareddata/alice and alice has shareddata/groupkey, shareddata/bob