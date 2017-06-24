"mode strict";

var
  bodyParser = require('body-parser'),
  express = require('express'),
    app = express(),
  zzz;

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/', function (req, res) {
  var html=
    'Example usage:<br>'+
    'https://ikarus512-fccmycdn.herokuapp.com/snd/doom/dooropen.mp3<br>';

  res.send(html);
});

app.use('/api', require('./roots/myPrognoz.js'));


app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+app.get('port')+' (https)!');
});
