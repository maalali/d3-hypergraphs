//<![CDATA[
////////// global variables. ///////////////

var json_text="";     // content of the input file: {"V":8,"E":6,"K":27, ......
var json_text_obj="";

// filled by matrixConvert() and returned to the json obj in visualization()
var jsonG = new Object({"nodes":[], "links":[]});

// json of content file that is ready for visualization; json = "{\"nodes\":[{\"name\":\"0\",\".......
// returned by matrixConvert()
var json="";


$(window).load(function(){


////////// start of reading JSON file ///////////////

    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e)
    {
        var file = fileInput.files[0];
        var textType = /json.*/;

        if (file.type.match(textType))
        {

            //alert("file type matched!");
            var reader = new FileReader();

            reader.onload = function(e)
            {
                fileDisplayArea.innerText = reader.result.toString();

                json_text=reader.result;
                //json=reader.result;
                //alert("fileDisplayArea got the text!");
                console.log(json_text);
            }

            reader.readAsText(file);

        }
        else
        {
            fileDisplayArea.innerText = "File not supported!"
        }
    });//end of addEventListener

////////// end of reading JSON file ///////////////

});


///////////////////////////////////////////////////////////////////////////////////////////
///// START matrixConvert() Function; converts the json-text of input file to the json format
///// for the use of visualization Function
///////////////////////////////////////////////////////////////////////////////////////////

function matrixConvert()
{

// Get the matrix from the JSON object using one of the examples above

    console.log(json_text.toString());

    json_text_obj=jQuery.parseJSON(json_text);  // convert json string to java object

    console.log(json_text_obj);

    var m = json_text_obj.Matrix;

    console.log(m);



    var edgeName;
    var edgeVector;

// The JSON object which holds the classical graph JSON format
    //var jsonG = new Object({"nodes":[], "links":[]});
    var nodeCount =0, linksCount = 0;

//console.log(jsonG);

// Loop through all rows
    for(var i =0; i < m.length; i++) {

        edgeName = m[i][0];	// "a"	// The name of the row = the name of the hyperedge
        edgeVector = m[i][1];	// 1, 1, 1, 1, 0, 0, 0, 0, 0  // A complete row = one hyperedge

        // Creates the nodes array in the JSON object which contains the verteces' names and their colors
        for (var col = 0; col < edgeVector.length; col++) {

            // Each vertex name is a number starting from 1 to |V|
            if(jsonG.nodes[col] == undefined) {

                jsonG.nodes[col] = {"name": (col).toString() , "group": (col).toString(), "HE": [], "fontsize":"45px", "title":null};

            }


            // create the necessary links for the current vertex
            if(edgeVector[col] == 1) {

                // Add the current hyperedge's name to the node's attribute: hyperedges to indicate that the current
                // node is a member of the added hyperedge
                jsonG.nodes[col].HE.push(edgeName);

                // Go through the next verteces to check for relations
                // Note that all verteces in one edge should be related forming a complete graph (a clique)
                // We know each edge's nodes in one vector by the value of each vertex.
                // If the value is 1, the vertex belongs to a given edge, if 0, it doesn't.
                for(var j = col + 1; j < edgeVector.length; j++) {

                    // If the next vertex has value =1, form a link between current vertex and the next
                    if(edgeVector[j] == 1) {

                        // Add a an object to the link array in our JSON object
                        jsonG.links[linksCount] = {"source": col, "target": j, "value": 1};

                        linksCount++; // increase links count
                    }
                }
            }

        };


    }

// Print the result just for testing
    console.log(JSON.stringify(jsonG)); // convert java obj to json string

    /*
     This is the format we want to convert our matrix to:

     {
     "nodes":[
     {"name":"0","group":1}, group = color
     {"name":"1","group":2},
     ...
     ...
     ...
     ]

     "links":[
     {"source":1,"target":2,"value":1}, value = link thickness -> 0 = no link
     {"source":1,"target":3,"value":1},
     ...
     ...
     ...
     ]
     }

     */

    return jsonG; // return json string to the visualization()
}
///////////////////////////////////////////////////////////////////////////////////////////
///// END matrixConvert()
///////////////////////////////////////////////////////////////////////////////////////////
//]]>

