# Casper1
Casper Code Example for Downloading Text Files
**playground for learning. those exmaples may help other beginners.**
## Casper's problem for beginners?

### Caspser closes before it did the job.
That's usually because:
* You have set up 'casper.start' 'casper.thenOpen', but you didn't call 'run' after each of them.
* Some selectors are invalid, so Casper skipped the step.

This project has a few example to show how to get casper working properly.

For example:
```typescript
    //I would recommend you to wrap each unit step in a function;
    function start() {
        //a  always begin with start/then/thenOpen/thenclick...
        casper.start('https://yande.re/user/login', (res) => {
            console.log('waiting for load: ' + 'https://yande.re/user/login');
            //other operations such as sendKeys, click, download, etc, when no navigation is required, should be placed inside the start/then callbacks.
            casper.sendKeys({
                type: 'xpath',
                path: '//*[@id="user_name"]'
            }, '******');
            
            casper.click({
                type: 'xpath',
                path: '//*[@id="user-login"]/form/table/tbody/tr[3]/td/input'
            });
        });
        //after the start, you must call 'run' to execute a suite of steps.
        casper.run(() => {
            //you need to invoke the next job inside the 'run' callback.
            download();
        });
    }
    function download(){
        casper.thenOpen('https://www.google.com/',(res)=>{
          //to do something.
        });
        casper.run(() => {
            nextJob();
        });
    }
    start();
```


