var http = require('http');
var url = require('url');
var fs = require('fs');
var chart = require('chart.js');



/*Generates sample coefficients and x values for use if none are supplied in the request
*
* These coefficients and x values are for y = 2x^3 -4x^2 + 7x  | x E Z, 0 < x < 8
 */
function createSampleParams(){
    return { coeffs: [7,-4,2], xvals: [1,2,3,4,5,6,7]};
}



/*Given an array of X values, and an array of coefficients for a poloynomial function,
* this method creates an array of corresponding y values
* Coefficients for each exponent are in the index of their degree.  Ex:
*
* y = 2x^3 -4x^2 + 7x   would translate into a coefficient array of [7,-4,2]
*
* y = 12x^6 + 2x^2      would translate into a coefficient array of [0,2,0,0,0,12]
*
* y = 3x^3 + x^2        would translate into a coefficient array of [0,1,3]
*
* */
function createPolyYvals (coeffs, xvals) {
    var yvals = [];
    for (x = 0; x < xvals.length; x++) {
        var xtot = 0;
        for (co = 0; co < coeffs.length; co++) {
            xtot += Math.pow(xvals[x], co + 1) * coeffs[co];
        }
        yvals.push(xtot);
    }
    return yvals;
}


/*Parses arguments from the request for use in creating a graph*/
function getURLParamters(req){
    var params = url.parse(req.url,true).query;
    var coeffs = [];
    var xvals = [];
    if (params['coeffs']) {
        coeffs = params['coeffs'].split(",");
    }
    if (params['xvals']) {
        xvals = params['xvals'].split(",");
    }
    var params = { coeffs: coeffs, xvals: xvals};
    return params;
}



/* Initiate server
*/
http.createServer(function (req, res) {
    var params = getURLParamters(req);
    var yvals = createPolyYvals(degreeToCoef, testx);
    res.write("coefficients: " + params.coeffs + " x-values: " + params.xvals + "y-values:" + yvals);
    res.end();
}).listen(8080);
