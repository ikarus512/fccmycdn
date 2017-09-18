
var a = a || {};

a.drawScatterplot = function(selector,data,title,fullWidth,fullHeight) {

  var titleHeight = 40;
  var width = fullWidth;
  var height = fullHeight - titleHeight;

  var chartAreaSz = {
    left:   Math.floor( width*0.07),
    top:    Math.floor(height*0.03),
    right:  Math.floor( width*(1-0.15)),
    bottom: Math.floor(height*(1-0.1)),
  };

  var barWidth = Math.ceil((chartAreaSz.right-chartAreaSz.left) / data.length);

  var formatSec = function(d){
    return d3.time.format("%M:%S")(new Date(d*1000));
  };

  //
  //  container
  //    titleDiv
  //    chartArea
  //    tooltip
  //
  var container = d3.select(selector).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: fullHeight+"px",
    overflow: "hidden",
    "color": "black",
    "background-color": "white",
  });

  var titleDiv = container.append("div").text(title).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: titleHeight+"px",
    "font-size": "2em",
    "text-align": "center",
  });

  var chartArea = container.append("svg").attr({width:width, height:height});

  var tooltip = container.append("div").style({
    "position": "absolute",
    "display": "none",
    "border": "1px solid black",
    "border-radius": "10px",
    "color": "black",
    "background-color": "lightgrey",
  });
    
  //
  //  chartArea details
  //
  chartArea.append("rect").attr({
    x:chartAreaSz.left, y:chartAreaSz.top,
    width:chartAreaSz.right-chartAreaSz.left,
    height:chartAreaSz.bottom-chartAreaSz.top,
    fill: "none"
  });

  var minX = data.reduce(function(min,el){
    return (min<el.Seconds) ? (min) : (el.Seconds);
  },data[0].Seconds);

  var maxX = data.reduce(function(max,el){
    return (max>el.Seconds) ? (max) : (el.Seconds);
  },data[0].Seconds);

  var minY = data.reduce(function(min,el){
    return (min<el.Place) ? (min) : (el.Place);
  },data[0].Place);
  var maxY = data.reduce(function(max,el){
    return (max>el.Place) ? (max) : (el.Place);
  },data[0].Place);

  var x = d3.time.scale()
    .domain([minX, maxX])
    .range([chartAreaSz.left, chartAreaSz.right]);
  var y = d3.scale.linear()
    .domain([minY,maxY])
    .range([chartAreaSz.top, chartAreaSz.bottom]);

  //
  //  xAxis
  //
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10,"")
    .tickSize(1,1)
    .tickFormat(formatSec);
  chartArea.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0," + chartAreaSz.bottom + ")")
    .call(xAxis)
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("transform", "translate(-8,0) rotate(-70)" );
  // xAxis grid
  chartArea.append("g").selectAll("line").data(x.ticks(20)).enter().append("line")
    .attr({
      "class":"verticalGrid",
      x1 : function(d){ return Math.floor(x(d));},
      x2 : function(d){ return Math.floor(x(d));},
      y1 : chartAreaSz.top,
      y2 : chartAreaSz.bottom,
      "stroke": "lightgrey",
      "stroke-width": "1px"
    });
  // xAxis label
  chartArea.append("text").text("Place")
    .attr({
      x:chartAreaSz.left/2, y:(chartAreaSz.top+chartAreaSz.bottom)/2,
      "text-anchor": "middle",
      "transform": "rotate(-90 "+chartAreaSz.left/2+" "+(chartAreaSz.top+chartAreaSz.bottom)/2+")",
      fill: "black"
    });

  //
  //  yAxis
  //
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "")
    .tickSize(1,1);
  chartArea.append("g")
    .attr("id", "yAxis")
    .attr("transform", "translate(" + chartAreaSz.left + ",0)")
    .call(yAxis)
      .selectAll("text")  
      .style("text-anchor", "end");
  // yAxis grid
  chartArea.append("g").selectAll("line").data(y.ticks(10)).enter().append("line")
    .attr({
      "class":"horizontalGrid",
      x1 : chartAreaSz.left,
      x2 : chartAreaSz.right,
      y1 : function(d){ return Math.floor(y(d));},
      y2 : function(d){ return Math.floor(y(d));},
      "stroke": "lightgrey",
      "stroke-width": "1px"
    });
  // yAxis label
  chartArea.append("text").text("Place")
    .attr({
      x:chartAreaSz.left/2, y:(chartAreaSz.top+chartAreaSz.bottom)/2,
      "text-anchor": "middle",
      "transform": "rotate(-90 "+chartAreaSz.left/2+" "+(chartAreaSz.top+chartAreaSz.bottom)/2+")",
      fill: "black"
    });


  //
  //  legend
  //
  var legendPos = {left:chartAreaSz.right-100, top:chartAreaSz.top+50, height:15};
  chartArea.append("text").text("Legend:").attr({
      x:legendPos.left, y:legendPos.top,
      fill: "black"
    });
  chartArea.append("circle").attr({
      cx:legendPos.left, cy:legendPos.top+1*legendPos.height, r:3,
      "stroke": "black", fill: "blue"
    });
  chartArea.append("text").text("No doping allegations").attr({
      x:legendPos.left, y:legendPos.top+1*legendPos.height,
      fill: "black", transform: "translate(10,5)",
    });
  chartArea.append("circle").attr({
      cx:legendPos.left, cy:legendPos.top+2*legendPos.height, r:3,
      "stroke": "black", fill: "red"
    });
  chartArea.append("text").text("There are doping allegations").attr({
      x:legendPos.left, y:legendPos.top+2*legendPos.height,
      fill: "black", transform: "translate(10,5)",
    });

  //
  //  data points, text
  //
  chartArea.append("g").selectAll("text")
    .data(data)
    .enter().append("text")
      .attr("x",function(d,i){ return x(d.Seconds)+5; })
      .attr("y",function(d,i){ return y(d.Place); })
      .text(function(d,i){ return d.Name; })
      .style("font-family","Arial")
      .style("font-size","0.8em");

  //
  //  data points, circles
  //
  chartArea.append("g").selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx",function(d,i){ return x(d.Seconds); })
      .attr("cy",function(d,i){ return y(d.Place); })
      .attr("r",3)
      .attr("stroke","black")
      .attr("fill",function(d){return (d.Doping)?("red"):("blue");})

      .on("mouseover", function(d) {
        var rect = d3.select(this);
        rect.attr("opacity", "0.5");

        tooltip.html(
            "<div style='padding:10px'><b>" + d.Name + ": " + d.Nationality + "  </b><div>"+
            "<div>Year: " + d.Year + "</div>"+
            "<div> Time: " + formatSec(d.Seconds) + "</div>"+
            "<div> Place: " + d.Place + "</div>"+
            ((d.Doping==="")?(""):("<hr /><div>"+d.Doping+"</div>"))
          )
          .style("left", (d3.event.pageX+20) + "px")
          .style("top", (d3.event.pageY-40) + "px");
        tooltip.transition()
          .duration(200)
          .style("display", "block");
      })
      .on("mouseout", function() {
        var rect = d3.select(this);
        rect.attr("opacity", "1");

        tooltip.transition()
          .duration(500)
          .style("display", "none");
      });
};

$(document).ready(function(){
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  $.getJSON(url).success(function(data) {
    a.drawScatterplot("#chart1",data,"Doping in Professional Bicycle Racing",800,500);
  });
});
