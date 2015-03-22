// Example #1
var hg = {
	"V":8,
	"E":6,
	"K":27,
	"Matrix":[
					["a", [ 1, 1, 0, 1, 1, 1, 1, 1 ]],
					["b", [ 0, 0, 0, 1, 0, 0, 1, 0 ]],
					["c", [ 1, 0, 0, 1, 1, 0, 1, 1 ]],
					["d", [ 0, 0, 1, 1, 1, 0, 0, 1 ]],
					["e", [ 0, 1, 1, 0, 0, 1, 1, 0 ]],
					["f", [ 1, 1, 1, 0, 1, 0, 0, 1 ]]
				]
};

// Example #2
var hg2 = {
	"V":8,
	"E":6,
	"K":27,
	"Matrix":[
					["a", [ 1, 1, 1, 1, 0]],
					["b", [ 0, 1, 1, 1, 1]]
				]
};

// Get the matrix from the JSON object using one of the examples above
var m = hg2.Matrix;
var edgeName;
var edgeVector;

// The JSON object which holds the classical graph JSON format
var jsonG = new Object({"nodes":[], "links":[]});
var nodeCount =0, linksCount = 0;

//console.log(jsonG);

// Loop through all rows
for(var i =0; i < m.length; i++) {
	
	edgeName = m[i][0];		// The name of the row = the name of the hyperedge
	edgeVector = m[i][1];	// A complete row = one hyperedge

	// Creates the nodes array in the JSON object which contains the verteces' names and their colors
	for (var col = 0; col < edgeVector.length; col++) {
		
		// Each vertex name is a number starting from 1 to |V|
		jsonG.nodes[col] = {"name": (col).toString() , "group": (col).toString()}
		
		
		// create the necessary links for the current vertex
		if(edgeVector[col] == 1) {

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
console.log(JSON.stringify(jsonG));

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

*/