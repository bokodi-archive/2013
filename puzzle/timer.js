$(document).ready(function() {
	$('#counterSec').html(0);
	$('#counterMin').html(0);
	timer = setInterval ( "increaseCounter()", 1000 );
});

function increaseCounter() {
	var secVal;
	var minVal;
	
	secVal = parseInt($('#counterSec').html(),10);
	minVal = parseInt($('#counterMin').html(),10);
	
	if(secVal != 59) {
		$('#counterSec').html((secVal+1));
	} else {
		$('#counterMin').html((minVal+1)); 
		$('#counterSec').html(0);
	}
}