
var a = a || {};

a.drawBarChart = function(selector,data,fullWidth,fullHeight) {

  var titleHeight = 40;
  var noteHeight = 50;
  var width = fullWidth;
  var height = fullHeight - titleHeight - noteHeight;

  var chartAreaSz = {
    left:   Math.floor( width*0.07),
    top:    Math.floor(height*0.02),
    right:  Math.floor( width*(1-0.02)),
    bottom: Math.floor(height*(1-0.1)),
  };

  var barWidth = Math.ceil((chartAreaSz.right-chartAreaSz.left) / data.data.length);

  var formatCurrency = d3.format("$,.2f");
  var formatDate = d3.time.format("%Y %b");

  //
  //  container
  //    title
  //    chartArea
  //    note
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

  var title = container.append("div").text(data.name).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: titleHeight+"px",
    "font-size": "2em",
    "text-align": "center",
  });

  var chartArea = container.append("svg").attr({width:width, height:height});

  var note = container.append("div").text(data.description).style({
    "box-sizing": "border-box",
    width: fullWidth+"px",
    height: noteHeight+"px",
    color: "grey",
    "text-align": "center",
  });

  var tooltip = container.append("div").style({
    "position": "absolute",
    "display": "none",
    "border": "1px solid black",
    "border-radius": "10px",
    "color": "black",
    "background-color": "white",
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

  var minDate = data.data.reduce(function(min,el){
    var m = new Date(min).getTime();
    var d = new Date(el[0]).getTime();
    return (m<d) ? (min) : (el[0]);
  }, data.data[0][0]);
  minDate = new Date(minDate);

  var maxDate = data.data.reduce(function(max,el){
    var m = new Date(max).getTime();
    var d = new Date(el[0]).getTime();
    return (m>d) ? (max) : (el[0]);
  }, data.data[0][0]);
  maxDate = new Date(maxDate);

  var x = d3.time.scale()
    .domain([minDate, maxDate])
    .range([chartAreaSz.left, chartAreaSz.right]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data.data, function(d) { return d[1]; }) ])
    .range([chartAreaSz.bottom, chartAreaSz.top]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years, 5)
    .tickSize(1,1)
    .tickFormat(d3.time.format("%Y")); //-%m-%d
  chartArea.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0," + chartAreaSz.bottom + ")")
    .call(xAxis)
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("transform", "translate(-8,0) rotate(-70)" );
  chartArea.append("g").selectAll("line").data(x.ticks(20)).enter().append("line")
    .attr({
      "class":"verticalGrid",
      x1 : function(d){ return Math.floor(x(d));},
      x2 : function(d){ return Math.floor(x(d));},
      y1 : chartAreaSz.top,
      y2 : chartAreaSz.bottom,
      "stroke" : "black",
      "stroke-width" : "1px"
    });

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
  chartArea.append("g").selectAll("line").data(y.ticks(10)).enter().append("line")
    .attr({
      "class":"horizontalGrid",
      x1 : chartAreaSz.left,
      x2 : chartAreaSz.right,
      y1 : function(d){ return Math.floor(y(d));},
      y2 : function(d){ return Math.floor(y(d));},
      "stroke" : "black",
      "stroke-width" : "1px"
    });

  var bars = chartArea.append("g").selectAll("rect")
    .data(data.data)
    .enter().append("rect")
      .attr("x",function(d,i){ return x(new Date(d[0])); })
      .attr("y",function(d,i){ return y(d[1]); })
      .attr("width",barWidth)
      .attr("height",function(d,i){ return chartAreaSz.bottom - y(d[1]); })
      .attr("fill","blue")

      .on("mouseover", function(d) {
        var rect = d3.select(this);
        rect.attr("opacity", "0.5");

        tooltip.html("<div><b>" + formatCurrency(d[1]) + " Billion </b><div>"+
              "<div>" + formatDate(new Date(d[0])) + "</div>")
          .style("left", (d3.event.pageX+3) + "px")
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
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  $.getJSON(url).success(function(data) {
    a.drawBarChart("#chart1",data,800,500);
  });
});
