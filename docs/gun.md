@Lightnet it is this dense code here: https://github.com/amark/gun/blob/master/sea.js#L1143-L1260 , basically each put operation is passed through a series functions that analyze each graph/node/key/value to make sure they are cryptographically valid. If anything is not correct, it acts as a firewall and rejects the data, else it to.next(msg) it into the next middleware adapters. Does this answer your question?



```
@Lightnet it looks like the owner is ~9-G... but user ~PVO... is trying to write to it.
Just to make sure I haven't confused you or others about the base algorithm for this, remember that:

Alice cannot actually write data on Bob's graph. (This would require a data-dependent wire adapter running on every peer, which does not scale)
So what we do is Alice writes to her graph that Bob is a collaborator.
THEN we load Bob's edit from Bob's graph and merge it ON SCREEN with Alice's data from her graph.
Their data is not actually merged at the storage or wire layer.
This will only work for less than X number of users. For larger than X number of users, a modified approach is needed.

@Lightnet it is the 3rd one ~ but again take note of my comments above, doing it at the wire adapter may not be very interoperable across peers.
```

```
You can pass {'<': 'zach', '-': 1} to have the byte limit go in reverse lexical direction.

Lexical gets are matched based in order of cascading specificness:

= exact match. If {'=': 'key'} is specified, (1 >) will not match.
* prefix match or (2 <) match. If {'*': 'key'} is specified, (2 >) will not match.
> and < match or (3 <) match. If {'>': 'start', '<': 'end'} is specified, (3 >) not matched.
> or < match or (4 <) match. As {'>': 'start'} or {'<': 'end'}.
A > match will already include everything a * matches, this is true and obvious if you think about it in detail. What may not be obvious though is:

Note: > will also match for an = exact match even if = is not listed (if it is, it will overrule >). So {'>': 'alice'} will match 'alice' also, same for <. So think of it as a hierarchy > || (> && <) || * || = or < || (< && >) || * || =.

There is no guarantee a peer will comply with lexical constraints. Just like in real life, if you ask somebody a question, they might answer with additional information. Every peer should enforce the constraint.
```



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


```
Gun.chain.uuid = function(fn){
  (this._.opt = this._.opt || {}).uuid = fn;
  return this;
}

// use:
var gun = Gun();
gun.get('foo').uuid(function(){ return 'spam' }).put({a: {thisNodeShouldBeSpam: true}});
console.log(gun._.graph);
Obviously you'd have the fn return random/whatever IDs, not the same soul.
```

```
var drop = gun.get('*');
drop.on('out', function(msg){
  if(msg.put){ delete msg.put['*'] }
  this.to.next(msg);
});

// use:
drop.put({
 a: Gun.node.ify({foo: 'bar'}, 'a'), // or manually add the soul
 b: Gun.node.ify({bar: 'foo'}, 'b')
})
// view:
console.log(gun._.graph)
so this is a chain adapter versus a wire adapter
```


```
gun.get({'#': {'*': ''}})
```

```
Gun.state.ify({}, 'b', 9, 'c', 'cool'); // node, key, state, value, soul
```

```
@go1dfish if the nodes are related to each other (have edges), that'd work, but I'm guessing probably not. Which case, .put( API won't let you :(, but you can manually write a wire command:

gun._.on('out', {
    put: {
        node1: {_:{'#':'node1','>':{...}},
            hello: "world!"
        },
        node2: {_:{'#':node2','>':{...}},
            hello: "world!"
        }
    }
})
Tho sounds like you're trying to avoid that? There are also a LOT of internal utility functions for constructing/building valid nodes and graphs, would those help?
```

```
Gun.node.soul(this._.graph[Object.keys(this._.graph)[0]])

```

```
(TEAM C) be @Kuirak_twitter @sirpy @Lightnet @mhelander @amark @wfcho211 on new SEA features
(TEAM B) @jussiry @JamieRez @amark etc. on Meta Editor, Music, IDEs
(TEAM A) p2p Uber / AirBnB stuff, etc.

var gun = Gun();
var dam = gun.back('opt.mesh');
dam.hear['yo'] = function(msg, peer){
  console.log('hi', msg);
  //dam.say({dam: 'yo', foo: 'bar'}, peer); // only send back to peer
  //dam.say({dam: 'yo', bar: 'everyone'}); // send to all directly connected peers
}

so replace 'yo' with whatever name you want your RPC module to be, and make sure when you send out messages (which you can do with dam) you have matching dam: 'yo' property, this is what stops the message from flooding into the rest of the network.
DAM is just an adapter for GUN that makes writing transport plugins easy, kinda like RAD is suppose to make storage easy.

or you mean on dam.say( ?
that peer corresponds to the gun.back('opt.peers') list that you pass in from the GUN constructor, often your NodeJS superpeer
so in the browser, with dam.say( (as long as you actually have a DAM set up to block the message on matching type) the message will only send to that neighbor peer (the NodeJS superpeer)

so if you do dam.say({dam: 'rpc-name'}) then it sends to all neighbor peers, if you do dam.say({dam: 'rpc-name'}, refToGunTestPeer) it'll only send to the guntest peer not the other one.
yeah, best to refer to config object
var peers = gun.back('opt.peers')

now those are what are called "up peers"
if you have lib/webrtc.js included in your browser
regardless of the "up peers" you explicitly pass in
you might get connected to other dynamic peers
in which case, the dam.say({...}) without 2nd param would send to all neighbor peers, some of whom might be dynamic from WebRTC
in browser, you're probably not doing this
but in NodeJS
every single browser peer is a dynamic peer

```