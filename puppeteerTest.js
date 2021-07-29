const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" ,headless:false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 2048,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.goto('https://www.douyu.com/4496540',{ waitUntil: 'networkidle2',});
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'example.png' });
    await browser.close();
})();
/*
client.set("selected", JSON.stringify(selected), redis.print);
//var a = client.get("record", redis.print());
console.log(process.env.redisPW);*/
