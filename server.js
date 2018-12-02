var http = require('http');
var url = require('url');
var fs = require('fs');
var plotly = require('plotly')('joejoejoejoe','HWFNV0n8O7NUns70pvPK');

    // testing out  y = 2x^3 -4x^2 + 7x




var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: "scatter"
};
var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: "scatter"
};
var data = [trace1, trace2];
var graphOptions = {filename: "basic-line", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

var degreeToCoef = [7,-4,2];
var testx = [1,2,3,4,5,6,7]

function createYvals (coeffs, xvals) {
    var yvals = [];
    for (x = 0; x < xvals.length; x++) {
        var xtot = 0;
        for (co = 0; co < coeffs.length; co++) {
            xtot += Math.pow(xvals[x], co + 1) * coeffs[co];
            console.log("x = " + xvals[x]);
            console.log("coefficient = " + coeffs[co]);
            console.log("exp = " + (co + 1));

        }
        yvals.push(xtot);
    }
    return yvals;
}

http.createServer(function (req, res) {

    var args = url.parse(req.url, true).query;
    var type = args.type;
    var m = args.m;
    console.log(createYvals(degreeToCoef, testx));


/*    var pows = [1,2,3,5];
    var coffs = [1,2,0,0];
    yvals = genModel(pows,coffs,5,10,1);
    console.log(yvals);*/
/*    fs.readFile('htmlskel.html', function(err, skel) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(skel);
        res.end();
    });*/
    var text = "type ->" + args.type + "\nx value ->" + args.x;
    res.end(text);
}).listen(8080);
