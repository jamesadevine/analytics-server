
/*
-----------GENERAL IMPORTS-----------
*/
var express = require('express'); //express framework!
var logger = require('morgan');
var app = express();  //create the app object
app.use(logger('dev'));
var cookieParser = require('cookie-parser');  //used to
var session = require('express-session'); //used for managing sessions
var uuid = require('node-uuid');  //used to generate UUIDs
var moment = require('moment'); //clever date library
var fs = require('fs'); //used to interact with the file system
var request = require('request');

var mongoose = require('mongoose'); //allows interation with MongoDB

//connect to MongoDB!
//mongoose.connect('mongodb://localhost/smartmonitoring');
//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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

/*var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.info('New client connected (id=' + socket.id + ').');

  socket.on('setUserID',function(userData){
    socket.join(userData.userid);
    console.log(userData);
  });
});*/

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

function hasCookie(cookie)
{
  if(!cookie["pxt_tracking"])
    return false

  return true;
}

app.post('/api/event/', function (req, res) {

    console.log(req.cookies, req.body);
    if(!hasCookie(req.cookies))
    {
      var cookie = uuid.v4()
      res.cookie("pxt_tracking", cookie);
      console.log("cookie genereated ", cookie)
    }

    var required = ["data"];
    var allParams = commonFunctions.checkParams(req.body,required);

    if(!allParams){
      res.status(400).json({error:"Missing a parameter"});
      return;
    }

    commonFunctions.logRequest("/api/event",req.query);

    /*var callback = function(result){
      if(result===-1){
        res.status(403).json({error:"User credentials incorrect"});
      }else{
        result=result.toObject();
        req.session.userID = result.id;
        result.energy = energyManager.getEnergyStats(result.countryCode);
        res.status(200).json({success:"logged"});
      }
    };*/

    res.status(200).json({success:"logged"});
  });



/*
  --------------------SETUP ROUTES----------------------
*/



