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