@Lightnet it is this dense code here: https://github.com/amark/gun/blob/master/sea.js#L1143-L1260 , basically each put operation is passed through a series functions that analyze each graph/node/key/value to make sure they are cryptographically valid. If anything is not correct, it acts as a firewall and rejects the data, else it to.next(msg) it into the next middleware adapters. Does this answer your question?

```javascript
//https://gun.eco/docs/API#gun-node-soul-data-
//line 299
//Node.soul
//Node.soul.ify
//

```