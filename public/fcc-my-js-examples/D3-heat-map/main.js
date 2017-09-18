
var a = a || {};

a.drawHeatMap = function(selector,data,baseT,title1,title2,title3,fullWidth,fullHeight) {

  var title1Height = 35;
  var title2Height = 20;
  var title3Height = 30;

  var svgMargins = {
    width:  fullWidth,
    height: fullHeight - title1Height - title2Height - title3Height,
  };

  var chartMargins = { // Within svgArea
    left:   Math.floor(svgMargins.width *0.1),
    top:    Math.floor(svgMargins.height*0.03),
    right:  Math.floor(svgMargins.width *(1-0.07)),
    bottom: Math.floor(svgMargins.height*(1-0.2)),
  };

  ////////////////////////////////////////////////
  //  container
  //    title1Div
  //    title2Div
  //    title3Div
  //    svgArea
  //    tooltip
  ////////////////////////////////////////////////
  var container = d3.select(selector).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: fullHeight+"px",
    overflow: "hidden",
    "color": "black",
    "background-color": "white",
  });

  var title1Div = container.append("div").text(title1).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: title1Height+"px",
    "font-size": "2em",
    "text-align": "center",
  });

  var title2Div = container.append("div").text(title2).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: title2Height+"px",
    "font-size": "1em",
    "text-align": "center",
  });

  var title3Div = container.append("div").text(title3).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: title3Height+"px",
    "padding-left": fullWidth/5+"px",
    "padding-right": fullWidth/5+"px",
    "font-size": "0.8em",
    "text-align": "center",
  });

  var svgArea = container.append("svg").attr({width:svgMargins.width, height:svgMargins.height});

  var tooltip = container.append("div").style({
    "position": "absolute",
    padding : "10px",
    "display": "none",
    "border": "1px solid black",
    "border-radius": "10px",
    "text-align": "center",
    "color": "black",
    "background-color": "lightgrey",
  });
    
  ////////////////////////////////////////////////
  //  chart rect
  ////////////////////////////////////////////////
  svgArea.append("rect").attr({
    x:chartMargins.left, y:chartMargins.top,
    width:chartMargins.right-chartMargins.left,
    height:chartMargins.bottom-chartMargins.top,
    fill: "none"
  });

  ////////////////////////////////////////////////
  //  xAxis (year)
  ////////////////////////////////////////////////
  var toYear = function(d){ return new Date(d+"-01-01"); };

  var minX = data.reduce(function(min,el){ return (min<el.year) ? (min) : (el.year); },data[0].year);
  var maxX = data.reduce(function(max,el){ return (max>el.year) ? (max) : (el.year); },data[0].year);

  var x = d3.time.scale()
    .domain([toYear(minX), toYear(maxX)])
    .range([chartMargins.left, chartMargins.right]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years, 10)
    .tickSize(1,1)
    .tickFormat(d3.time.format("%Y"));

  svgArea.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0," + chartMargins.bottom + ")")
    .call(xAxis)
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("transform", "translate(-8,0) rotate(-70)" );

  // xAxis grid
  svgArea.append("g").attr("id","xAxisGrid").selectAll("line")
    .data(x.ticks(20))
    .enter().append("line").attr({
        "id":"verticalGrid",
        x1 : function(d){ return x(d);},
        x2 : function(d){ return x(d);},
        y1 : chartMargins.top,
        y2 : chartMargins.bottom,
        "stroke": "lightgrey",
        "stroke-width": "1px"
      });

  // xAxis label
  svgArea.append("text").attr("id","xAxisLabel").text("Years")
    .attr({
      x:chartMargins.left*3/4+chartMargins.right*1/4,
      y:chartMargins.bottom*2/5+svgMargins.height*3/5,
    });

  ////////////////////////////////////////////////
  //  yAxis (month)
  ////////////////////////////////////////////////
  var months=["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  var y = d3.scale.linear()
    .domain([0,12])
    .range([chartMargins.top, chartMargins.bottom]);

  // yAxis labels
  svgArea.append("g").attr("id","yAxisLabels").selectAll("text")
    .data(months)
    .enter().append("text").text(function(d){return d;})
      .attr({
        x: chartMargins.left,  y:function(d,i){return y(i+0.5);},
        "text-anchor": "end",
        //"transform": "rotate(-90 "+chartMargins.left/2+" "+(chartMargins.top+chartMargins.bottom)/2+")",
        fill: "black"
      });

  // yAxis grid
  svgArea.append("g").attr("id","yAxisGrid").selectAll("line")
    .data(y.ticks(13))
    .enter().append("line")
      .attr({
        id: "horizontalGrid",
        x1: chartMargins.left,
        x2: chartMargins.right,
        y1: function(d){ return y(d);},
        y2: function(d){ return y(d);},
        stroke: "lightgrey",
        "stroke-width": "1px"
      });

  // yAxis label
  svgArea.append("text").attr("id","yAxisLabel").text("Month")
    .attr({
      x: chartMargins.left/4,
      y: (chartMargins.top+chartMargins.bottom)/2,
      "text-anchor": "middle",
      "transform": "rotate(-90 " + chartMargins.left/4
                           + " " + (chartMargins.top+chartMargins.bottom)/2
                           +")",
      fill: "black"
    });


  ////////////////////////////////////////////////
  //  zAxis (color, based on temperature)
  ////////////////////////////////////////////////
  var colors = ["#65a", "#38c", "#7c7", "#9f9", "#cfc", "#fff", "#fe9", "#fb6", "#f74", "#d45", "#a04"];

  var minT = baseT + data.reduce(function(min,el){ return (min<el.variance) ? (min) : (el.variance); },data[0].variance);
  var maxT = baseT + data.reduce(function(max,el){ return (max>el.variance) ? (max) : (el.variance); },data[0].variance);

  var z = d3.scale.quantile()
    .domain([minT,maxT])
    .range(colors);

  ////////////////////////////////////////////////
  //  legend
  ////////////////////////////////////////////////
  var legendMargins = {left:(chartMargins.right+chartMargins.left)/2, top:chartMargins.bottom+40, height:15, width:30};

  var legend = svgArea.append("g").attr("id","myLegend").selectAll(".legend")
    .data([minT].concat(z.quantiles()), function(d) { return d; });

  legend.enter().append("g").attr("class", "legend");
  legend.append("rect").attr({
    x: function(d,i){ return legendMargins.left+i*legendMargins.width; },
    y: legendMargins.top,
    width: legendMargins.width,
    height: legendMargins.height,
    fill: function(d,i) { return colors[i]; },
  });
  legend.append("text")
    .text(function(d){ return d3.format(".1f")(d);})
    .attr({
      x: function(d,i){ return legendMargins.left+(i+0.5)*legendMargins.width; },
      y: legendMargins.top+2*legendMargins.height,
      "font-size": "0.8em",
      "text-anchor": "middle",
      fill: "black"
    });

  ////////////////////////////////////////////////
  //  data points
  ////////////////////////////////////////////////
  svgArea.append("g").selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr({
        x: function(d,i){ return x(toYear(d.year)); },
        y: function(d,i){ return y(d.month-1); },
        width:  (chartMargins.right-chartMargins.left)/(maxX-minX),
        height: (chartMargins.bottom-chartMargins.top)/12,
        stroke: "none",
        fill: function(d){return z(baseT+d.variance);},
      })

      .on("mouseover", function(d) {
        // var rect = d3.select(this);
        // rect.attr("opacity", "0.5");

        tooltip.html(
            "<div><b>" + d.year + "-" + months[d.month-1] + "</b></div>"+
            "<div>" + d3.format(".2f")(baseT + d.variance) + "<sup>o</sup>C </div>"+
            "<div> (base " + ((d.variance>=0)?("+"):("")) + d3.format(".2f")(d.variance) + "<sup>o</sup>C)</div>"
          )
          .style("left", (d3.event.pageX+20) + "px")
          .style("top", (d3.event.pageY-40) + "px");

        tooltip.transition()
          .duration(200)
          .style("display", "block");
      })
      .on("mouseout", function() {
        // var rect = d3.select(this);
        // rect.attr("opacity", "1");

        tooltip.transition()
          .duration(500)
          .style("display", "none");
      });

  //console.log(document);
};

$(document).ready(function(){
  var title1="Monthly Global Land-Surface Temperature";
  var title2="1753 - 2015";
  var title3="Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average."
    +"Estimated Jan 1951-Dec 1980 absolute temperature ?: 8.66 +/- 0.07";

  // a.drawHeatMap("#chart1",a.data.monthlyVariance,a.data.baseTemperature,title1,title2,title3,800,500);

  // var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  // $.getJSON(url).success(function(d) {
  //   a.drawHeatMap("#chart1",d.monthlyVariance,d.baseTemperature,title1,title2,title3,800,500);
  // });

  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  d3.json(url, function(error, d) {
    if (error) throw error;
    a.drawHeatMap("#chart1",d.monthlyVariance,d.baseTemperature,title1,title2,title3,800,500);
  });

});
