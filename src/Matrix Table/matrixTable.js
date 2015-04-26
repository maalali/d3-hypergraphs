/***
*
*	Information Visualization - CS 4/5/6/79995, Spring 2015
*	Team Project
*	
*	Team :  
*	Basma Alqadi 		<balqadi@kent.edu>
*	Tahani Albalawi		<talbala1@kent.edu>
*	Mohammed Alali 		<malali1@kent.edu>
*	Ismael Ali 			<iali1@kent.edu>
*	Naser Madi 			<nmadi@kent.edu>
*
*
*	Desc.: 	This file creates the hypergraph matrix. It allows users to add rows\hyperegde and columns\vertices.
			It also allows users to manipulate the matrix data where changes are reflected on the original matrix data structure. 
			The original matrix data structure (variable) is the one that is passed to converting function then to the d3's force function for rendering.
**/

$(function() {
	
	// Sample input which would come from JSON file. 
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

	// We get the matrix only, other data are not really needed 
	var inputHG = hg.Matrix;

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
	verticesNamesTable = createColHeader(verticesNamesTable);

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
	mainTable = createMainMatrixStructure(mainTable);

	// attach table to div
	$(mainContainerDiv).append(mainTable);
	
	$('body').html('');

	$('body').append(mainContainerDiv);
	//console.log(mainContainerDiv);
	
	// Attach events to add column\vertex and row\hyperedge
	$('#addCol').on('click', inputHG, addVertex);
	$('#addRow').on('click', inputHG, addHyperedge);

	/******
	*	
	*
	*
	*	Functions
	*
	*
	*/

	// Cols headers
	function createColHeader(verticesNamesTable) {
		// Create the vertices names table
		for (var i = 0; i < numOfCols; i++) {
			
			var vertexName = '<td>' + i + '</td>';
			$(verticesNamesTable).children().eq(0).children().eq(0).append(vertexName);
		};

		return verticesNamesTable;
	}

	// Rows Headers
	function createRowsHeader(hyperedgesNamesTable, inputHG) {

		// Create the hyperedges names table
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
	function createMainMatrixStructure(mainTable) {
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

					$(e).append('<td id="HETitle">H</td>');
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
					var newRowName = $('#HENamesTable td').last().text();

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

	/**
	*
	*	Events Functions
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
						// 	var l = $(this).val().length;
						// 	if(l == 1) {

						// 		$(this).css({'width':'22px', 'text-align':'center'});
						// 	} else {

						// 	var newWidth = ((l - 1) * 7) + 22;
						// 	$(this).css({'width':newWidth + 'px', 'text-align':'left'});
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
								});

		return inputBox;
	}

});