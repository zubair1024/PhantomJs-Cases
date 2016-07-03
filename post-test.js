/**
 * Created by zubair on 03-Jul-16
 */
"use strict";
var page   = require('webpage').create(),
    fs     = require('fs'),
    system = require('system'),
    args   = system.args,
    server = args[1],
    data   = args[2],
    count  = 0,
    runs   = args[3];

/**
 * Scenario for running a post request test for request analysis.
 * Use CLI to perform the necessary test case: phantomjs post.js <url> <params> <number-of-requests-to-log>
 */
function runScenario() {
    function handleRequest() {
        var time = Date.now();
        page.open(server, 'post', data, function (status) {
            if (status !== 'success') {
                console.log('FAIL to load the address');
            }
            else {
                time = Date.now() - time;
                console.log('try '+count+': '+time+' ms');
                fs.write('./result.txt', 'Loading time for ' + server + ' (ms):' + time + '\n', 'a');
                setTimeout(nextRequest, 200);
            }
        });
        page.onResourceReceived = function (response) {
            if (Date.now() > time) {
                time = Date.now();
            }
        };
    }

    function nextRequest() {
        if (count < runs) {
            handleRequest();
            count++;
        } else {
            phantom.exit(0);
        }
    }
    nextRequest();
}

//Run the given scenario
runScenario();