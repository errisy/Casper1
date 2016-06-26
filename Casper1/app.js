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
                _this.workload(link, that.run);
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
casper.start('https://github.com/Microsoft/TypeScript/tree/master/src/compiler', function (response) {
    casper.echo('waiting for .jsb');
    casper.waitForSelector('div.file-wrap', //waiting for body is choice to determine the page has been loaded.
    (function () {
        //casper.captureSelector('test.jpg', 'div.file-wrap');
        links = casper.getElementsAttribute('table.files>tbody>tr>td>span>a.js-navigation-open', 'href')
            .map(function (link) { return 'https://raw.githubusercontent.com' + link.replace('/blob/', '/'); });
        //casper.echo(links.map(link => 'https://raw.githubusercontent.com'+link.replace('/blob/', '/')).join('\n'));
        //https://raw.githubusercontent.com/Microsoft/TypeScript/master/src/compiler/binder.ts
        //               https://github.com/Microsoft/TypeScript/blob/master/src/compiler/binder.ts
    }), (function () {
        casper.die('Timeout reached');
        casper.exit();
    }), 30000);
});
//casper.then(() => {
//    casper.echo('start download');
//    links.forEach(link => {
//        //casper.download(link, 'compiler/' + getFileName(link), 'POST');
//        casper.start(link).then(() => {
//            casper.download(link, 'compiler/' + getFileName(link));
//        });
//        //casper.run(() => {
//        //    casper.echo('downloaded: ' + link);
//        //});
//    });
//})
casper.run(function () {
    casper.echo('Read Page: Microsoft/TypeScript/tree/master/src/compiler');
    downloadTSFiles();
});
function downloadTSFiles() {
    //casper.thenOpen(links.pop(), (response) => {
    //    console.log(casper.getCurrentUrl());
    //    //casper.download(casper.getCurrentUrl(), 'compiler/' + getFileName(casper.getCurrentUrl()));
    //    fs.write('compiler/' + getFileName(casper.getCurrentUrl()), casper.getPageContent(), 'w');
    //});
    //casper.run(() => {
    //    if (links.length > 0) {
    //        next();
    //    }
    //    else {
    //        downloadLabrador();
    //    }
    //});
    casper.then(function () {
        links.forEach(function (link) {
            console.log(link);
            casper.download(casper.getCurrentUrl(), 'compiler/' + getFileName(casper.getCurrentUrl()));
        });
    });
    casper.run(function () {
        downloadLabrador();
    });
}
function downloadLabrador() {
    casper.thenOpen('https://en.wikipedia.org/wiki/File:Canadian_Golden_Retriever.jpeg', function (response) {
        casper.waitForSelector('div.fullImageLink>a>img', function () {
            console.log(casper.getCurrentUrl());
            casper.download('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Canadian_Golden_Retriever.jpeg/800px-Canadian_Golden_Retriever.jpeg', 'labrador.jpeg');
            var fullsize = casper.getElementAttribute('div.fullImageLink>a', 'href');
            console.log(fullsize);
            casper.download(fullsize, 'labrador-full.jpeg');
            console.log('http://www.golden-retriever.com/wp-content/uploads/2015/02/golden-retriever.jpeg');
            casper.download('http://www.golden-retriever.com/wp-content/uploads/2015/02/golden-retriever.jpeg', 'golden-retriever.jpeg');
            console.log('https://twitter.com/W3C');
            casper.download('https://twitter.com/W3C', 'twitter-w3c.txt');
        });
    });
    casper.run(function () {
        casper.exit();
    });
}
//# sourceMappingURL=app.js.map