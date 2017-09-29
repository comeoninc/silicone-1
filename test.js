const Express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const app = new Express();
const assert = require('assert');
app.get('/silicone.umd.js', (req, res) => {
    var siliconePath = path.resolve(__dirname, './dist/silicone.umd.js');
    fs.createReadStream(siliconePath).pipe(res.header('content-type', 'application/json'));
});
app.use('/', Express.static('static'));

describe('Silicone', () => {

    let browser = null;
    let server = null;

    const getRunner = async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:8080');
        return {
            page: page,
            run: async (fn) => {
                const promise = await page.evaluate(fn);
                return promise;
            }
        }
    }

    before((done) => {
        server = app.listen(8080, 'localhost', (err) => {
            if (err) {
                console.log('puto');
            }
            puppeteer.launch().then(b => {
                browser = b;
                done();
            })            
        })
    });

    after(async () => {
        if (browser) {
            await browser.close(); 
        }
        if (server){ 
            server.close()
        }
    })

    it('should wait for div to contain text', async () => {
        const runner = await getRunner();
        runner.page.evaluate(() => {
            setTimeout(() => {
                document.getElementById('div-text-test').innerHTML = 'test';
            }, 2000)
        })
        await runner.run(() => Silicone.waitFor('#div-text-test').toContainText('test'));
    });

    it('should type "hola"', async () => {
        const runner = await getRunner();
        await runner.run(() => Silicone.type('#input-type-test', 'hola'));
        const text = await runner.page.evaluate(() => document.getElementById('input-type-test').value);
        assert(text === 'hola', 'text is "hola"');
    });
})