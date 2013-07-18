var request = require('request');
function dumbfunc(error, response, result)
{
    console.log(result);
}
request('http://google.com/', dumbfunc);
