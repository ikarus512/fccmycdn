var a = a || {};

MyMapArea = function(selector,width,height) {
    this.sat = 0;
    this.hue = 0;

    var container = d3.select(selector)
        .attr("id","mapContainer")
        .style("position","relative");

    var tooltip = container.append("div")
        .attr("id","mapTooltip")
        .style({
            "position": "absolute",
            "box-sizing": "border-box",
            padding : "10px",
            "display": "none",
            //"opacity": 0,
            "border": "1px solid black",
            "border-radius": "10px",
            "text-align": "center",
            "color": "black",
            "background-color": "lightgrey",
        });

    this.svg = container
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

    this.sea = this.svg.append( "rect" )
        .attr("id","seasArea")
        .attr({x:0, y:0, width:width, height:height, stroke:"black", fill:"blue"});

    this.map = this.svg.append( "g" )
        .attr("id","mapArea");

    this.countries = this.map.append( "g" )
        .attr("id","mapArea");

    this.meteorites = this.map.append( "g" )
        .attr("id","meteoritesArea")

    this.projection = d3.geo.equirectangular()
        .translate([width/2,height/2])
        .scale(127);

    // function to turn lat/lon coordinates into screen coordinates
    this.path = d3.geo.path()
        .projection( this.projection );

    var zoomed = function () {
        var e = d3.event,
            tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
            ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
            scale=e.scale;
        this.zoom.translate([tx, ty]);

        this.map.attr("transform", "translate(" + [tx,ty] + ")scale(" + scale + ")");

    }.bind(this);

    this.zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 20])
        .on("zoom", zoomed);

    this.svg.call(this.zoom);


    var addCountriesJson = function (json) {
        var jfeatures = topojson.feature(json, json.objects.countries).features;

        this.countries.selectAll( "path" )
            .data( jfeatures )
        .enter()
            .append( "path" )
            .attr( "fill", "#080" )
            .attr( "stroke", "#040")
            .attr( "stroke-width", 0.1)
            .attr( "d", this.path );
    }.bind(this);

    this.addCountries = function(data) {
        if( typeof(data) === "string" ) { // Here if data is URL
            d3.json(data, function(data) { addCountriesJson(data); });
        } else { // Here if data is JSON
            addCountriesJson(data);
        }
    }

    var addDataJson = function (json) {
        json.features.sort(function(a,b) {
            return b.properties.mass - a.properties.mass;
        });

        json.features.map(function(d) {
            var hue = 360 * Math.random();
            d.color = 'hsl('+hue+',100%, 50%)';
        });


        this.meteorites
            .selectAll('circle')
            .data(json.features)
        .enter()
            .append('circle')
            .attr('cx', function(d) { return this.projection([d.properties.reclong,d.properties.reclat])[0] }.bind(this))
            .attr('cy', function(d) { return this.projection([d.properties.reclong,d.properties.reclat])[1] }.bind(this))
            .attr('r', function(d) {
                var range = 718750/2/2;

                if (d.properties.mass <= range) return 1;
                else if (d.properties.mass <= range*2) return 2;
                else if (d.properties.mass <= range*3) return 5;
                else if (d.properties.mass <= range*20) return 10;
                else if (d.properties.mass <= range*100) return 15;
                return 20;
            })
            .attr("fill",function(d){return d.color;})
            .attr("fill-opacity",0.5)
            .attr("stroke-width",0.1)
            .attr("stroke","white")

            .on('mouseover', function(d) {
                var rect = d3.select(this);
                rect.attr("fill-opacity", "1");

                var p = d.properties;
                tooltip.html(""
                    + "<div> Name: " + (p.name) + "</div>"
                    + "<div> Mass: " + (p.mass) + "</div>"
                    + "<div> Year: " + (new Date(p.year)).getFullYear()+ "</div>"
                    + "<div> Coords: " + (p.reclat) + " x " + (p.reclong) + "</div>"
                    + "<div> Fall: " + (p.fall) + "</div>"
                    + "<div> Rec.Class: " + (p.recclass) + "</div>"
                    + "<div> Type: " + (p.nametype) + "</div>"
                );

                var posLeft = $(this).position().left - $("#mapTooltip").width() - 40;
                if(posLeft<0) posLeft = $(this).position().left + $(this).width() + 20;

                var posTop  = $(this).position().top - $("#mapTooltip").height() - 40;

                tooltip
                    // .style("left", (d3.event.pageX-20) + "px")
                    // .style("top", (d3.event.pageY-20) + "px");
                    .style("left", posLeft + "px")
                    .style("top", posTop + "px");

                tooltip.style("display", "block")
                    //.transition()
                    //.duration(1000)
                    //.style("opacity", 1);
            })

            .on("mouseout", function() {
                var rect = d3.select(this);
                rect.attr("fill-opacity", "0.5");

                tooltip
                    .style("display", "none")
                    //.style("opacity", 0);
            });

    }.bind(this);

    this.addData = function(data) {
        if( typeof(data) === "string" ) { // Here if data is URL
            d3.json(data, function(data) { addDataJson(data); });
        } else { // Here if data is JSON
            addDataJson(data);
        }
    }
};

$(document).ready(function(){
    var map = new MyMapArea("#chart1",800,400);
    //map.addCountries(a.map);
    map.addCountries("https://d3js.org/world-50m.v1.json"); //https://github.com/topojson/world-atlas
    //map.addData(a.data);
    map.addData("https://data.nasa.gov/resource/y77d-th95.geojson");
});
