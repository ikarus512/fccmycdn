var a = a || {};

// Country flag sprite libraries:
//  https://www.flag-sprites.com  (16x10px   .flag.flag.code)
//  https://github.com/lafeber/world-flags-sprite (32x20 .f32 .flag.code)

a.drawForceGraph = function(selector,data,width,height) {

  ////////////////////////////////////////////////
  //  container
  //    svgArea
  //    containerArea
  //    tooltip
  ////////////////////////////////////////////////
  var container = d3.select(selector).style({
    "position": "relative",
    "box-sizing": "border-box",
    width: width+"px",
    height: height+"px",
    overflow: "hidden",
    "color": "white",
    "background-color": "darkblue",
  });

  var svgArea = container.append("svg").attr({width:width, height:height})
    .style("position","relative");

  var containerArea = container.append("div").attr({width:width, height:height})
    .style("position","absolute")
    .style("left","0px")
    .style("top","0px");

  var tooltip = container.append("div").attr("id","myTooltip").style({
    "position": "absolute",
    "box-sizing": "border-box",
    padding : "10px",
    //"display": "none",
    "opacity": 0,
    "border": "1px solid black",
    "border-radius": "10px",
    "text-align": "center",
    "color": "black",
    "background-color": "lightgrey",
  });


  var nodes = data.nodes;
  var links = data.links;
  nodes.forEach(function(n,i){
    n.neighbours = links.reduce(function(prev,l){
      if(l.source===i || l.target===i)
        return prev+1;
      return prev;
    },0);
  });

  ////////////////////////////////////////////////
  //  Force layout
  ////////////////////////////////////////////////
  var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    // .linkStrength(0.1)
    // .friction(0.9)
    .linkDistance(100)
    .charge(-30)
    .gravity(0.05)
    // .theta(0.8)
    // .alpha(0.1)
    .on("tick", tick)
    .start();


  ////////////////////////////////////////////////
  //  Links
  ////////////////////////////////////////////////
  var link = svgArea.selectAll('.link')
    .data(links)
  .enter().append('line')
    .attr("class","link")
    .attr({"stroke-width":"1px", "stroke":"#f00", });

  ////////////////////////////////////////////////
  //  Nodes
  ////////////////////////////////////////////////
  var node = containerArea.selectAll(".node")
    .data(nodes)
  .enter().append("div")
    .attr("class", "node")
    .style("position","absolute")
    .style("width", function(d) { return (8+d.neighbours)*2+"px"; })
    .style("height" , function(d) { return (8+d.neighbours)*2+"px"; })
    .style("border" , "1px solid black")
    .style("border-radius" , function(d) { return 8+d.neighbours+"px"; })
    .style("background-color", "#444")
    .call(force.drag);

  node.append("div")
    .style("position","absolute")
    .style("left", function(d) { return (8+d.neighbours-8)+"px"; })
    .style("top" , function(d) { return (8+d.neighbours-5)+"px"; })
    .attr("class",function(d){return "flag flag-"+d.code;});

  node.on("mouseover", function(d) {
    var rect = d3.select(this);
    rect.style("opacity", "0.5");

    tooltip.html(""
        +"<div>"
        +  "<span class='" + ("flag flag-"+d.code) + "' style='display:inline-block;'> </span>"
        +  "&nbsp; <b>" + d.country + "</b>"
        +  "<div>"
        +"<div>Neighbours: " + d.neighbours + "</div>"
      );

    tooltip
      // .style("left", (d3.event.pageX-20) + "px")
      // .style("top", (d3.event.pageY-20) + "px");
      .style("left", ($(this).position().left - $("#myTooltip").width()-20) + "px")
      .style("top", ($(this).position().top - $("#myTooltip").height()-20) + "px");

    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
  });

  node.on("mouseout", function() {
    var rect = d3.select(this);
    rect.style("opacity", "1");

    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

  //console.log(document);

  function tick(e) {
    node
      .style("left", function(d) { return (d.x-8-d.neighbours)+"px"; })
      .style("top" , function(d) { return (d.y-8-d.neighbours)+"px"; })

    link
      .attr('x1', function(d) { return d.source.x;})
      .attr('x2', function(d) { return d.target.x;})
      .attr('y1', function(d) { return d.source.y;})
      .attr('y2', function(d) { return d.target.y;});
  }

};

$(document).ready(function(){
  // a.drawForceGraph("#chart1",a.data,800,800);

  var url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  d3.json(url, function(error, d) {
    if (error) throw error;
    a.drawForceGraph("#chart1",d,800,800);
  });
});
