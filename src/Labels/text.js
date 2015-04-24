//<![CDATA[ 
$(window).load(function(){
var vertices = new Array();
var width = window.innerWidth - 20,
    height = window.innerHeight - 10;
var color = d3.scale.category10();
var r = 6;
var force = d3.layout.force().size([width, height]);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
$(function() {

    // Example #2
    var json = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":1,\"target\":4,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":3,\"target\":4,\"value\":1}]}";
    
    // Example #3
    //var json = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"5\",\"group\":\"5\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"6\",\"group\":\"6\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"7\",\"group\":\"7\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"8\",\"group\":\"8\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":2,\"target\":5,\"value\":1},{\"source\":2,\"target\":6,\"value\":1},{\"source\":3,\"target\":4,\"value\":1},{\"source\":3,\"target\":5,\"value\":1},{\"source\":3,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":4,\"target\":7,\"value\":1},{\"source\":4,\"target\":8,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":5,\"target\":7,\"value\":1},{\"source\":5,\"target\":8,\"value\":1},{\"source\":6,\"target\":7,\"value\":1},{\"source\":6,\"target\":8,\"value\":1},{\"source\":7,\"target\":8,\"value\":1}]}";



    json = htmlDecode(json);

    json = $.parseJSON(json);

//to edit here to make the line invesible change the stroke color and make it un visible

    force.nodes(json.nodes).links(json.links).gravity(document.getElementById('gravitySlider').value).linkDistance(document.getElementById('attractionSlider').value).charge(document.getElementById('repulsionSlider').value).start();


    var node = svg.selectAll(".node").data(json.nodes).enter().append("g").attr("class", "node").attr("hyperedges", function(d) {
        return (d.HE)
    });
    var link = svg.selectAll(".link").data(json.links).enter().append("line").attr("class", "link").style("stroke-opacity", "0.2");

    node.append('circle').attr('r', function(d) {
        var tmprad = parseInt(d.fontsize.replace('px', '')) * (d.name.length / 3);
        if (tmprad > r) r = tmprad;
        return tmprad;
    }).style('fill', '#ffffff').style('stroke', function(d) {
        return color(d.group)
    });



//Set up tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip') //tooltips   d3-tip
    .offset([-10, 0])
    .html(function (d) {
    return  d.name + "";


})
svg.call(tip);
//-------------------------



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
    }).style("cursor", "pointer").call(force.drag).on('click', tip.show).on('mouseout', tip.hide);
//click   mouseover   mouseout
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
   
    //var nodes = vertices.map(Object);
    // var groups = d3.nest().key(function(d) {

    //    //console.log(d);
    //     return $(d).attr("grp");
    // }).entries(node[0]);
    // console.log(node[0]);

    //console.log(node[0]);
    //console.log(groups);

    //*****************
    // Buidling the above map manually without using the nest function
    var groups = [];        // The final groups map
    var keys = [];          // Keys = the names of hyperedges
    var groupsObj = {};     // A temp object to hold grouped nodes. 
                            // This is used to utilize the hashtable property in JavaScript so we don't have to check for duplicate keys

    // Loop through all nodes
    node[0].forEach(function(n) { 

        // Get the each node's hyperedges list in which they belong to
        keys = ($(n).attr("hyperedges")).split(",");

        // Add each key to our groups. Each key is a hyperedge
        keys.forEach(function(k) { 

            // Existing key
            if(groupsObj[k] != undefined) {

                // Add the current node to the key (i.e. to the hyperedge)
                groupsObj[k].values.push(n);
            } 
            else // A new key
            {
                // Create a new key
                groupsObj[k] = {"key": k, "values": []};

                // Add the current node to the key (i.e. to the hyperedge)
                groupsObj[k].values.push(n);
            }
        })
    })

    // Convert the list of objects into an array
    for(var i in groupsObj) {

        groups.push(groupsObj[i]);
    }
    //****

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
        
        //console.log(corners);
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
           
           // console.log(d);  

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


//=================================


    
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


    d3.select("#gravitySlider").on("change", function() { 
        force.stop();
        var newGravity = document.getElementById('gravitySlider').value;
        var newCharge = document.getElementById('repulsionSlider').value;
        var newLStrength = document.getElementById('attractionSlider').value;
        
        
        document.getElementById('gravityInput').value = newGravity;
        document.getElementById('repulsionInput').value = newCharge;
        document.getElementById('attractionInput').value = newLStrength;

        force
        .charge(newCharge)
        .linkDistance(newLStrength)
        .gravity(newGravity).start();
  
        });
       
    d3.select("#attractionSlider").on("change", function() { 
         force.stop();
        var newGravity = document.getElementById('gravitySlider').value;
        var newCharge = document.getElementById('repulsionSlider').value;
        var newLStrength = document.getElementById('attractionSlider').value;
        
        document.getElementById('gravityInput').value = newGravity;
        document.getElementById('repulsionInput').value = newCharge;
        document.getElementById('attractionInput').value = newLStrength;

        force
        .charge(newCharge)
        .linkDistance(newLStrength)
        .gravity(newGravity).start();
  
        });

 

    d3.select("#repulsionSlider").on("change", function() { 
         force.stop();
        var newGravity = document.getElementById('gravitySlider').value;
        var newCharge = document.getElementById('repulsionSlider').value;
        var newLStrength = document.getElementById('attractionSlider').value;
         
        document.getElementById('gravityInput').value = newGravity;
        document.getElementById('repulsionInput').value = newCharge;
        document.getElementById('attractionInput').value = newLStrength;
 
        force
        .charge(newCharge)
        .linkDistance(newLStrength)
        .gravity(newGravity).start();
  
        });

    d3.select("#dark-theme").on("click", function () {

        d3.select("body").attr("class", "dark");
        d3.selectAll("#dark-theme").attr("disabled", "disabled");
        d3.selectAll("#light-theme").attr("disabled", null);
        svg.selectAll('rect').style("fill", "#131313");

    });

   d3.select("#light-theme").on("click", function () {
        d3.select("body").attr("class", null);
        d3.selectAll("#light-theme").attr("disabled", "disabled");
        d3.selectAll("#dark-theme").attr("disabled", null);
        svg.selectAll('rect').style("fill", "#fff");

 });

});
//------
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


  

});//]]>
