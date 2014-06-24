$(function() {
	var $benjamins;
	var moneyHomePosition;
	var $dragArrow = $('#drag-arrow');
	var $resultArrow = $('#result-arrow');
	var $personWallet = $('#person-wallet');
	var $tree = $('#tree');
	var $charity = $('#charity');

	function createNewBenjamins(draggable) {
		// Initialize the benjamins on page load
		// Create a new dollar bill once the old one disappears
		$personWallet.before('<div class="interactive-target stationary" id="benjamins"></div>');
		$benjamins = $('#benjamins');
		
		// Defines where the money goes back to if the user doesn't drop it anywhere
		moneyHomePosition = {
			top: 108,
			left: 22,
			opacity: 0
		};

		if (draggable) {
			$benjamins.draggable({
				// From http://stackoverflow.com/a/5848800
				// Reverts the money to your wallet if you don't drag it into the pot or the charity
				revert: function(event, ui) {
					disappearIntoPosition(moneyHomePosition, 500, true);
					return !event;
				},
				containment: 'document',
				start: function(event, ui) {
					$(this).removeClass('stationary');
				}
			});
		}
	}

	$tree.droppable({
		drop: function(event, ui) {
			$dragArrow.fadeOut(400, function(){$dragArrow.remove();});
			moneyHomePosition = {top: 108, left: 295, opacity: 0};
			disappearIntoPosition(moneyHomePosition, 500, true);
			$tree.grow();
			$benjamins.draggable('disable');
			$resultArrow.delay(400).fadeIn(400, function(){
				makeItRain();
			});
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});
	$tree.grow = function() {
		$tree.addClass('grown');
	};

	$charity.droppable({
		drop: function(event, ui) {
			moneyHomePosition = {top: 108, left: 570, opacity: 0};
			disappearIntoPosition(moneyHomePosition, 500, true);
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});

	function disappearIntoPosition(position, speed, draggable) {
		$benjamins.animate(position, speed, function(){
			$benjamins.remove();
			createNewBenjamins(draggable);
		});
	}

	function makeItRain() {
		$benjamins.removeClass('stationary');
		$benjamins.css({top: 163, left: 345, opacity:1, height:'0px', width: '0px'});
		$benjamins.animate({top: 138, left: 320, height: '50px', width: '50px'}, 4000, function() {
			disappearIntoPosition({top: 158, left: 595, opacity: 0}, 1000, false);
			setTimeout(function(){makeItRain();}, 2000);
		});
	}

	createNewBenjamins(true);
});
