"use strict";
const crypto = require("crypto");
const oicq = require("./index");
const request = require('superagent')
require('superagent-charset')(request)


const redis = require("redis");
const client = redis.createClient({
    host: '47.100.214.170',
    port: '1233',
    // password: process.env.redisPW,
    password: 'Yq911916',
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

var stockReg= /var hq_str_.*?="(.*?)"/;

const puppeteer = require('puppeteer');


bot.on('message.group', async (data) => {
    if (whiteListGroup.indexOf(data.group_id) > -1 && data.user_id != 474470571) {
        if (data.raw_message == '加班') {
            if (data.user_id != 1620644350) {
                record[data.user_id] = {
                    userName: data.sender.title || data.sender.card ? data.sender.card : data.sender.nickname,
                    startTime: Date.now(),
                }
                client.set("record", JSON.stringify(record));
                var message = '';
                for (var i in record) {
                    message += record[i].userName + " " + ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
                }
                bot.sendGroupMsg(data.group_id, message);
            } else {
                bot.sendGroupMsg(data.group_id, `${data.sender.title || data.sender.card ? data.sender.card : data.sender.nickname} 不许加班！！`);
            }
        }
        if (data.raw_message == 'shx') {
            bot.sendGroupMsg(data.group_id, 'shx yyds');
            return;
        }
        if (data.raw_message == 'fluxia') {
            bot.sendGroupMsg(data.group_id, 'design by shx');
            return;
        }
        if (data.raw_message == 'dali') {
            bot.sendGroupMsg(data.group_id, 'dali');
            return;
        }
        if (data.raw_message == 'cnm') {
            bot.sendGroupMsg(data.group_id, 'cnm cnm cnm cnm');
        }
        if (data.raw_message == '下班') {
            delete record[data.user_id];
            client.set("record", JSON.stringify(record));
            var message = '';
            for (var i in record) {
                message += record[i].userName + " " + ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
            }
            bot.sendGroupMsg(data.group_id, message);
        }
        if (data.raw_message == '汇报') {
            var message = '';
            for (var i in record) {
                message += record[i].userName + " " + ((Date.now() - record[i].startTime) / 1000 / 60).toFixed(2) + "min" + "\n";
            }
            bot.sendGroupMsg(data.group_id, message);
        }
        if (data.raw_message && (data.raw_message.startsWith('sz') || data.raw_message.startsWith('sh'))) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: 2048,
                height: 1080,
                deviceScaleFactor: 1,
            });
            await page.goto('http://quote.eastmoney.com/'+ data.raw_message +'.html#emchart-0');
            await page.screenshot({path: 'example.png'});
            await browser.close();
            bot.sendGroupMsg(data.group_id, `[CQ:image,file=example.png]`);
        }
        if (data.raw_message && (data.raw_message.startsWith('douyu'))) {
            const browser = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:false});
            const page = await browser.newPage();
            await page.setViewport({
                width: 2048,
                height: 1080,
                deviceScaleFactor: 1,
            });
            await page.goto('https://www.douyu.com/' + data.raw_message.split('douyu')[1]);
            await page.waitForTimeout(5000);
            await page.screenshot({path: 'example.png'});
            await browser.close();
            bot.sendGroupMsg(data.group_id, `[CQ:image,file=example.png]`);
        }
        if (data.raw_message && (data.raw_message.startsWith('屁小将'))) {
            const browser = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:false});
            const page = await browser.newPage();
            await page.setViewport({
                width: 2048,
                height: 1080,
                deviceScaleFactor: 1,
            });
            await page.goto('https://www.douyu.com/4496540',);
            await page.waitForTimeout(5000);
            await page.screenshot({ path: 'example.png' });
            await browser.close();
            bot.sendGroupMsg(data.group_id, `[CQ:image,file=example.png]`);
        }
        if (data.raw_message == '自选' || data.raw_message == '送钱') {
            var message = '';
            var url = 'http://hq.sinajs.cn/list=';
            for (let i = 0; i < selected.length; i++) {
                url += `${selected[i]},`
            }
            console.log(url);
            request.get(url)
                .charset('GB18030')
                .end(function (err, res) {
                    if (!err) {
                        for (const text of res.text.split(';')) {
                            var content = stockReg.exec(text);
                            if (content) {
                                var reqs = content[1].split(',');
                                message += `${reqs[0]} ${reqs[3]} ${(((Number(reqs[3]) / Number(reqs[2])) - 1) * 100).toFixed(2)}% 成交数: ${reqs[8]}\n`;
                            }
                        }
                        bot.sendGroupMsg(data.group_id, message);
                    }
                });
        }
        if (data.raw_message.startsWith('添加')) {
            if (data.user_id != 1620644350) {
                var code = data.raw_message.split(' ')[1];
                if(code != '' && code != null && selected.indexOf(code) == -1) {
                    var url = `http://hq.sinajs.cn/list=${code}`;
                    request.get(url)
                           .charset('GB18030')
                           .end(function (err, res) {
                            if(!err){
                                var text  = res.text;
                                var content  = stockReg.exec(text);
                                if(content){
                                    var reqs = content[1].split(',');
                                    if(reqs.length > 1) {
                                         selected.push(code);
                                         client.set("selected", JSON.stringify(selected));
                                    }
                                }
                            }
                    });
                }
            } else {
                bot.sendGroupMsg(data.group_id, `${data.sender.title || data.sender.card ? data.sender.card : data.sender.nickname} 不许加！！`);
            }
        }
        if (data.raw_message.startsWith('删除')) {
            var code = data.raw_message.split(' ')[1];
            console.log(code);
            var index = selected.indexOf(code);
            if (index > -1) {
                selected.splice(index, 1)
            }
            client.set("selected", JSON.stringify(selected));
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
