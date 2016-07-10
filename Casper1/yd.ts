module yd {
    var casper: Casper = require('casper');
    var fs: FileSystem = require('fs');

    class CasperWorker {
        public links: string[];
        public workload: (url: string, next: () => void, terminate: () => void) => void;
        public callback: () => void;
        constructor(links: string[], workload: (url: string, next: () => void, terminate: () => void) => void, callback: () => void) {
            this.links = links.map(value => value);
            this.workload = workload;
            this.callback = callback;
        }
        public run = () => {
            let that = this;
            if (this.links.length > 0) {
                let link = this.links.shift();
                console.log('run: ' + link);
                this.workload(link, that.run, that.callback);
            }
            else {
                this.callback();
            }
        }

    }

    //casper.viewport(1280, 960);
    var links: string[] = [];
    function getFileName(link: string): string {
        let lastIndex = link.lastIndexOf('\/');
        if (lastIndex > -1) return link.substr(lastIndex + 1);
        return link;
    }
    function getFileNumber(link: string): string {
        return /\d+$/ig.exec(link)[0];
    }

    casper = casper.create({
        viewportSize: {
            width: 1280,
            height: 960
        },
        pageSettings: {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
            webSecurityEnabled: false
        }
    });

    function start() {
        casper.start('https://yande.re/user/login', (res) => {
            console.log('waiting for load: ' + 'https://yande.re/user/login');

            //casper.waitForSelector('//*[@id="user_name"]', (() => {
            //    console.log('loaded');

            //}),
            //    (function () {
            //        casper.die('Timeout reached');
            //        casper.exit();
            //    }), 30000);
            //console.log('xpath test: ', casper.exists({
            //    type: 'xpath',
            //    path: '//*[@id="user_name"]'
            //}));
            //casper.sendKeys({
            //    type: 'xpath',
            //    path: '//*[@id="user_name"]'
            //}, '******');
            //casper.sendKeys({
            //    type: 'xpath',
            //    path: '//*[@id="user_password"]'
            //}, '******');
            ////casper.captureSelector('start.png', 'html');
            //casper.click({
            //    type: 'xpath',
            //    path: '//*[@id="user-login"]/form/table/tbody/tr[3]/td/input'
            //});
            //casper.waitForSelector({
            //    type: 'xpath',
            //    path: '//*[@id="user-index"]/h2'
            //}, () => {
            //    //casper.captureSelector('login.png', 'html');
            //});
            //console.log('clicked');
            //console.log('login done');

            //casper.waitForSelector('//*[@id="user-index"]/h2', () => {

            //});
        });
        casper.run(() => {
            download();
        });
    }

    function download() {
        let pages: string[] = [];
        for (let i = 1; i < 3; i++) {
            pages.push('https://yande.re/post?page=' + i + '&tags=chi%27s_sweet_home');//
        }
        let worker = new CasperWorker(pages, readPage, () => {
            casper.exit();
        });
        worker.run();
    }

    function readPage(link: string, next: () => void, terminate: () => void): void {
        console.log('open page: ' + link);
        let links: string[];
        casper.thenOpen(link, (res) => {
            console.log('a.thumb ? ', casper.exists('a.thumb'));
            casper.waitForSelector('a.thumb', () => {
                links = casper.getElementsAttribute('a.thumb', 'href').map(link => 'https://yande.re' + link);
                console.log('number of links: ' + links.length);

            });
        });
        casper.run(() => {
            let worker = new CasperWorker(links, downloadPicture, (links.length = 16) ? next : terminate);
            worker.run();
        });
    }
    function downloadPicture(link: string, next: () => void, terminate: () => void): void {
        casper.thenOpen(link, (r) => {
            console.log('download image: ' + link);
            casper.waitForSelector('#image', () => {
                let imagelink = casper.getElementAttribute('#image', 'src');
                casper.download(imagelink, 'yande/' + getFileNumber(link) + '.jpg');
            });
        })
        casper.run(() => {
            console.log('Image Downloaded');
            next();
        });
    }
    start();
}
 

