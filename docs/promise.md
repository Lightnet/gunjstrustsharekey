https://jsbin.com/jafahutege/edit?js,output

```javascript
let promise = new Promise(function(resolve, reject) {
  // executor (the producing code, "singer")
  let ii = 0;
  setTimeout(() => resolve(ii), 1000);
  for(let i =0;i < 100000000;i++){
    //resolve(i);
    ii = i
  }
  
});

promise.then(
  function(result) { 
    /* handle a successful result */ 
    console.log(result)
    console.log("done");
  },
  function(error) { /* handle an error */ }
);
```