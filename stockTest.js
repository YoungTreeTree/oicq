const request = require('superagent')
require('superagent-charset')(request)




/*request.get('http://hq.sinajs.cn/list=sz002352')
    .charset('GB18030')
    .end(function(err,res) {
        var reqs = stockReg.exec(res.text);
        console.log(res.text);
        console.log(reqs);
        console.log(`${reqs[1]} ${reqs[2]}`);
    });*/



var message = '';
var selected = ['sh600009', 'sh600309', 'sz002352'];
var url = 'http://hq.sinajs.cn/list=';
for (let i = 0; i < selected.length; i++) {
    url += `${selected[i]},`
}
var stockReg= /var hq_str_.*?="(.*?)"/;
request.get(url)
    .charset('GB18030')
    .end(function(err,res) {
        if (!err) {
            for (const text of res.text.split(';')) {
                console.log(text);
                var content = stockReg.exec(text);
                if (content) {
                    var reqs = content[1].split(',');
                    if (reqs) {
                        console.log(`${reqs[0]} ${reqs[3]} ${(((Number(reqs[3]) / Number(reqs[2])) - 1) * 100).toFixed(2)}% 成交数: ${reqs[8]}`);
                    }
                }

            }
            /*var reqs = stockReg.exec(res.text);
            bot.sendGroupMsg(data.group_id, );*/
        }
    });