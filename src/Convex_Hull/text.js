//orig for tesxt.js -----> f2..csv
//stroke: #999;

var vertices = new Array();
var width = 960,
    height = 500;
var color = d3.scale.category10();
var r = 6;
var force = d3.layout.force().size([width, height]);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
$(function() {


       
          //color group of nodes only
    var json = "{\"nodes\":[{\"name\":\"v2\",\"group\":1,\"group\":2,\"fontsize\":\"10px\",\"title\":\"E0\"},{\"name\":\"v3\",\"group\":1,\"fontsize\":\"10px\",\"title\":\"E1\"},{\"name\":\"v7\",\"group\":1,\"fontsize\":\"10px\",\"title\":\"E2\"},{\"name\":\"v8\",\"group\":1,\"fontsize\":\"10px\",\"title\":\"E3\"},{\"name\":\"v10\",\"group\":1,\"fontsize\":\"10px\",\"title\":\"E4\"},{\"name\":\"v4\",\"group\":2,\"fontsize\":\"10px\",\"title\":\"E5\"},{\"name\":\"v5\",\"group\":2,\"fontsize\":\"10px\",\"title\":\"E6\"},{\"name\":\"v11\",\"group\":3,\"fontsize\":\"10px\",\"title\":\"E7\"},{\"name\":\"v12\",\"group\":3,\"fontsize\":\"10px\",\"title\":\"E8\"},{\"name\":\"v13\",\"group\":3,\"fontsize\":\"10px\",\"title\":\"E9\"},{\"name\":\"v14\",\"group\":2,\"fontsize\":\"10px\",\"title\":\"E10\"}],\"links\":[{\"source\":0,\"target\":3,\"value\":1},{\"source\":0,\"target\":4,\"value\":1},{\"source\":0,\"target\":5,\"value\":1},{\"source\":0,\"target\":6,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":4,\"value\":1},{\"source\":2,\"target\":1,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":3,\"target\":0,\"value\":1},{\"source\":3,\"target\":2,\"value\":1},{\"source\":4,\"target\":0,\"value\":1},{\"source\":4,\"target\":1,\"value\":1},{\"source\":5,\"target\":0,\"value\":1},{\"source\":5,\"target\":4,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":5,\"target\":7,\"value\":1},{\"source\":5,\"target\":10,\"value\":1},{\"source\":6,\"target\":0,\"value\":1},{\"source\":6,\"target\":0,\"value\":1},{\"source\":6,\"target\":4,\"value\":1},{\"source\":6,\"target\":5,\"value\":1},{\"source\":6,\"target\":7,\"value\":1},{\"source\":6,\"target\":10,\"value\":1},{\"source\":7,\"target\":5,\"value\":1},{\"source\":7,\"target\":6,\"value\":1},{\"source\":7,\"target\":8,\"value\":1},{\"source\":7,\"target\":9,\"value\":1},{\"source\":8,\"target\":7,\"value\":1},{\"source\":8,\"target\":9,\"value\":1},{\"source\":9,\"target\":7,\"value\":1},{\"source\":9,\"target\":8,\"value\":1},{\"source\":10,\"target\":5,\"value\":1},{\"source\":10,\"target\":6,\"value\":1}]}";


    json = htmlDecode(json);


    json = $.parseJSON(json);

//to edit here to make the line invesible change the stroke color and make it un visible
    svg.append("svg:rect").attr("width", width).attr("height", height).style("stroke", "#fff").style("fill", "#fff");

    force.nodes(json.nodes).links(json.links).gravity(0.05).linkDistance(120).charge(-200).start();

    var node = svg.selectAll(".node").data(json.nodes).enter().append("g").attr("class", "node").attr("grp", function(d) {
        return (d.group)
    });
    var link = svg.selectAll(".link").data(json.links).enter().append("line").attr("class", "link").style("stroke-opacity", "0.2");

    node.append('circle').attr('r', function(d) {
        var tmprad = parseInt(d.fontsize.replace('px', '')) * (d.name.length / 3);
        if (tmprad > r) r = tmprad;
        return tmprad;
    }).style('fill', '#ffffff').style('stroke', function(d) {
        return color(d.group)
    });

    node.selectAll('text').data(json.nodes).enter().append("text").attr("text-anchor", "middle").attr("dx", 2).attr("dy", ".35em").attr('original-title', function(d) {
        return d.title
    }).attr("style", function(d) {
        return "font-size:" + d.fontsize
    }).text(function(d) {
        return d.name
    }).attr("style", function(d) {
        return "font-size:" + d.fontsize
    }).style('fill', function(d) {
        return color(d.group);
    }).style("cursor", "pointer").call(force.drag);

    var cx = new Array();
    var cy = new Array();

    node.attr("cx", function(d) {
        cx.push(d.x);
    }).attr("cy", function(d) {
        cy.push(d.y);
    });
        
    cx.forEach(function(o, i) {
        vertices.push(new Array(cx[i], cy[i]));
    });

    var nodes = vertices.map(Object);
    //console.log(node[0]);
//***********************************************************************************
    //var groups = d3.nest().key(function(d) {

    var groups = d3.nest().key(function(d) {
        //console.log($(d).attr("grp"));
        return $(d).attr("grp");
    }).entries(node[0]);
        
    var getRadius = function(x,y,d) {
        var margin = 10;
        for(var i in d.values) {
            i = d.values[i];
            if(parseInt($(i).attr("cx")) == x && parseInt($(i).attr("cy")) == y) {
                return parseInt($(i.childNodes[0]).attr("r"))+margin;
            }
        }
        return 100+margin;
    }
            
     
    var groupPath = function(data) {
        var corners = d3.geom.hull(data.values.map(function(i) {
            return [$(i).attr("cx"), $(i).attr("cy")];
        }));
        if(corners.length == 0) {return "";}
        
        var x1 = parseInt(corners[corners.length - 1][0]);
        var y1 = parseInt(corners[corners.length - 1][1]);
        var x2 = parseInt(corners[0][0]);
        var y2 = parseInt(corners[0][1]);
        var r1 = getRadius(x1,y1,data);
        var r2 = getRadius(x2,y2,data);
        var dx = (x2-x1);
        var dy = (y2-y1);
        var d = Math.sqrt(dx*dx + dy*dy);
        var calpha = (d!=0)?(r1 - r2)/d:0;
        var salpha = Math.sqrt(1-(calpha*calpha));
        var x2p = x2 + r2/d * ( calpha * dx + salpha * dy);
        var y2p = y2 + r2/d * (-salpha * dx + calpha * dy);
        var ret = "M"+x2p+","+y2p;
        for(var i = 0;i<corners.length;i++) {
            var x1 = parseInt(corners[i][0]);
            var y1 = parseInt(corners[i][1]);
            var x2 = parseInt(corners[(i+1)%corners.length][0]);
            var y2 = parseInt(corners[(i+1)%corners.length][1]);
            var r1 = getRadius(x1,y1,data);
            var r2 = getRadius(x2,y2,data);
            var dx = (x2-x1);
            var dy = (y2-y1);
            var d = Math.sqrt(dx*dx + dy*dy);
            console.log(d);
            var calpha = (r1 - r2)/d;
            var salpha = Math.sqrt(1-(calpha*calpha));
            var x1p = x1 + (r1/d * ( calpha * dx + salpha * dy));
            var y1p = y1 + (r1/d * (-salpha * dx + calpha * dy));
            var x2p = x2 + (r2/d * ( calpha * dx + salpha * dy));
            var y2p = y2 + (r2/d * (-salpha * dx + calpha * dy));
            //ret += "L"+x1p+","+y1p+"L"+x2p+","+y2p;
            ret += "A "+r1+" "+r1+" 0 0 1 "+x1p+","+y1p+"L"+x2p+","+y2p;
        }
        return ret;
    };

//key
    var groupFill = function(d, i) {
        return color(d.key);
    };

    svg.style("opacity", 1e-6).transition().duration(1000).style("opacity", 1);


    force.on("tick", function() {
        

        link.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });


        node.attr("cx", function(d) {
            return d.x = Math.max(r, Math.min(width - r, d.x));
        }).attr("cy", function(d) {
            return d.y = Math.max(r, Math.min(height - r, d.y));
        });

        node.selectAll('circle').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"
        });

        // reposition text
        node.selectAll('text').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"
        });

      svg.selectAll("path")
        .data(groups)
        .attr("d", groupPath)
        .enter().insert("path", "g")
        .style("fill", groupFill)
        .style("stroke", groupFill)
        .style("stroke-width", 1)
        .style("stroke-linejoin", "round")
        .style("opacity", .2)
        .attr("d", groupPath);


    });
});

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function move() {
    vertices[0] = d3.svg.mouse(this);
    update();
}

function click() {
    vertices.push(d3.svg.mouse(this));
    update();
}

function update() {
    svg.selectAll("path").data([d3.geom.hull(vertices)]).attr("d", function(d) {
        return "M" + d.join("L") + "Z";
    }).enter().append("svg:path").attr("d", function(d) {
        return "M" + d.join("L") + "Z";
    });

    svg.selectAll("nodes").data(vertices.slice(1)).enter().append("svg:circle").attr("transform", function(d) {
        return "translate(" + d + ")";
    });
}