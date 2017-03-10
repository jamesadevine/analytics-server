
/*
-----------GENERAL IMPORTS-----------
*/
var express = require('express'); //express framework!
var logger = require('morgan');
var app = express();  //create the app object
//app.use(logger('dev'));
var cookieParser = require('cookie-parser');  //used to
var session = require('express-session'); //used for managing sessions
var uuid = require('shortid');  //used to generate UUIDs
var moment = require('moment'); //clever date library
var fs = require('fs'); //used to interact with the file system
var request = require('request');

var mongoose = require('mongoose'); //allows interation with MongoDB

//connect to MongoDB!
//mongoose.connect('mongodb://localhost/pxtracking');
//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// schemas for the database...
/*var BasicEventSchema = mongoose.model('BasicEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
})

var MouseEventSchema = mongoose.model('MouseEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    x: Number;
    y: Number;
    srcId: String;
    srcClass: String;
    srcNodeName: String;
})

var BlocklyEvent = mongoose.model('BlocklyEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
})

var BlocklyUIEvent = mongoose.model('BlocklyUIEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
    uiType: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
})

var BlocklyCreateEvent = mongoose.model('BlocklyCreateEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
    xml: mongoose.Schema.Types.Mixed,
    ids: [String];
})

var BlocklyDeleteEvent = mongoose.model('BlocklyDeleteEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
    xml: mongoose.Schema.Types.Mixed,
    ids: [String];
})

var BlocklyChangeEvent = mongoose.model('BlocklyChangeEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
    name: String
})

var BlocklyMoveEvent = mongoose.model('BlocklyMoveEvent', {
    type: String,
    timestamp: Number,
    cookie: {type: String, index: true},
    data: mongoose.Schema.Types.Mixed,
    workspaceId: String,
    blockId: String,
    group: String,
    blockType: String,
    name: String,
    oldParentId: String,
    newParentId: String,
    oldParentBlockType: String,
    newParentBlockType: String,
    oldCoordinate: mongoose.Schema.Types.Mixed,
    newCoordinate: mongoose.Schema.Types.Mixed,
    oldInputName: String,
    newInputName: String
})
*/
//create the project name
app.use(cookieParser());

//create the session generator
app.use(session({secret: 'J@m3sD3V1n3',
                 saveUninitialized: true,
                 resave: true}));

//create the body parser to automatically pass request parameters
var bodyParser = require('body-parser');

//set the limit to 50mb for image upload
app.use( bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//set CORS
var allowCrossDomain = function(req, res, next) {
    var allowedOrigins = ['http://scc-devine.lancs.ac.uk', 'http://scc-devine.lancs.ac.uk:800'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://scc-devine.lancs.ac.uk | http://scc-devine.lancs.ac.uk:800');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
};

app.use(allowCrossDomain);

//set the public DIR
app.use(express.static(__dirname + '/public'));


/*
  --------------------SERVER OBJECT----------------------
*/

var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});

/*
  --------------------COMMON FUNCTIONS----------------------
*/

var commonFunctions ={
  logRequest:function(location,body){
    var logString = "";

    for(var key in body)
      logString+=" || "+key+": "+body[key];

    console.log(location+":"+logString);
  },

  //returns true if all params are there
  checkParams:function(request,required){
    for(var i =0;i<required.length;i++){
      if(typeof request[required[i]] === 'undefined')
        return false;
    }
    return true;
  }
};

function hasCookie(cookies)
{
  if(!cookies["pxt_tracking"])
    return false

  return true;
}

app.post('/api/event/', function (req, res) {
    var cookie;

    if(!hasCookie(req.cookies))
    {
      cookie = uuid.generate()
      res.cookie("pxt_tracking", cookie);
    }
    else
        cookie = req.cookies["pxt_tracking"]

    console.log(JSON.stringify({cookie:cookie,data:req.body}))

    var required = ["data"];
    var allParams = commonFunctions.checkParams(req.body,required);

    if(!allParams){
      res.status(400).json({error:"Missing a parameter"});
      return;
    }

    res.status(200).json({success:"logged"});
});



/*
  --------------------SETUP ROUTES----------------------
*/
