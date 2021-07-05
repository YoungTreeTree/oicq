const request = require('superagent')
require('superagent-charset')(request)



var stockReg= /var hq_str_.*?="(.*?),\d*?\.\d*?,\d*?\.\d*?,(.*?),.*"/;
/*request.get('http://hq.sinajs.cn/list=sz002352')
    .charset('GB18030')
    .end(function(err,res) {
        var reqs = stockReg.exec(res.text);
        console.log(res.text);
        console.log(reqs);
        console.log(`${reqs[1]} ${reqs[2]}`);
    });*/



var message = '';
var selected = ['sh600009', 'sh600309'];
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
                    console.log(`${reqs[1]} ${reqs[2]}`);
                }
            }
            /*var reqs = stockReg.exec(res.text);
            bot.sendGroupMsg(data.group_id, );*/
        }
    });