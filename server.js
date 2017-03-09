"mode strict";

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

app.get('/', function (req, res) {
  var html=
    'Example usage:<br>'+
    'https://ikarus512-fccmycdn.herokuapp.com/snd/doom/dooropen.mp3<br>';

  res.send(html);
});


app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+app.get('port')+' (https)!');
});
