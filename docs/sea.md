

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