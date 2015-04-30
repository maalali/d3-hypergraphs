//<![CDATA[ 


$(window).load(function(){
var vertices = new Array();
var width = $('#renderingPanel').width() - 20,
    height = $('#renderingPanel').height() - 20;
// var width = window.innerWidth - 20,
//     height = window.innerHeight - 10;
var color = d3.scale.category10();
var r = 6;
var ndoeAdditionalDistance = 15;    // Used to create longer distance between nodes in different hyperedges
var incidenceMatrixInput; 
var hypergraph;
var hypergraphBackup;
var twoSecStatus = false;
var drawHyperedge = true;
var linkStyle = "nolink";
var nextFocusedCell;
var force = d3.layout.force().size([width, height]);
var svg = d3.select("#renderingPanel").append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").style({"padding-top": "9px", "padding-left":"9px"});
$(function() {


    
        // // Example #2
        // var incidenceMatrixInput = {
        //     "V":5,
        //     "E":2,
        //     "K":8,
        //     "Matrix":[
        //                     ["a", [ 1, 1, 1, 1, 0]],
        //                     ["b", [ 0, 1, 1, 1, 1]]
        //                 ]
        // };

        // Example #3
        incidenceMatrixInput = {
            "V":9,
            "E":2,
            "K":14,
            "Matrix":[
                            ["a", [ 1, 1, 1, 1, 0, 0, 0, 0, 0 ]],
                            ["b", [ 0, 0, 1, 1, 1, 1, 1, 0, 0 ]],
                            ["c", [ 0, 0, 0, 0, 1, 1, 1, 1, 1 ]]
                        ]
        };

       // // Example #1
       //  incidenceMatrixInput = {
       //      "V":8,
       //      "E":6,
       //      "K":27,
       //      "Matrix":[
       //                  ["a", [ 1, 1, 0, 1, 1, 1, 1, 1 ]],
       //                  ["b", [ 0, 0, 0, 1, 0, 0, 1, 0 ]],
       //                  ["c", [ 1, 0, 0, 1, 1, 0, 1, 1 ]],
       //                  ["d", [ 0, 0, 1, 1, 1, 0, 0, 1 ]],
       //                  ["e", [ 0, 1, 1, 0, 0, 1, 1, 0 ]],
       //                  ["f", [ 1, 1, 1, 0, 1, 0, 0, 1 ]]
       //              ]
       //  };

            // Get the matrix\hypergraph data
        hypergraph = incidenceMatrixInput.Matrix;
        hypergraphBackup = hypergraph;

        // Number of rows\Hyperedges
        var numOfRows = hypergraph.length; // Input from user
        
        // Number of cols/vertices
        var numOfCols = hypergraph[0][1].length;

        // Assign basic ops events
        $('#btnHGDual').click(dual);
        $('#btnHG2Sec').click(twoSection);
        $('#btnHGLineGraph').click(lineGraph);
        $('#btnHGRestore').click(function(){hypergraph = hypergraphBackup; drawHyperedge = true; d3_visualize();});
        $('#btnBrowse').change(loadFile);
        $('#attractionInput').val($('#attractionSlider').val());
        $('#gravityInput').val($('#gravitySlider').val());
        $('#repulsionInput').val($('#repulsionSlider').val());

        function d3_visualize() {

        $("#renderingPanel").html('');

        width = $('#renderingPanel').width() - 20;
        height = $('#renderingPanel').height() - 20;

        var force = d3.layout.force().size([width, height]);
        var svg = d3.select("#renderingPanel").append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").style({"padding-top": "9px", "padding-left":"9px"});
        // Example #2
        //var HGJason = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":1,\"target\":4,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":3,\"target\":4,\"value\":1},{\"source\":0,\"target\":4,\"value\":1}]}";
        //var HGJason = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":1,\"target\":4,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":3,\"target\":4,\"value\":1}]}";
        
        // Example #3
       //var HGJason = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"5\",\"group\":\"5\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"6\",\"group\":\"6\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"7\",\"group\":\"7\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"8\",\"group\":\"8\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":2,\"target\":5,\"value\":1},{\"source\":2,\"target\":6,\"value\":1},{\"source\":3,\"target\":4,\"value\":1},{\"source\":3,\"target\":5,\"value\":1},{\"source\":3,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":4,\"target\":7,\"value\":1},{\"source\":4,\"target\":8,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":5,\"target\":7,\"value\":1},{\"source\":5,\"target\":8,\"value\":1},{\"source\":6,\"target\":7,\"value\":1},{\"source\":6,\"target\":8,\"value\":1},{\"source\":7,\"target\":8,\"value\":1},{\"source\":0,\"target\":1,\"value\":1},{\"source\":1,\"target\":0,\"value\":1}]}";
        //var HGJason = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"5\",\"group\":\"5\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"6\",\"group\":\"6\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"7\",\"group\":\"7\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null},{\"name\":\"8\",\"group\":\"8\",\"HE\":[\"c\"],\"fontsize\":\"45px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":2,\"target\":5,\"value\":1},{\"source\":2,\"target\":6,\"value\":1},{\"source\":3,\"target\":4,\"value\":1},{\"source\":3,\"target\":5,\"value\":1},{\"source\":3,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":4,\"target\":7,\"value\":1},{\"source\":4,\"target\":8,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":5,\"target\":7,\"value\":1},{\"source\":5,\"target\":8,\"value\":1},{\"source\":6,\"target\":7,\"value\":1},{\"source\":6,\"target\":8,\"value\":1},{\"source\":7,\"target\":8,\"value\":1}]}";
        //var HGJason = "{\"nodes\":[{\"name\":\"0\",\"group\":\"0\",\"HE\":[\"a\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"1\",\"group\":\"1\",\"HE\":[\"a\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"2\",\"group\":\"2\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"3\",\"group\":\"3\",\"HE\":[\"a\",\"b\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"4\",\"group\":\"4\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"5\",\"group\":\"5\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"6\",\"group\":\"6\",\"HE\":[\"b\",\"c\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"7\",\"group\":\"7\",\"HE\":[\"c\"],\"fontsize\":\"10px\",\"title\":null},{\"name\":\"8\",\"group\":\"8\",\"HE\":[\"c\"],\"fontsize\":\"10px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":2,\"target\":5,\"value\":1},{\"source\":2,\"target\":6,\"value\":1},{\"source\":3,\"target\":4,\"value\":1},{\"source\":3,\"target\":5,\"value\":1},{\"source\":3,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":4,\"target\":7,\"value\":1},{\"source\":4,\"target\":8,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":5,\"target\":7,\"value\":1},{\"source\":5,\"target\":8,\"value\":1},{\"source\":6,\"target\":7,\"value\":1},{\"source\":6,\"target\":8,\"value\":1},{\"source\":7,\"target\":8,\"value\":1}]}";

        HGJason  = flattenMatrix(hypergraph);

       // HGJason = htmlDecode(HGJason);

        //HGJason = $.parseJSON(HGJason);

        createMatrixTable(hypergraph);

        //to edit here to make the line invesible change the stroke color and make it un visible
        svg.append("svg:rect").attr("width", width).attr("height", height).style("stroke", "#fff").style("fill", "rgb(204, 204, 204)");

        force.nodes(HGJason.nodes)
            .links(HGJason.links)
            .gravity(document.getElementById('gravitySlider').value)
            .linkDistance(function(n, i) {
                var l; 
                n.source.HE.length <= 1 || n.target.HE.length <= 1? l= (parseInt(document.getElementById('attractionSlider').value) + ndoeAdditionalDistance): l=parseInt(document.getElementById('attractionSlider').value); return l;

            })
            .charge(function(n, i){  return document.getElementById('repulsionSlider').value;})
            .linkStrength(0.9)
            .friction(0.9)
            .start();

        node = svg.selectAll(".node").data(HGJason.nodes).enter().append("g").attr("class", "node").attr("hyperedges", function(d) {
            return (d.HE)
        }).attr('name', function(d) { return d.name;});
        link = svg.selectAll(".link").data(HGJason.links).enter().append("line").attr("class", linkStyle).style("stroke-opacity", "0.2");

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
        
        var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);
   
    
        node.selectAll('text').data(HGJason.nodes).enter().append("text").attr("text-anchor", "middle").attr("dx", 2).attr("dy", ".35em").attr('original-title', function(d) {
            return d.title
        }).attr("style", function(d) {
            return "font-size:" + d.fontsize
        }).text(function(d) {
           // console.log(d);
            return d.name
            //return d.x + ',' + d.y;
        }).attr("style", function(d) {
            return "font-size:" + d.fontsize
        })/*.style('fill', function(d) {
            return color(d.group);
        })*/.style("cursor", "pointer")
        .call(force.drag)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('dblclick', releasenode)
        .on('click', connectedNodes) //Double-click on a node to fade out all but its immediate neighbours. 
        .call(node_drag);

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

            // If the key is empty, then this node does not belong to any hyperedge
            // so we ignore it to avoid drawing hyperedge arround the group of nodes
            // that do not belong to any hyperedge
            if(keys[0] != "") {

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
            }   

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
        var x2p = x2 - r2/d * (calpha * dx + salpha * dy);
        var y2p = y2 - r2/d * (-salpha * dx + calpha * dy);
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
           
             
            var calpha = (r1 - r2)/d;
            var salpha = Math.sqrt(1-(calpha*calpha));
            var x1p = x1 - (r1/d * (calpha * dx + salpha * dy));
            var y1p = y1 - (r1/d * (-salpha * dx + calpha * dy));
            var x2p = x2 - (r2/d * (calpha * dx + salpha * dy));
            var y2p = y2 - (r2/d * (-salpha * dx + calpha * dy));
            
            ret += "A "+r1+" "+r1+" 1 0 0 "+x1p+","+y1p+"L"+x2p+","+y2p;
            
            //console.log(ret); 
        }
        return ret;
    //return corners;
    };

        /*var groupPath = function(d) {
            var result = "M" + d3.geom.hull(d.values.map(function(i) {
                console.log(i);
                return [$(i).attr("cx"), $(i).attr("cy")];
            })).join("L") + "Z";

            return result;
        };*/
        
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

            // For debuggin purpose: display the x,y cooredinates on the nodes instead of their names
            //node.selectAll('text').text(function(d) {
               // return  parseFloat(d.x).toFixed(2) +","+ parseFloat(d.y).toFixed(2);
            //});

            if(drawHyperedge) {
              svg.selectAll("path")
                .data(groups)
                .attr("d", groupPath)
                .enter().insert("path", "g")
                .style("fill", groupFill)
                .style("stroke", groupFill)
                .style("stroke-width", 1)
                .style("stroke-linejoin", "round")
                .style("opacity", 0.2);

            } else {

                svg.selectAll("path")
                .data(groups);
            }


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
        
        function dragstart(d, i) {
            force.stop() // stops the force auto positioning before start dragging
        }
        
        function dragmove(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
        }
    
        function dragend(d, i) {
            d.fixed = true; // set the node to fixed so the force doesn't include the node in its auto positioning stuff
            force.resume();
        }
        
        function releasenode(d) {
            d.fixed = false; //  set the node to fixed so the force doesn't include the node in its auto positioning stuff
        }
    

        }

        // Initial call to start d3 visualization 
        // Can be removed after file load integration.
        d3_visualize();

 // Load JSON file
function loadFile(e) {

    ////////// start of reading JSON file ///////////////

     //var fileInput = document.getElementById('fileInput');
    var file = this.files[0];
    var textType = /json.*/;
    var json_text;

    $(txtFilePath).val(file.name);

        // if (file.type.match(textType))
        if (file.name.split('.')[1].match(textType))
        {

            //alert("file type matched!");
            var reader = new FileReader();

            reader.onload = function(e)
            {
               // fileDisplayArea.innerText = reader.result.toString();

                json_text=reader.result;
                //json=reader.result;
                //alert("fileDisplayArea got the text!");
                //console.log(json_text);
            }
            reader.onloadend = function(e){


                 incidenceMatrixInput = JSON.parse(json_text);
                 hypergraph = incidenceMatrixInput.Matrix;
                 hypergraphBackup = hypergraph;

                // Update file info
                $('#fileName').text(file.name);
                $('#fileSize').text(file.size + " KB");

                 d3_visualize();
                 //console.log(incidenceMatrixInput);
            }
            reader.onerror = function(e) {
                $(txtFilePath).val("Encountered an error!");
            }
            reader.readAsText(file);

        }
        else
        {
            $(txtFilePath).val("File not supported!");
        }

           

            //d3_visualize();

////////// end of reading JSON file ///////////////
}



    // function restart() {

    //     force.nodes([]);
    //     force.links([]);

    //     link = link.data(HGJason.links);
    //     link.exit().remove();
    //     link.enter().insert("line").attr("class", "link").style("stroke-opacity", "0.2");

    //     node = node.data(HGJason.nodes);
    //     //node.exit().remove();
    //     node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 5).call(force.drag);


    //     node.enter().insert("g").attr("class", "node").attr("hyperedges", function(d) {
    //         return (d.HE)
    //     }).attr('name', function(d) { return d.name;});

 
    //     force.start();
    // }


    function createMatrixTable(hg) {
    // Sample input which would come from JSON file. 
  // var hg = {
  //   "V":8,
  //   "E":6,
  //   "K":27,
  //   "Matrix":[
  //                   ["a", [ 1, 1, 0, 1, 1, 1, 1, 1 ]],
  //                   ["b", [ 0, 0, 0, 1, 0, 0, 1, 0 ]],
  //                   ["c", [ 1, 0, 0, 1, 1, 0, 1, 1 ]],
  //                   ["d", [ 0, 0, 1, 1, 1, 0, 0, 1 ]],
  //                   ["e", [ 0, 1, 1, 0, 0, 1, 1, 0 ]],
  //                   ["f", [ 1, 1, 1, 0, 1, 0, 0, 1 ]]
  //               ]
  //   };

    // We get the matrix only, other data are not really needed 
    //var inputHG = hg.Matrix;
    var inputHG = hg;

    // Number of rows\Hyperedges
    var numOfRows = inputHG.length; // Input from user
    
    // Number of cols/vertices
    var numOfCols = inputHG[0][1].length;
    
    // Main div container
    var mainContainerDiv = $('<div></div>').attr("id", "matrixContainer");
    
    // Main table container
    var mainTable = $('<table></table>').attr('id', 'matrixContainerTable');
    
    // Vertices' names table
    var verticesNamesTable = $('<table><tr></tr></table>').attr('id', 'vertNamesTable');

    // Create vertices' name headers
    verticesNamesTable = createColHeader(verticesNamesTable, inputHG);

    // Hyperedges' names table
    var hyperedgesNamesTable = $('<table></table>').attr('id', 'HENamesTable');

    // Create hyperedges\rows name headers
    hyperedgesNamesTable = createRowsHeader(hyperedgesNamesTable, inputHG);
    
    // Matrix data main div to contain the main matrix data table -- reason we have it: styling
    var matrixDataDiv = $('<div></div>').attr('id', 'matrixData');
    
    // Matrix data main table
    var matrixDataTable = $('<table></table>').attr('id', 'dataTable');

    // Create data table initialized with the input matrix data
    matrixDataTable = createMatrixDataTable(matrixDataTable, inputHG);  
    
    // Attach matrix data to matrix data main div
    $(matrixDataDiv).append(matrixDataTable);

    // Create the main matrix rows + cols and the rest of the matrix table structure
    mainTable = createMainMatrixStructure(mainTable,verticesNamesTable, hyperedgesNamesTable, matrixDataDiv );

    // attach table to div
    $(mainContainerDiv).append(mainTable);
    
    $('#matrixEditContent').html('');

    $('#matrixEditContent').append(mainContainerDiv);

    // Update matrix size
    updateMatrixSize(inputHG);

    //console.log(mainContainerDiv);
    
    // Attach events to add column\vertex and row\hyperedge
    $('#addCol').on('click', inputHG, addVertex);
    $('#addRow').on('click', inputHG, addHyperedge);

    updateMatrixStats();

    /******
    *   
    *
    *
    *   Functions
    *
    *
    */
}
    // Cols headers
    function createColHeader(verticesNamesTable, inputHG) {
        // Create the vertices names table
        // Number of cols/vertices
        var numOfCols = inputHG[0][1].length;
        for (var i = 0; i < numOfCols; i++) {
            
            var vertexName = '<td>' + i + '</td>';
            $(verticesNamesTable).children().eq(0).children().eq(0).append(vertexName);
        };

        return verticesNamesTable;
    }

    // Rows Headers
    function createRowsHeader(hyperedgesNamesTable, inputHG) {

        // Create the hyperedges names table
        var numOfRows = inputHG.length;
        for (var i = 0; i < numOfRows; i++) {
        
            var inputBox = createMatrixHeaderCell(inputHG[i][0]);

            //var hyperedge = '<tr><td>' +  inputHG[i][0] + '</td></tr>';
            var td = $('<td></td>').append(inputBox);
            var hyperedge = $('<tr></tr>').append(td);

            $(hyperedgesNamesTable).append(hyperedge);
        };

        return hyperedgesNamesTable;
    }

    // Matrix table with initial data
    function createMatrixDataTable(matrixDataTable, inputHG) {

        // Create the main data table
        var numOfRows = inputHG.length;
        var numOfCols = inputHG[0][1].length;
        for (var i = 0; i < numOfRows; i++) {
        
            var hyperedge = $('<tr></tr>');

            for (var col = 0; col < numOfCols; col++) {

                // Create a new cell for a vertex
                //var vertex = '<td' + ' style="color:' + (inputHG[i][1][col] == '0'? 'Gray':'rgb(181, 255, 24)') + ';">' + inputHG[i][1][col] + '</td>';
                
                var inputBox = createMatrixInputCell(inputHG[i][1][col], i, col, inputHG );

                var vertex = $('<td></td>').append(inputBox);
                

                // For some reasons, attaching a class after page load does not render at all
                //var vertex = $('<td>' +  inputHG[i][1][col] + '</td>');
                //$(vertex).addClass('one');

                // Attach the new cell to the current hyperedge row
                $(hyperedge).append(vertex);

            };

            $(matrixDataTable).append(hyperedge);
        };

        return matrixDataTable;
    }

    // Create the main matrix table structure
    function createMainMatrixStructure(mainTable, verticesNamesTable, hyperedgesNamesTable, matrixDataDiv) {

        for (var i = 0; i < 4 ;i++) {

                $(mainTable).append('<tr></tr>');
            };

        // Add the rest 
        $(mainTable).children().eq(0).children().each(function(i, e){

            switch (i) {

                case 0:
                    
                    $(e).append('<td></td>');
                    $(e).append('<td></td>');
                    $(e).append('<td id="vertTitle">Vertices</td>');
                    
                break;
                case 1:

                    $(e).append('<td></td>');
                    $(e).append('<td></td>');
                    $(e).append('<td id="vertNames"></td>');
                    
                    // Get the last added td
                    var vertNamesTd = $(e).last().children().eq(2);

                    // Attach the vertices' names table
                    $(vertNamesTd).append(verticesNamesTable);

                    // Add the add col td
                    $(e).append('<td id="addCol">+</td>');

                    //console.log(e);

                break;
                case 2:

                    $(e).append('<td id="HETitle">HE</td>');
                    $(e).append('<td id="HENames"></td>');

                    // Get the last added td
                    var HENamesTd = $(e).last().children().eq(1);

                    // Attach the hyperedges' names table
                    $(HENamesTd).append(hyperedgesNamesTable);

                    $(e).append('<td id="matrixDataCell"></td>');

                    // Get the last td
                    var matrixDataCellTd = $(e).last().children().eq(2);;

                    // Attach the hyperedges' names table
                    $(matrixDataCellTd).append(matrixDataDiv);

                    //console.log(e);
                break;
                case 3:

                    $(e).append('<td></td>');
                    $(e).append('<td id="addRow">+</td>');
                    $(e).append('<td id="matrixSize">+</td>');
                    //console.log(e);
                break;                                  
            }
        });

        return mainTable;
    }

    function getNewHEName(lastHEName) {

        var newName;

        if (lastHEName.length > 1)
            newName = lastHEName[lastHEName.length - 1];
        else
            newName = lastHEName;

        var ascii = newName.toLowerCase().charCodeAt();

        // a = 97 to z = 122
        if(ascii >= 122) {

            newName = lastHEName.substring(0, lastHEName.length -1) + 'aa';

        } else {

            newName = lastHEName.substring(0, lastHEName.length - 1) + String.fromCharCode(ascii + 1);
        }

        return newName;
    }

    // Reflect changes to the hypergraph data structure from the matrix table 
    function updateHypergraph(inputHG, UpdateType, source) {

        switch(UpdateType) {

            case "row":

                    // Get the number of cols
                    var numOfCols = inputHG[0][1].length;

                    // Get the new row name -- the last one which has been added lastly
                    var newRowName = $('#HENamesTable td input').last().val();

                    // Create a new array initialized with zeros
                    var newRowArray = [];

                    for (var i = 0; i < numOfCols; i++) {
                        newRowArray.push(0);
                    };

                    // Create the new hyperedge
                    var newRow = [newRowName, newRowArray];

                    // Push it to the inputHG
                    inputHG.push(newRow);

            break;

            case "col":

                    // Get the number of cols
                    var numOfRows = inputHG.length;

                    // Add a col in each hyperedge
                    for (var i = 0; i < numOfRows; i++) {
                        
                        inputHG[i][1].push(0);
                    };

            break;

            case "cell" :

                    // Reflect changes in the hypergraph data structure
                    inputHG[$(source).attr('row')][1][$(source).attr('col')] = parseInt($(source).val());

                    //console.log($(source).attr('row') + ',' + $(source).attr('col'));
                    //console.log(inputHG);
            break;
        }
    }

    function updateMatrixSize(inputHG) {

        var numOfRows = inputHG.length;
        var numOfCols = inputHG[0][1].length;

        $('#matrixSize').html(numOfRows + ' X ' + numOfCols);

    }

    /**
    *
    *   Events Functions
    *
    */
    function addVertex(e) {

        // Get the hypergraph/inputHG to work with 
        var HG = e.data;

        // Get the last vertex name 
        var lastVertexName = parseInt($('#vertNamesTable td').last().text());

        // Create the next new name -- we're using numbers so just increment the number by one
        var newVertexName = $('<td>' + (lastVertexName + 1) + '</td>');

        // Append the new vertex name 
        $('#vertNamesTable tr').append(newVertexName);

        // Get how many row we have so we can create the column 
        var numOfRows = HG.length;

        // Add the new column 
        //var newCell = $('<td>0</td>').css('color', 'Gray');
        //$('#dataTable tr').append(newCell);
        $('#dataTable tr').each(function(row) {

            var newCell = $('<td></td>').append(createMatrixInputCell(0,row, (lastVertexName + 1), HG));
            $(this).append(newCell);

        });

        // Reflect changes on the hypergraph data structure
        updateHypergraph(HG, "col", null);

        // Update matrix size 
        updateMatrixSize(HG);

        // Update stats
        //updateMatrixStats();

        // Refresh 
        d3_visualize();

        //console.log(HG);

    }

    function addHyperedge(e) {
        
        // Get the hypergraph\inputHG
        var HG = e.data;

        // Get num of cols
        var numOfCols = HG[0][1].length;

        // Get the last latter (last hyperedge name)
        var lastHEName = $('#HENamesTable input').last().val();

        // Create the next letter
        var newName = getNewHEName(lastHEName);

        var inputBox = createMatrixHeaderCell(newName);

        // Update the hyperedges header
        //$('#HENamesTable tbody').append('<tr><td>' + newName + '</td></tr>');
        var td = $('<td></td>').append(inputBox);
        $('#HENamesTable tbody').append($('<tr></tr>').append(td));

        // Add the new row
        //$('#dataTable tbody').append($('#dataTable tr').last().clone());
        //$('#dataTable tr').last().children().children().val('0').css('color', 'Gray');

        var tr = $('<tr></tr>');

        var newRowIndex = $('#dataTable tr').length;

        for (var i = 0; i < numOfCols; i++) {
            
            var td = $('<td></td>').append(createMatrixInputCell(0, newRowIndex,i, HG));

            $(tr).append(td);
        };

        $('#dataTable tbody').append(tr);

        // Reflect changes on the hypergraph data structure
        updateHypergraph(HG, "row", null);

        // Update matrix size 
        updateMatrixSize(HG);

        // Update matrix stats
        updateMatrixStats();

        //d3_visualize();
        //console.log(HG);
    }

    // Create an input HTML element for hyperedges\row names
    // Currently, we do not allow name modification, so the textbox is disabled
    function createMatrixHeaderCell(cellVal) {

        var inputBox = $('<input></input>')
                        .attr({'maxLength':50, 'type':'text', 'disabled':'disabled'})
                        .css({'color':'white', 'width': '100%', 'height':'20px', 'border':'none', 'border-width':'0px', 
                            'text-align':'center','background-color':'rgb(145, 145, 145)'})
                        .val(cellVal);
                        // .keyup(function() {
                        //  var l = $(this).val().length;
                        //  if(l == 1) {

                        //      $(this).css({'width':'22px', 'text-align':'center'});
                        //  } else {

                        //  var newWidth = ((l - 1) * 7) + 22;
                        //  $(this).css({'width':newWidth + 'px', 'text-align':'left'});
                        // }
                        // });
        return inputBox;
    }


    // Create a data cell and attaches the row and col values so we know where to update in the original data matrix (i.e. the original hypergraph data structure)
    function createMatrixInputCell(cellVal, row, col, inputHG) {

        var inputBox = $('<input></input>')
                                .attr({'maxLength':1, 'type':'text', 'row': row, 'col':col}).css({'color':(cellVal == '0'? 'Gray':'rgb(181, 255, 24)'),
                                'width': '20px', 'height':'20px', 'border':'none', 'border-width':'0px', 'text-align':'center',
                                'background-color':'rgb(181, 185, 190)'})
                                .val(cellVal )
                                .keydown(function(e) {

                                    //console.log(e);

                                    // These input conditions taken from : http://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
                                    // Allow: backspace, delete, tab, escape, enter and .
                                    if ($.inArray(e.keyCode, [/*46, 8, */9, 27, 13, 110]) !== -1 ||
                                         // Allow: Ctrl+A
                                        (e.keyCode == 65 && e.ctrlKey === true) || 
                                         // Allow: home, end, left, right, down, up
                                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                                             // let it happen, don't do anything
                                             return;
                                    }
                                    else if (e.keyCode != 48 && e.keyCode != 49 ) 
                                        e.preventDefault();
                                        
                                })
                                .keyup(function(e){
                                    if (e.keyCode != 48 && e.keyCode != 49 ) return;
                                    $(this).val() == '0'? $(this).css('color', 'Gray') : $(this).css('color', 'rgb(181, 255, 24)');
                                })
                                .change(function(e){

                                    updateHypergraph(inputHG, 'cell', this);
                                    console.log($(this).val());

                                    d3_visualize();

                                    nextFocusedCell = $(this).parent().parent().children().eq(parseInt($(this).attr('col')) + 1).children().eq(0);
                                    //console.log($(this).parent().parent().children().eq(nextFocusedCell).children().eq(0));
                                    // Flatten
                                    //HGJason  = flattenMatrix(hypergraph);
                                    
                                });

        return inputBox;
    }

    /*
    *
    *
    *   Hypergraph Ops Functions
    *
    */

    function dual() {


        var HGMatrix = [];

        for (var i = 0; i < hypergraph.length; i++) {
            HGMatrix.push(hypergraph[i][1]);
        };

        transposedHGMatrix = HGMatrix[0].map(function(col, i) { 
              return HGMatrix.map(function(row) { 
                return row[i] 
              })
        });

        var numOfRows = transposedHGMatrix.length;
        var numOfCols = transposedHGMatrix[0].length;
        var HEName = "a";

        // CLear current hypergraph
        hypergraph = [];

        for (var i = 0; i < numOfRows; i++) {

            hypergraph.push([HEName, transposedHGMatrix[i]]);
            HEName = getNewHEName(HEName);
        };

        d3_visualize();
    }

    // 2-Sec
    function twoSection() {

        if (twoSecStatus) {
                        
            linkStyle = "nolink";
            twoSecStatus = false;
            drawHyperedge = true;
            d3_visualize();
        
        } else {
            linkStyle = "link";
            twoSecStatus = true;
            drawHyperedge = false;
            d3_visualize();
        }
            // var oneBar = d3.select(".link")
            // oneBar.classed(".link", !oneBar.classed(".nolink"));
    }


    // Line graph
    function lineGraph() {

        var numOfRows = hypergraph.length;
        var numOfCols = hypergraph[0][1].length;
        var HGLineGraph = new Array(numOfRows);
        var dontCheck = [];

        for (var i = 0; i < numOfRows; i++) {
            
            // The first col is the hypergraph in relation with itself so it is zero
            HGLineGraph[i] = [hypergraph[i][0], new Array(numOfRows)];
            HGLineGraph[i][1][i] = 0;
        };

        for (var i = 0; i < numOfRows; i++) {

            // No need to check the last one anyways
            // if (i+1 == numOfRows) break;

            // Each hyperedge will have a row length = the number of hyperedges in the HG
            //HGLineGraph[i][1] = new Array(numOfRows);

            if(dontCheck.indexOf(i) != -1) {
             
                for (var col = 0; col < numOfRows; col++) {
                    HGLineGraph[i][1][col] = 0;
                };

                continue;
            }

            for (var ii = 0; ii < numOfRows; ii++) {

                    if (i == ii) continue;
                  for (var col = 0; col < numOfCols; col++) {

                    if(hypergraph[i][1][col] == 1 && hypergraph[ii][1][col] == 1) {
                        HGLineGraph[i][1][ii] = 1;
                        HGLineGraph[i][1][i] = 1;
                        dontCheck.push(ii);
                        break;
                    }

                    //if (col + 1 == numOfCols) {hypergraph[i][1][ii]};
                  }

                  if (HGLineGraph[i][1][ii] == undefined) {
                    HGLineGraph[i][1][ii] = 0;
                   // HGLineGraph[i][1][i] = 0;
                }
            }
        }

        // Assign the new 
        hypergraph = HGLineGraph;

        // Enable Line Graph by disabling convex hull drawing
        drawHyperedge = false;

        // Refresh
        d3_visualize();
    }

    //
    // Update the matrix stats
    function updateMatrixStats() {

        // Get the number of vertices
        var numOfVertices = hypergraph[0][1].length;
         $('#numOfVertices').text(numOfVertices);

        // Get the number of edges
        var numOfHyperedges = hypergraph.length;
        $('#numOfHyperedges').text(numOfHyperedges);

        // Get the cardinality K
        var cardinalityK = 0; 
        // Get the maxRank -> the edges with highest number of vertices
        var maxEdgesRanks = 0;
        var verticesCount = 0;

        for (var i = 0; i < numOfHyperedges; i++) {
            
            verticesCount = 0;
            for (var col = 0; col < numOfVertices; col++) {
                if (hypergraph[i][1][col] == 1) {
                    cardinalityK++;
                    verticesCount++;
                };
            }

            if(verticesCount > maxEdgesRanks)
                maxEdgesRanks = verticesCount;
        };

        $('#matrixCardinality').text(cardinalityK);
        $('#maxRank').text(maxEdgesRanks);

        // Find max degree -> the vertex that is touching\part-of the max number of hyperedges
        var numOfNodes = HGJason.nodes.length;
        var maxDegree = 0;
        var countDegrees = 0;

        for (var i = 0; i < numOfNodes; i++) {
        
            if(HGJason.nodes[i].HE.length > maxDegree)
                maxDegree = HGJason.nodes[i].HE.length;
        };

        $('#maxDegree').text(maxDegree);

    }


    /**
    ** CONVERSION FUNCTION 
            Converts an input matrix of a hypergraph into a regular flat JSON format that the d3 force function accepts
    **/

    function flattenMatrix(incidenceMatrix) {

        // Get the matrix from the JSON object using one of the examples above
        //var m = incidenceMatrix.Matrix;
        var m = incidenceMatrix;
        var edgeName;
        var edgeVector;

        // The JSON object which holds the classical graph JSON format
        var jsonG = new Object({"nodes":[], "links":[]});
        var nodeCount =0, linksCount = 0;

        //console.log(jsonG);
        
        // Loop through all rows
        for(var i =0; i < m.length; i++) {
            
            edgeName = m[i][0];     // The name of the row = the name of the hyperedge
            edgeVector = m[i][1];   // A complete row = one hyperedge

            // Creates the nodes array in the JSON object which contains the verteces' names and their colors
            for (var col = 0; col < edgeVector.length; col++) {
                
                // Each vertex name is a number starting from 1 to |V|
                if(jsonG.nodes[col] == undefined) {
                    
                    jsonG.nodes[col] = {"name": (col).toString() , "group": (col).toString(), "HE": [], "fontsize":"35px", "title":null,};
                
                 } 
                
                
                // create the necessary links for the current vertex
                if(edgeVector[col] == 1) {

                    // Add the current hyperedge's name to the node's attribute: hyperedges to indicate that the current 
                    // node is a member of the added hyperedge
                    jsonG.nodes[col].HE.push(edgeName);

                    // Go through the next verteces to check for relations
                    // Note that all vertices in one edge should be related forming a complete graph (a clique)
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

        // for (var i = 0; i < jsonG.nodes.length; i++) {
        //     if(jsonG.nodes[0].HE.length == 0)
        //         jsonG.nodes.splice(i, 1);
        // };

        //return JSON.stringify(jsonG); // Return the JSON string
        return jsonG;                   // Return the JSON object
    } // End of flattenMatrix function 
  
});


function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


//------------ highlighting -----------------------------------------------------
//Double-click on a node to fade out all but its immediate neighbours. 

//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < HGJason.nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
};
HGJason.links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}
function connectedNodes() {
    if (toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;
    } else {
        //Put them back to opacity=1
        node.style("opacity", 1);
        link.style("opacity", 1);
        toggle = 0;
    }
}
//____________________________________________________________________________

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
});//]]>  
