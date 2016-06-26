var yd;
(function (yd) {
    var casper = require('casper');
    var fs = require('fs');
    var CasperWorker = (function () {
        function CasperWorker(links, workload, callback) {
            var _this = this;
            this.run = function () {
                var that = _this;
                if (_this.links.length > 0) {
                    var link = _this.links.shift();
                    console.log('run: ' + link);
                    _this.workload(link, that.run, that.callback);
                }
                else {
                    _this.callback();
                }
            };
            this.links = links.map(function (value) { return value; });
            this.workload = workload;
            this.callback = callback;
        }
        return CasperWorker;
    }());
    //casper.viewport(1280, 960);
    var links = [];
    function getFileName(link) {
        var lastIndex = link.lastIndexOf('\/');
        if (lastIndex > -1)
            return link.substr(lastIndex + 1);
        return link;
    }
    function getFileNumber(link) {
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
        casper.start('https://yande.re/user/login', function (res) {
            console.log('waiting for load: ' + 'https://yande.re/user/login');
            //casper.waitForSelector('//*[@id="user_name"]', (() => {
            //    console.log('loaded');
            //}),
            //    (function () {
            //        casper.die('Timeout reached');
            //        casper.exit();
            //    }), 30000);
            console.log('xpath test: ', casper.exists({
                type: 'xpath',
                path: '//*[@id="user_name"]'
            }));
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
        casper.run(function () {
            download();
        });
    }
    function download() {
        var pages = [];
        for (var i = 1; i < 3; i++) {
            pages.push('https://yande.re/post?page=' + i + '&tags=chi%27s_sweet_home'); //
        }
        var worker = new CasperWorker(pages, readPage, function () {
            casper.exit();
        });
        worker.run();
    }
    function readPage(link, next, terminate) {
        console.log('open page: ' + link);
        var links;
        casper.thenOpen(link, function (res) {
            console.log('a.thumb ? ', casper.exists('a.thumb'));
            casper.waitForSelector('a.thumb', function () {
                links = casper.getElementsAttribute('a.thumb', 'href').map(function (link) { return 'https://yande.re' + link; });
                console.log('number of links: ' + links.length);
            });
        });
        casper.run(function () {
            var worker = new CasperWorker(links, downloadPicture, (links.length = 16) ? next : terminate);
            worker.run();
        });
    }
    function downloadPicture(link, next, terminate) {
        casper.thenOpen(link, function (r) {
            console.log('download image: ' + link);
            casper.waitForSelector('#image', function () {
                var imagelink = casper.getElementAttribute('#image', 'src');
                casper.download(imagelink, 'yande/' + getFileNumber(link) + '.jpg');
            });
        });
        casper.run(function () {
            console.log('Image Downloaded');
            next();
        });
    }
    start();
})(yd || (yd = {}));
//# sourceMappingURL=yd.js.map