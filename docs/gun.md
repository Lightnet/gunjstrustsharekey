@Lightnet it is this dense code here: https://github.com/amark/gun/blob/master/sea.js#L1143-L1260 , basically each put operation is passed through a series functions that analyze each graph/node/key/value to make sure they are cryptographically valid. If anything is not correct, it acts as a firewall and rejects the data, else it to.next(msg) it into the next middleware adapters. Does this answer your question?


```javascript
ct: "..."
iv: "..."
s: "..."
~@publickey1:{'#': ~@publickey1}
~@publickey2:{'#': ~@publickey2}
_:{...}
//NO! Mismatched owner on 'ct'.
//TypeError: Cannot read property 'byteLength' of undefined
```

```
NO! Mismatched owner on '~@9-G4ik7HIgSGPGNVXGRSFuyiKJlTHcK_rXTaLo6OP7U.iQMMteCq_oF4LQ1a_eTc0RRDi8cx8y9z3Cd0DCwH5Js'. 
{jzdp9gczM8IwbnDJ8lK1~PVOu0a-TWhG87KzVBQFwUBo2GHaf2UYLbrg1xx7abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.: {…}, jzbc3vhfh7HWXQi7vzMp~PVOu0a-TWhG87KzVBQFwUBo2GHaf2UYLbrg1xx7abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.: {…}}
jzbc3vhfh7HWXQi7vzMp~PVOu0a-TWhG87KzVBQFwUBo2GHaf2UYLbrg1xx7abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.:
alias: {#: "jzdp9gczM8IwbnDJ8lK1~PVOu0a-TWhG87KzVBQFwUBo2GHaf2…abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68."}
_: {#: "jzbc3vhfh7HWXQi7vzMp~PVOu0a-TWhG87KzVBQFwUBo2GHaf2…abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.", >: {…}}
__proto__: Object
jzdp9gczM8IwbnDJ8lK1~PVOu0a-TWhG87KzVBQFwUBo2GHaf2UYLbrg1xx7abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.:
sea: "SEA{"ct":"e9guh94pL204xIi9mfQXfjVT","iv":"9QI9vPvyKN7iGOgcZKBy","s":"4E7AalV/OHpJ"}"
~@9-G4ik7HIgSGPGNVXGRSFuyiKJlTHcK_rXTaLo6OP7U.iQMMteCq_oF4LQ1a_eTc0RRDi8cx8y9z3Cd0DCwH5Js: {#: "~@9-G4ik7HIgSGPGNVXGRSFuyiKJlTHcK_rXTaLo6OP7U.iQMMteCq_oF4LQ1a_eTc0RRDi8cx8y9z3Cd0DCwH5Js"}
_: {#: "jzdp9gczM8IwbnDJ8lK1~PVOu0a-TWhG87KzVBQFwUBo2GHaf2…abug.g3wrGN95U_AuhJNB-4plgMyJzVkO0dph2dRhipAUj68.", >: {…}}
__proto__: Object
__proto__: Object
```



```
@Lightnet oh, odd, you shouldn't be able to write to that object with ct/iv/s on it, because that is the cryptography "packet" that is parsed out of GUN. Try adding the pubkeys to the node instead. To differentiate: {foo: "SEA{ct:'...',iv:'...',s:'...'}", bar: "SEA{ct:'...',iv:'...',s:'...'}"}both foo and bar are properties, the ct/iv/s records on them are atomic values, they should not be able to add to/modify them, only the node with foo and bar that you could add another property along side.
```

```
gun.get('stores').map((store) => {
        if (store.name === app.name) {
          app.errors.name = 'Store with this name already exists!'
          app.disabled = true
        } else {
          app.disabled = false
        }
      })
```

```javascript
//https://gun.eco/docs/API#gun-node-soul-data-
//line 299
//Node.soul
//Node.soul.ify
//

```

```javascript
localStorage.clear();
var gun = Gun();

gun.get('mark').put({
  name: "Mark",
  email: "mark@gunDB.io",
});

gun.get('mark').on(function(data, key){
  //console.log("update:", data);
});

let g = gun.get('mark').map().once(function(data, key){
  //console.log(data)
  //console.log(key)
});
//console.log(g);

g = gun.get('mark');
let each={}
each.nodetest = function(node, soul){
  console.log("node",node);
  console.log("soul",soul);                  
};
console.log(g)
Gun.obj.map(g._.put, each.nodetest);
```