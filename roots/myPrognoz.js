"mode strict";
var express = require('express'),
  fs = require('fs'),
  router = express.Router(),
  request = require('request'),
  myEnableCORS = require('./my-enable-cors.js');

router
.all(/^\/myPrognoz.*/, myEnableCORS)
.get(/^\/myPrognoz.*/, function (req, res) {
  var searchstr = req.url.replace(/^\/myPrognoz\w*\//,''),
    details = req.url.match(/^\/myPrognozDetails/,''),
    arr_temperature,
    arr_precip_val,
    arr_precip_ver,
    arr_wind_speed,
    arr_pressure,
    arr_humidity,
    arr_phenomenon_name;

  if (process.env.APP_URL !== 'https://ikarus512-fccmycdn.herokuapp.com') {
    var data = require('./1.js');
    processData(res, data);
  } else {
    request.get(
      'http://meteoinfo.ru/forecasts5000/russia/'+searchstr,
      //'http://meteoinfo.ru/forecasts5000/russia/moscow-area/moscow',
      //'http://meteoinfo.ru/forecasts5000/russia/nizhegorodskaya-area',
      function(err, response, data) {
        if(err || response.statusCode !== 200) {
          res.json({ "error": err, statusCode: response.statusCode });
        } else {
          processData(res, data);
        }
      }
    );
  }

  function extractVal(str,name) {
    var re = new RegExp(name+'=(\\[\\{[^;]*);', 'i');
    var s;
    try {
      s = eval(str.match(re)[1]);
    } catch(err) {
    }
    return s;
  }

  function processData(res, data) {
    try {
      // extract data
      arr_temperature= extractVal(data, 'arr_temperature');
      arr_precip_val = extractVal(data, 'arr_precip_val');
      arr_precip_ver = extractVal(data, 'arr_precip_ver');
      arr_wind_speed = extractVal(data, 'arr_wind_speed');
      arr_pressure   = extractVal(data, 'arr_pressure');
      arr_humidity   = extractVal(data, 'arr_humidity');
      arr_phenomenon_name   = extractVal(data, 'arr_phenomenon_name');

      // extract dates
      var x = arr_precip_val.map((el)=>{ return el.x; });
      // Filter out absent dates
      arr_temperature = arr_temperature.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });
      arr_precip_ver = arr_precip_ver.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });
      arr_wind_speed = arr_wind_speed.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });
      arr_pressure = arr_pressure.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });
      arr_humidity = arr_humidity.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });
      arr_phenomenon_name = arr_phenomenon_name.filter((el)=>{ return x.some((xel)=>{ return xel===el.x; }); });

      var result = {
        x: x,
        t: arr_temperature.map((el)=>{ return el.y; }),
        val: arr_precip_val.map((el)=>{ return el.y; }),
        ver: arr_precip_ver.map((el)=>{ return el.y; }),
        wnd: arr_wind_speed.map((el)=>{ return el.y; }),
        // arr_pressure.map((el)=>{ return el.y; }),
        // arr_humidity.map((el)=>{ return el.y; }),
        // arr_phenomenon_name.map((el)=>{ return el.y; }),
      };
      if (details) {
        result.p = arr_pressure.map((el)=>{ return el.y; });
        result.h = arr_humidity.map((el)=>{ return el.y; });
        result.n = arr_phenomenon_name.map((el)=>{ return el.y; });
      }

      res.json(result);

    } catch(err) {
      res.json({err});
    }
  }

});

// *
router.all('*', function (req, res) {
  res.json({error: "Cannot "+req.method+" "+req.originalUrl});
});

module.exports = router;
