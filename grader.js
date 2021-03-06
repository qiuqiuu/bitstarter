#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var wrap = function() {
    this.setValue = function(value) {this.val = value;};
    this.getValue = function() {return this.val;};
};
var gwrap = new wrap();
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
// http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};
var url;
var findURL = function(inurl) {
    url = inurl;
    //console.log(inurl);
    //program.url = inurl;
    //console.log(program.url);
}
var openurl = function(inurl) {
    var callme = function(result, response) {
        console.log(JSON.stringify(
        checkHtmlFile('poopsie', program.checks,
           function(poop){return result;}), null, 4));
    };
    restler.request(inurl, {}).on('complete', callme);
}

var cheerioHtmlFile = function(htmlfile, openmethod) {
    return cheerio.load(openmethod(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile, openmethod) {
    $ = cheerioHtmlFile(htmlfile, openmethod);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {    
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-u, --url <url>', 'URL of index.html', clone(findURL), '')
        .parse(process.argv);
    if (url != '') {
        openurl(url);
    } else {
        var checkJson = checkHtmlFile(program.file, program.checks, fs.readFileSync);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
