const redis = require("redis");
const client = redis.createClient({
    host: '47.100.214.170',
    port: '1233',
    password: process.env.redisPW,
});

client.on("error", function(error) {
    console.error(error);
});

var selected = ['sh600009', 'sh600309','sh601899','sh600031'];
selected.push('sz002008');
console.log(selected);
var index = selected.indexOf('sz002008');
if ( index > -1) {
    selected.splice(index,index)
}
console.log(selected);
/*
client.set("selected", JSON.stringify(selected), redis.print);
//var a = client.get("record", redis.print());
console.log(process.env.redisPW);*/
