var app = require('http').createServer(handler)
var url = require('url');
var io = require('socket.io')(app);
var fs = require('fs');
const random = require('random');

app.listen(80);

function handler (req, res) {
  var params = getURLParamters(req);
  var yvals = createPolyYvals(params.coeffs, params.xvals);
  var mapping = {xvals: params.xvals, yvals: yvals};
  io.emit('refresh_values', mapping);


  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

 io.on('connection', function (socket) {
  socket.on('values submitted', function (values) {
    console.log("submitting new info");
    let ys = createPolyYvals (values.coeffs, values.xvals);
    console.log(ys);
    socket.emit('values returned', {xvals: values.xvals, yvals: ys} );
  });
});


/*Generates sample coefficients and x values for use if none are supplied in the request
*
* These coefficients and x values are for y = 2x^3 -4x^2 + 7x  | x E Z, 0 < x < 8
*/
function createSampleParams(){
    console.log("Using sample params");
    return { coeffs: [7,-4,2], xvals: [1,2,3,4,5,6,7]};
}



/*Given an array of X values, and an array of coefficients for a poloynomial function,
* this method creates an array of corresponding y values
* Coefficients for each exponent are in the index of their degree.  Ex:
*
* y = 2x^3 -4x^2 + 7x   would translate into a coefficient array of [7,-4,2]
* y = 12x^6 + 2x^2      would translate into a coefficient array of [0,2,0,0,0,12]
* y = 3x^3 + x^2        would translate into a coefficient array of [0,1,3]
*/
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





/*Parses arguments from the request for use in creating a graph.
//NOTE:  There is currently no validation for invalid input.
*/
function getURLParamters(req) {
    var params = url.parse(req.url,true).query;
    console.log(params);


    var coeffs = [];
    var xvals = [];
    //check if parameters are defined
    if (typeof params['coeffs'] !== 'undefined' && typeof params['xvals'] !== 'undefined') {
        coeffs = params['coeffs'].split(",");
        xvals = params['xvals'].split(",");
    } else {
        return createSampleParams();
    }
    var params = { coeffs: coeffs, xvals: xvals};
    return params;
}
