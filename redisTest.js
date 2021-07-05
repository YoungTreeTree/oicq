const redis = require("redis");
const client = redis.createClient({
    host: '47.100.214.170',
    port: '1233',
    password: process.env.redisPW,
});

client.on("error", function(error) {
    console.error(error);
});

var selected = ['sh600009', 'sh600309'];

client.set("selected", JSON.stringify(selected), redis.print);
//var a = client.get("record", redis.print());
console.log(process.env.redisPW);