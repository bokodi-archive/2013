$(document).ready(function() {
	rowLength = 15; // number of cells at one row
	columnLength = 9; // number of cells at one column
	numberOfCells = rowLength * columnLength; // number of all cells
	numberOfBreakableWalls = 40; // number of breakable walls
	breakableWalls = new Array();
	unbreakableWalls = new Array();
	numberOfBombs = 0; // default bombs
	numberOfMonsters = 1; // default monsters
	bombRadius = 2; // cells
	moveUp = 0; // default move up
	moveRight = 0; // default move right
	moveDown = 0; // default move down
	moveLeft = 0; // default move left
	waitUp = 0; // default wait_list up
	waitRight = 0; // default wait_list right
	waitDown = 0; // default wait_list down
	waitLeft = 0; // default wait_list left
	moveSpeed = 10; // milliseconds
	monsterSpeed = 2000; // milliseconds
	animateSpeed = 200; // milliseconds
	moveHelpRate = 1; // percent
	upCode = 38; // key_code
	rightCode = 39; // key_code
	downCode = 40; // key_code
	leftCode = 37; // key_code
	charStep = 2; // character animated position
	direction = ""; // character's direction
	
	for (i=0, j=0; i<numberOfCells; i++) {
		$("#area ul").append("<li></li>");
		var index = $("#area ul li").eq(i).index();
		if (row(index)%2 == 0 && column(index)%2 == 0) {
			$("#area ul li").eq(index).css("background", "url('pics/concrete.jpg')");
			unbreakableWalls[j] = index; j++;
		}
	}
	for (i=0, j=0; i<numberOfBreakableWalls; i++) {
		do {
			var wall = Math.floor((Math.random()*numberOfCells));
		} while (wall == 0 || wall == 1 || wall == rowLength || $.inArray(wall, unbreakableWalls) != (-1) || $.inArray(wall, breakableWalls) != (-1));
		$("#area ul li").eq(wall).css("background", "url('pics/brick.jpg')");
		breakableWalls[j] = wall; j++;
	}
	for (i=0; i<numberOfMonsters; i++) {
		do {
			var cell = Math.floor((Math.random()*numberOfCells));
		} while (cell == 0 || cell == 1 || cell == rowLength || $.inArray(cell, unbreakableWalls) != (-1) || $.inArray(cell, breakableWalls) != (-1));
		var mTop = (row(cell) - 1) * $("#area ul li").height();
		var mLeft = (column(cell) - 1) * $("#area ul li").width();
		$("#area").prepend("<div class='monster' style='top: "+mTop+"px; left: "+mLeft+"px;'></div>");
	}
		
});
	
	function row(ix) {
		var thisRow = Math.floor(ix / rowLength) + 1;
		return thisRow;
	}
	function column(ix) {
		var thisColumn = (ix - (row(ix) - 1) * rowLength) + 1;
		return thisColumn;
	}
	
	$(function() {
		$(document).keydown(function(e) {
			if (e.ctrlKey && !numberOfBombs) { setBomb(); }
		});
		$(document).keydown(function(e) {
			switch(e.keyCode) {
				case upCode: moveUp = 1; moveRight = 0; moveDown = 0; moveLeft = 0; waitUp = 1; {direction = "back";} break;
				case rightCode: moveRight = 1; moveUp = 0; moveDown = 0; moveLeft = 0; waitRight = 1; {direction = "right";} break;
				case downCode: moveDown = 1; moveUp = 0; moveRight = 0; moveLeft = 0; waitDown = 1; {direction = "front";} break;
				case leftCode: moveLeft = 1; moveUp = 0; moveRight = 0; moveDown = 0; waitLeft = 1; {direction = "left";} break;
			}
		});
		$(document).keyup(function(e) {
			switch(e.keyCode) {
				case upCode: moveUp = 0; waitUp = 0;
					if (waitRight) {moveRight = 1; direction = "right"; break}
					if (waitDown) {moveDown = 1; direction = "front"; break}
					if (waitLeft) {moveLeft = 1; direction = "left"; break} break;
				case rightCode: moveRight = 0; waitRight = 0;
					if (waitUp) {moveUp = 1; direction = "back"; break}
					if (waitDown) {moveDown = 1; direction = "front"; break}
					if (waitLeft) {moveLeft = 1; direction = "left"; break} break;
				case downCode: moveDown = 0; waitDown = 0;
					if (waitUp) {moveUp = 1; direction = "back"; break}
					if (waitRight) {moveRight = 1; direction = "right"; break}
					if (waitLeft) {moveLeft = 1; direction = "left"; break} break;
				case leftCode: moveLeft = 0; waitLeft = 0;
					if (waitUp) {moveUp = 1; direction = "back"; break}
					if (waitRight) {moveRight = 1; direction = "right"; break}
					if (waitDown) {moveDown = 1; direction = "front"; break} break;
			}
			if (moveUp == 0 && moveRight == 0 && moveDown == 0 && moveLeft == 0) {direction = ""};
		});
		setup();
	});

	function setup() {
		topPos = $("#character").css("top");
		leftPos = $("#character").css("left");
		var width = $("#character").width();
		var height = $("#character").height();
		$("#area").prepend("<div id='ghost' style='position: absolute; left:"+ leftPos +"; top:"+ topPos +"; width:"+ width +"px; height:"+ height +"px;'></div>");
		moveGhostInterval = setInterval("moveGhost()", moveSpeed);
		moveMonsterInterval = setInterval("moveMonster()", monsterSpeed);
		setInterval("characterAnimate()", animateSpeed);
	}
	
	function whichCell() {
		var area = $("#area");
		var cell = $("#area ul li");
		var character = $("#character");
		var cellWidth = cell.width();
		var cellHeight = cell.height();
		var characterWidth = character.width();
		var characterHeight = character.height();
		var characterTop = character.offset().top - area.offset().top;
		var characterLeft = character.offset().left - area.offset().left;
		var characterRow = Math.ceil((characterTop + characterHeight / 2) / cellHeight);
		var characterColumn = Math.ceil((characterLeft + characterWidth / 2) / cellWidth);
		inx = ((characterRow - 1) * rowLength) + characterColumn - 1;
		nearbyCells = new Array();
		nearbyCells[0] = inx - rowLength - 1; if ( row(inx) == 1 || column(inx) == 1 ) { delete nearbyCells[0] }
		nearbyCells[1] = inx - rowLength; if ( row(inx) == 1 ) { delete nearbyCells[1] }
		nearbyCells[2] = inx - rowLength + 1; if ( row(inx) == 1 || column(inx) == rowLength ) { delete nearbyCells[2] }
		nearbyCells[3] = inx - 1; if ( column(inx) == 1 ) { delete nearbyCells[3] }
		nearbyCells[4] = inx + 1; if ( column(inx) == rowLength ) { delete nearbyCells[4] }
		nearbyCells[5] = inx + rowLength - 1; if ( row(inx) == columnLength || column(inx) == 1 ) { delete nearbyCells[5] }
		nearbyCells[6] = inx + rowLength; if ( row(inx) == columnLength ) { delete nearbyCells[6] }
		nearbyCells[7] = inx + rowLength + 1; if ( row(inx) == columnLength || column(inx) == rowLength ) { delete nearbyCells[7] }
	}
	
	function monsterCell() {
		monster = $(".monster");
		var area = $("#area");
		var cell = $("#area ul li");
		var cellWidth = cell.width();
		var cellHeight = cell.height();
		var monsterWidth = monster.width();
		var monsterHeight = monster.height();
		monsterTop = monster.offset().top - area.offset().top;
		monsterLeftSide = monster.offset().left - area.offset().left;
		var monsterRow = Math.ceil((monsterTop + monsterHeight / 2) / cellHeight);
		var monsterColumn = Math.ceil((monsterLeftSide + monsterWidth / 2) / cellWidth);
		monsterPos = ((monsterRow - 1) * rowLength) + monsterColumn - 1;
	}
	
	function insideGameArea(a, b) {
		var aPos = a.position();
		var aLeft = aPos.left;
		var aRight = aPos.left + a.width();
		var aTop = aPos.top;
		var aBottom = aPos.top + a.height();
		var bTop = 0;
		var bRight = b.width();
		var bBottom = b.height();
		var bLeft = 0;
		return !(aLeft < 0 || aTop < 0 || aRight > bRight || aBottom > bBottom);
	}

	function isOverlap(a, b) {
		var aPos = a.position();
		var bPos = b.position();
		var aLeft = aPos.left;
		var aRight = aPos.left + a.width();
		var aTop = aPos.top;
		var aBottom = aPos.top + a.height();
		var bLeft = bPos.left;
		var bRight = bPos.left + b.width();
		var bTop = bPos.top;
		var bBottom = bPos.top + b.height();
		return !( bLeft > aRight || bRight < aLeft || bTop > aBottom || bBottom < aTop);
	}
	
	function moveHelper() {
		var character = $("#character");
		var cell = $("#area ul li");
		var area = $("#area");
		var characterTop = character.offset().top - area.offset().top;
		var characterRight = character.offset().left + character.width() - area.offset().left;
		var characterBottom = character.offset().top + character.height() - area.offset().top;
		var characterLeft = character.offset().left - area.offset().left;
		var cellWidth = cell.width();
		var cellHeight = cell.height();
		var topHelp = cellHeight - (characterTop % cellHeight);
		var rightHelp = characterRight % cellWidth;
		var bottomHelp = characterBottom % cellHeight;
		var leftHelp = cellWidth - (characterLeft % cellWidth);
		var allowHelpVertical = (moveHelpRate / 100) * cellHeight;
		var allowHelpHorizontal = (moveHelpRate / 100) * cellWidth;
		var move = 0;
		if ((moveRight || moveLeft) && topHelp > allowHelpHorizontal && topHelp != 0 && ((characterTop - (characterTop % cellHeight)) / cellHeight) % 2 == 0) {
			if (moveRight && $.inArray(nearbyCells[2], breakableWalls) == (-1) && $.inArray(nearbyCells[4], breakableWalls) == (-1)) { $("#ghost").css({"top": "-=1"}); move = 1; }
			if (moveLeft && $.inArray(nearbyCells[0], breakableWalls) == (-1) && $.inArray(nearbyCells[3], breakableWalls) == (-1)) { $("#ghost").css({"top": "-=1"}); move = 1; }
			if (move) {$("#character").css({"top": $("#ghost").css("top")})}
		}
		if (((moveUp || moveDown) && rightHelp > allowHelpVertical && rightHelp != 0 && ((characterRight - (characterRight % cellWidth)) / cellWidth) % 2 == 0) || bottomHelp == character.height()) {
			if (characterLeft % cellWidth == 0) { $("#ghost").css({"left": "+=1"}); move = 1; }
			if (moveUp && $.inArray(nearbyCells[2], breakableWalls) == (-1) && $.inArray(nearbyCells[1], breakableWalls) == (-1)) { $("#ghost").css({"left": "+=1"}); move = 1; }
			if (moveDown && $.inArray(nearbyCells[7], breakableWalls) == (-1) && $.inArray(nearbyCells[6], breakableWalls) == (-1)) { $("#ghost").css({"left": "+=1"}); move = 1; }
			if (move) {$("#character").css({"left": $("#ghost").css("left")})}
		}
		if (((moveRight || moveLeft) && bottomHelp > allowHelpHorizontal && bottomHelp != 0 && ((characterBottom - (characterBottom % cellHeight)) / cellHeight) % 2 == 0) || rightHelp == character.width()) {
			if (characterTop % cellHeight == 0) { $("#ghost").css({"top": "+=1"}); move = 1; }
			if (moveRight && $.inArray(nearbyCells[7], breakableWalls) == (-1) && $.inArray(nearbyCells[4], breakableWalls) == (-1)) { $("#ghost").css({"top": "+=1"}); move = 1; }
			if (moveLeft && $.inArray(nearbyCells[5], breakableWalls) == (-1) && $.inArray(nearbyCells[3], breakableWalls) == (-1)) { $("#ghost").css({"top": "+=1"}); move = 1; }
			if (move) {$("#character").css({"top": $("#ghost").css("top")})}
		}
		if ((moveUp || moveDown) && leftHelp > allowHelpVertical && leftHelp != 0 && ((characterLeft - (characterLeft % cellWidth)) / cellWidth) % 2 == 0) {
			if (moveUp && $.inArray(nearbyCells[0], breakableWalls) == (-1) && $.inArray(nearbyCells[1], breakableWalls) == (-1)) { $("#ghost").css({"left": "-=1"}); move = 1; }
			if (moveDown && $.inArray(nearbyCells[5], breakableWalls) == (-1) && $.inArray(nearbyCells[6], breakableWalls) == (-1)) { $("#ghost").css({"left": "-=1"}); move = 1; }
			if (move) {$("#character").css({"left": $("#ghost").css("left")})}
		}
	}
	
	function characterAnimate() {
		if (direction) {
			charStep++; if (charStep == 5) charStep = 1;
			$("#character").removeAttr("class");
			switch(charStep) {
				case 1: $("#character").addClass(direction + "-stand"); break;
				case 2: $("#character").addClass(direction + "-right"); break;
				case 3: $("#character").addClass(direction + "-stand"); break;
				case 4: $("#character").addClass(direction + "-left"); break;
			}
		}
	}

	function moveGhost() {
		var moved = 0;
		var moveAllowed = 1;
		whichCell();
		monsterCell();
		if (moveUp) { $("#ghost").css({"top": "-=1"}); moved = 1; }
		if (moveRight) { $("#ghost").css({"left": "+=1"}); moved = 1; }
		if (moveDown) { $("#ghost").css({"top": "+=1"}); moved = 1; }
		if (moveLeft) { $("#ghost").css({"left": "-=1"}); moved = 1; }
		if ( inx == monsterPos) { $("#character").fadeOut(1500); }
		monsterPos = "";
		
		if (!moved) return false;
		if (!insideGameArea($("#ghost"), $("#area"))) { moveAllowed = 0; }
		$.each(nearbyCells, function(index, value) {
			if ($.inArray(value, unbreakableWalls) != (-1) && isOverlap($("#ghost"), $("#area ul li:eq("+ value +")"))) { moveAllowed = 0; moveHelper(); }
		});
		$.each(nearbyCells, function(index, value) {
			if ($.inArray(value, breakableWalls) != (-1) && isOverlap($("#ghost"), $("#area ul li:eq("+ value +")"))) { moveAllowed = 0; }
		});
		
		var ghostTop = $("#ghost").css("top");
		var ghostLeft = $("#ghost").css("left");
		var characterTop = $("#character").css("top");
		var characterLeft = $("#character").css("left");
		
		if (moveAllowed) {
			$("#character").css({"top": ghostTop, "left": ghostLeft});
		} else {
			$("#ghost").css({"top": characterTop, "left": characterLeft});
		}
	}
	
	function moveMonster() {
		monsterUp = 0;
		monsterRight = 0;
		monsterDown = 0;
		monsterLeft = 0;
		monsterCell();
		if (row(monsterPos) != 1 && $.inArray(monsterPos - rowLength, breakableWalls) == (-1) && $.inArray(monsterPos - rowLength, unbreakableWalls) == (-1)) {monsterUp = 1}
		if (column(monsterPos) != rowLength && $.inArray(monsterPos + 1, breakableWalls) == (-1) && $.inArray(monsterPos + 1, unbreakableWalls) == (-1)) {monsterRight = 1}
		if (row(monsterPos) != columnLength && $.inArray(monsterPos + rowLength, breakableWalls) == (-1) && $.inArray(monsterPos + rowLength, unbreakableWalls) == (-1)) {monsterDown = 1}
		if (column(monsterPos) != 1 && $.inArray(monsterPos - 1, breakableWalls) == (-1) && $.inArray(monsterPos - 1, unbreakableWalls) == (-1)) {monsterLeft = 1}
		if (monsterUp || monsterRight || monsterDown || monsterLeft) {
			do {
				way = 0;
				monsterDistance = Math.floor((Math.random()*4) + 1);
				switch(monsterDistance) {
					case 1: way = monsterUp; if (monsterUp) {monster.animate({top: monsterTop - 60}, monsterSpeed);} break;
					case 2: way = monsterRight; if (monsterRight) {monster.animate({left: monsterLeftSide + 60}, monsterSpeed);} break;
					case 3: way = monsterDown; if (monsterDown) {monster.animate({top: monsterTop + 60}, monsterSpeed);} break;
					case 4: way = monsterLeft; if (monsterLeft) {monster.animate({left: monsterLeftSide - 60}, monsterSpeed);} break;
				}
			} while ( !way )
		}
	}
	
	function setBomb() {
		whichCell();
		object = $("#area ul li");
		character = $("#character");
		upper = inx - rowLength;
		rightSide = inx + 1;
		under = inx + rowLength;
		leftSide = inx - 1;
		numberOfBombs++;
		destroy = 0;
		$("#area ul li:eq("+ inx +")").append("<div class='bomb'></div>").children(".bomb").delay(3000).fadeOut(200);
		setTimeout(function(){
			monsterCell();
			if ( $.inArray(upper, breakableWalls) != (-1) && row(upper + rowLength) != 1 ) {
				object.eq(upper).css("background", "none");
				breakableWalls.splice($.inArray(upper, breakableWalls), 1);
			} else if ( $.inArray(upper, unbreakableWalls) == (-1) && row(upper + rowLength) != 1 ) {
				object.eq(upper).append("<div class='fire_up'></div>").children(".fire_up").delay(700).fadeOut(500);
				if ( inx == upper || inx == upper + rowLength ) { character.fadeOut(1500) }
				if ( monsterPos == upper || monsterPos == upper + rowLength ) { monster.fadeOut(500) }
			}
			if ( $.inArray(rightSide, breakableWalls) != (-1) && column(rightSide) != 1 ) {
				object.eq(rightSide).css("background", "none");
				breakableWalls.splice($.inArray(rightSide, breakableWalls), 1);
			} else if ( $.inArray(rightSide, unbreakableWalls) == (-1) && column(rightSide) != 1 ) {
				object.eq(rightSide).append("<div class='fire_right'></div>").children(".fire_right").delay(700).fadeOut(500);
				if ( inx == rightSide || inx == rightSide - 1 ) { character.fadeOut(1500) }
				if ( monsterPos == rightSide || monsterPos == rightSide - 1 ) { monster.fadeOut(500) }
			}
			if ( $.inArray(under, breakableWalls) != (-1) && row(under) != 1 ) {
				object.eq(under).css("background", "none");
				breakableWalls.splice($.inArray(under, breakableWalls), 1);
			} else if ( $.inArray(under, unbreakableWalls) == (-1) && row(under) != 1 ) {
				object.eq(under).append("<div class='fire_down'></div>").children(".fire_down").delay(700).fadeOut(500);
				if ( inx == under || inx == under - rowLength ) { character.fadeOut(1500) }
				if ( monsterPos == under || monsterPos == under - rowLength ) { monster.fadeOut(500) }
			}
			if ( $.inArray(leftSide, breakableWalls) != (-1) && column(leftSide) != rowLength ) {
				object.eq(leftSide).css("background", "none");
				breakableWalls.splice($.inArray(leftSide, breakableWalls), 1);
			} else if ( $.inArray(leftSide, unbreakableWalls) == (-1) && column(leftSide) != rowLength ) {
				object.eq(leftSide).append("<div class='fire_left'></div>").children(".fire_left").delay(700).fadeOut(500);
				if ( inx == leftSide || inx == leftSide + 1 ) { character.fadeOut(1500) }
				if ( monsterPos == leftSide || monsterPos == leftSide + 1 ) { monster.fadeOut(500) }
			}
			monsterPos = "";
			numberOfBombs--;
		}, 3200);
	}