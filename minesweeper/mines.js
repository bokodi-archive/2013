$(document).ready(function() {
	$("#game_start").click(function() {
		rowLength = parseInt($("#row").val());
		columnLength = parseInt($("#column").val());
		$("#row_label").css("color", "black");
		$("#column_label").css("color", "black");
		
		if (isNaN(rowLength)) {
			$("#row_label").css("color", "red");
		}
		
		if (isNaN(columnLength)) {
			$("#column_label").css("color", "red");
		}
		
		if (!isNaN(rowLength) && !isNaN(columnLength)) {
			numberOfCells = rowLength * columnLength;
			$("#starter_div").hide();
			$("#table").html("<ul></ul>");
			$("#table ul").css("width", rowLength * 20);
			$("#table ul").css("margin", "0 auto");
			
			for (i = 0; i < numberOfCells; i++) {
				$("#table ul").append("<li></li>");
			}
			
			item = $("#table ul li");
			item.css("float", "left");
			item.css("outline", "black solid thin");
			item.css("width", "20px");
			item.css("height", "20px");
			item.css("background", "#EEF5B5");
			mines = new Array();
			
			for (i=0; i<numberOfCells*0.2; i++) {
				do {
					thisMine = Math.floor((Math.random()*numberOfCells))
				} while (jQuery.inArray(thisMine, mines) != (-1))
				
				mines[i] = thisMine;
			}
		}
		
		function row(ix) {
			thisRow = Math.floor(ix / rowLength) + 1;
			return thisRow;
		}
		
		function column(ix) {
			thisColumn = (ix - (row(ix) - 1) * rowLength) + 1;
			return thisColumn;
		}
		
		function nearbys(parent) {
			UL = parent - rowLength - 1;
			if (parent - rowLength - 1 < 0 || Math.abs(column(parent - rowLength - 1) - column(parent)) != 1) {UL = "n"}
			UP = parent - rowLength;
			if (parent - rowLength < 0) {UP = "n"}
			UR = parent - rowLength + 1;
			if (parent - rowLength + 1 < 0 || Math.abs(column(parent - rowLength + 1) - column(parent)) != 1) {UR = "n"}
			Left = parent - 1;
			if (parent - 1 < 0 || Math.abs(column(parent - 1) - column(parent)) != 1) {Left = "n"}
			Right = parent + 1;
			if (parent + 1 > numberOfCells || Math.abs(column(parent + 1) - column(parent)) != 1) {Right = "n"}
			DL = parent + rowLength - 1;
			if (parent + rowLength - 1 > numberOfCells || Math.abs(column(parent + rowLength - 1) - column(parent)) != 1) {DL = "n"}
			Down = parent + rowLength;
			if (parent + rowLength > numberOfCells) {Down = "n"}
			DR = parent + rowLength + 1;
			if (parent + rowLength + 1 > numberOfCells || Math.abs(column(parent + rowLength + 1) - column(parent)) != 1) {DR = "n"}
		}
		
		function howManyMines(ix, iy) {
			nextIsMine = 0;
			nearbys(ix);
			
			if ($.inArray(UL, mines) != (-1)) {nextIsMine++}
			if ($.inArray(UP, mines) != (-1)) {nextIsMine++}
			if ($.inArray(UR, mines) != (-1)) {nextIsMine++}
			if ($.inArray(Left, mines) != (-1)) {nextIsMine++}
			if ($.inArray(Right, mines) != (-1)) {nextIsMine++}
			if ($.inArray(DL, mines) != (-1)) {nextIsMine++}
			if ($.inArray(Down, mines) != (-1)) {nextIsMine++}
			if ($.inArray(DR, mines) != (-1)) {nextIsMine++}
			
			nearbys(iy);
			
			return nextIsMine;
		}
		
		item.click(function() {
			index = $(this).index();
			
			if ($.inArray(index, mines) != (-1)) {
				$(this).html('<img src="pics/mine.png"/>');
			} else {
				if (howManyMines(index, index) != 0) {
					$(this).html(howManyMines(index, index));
				} else {
					empty = new Array(); m = 0;
					checked = new Array(); n = 0;
					empty[m] = index; m++;
					nearbys(index);
					
					if (howManyMines(UL, index) == 0 && UL != "n") {empty[m] = UL; m++;}
					if (howManyMines(UP, index) == 0 && UP != "n") {empty[m] = UP; m++;}
					if (howManyMines(UR, index) == 0 && UR != "n") {empty[m] = UR; m++;}
					if (howManyMines(Left, index) == 0 && Left != "n") {empty[m] = Left; m++;}
					if (howManyMines(Right, index) == 0 && Right != "n") {empty[m] = Right; m++;}
					if (howManyMines(DL, index) == 0 && DL != "n") {empty[m] = DL; m++;}
					if (howManyMines(Down, index) == 0 && Down != "n") {empty[m] = Down; m++;}
					if (howManyMines(DR, index) == 0 && DR != "n") {empty[m] = DR; m++;}
					
					checked[n] = index; n++;
					
					do {
						emptLen = empty.length;
						x = 0;
						for (i = 0; i < emptLen; i++) {
							nearbys(empty[i]);
							if ( $.inArray(empty[i], checked) != (-1) ) { continue }
							if ( howManyMines(UL, empty[i]) == 0 && UL != "n" && $.inArray(UL, empty) == (-1) ) { empty[m] = UL; m++; x = 1; }
							if ( howManyMines(UP, empty[i]) == 0 && UP != "n" && $.inArray(UP, empty) == (-1) ) { empty[m] = UP; m++; x = 1; }
							if ( howManyMines(UR, empty[i]) == 0 && UR != "n" && $.inArray(UR, empty) == (-1) ) { empty[m] = UR; m++; x = 1; }
							if ( howManyMines(Left, empty[i]) == 0 && Left != "n" && $.inArray(Left, empty) == (-1) ) { empty[m] = Left; m++; x = 1; }
							if ( howManyMines(Right, empty[i]) == 0 && Right != "n" && $.inArray(Right, empty) == (-1) ) { empty[m] = Right; m++; x = 1; }
							if ( howManyMines(DL, empty[i]) == 0 && DL != "n" && $.inArray(DL, empty) == (-1) ) { empty[m] = DL; m++; x = 1; }
							if ( howManyMines(Down, empty[i]) == 0 && Down != "n" && $.inArray(Down, empty) == (-1) ) { empty[m] = Down; m++; x = 1; }
							if ( howManyMines(DR, empty[i]) == 0 && DR != "n" && $.inArray(DR, empty) == (-1) ) { empty[m] = DR; m++; x = 1; }
							checked[n] = empty[i]; n++;
						}
					} while ( x == 1 )
					
					for (i=0; i<empty.length; i++) {
						nearbys(empty[i]);
						if (howManyMines(UL, empty[i]) != 0) {item.eq(UL).html(howManyMines(UL, empty[i]))}
						if (howManyMines(UP, empty[i]) != 0) {item.eq(UP).html(howManyMines(UP, empty[i]))}
						if (howManyMines(UR, empty[i]) != 0) {item.eq(UR).html(howManyMines(UR, empty[i]))}
						if (howManyMines(Left, empty[i]) != 0) {item.eq(Left).html(howManyMines(Left, empty[i]))}
						if (howManyMines(Right, empty[i]) != 0) {item.eq(Right).html(howManyMines(Right, empty[i]))}
						if (howManyMines(DL, empty[i]) != 0) {item.eq(DL).html(howManyMines(DL, empty[i]))}
						if (howManyMines(Down, empty[i]) != 0) {item.eq(Down).html(howManyMines(Down, empty[i]))}
						if (howManyMines(DR, empty[i]) != 0) {item.eq(DR).html(howManyMines(DR, empty[i]))}
						item.eq(empty[i]).css("background", "green");
					}
				}
				
			}
		});
		
		item.bind("contextmenu", function(e) {
			return false;
		});
		
		item.mousedown(function(event) {
			switch (event.which) {
				case 3:
					$(this).html('<img src="pics/flag.png"/>');
					break;
			}
		});
	});
});