function visualizationFunction()
{
    document.getElementById('visualization-area').innerHTML = "";

    json = matrixConvert();

    console.log(json);

    json = JSON.stringify(json);

    console.log(json);


////////// Start visualization ///////////////

    var vertices = new Array();
// var width = 960,
//     height = 500;
    var width = window.innerWidth - 20,
        height = window.innerHeight - 10;
    var color = d3.scale.category10();
    var r = 6;
    var ndoeAdditionalDistance = 60;    // Used to create longer distance between nodes in different hyperedges
    var force = d3.layout.force().size([width, height]);
    var svg = d3.select(document.getElementById('visualization-area')).append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    $(function() {

        // Example #2
        // Example #3

        json = htmlDecode(json);

        console.log(json);


        json = $.parseJSON(json);

        console.log(json);


        //to edit here to make the line invesible change the stroke color and make it un visible
        svg.append("svg:rect").attr("width", width).attr("height", height).style("stroke", "#fff").style("fill", "#fff");

        force
            .nodes(json.nodes)
            .links(json.links)
            .gravity(0.1)
            //.chargeDistance()
            .linkDistance(
            function(d, i)
            {
                if(d.HE == 'a') {
                    return 900;
                }
                else if (d.HE == 'b'){
                    return 400;
                }
                else // d.HE == 'c'
                {return 50;}
            })
            .charge(-400)
            //.friction(function(d, i){  if(d.HE == 'a') { return 0.1; } else if (d.HE == 'b'){return 0.7;}else {return 1.2;} })
            .start();

        var node = svg.selectAll(".node").data(json.nodes).enter().append("g").attr("class", "node").attr("hyperedges", function(d) {
            return (d.HE)
        }).attr('name', function(d) { return d.name;});
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

        var nodeName;
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
            });


        });

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
                // if ($(i) == undefined) return;

                //console.log($(i));

                // console.log("Inside hull: ");
                // console.log(val);

                return [$(i).attr("cx"), $(i).attr("cy"), $(i).attr('name')]; // ** NOTE: node name has been added for debugging; it is not needed.
            }));

            // console.log("done hull");

            if(corners.length == 0) {return "";}

            // console.log("Inside grouPath: ");
            // console.log(corners);

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

                var calpha = (d!=0)?(r1 - r2)/d:0;
                var salpha = Math.sqrt(1-(calpha*calpha));
                var x1p = x1 + (r1/d * ( calpha * dx + salpha * dy));
                var y1p = y1 + (r1/d * (-salpha * dx + calpha * dy));
                var x2p = x2 + (r2/d * ( calpha * dx + salpha * dy));
                var y2p = y2 + (r2/d * (-salpha * dx + calpha * dy));
                //ret += "L"+x1p+","+y1p+"L"+x2p+","+y2p;
                ret += " A "+r1+" "+r1+" 0 0 1 "+x1p+","+y1p+"L"+x2p+","+y2p;
                //ret = ret.replace(/NaN/g, '0')
            }
            //console.log(ret);
            return ret;
        };


        var groupFill = function(d, i) {
            return color(d.key);
        };

        // svg.style("opacity", 1e-6).transition().duration(1000).style("opacity", 1);


        force.on("tick", function() {


            // (x1,y1) o-------------o (x2,y2)
            link.attr("x1", function(d) {
                return d.source.x;
            }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });

            // nodes\verteces locations
            // node = all g SVG elements. HTML tag example: <g ... cx='100' cy='20' ..
            // Please note: both attributes updates ONLY data object associated with each element. It does NOT make the changes effective\visible
            // to the end user untill we do the transformation  below.
            node.attr("cx", function(d) {
                return d.x = Math.max(r, Math.min(width - r, d.x)); // to make sure it is within our SVG area width
            }).attr("cy", function(d) {
                return d.y = Math.max(r, Math.min(height - r, d.y)); // to make sure it is within our SVG area height
            });

            // After the above updates to the data objects associated with each g elemnt (each node), we
            // apply transformation to make changes visible (i.e. render HTML\SVG updates to be visible to the end user)
            node.selectAll('circle').attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"
            });

            // reposition text
            // Same as the above node's transformation
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
                .style("opacity", .2);
            //.attr("d", groupPath);


        });
        d3.select("#gravitySlider").on("input", function() {
            force.stop();
            var newGravity = document.getElementById('gravitySlider').value;
            var newCharge = document.getElementById('repulsionSlider').value;
            var newLStrength = document.getElementById('attractionSlider').value;

            document.getElementById('gravityInput').value = newGravity;
            document.getElementById('repulsionInput').value = newCharge;
            document.getElementById('attractionInput').value = newLStrength;

            force
                .charge(newCharge)
                .linkDistance(function(n, i) {
                    var l;
                    n.source.HE.length <= 1 || n.target.HE.length <= 1? l=( parseInt(newLStrength) + ndoeAdditionalDistance): l=newLStrength; return l;

                })
                .gravity(newGravity).start();

        });

        d3.select("#attractionSlider").on("input", function() {
            force.stop();
            var newGravity = document.getElementById('gravitySlider').value;
            var newCharge = document.getElementById('repulsionSlider').value;
            var newLStrength = document.getElementById('attractionSlider').value;

            document.getElementById('gravityInput').value = newGravity;
            document.getElementById('repulsionInput').value = newCharge;
            document.getElementById('attractionInput').value = newLStrength;

            force
                .charge(newCharge)
                .linkDistance(function(n, i) {
                    var l;
                    n.source.HE.length <= 1 || n.target.HE.length <= 1? l=( parseInt(newLStrength) + ndoeAdditionalDistance): l=newLStrength; return l;

                })
                .gravity(newGravity).start();

        });

        d3.select("#repulsionSlider").on("input", function() {
            force.stop();
            var newGravity = document.getElementById('gravitySlider').value;
            var newCharge = document.getElementById('repulsionSlider').value;
            var newLStrength = document.getElementById('attractionSlider').value;

            document.getElementById('gravityInput').value = newGravity;
            document.getElementById('repulsionInput').value = newCharge;
            document.getElementById('attractionInput').value = newLStrength;

            force
                .charge(newCharge)
                .linkDistance(function(n, i) {
                    var l;
                    n.source.HE.length <= 1 || n.target.HE.length <= 1? l=( parseInt(newLStrength) + ndoeAdditionalDistance): l=newLStrength; return l;

                })
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

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    /*function move() {
     //vertices[0] = d3.svg.mouse(this);
     // update();
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
     }*/

}
