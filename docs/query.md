```javascript
//localStorage.clear();
//https://gun.eco/docs/RAD

var gun = Gun();

function DateStamp(){
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  
  let hour = dateObj.getUTCHours();
  let minute = dateObj.getUTCMinutes();
  let second = dateObj.getUTCSeconds();
  let millisecond = dateObj.getUTCMilliseconds();
  
  let newdate = year + "/" + month + "/" + day + ":" + hour + ":" + minute + ":"  + second + ":" + millisecond;
  console.log(newdate);
  return newdate;
  //return Date.now();
}

//gun.get('sharedata').get(DateStamp()).put({pub:"test1"})
/*
gun.get('sharedata').get(DateStamp()).put({pub:"test2"})
gun.get('sharedata').get(DateStamp()).put({pub:"test3"})
gun.get('sharedata').get(DateStamp()).put({pub:"test4"})
gun.get('sharedata').get(DateStamp()).put({pub:"test5"})
gun.get('sharedata').get(DateStamp()).put({pub:"test6"})
gun.get('sharedata').get(DateStamp()).put({pub:"test6"})
*/
//gun.get('sharedata').get(DateStamp()).put({pub:"test6"});
//console.log(Date.now())
//setTimeout(()=>{
let strtime = DateStamp()+"";
  
let dateObj = new Date();
let month = dateObj.getUTCMonth() + 1; //months from 1-12
let day = dateObj.getUTCDate();
let year = dateObj.getUTCFullYear();
strtime = year + "/" + month + "/" + day;

function getdata(){
  console.log("=============================test");
  gun.get('sharedata')
  //.get({'.': {'>': '*', '-': 1}})
  //.get({'.': {'>': '*', '-': 1}, '%': 1})
  //.get({'.': {'>': strtime, '-': 1}, '%': 1})
  //.get({'.': {'>': strtime, '-': 0}, '%': 100})
    .get({'.': {'>': strtime, '-': 1}, '%': 1})
    .once()
    .map()
    .once((data,key)=>{
    console.log("DATA:", data);
    console.log("KEY:", key);
  });
}

getdata();


//},1000);
//https://jsbin.com/yoyagoqiba/1/edit?js,console

```

```javascript
//localStorage.clear();
//https://gun.eco/docs/RAD

var gun = Gun();

function DateStamp(){
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  
  let hour = dateObj.getUTCHours();
  let minute = dateObj.getUTCMinutes();
  let second = dateObj.getUTCSeconds();
  let millisecond = dateObj.getUTCMilliseconds();
  
  
  let newdate = year + "/" + month + "/" + day + ":" + hour + ":" + minute + ":"  + second + ":" + millisecond;
  console.log(newdate);
  return newdate;
  //return Date.now();
}
/*
gun.get('sharedata').get(DateStamp()).put({pub:"test1"})
gun.get('sharedata').get(DateStamp()).put({pub:"test2"})
gun.get('sharedata').get(DateStamp()).put({pub:"test3"})
gun.get('sharedata').get(DateStamp()).put({pub:"test4"})
gun.get('sharedata').get(DateStamp()).put({pub:"test5"})
gun.get('sharedata').get(DateStamp()).put({pub:"test6"})
gun.get('sharedata').get(DateStamp()).put({pub:"test6"})
*/
//gun.get('sharedata').get(DateStamp()).put({pub:"test6"})
//console.log(Date.now())
//setTimeout(()=>{
let strtime = DateStamp()+"";
  
let dateObj = new Date();
let month = dateObj.getUTCMonth() + 1; //months from 1-12
let day = dateObj.getUTCDate();
let year = dateObj.getUTCFullYear();
strtime = year + "/" + month + "/" + day;
 
gun.get('sharedata')
  //.get({'.': {'>': '*', '-': 1}})
  //.get({'.': {'>': '*', '-': 1}, '%': 1})
  .get({'.': {'>': strtime, '-': 1}, '%': 1})
  //.get({'.': {'<': strtime, '-': 1}, '%': 1})
  //.get({'.': {'>': strtime, '-': 0}, '%': 1})
  .once()
  .map()
  .once((data,key)=>{
    console.log("DATA:", data);
    console.log("KEY:", key);
    //gun.get(data["_"]["#"]).on((da, ke, at, ev)=>{
      //gun.get(data["_"]["#"]).off();
      //console.log("da:",da);//get time stamp data
    //})
  })
//},1000);
```

//https://jsbin.com/ziwihuyaji/2/edit?js,output