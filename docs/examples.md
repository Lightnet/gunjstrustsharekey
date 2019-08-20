```html
<script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
```
# Setup Gun
```javascript
var gun = Gun();
```

```javascript
var gun = Gun("http://localhost/gun");
```

```javascript
var gun = Gun(["http://localhost/gun","http://localhost/gun2"]);
```

```javascript
var gun = Gun({peers:["http://localhost/gun","http://localhost/gun2"]});//peer to peers?
```

```javascript
gun.get('@pp').put({name:"test1"});
const app = gun.get('@pp');
//{ "#": "somesoul" }
console.log(app);
app.then(data =>{
    console.log(data);
});
```
# Map list
```html
    <script src="https://cdn.jsdelivr.net/npm/gun/lib/radix.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gun/lib/radisk.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gun/lib/store.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gun/lib/rindexed.js"></script>
```

```javascript
//https://gun.eco/docs/RAD
//gun.get('testlist').set({name:"test"});
//key and data list
gun.get('testlist').get({'.':{'>':'a'},'%': 50000}).once(function(data,key){
    console.log(data)
    console.log(key)
});
//map list key and data json
gun.get('testlist').get({'.':{'>':'a'},'%': 50000}).map().once(function(data,key){
    console.log(data)
    console.log(key)
});
//there some different how get map list on key id or json object

//This does not work since it name space only the child node works
gun.get({'.':{'>':'*'},'%': 50000}).map().once(function(data,key){
    console.log(data)
    console.log(key)
});
```

