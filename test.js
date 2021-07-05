"use strict";
const crypto = require("crypto");
const oicq = require("./index");
const request = require('superagent')
require('superagent-charset')(request)


const redis = require("redis");
const client = redis.createClient({
    host: '47.100.214.170',
    port: '1233',
    password: process.env.redisPW,
});

client.on("error", function(error) {
    console.error(error);
});

var num = process.argv[2];
var pw = process.argv[3];

var bot = oicq.createClient(num, {
    log_level: "debug", ignore_self: false
});
const password_md5 = crypto.createHash("md5").update(pw).digest();

bot.login(password_md5);

var whiteListGroup = [698599584, 857448829];

var stockReg= /var hq_str_.*?="(.*?),\d*?\.\d*?,\d*?\.\d*?,(.*?),.*"/;

bot.on('message.group', (data)=>{
    if (whiteListGroup.indexOf(data.group_id) > -1 && data.user_id != 474470571){
        if (data.raw_message == '加班'){
            if (data.user_id != 1620644350) {
                record[data.user_id] = {
                    userName: data.sender.title || data.sender.card ? data.sender.card : data.sender.nickname,
                    startTime: Date.now(),
                }
                client.set("record", JSON.stringify(record));
                var message = '';
                for (var i in record){
                    message += record[i].userName + " "+ ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
                }
                bot.sendGroupMsg(data.group_id, message);
            } else {
                bot.sendGroupMsg(data.group_id, `${data.sender.title || data.sender.card ? data.sender.card : data.sender.nickname} 不许加班！！`);
            }
        }
        if (data.raw_message == '下班'){
            delete record[data.user_id];
            client.set("record", JSON.stringify(record));
            var message = '';
            for (var i in record){
                message += record[i].userName + " "+ ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
            }
            bot.sendGroupMsg(data.group_id, message);
        }
        if (data.raw_message == '汇报'){
            var message = '';
            for (var i in record){
                message += record[i].userName + " "+ ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
            }
            bot.sendGroupMsg(data.group_id, message);
        }
        if (data.raw_message && (data.raw_message.startsWith('sz') || data.raw_message.startsWith('sh'))){
            request.get(`http://hq.sinajs.cn/list=${data.raw_message}`)
                .charset('GB18030')
                .end(function(err,res) {
                    if (!err) {
                        var reqs = stockReg.exec(res.text);
                        if (reqs) {
                            bot.sendGroupMsg(data.group_id, `${reqs[1]} ${reqs[2]}`);
                        }
                    }
                });
        }

        if (data.raw_message == '自选' || data.raw_message == '送钱'){
            var message = '';
            var url = 'http://hq.sinajs.cn/list=';
            for (let i = 0; i < selected.length; i++) {
                url += `${selected[i]},`
            }
            request.get(url)
                .charset('GB18030')
                .end(function(err,res) {
                    if (!err) {
                        for (const text of res.text.split(';')) {
                            var reqs = stockReg.exec(text);
                            if (reqs) {
                                message += `${reqs[1]} ${reqs[2]}\n`;
                            }
                        }
                        bot.sendGroupMsg(data.group_id, message);
                    }
                });
        }
    }
});

var record = {}

var selected = [];

client.get("record", function(err, value) {
    if (err) throw err;
    record = JSON.parse(value);
});


client.get("selected", function(err, value) {
    if (err) throw err;
    selected = JSON.parse(value);
});