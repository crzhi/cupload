$(document).ready(function() {
	drags('div', 'div-dash', 'dash');
});
function drags(name, name2, name3) {
	var range = {
		x: 0,
		y: 0
	};
	var lastPos = {
		x: 0,
		y: 0,
		x1: 0,
		y1: 0
	};
	var tarPos = {
		x: 0,
		y: 0,
		x1: 0,
		y1: 0
	};
	var thidDiv = null,
	move = false,
	choose = false;
	var thidDivWidth = 0,
	thidDivHeight = 0,
	thidDivHalfW = 0,
	thidDivHalfH = 0,
	tarFirstX = 0,
	tarFirstY = 0;
	var tarDiv = null,
	tarFirst, tempDiv;
	var initPos = {
		x: 0,
		y: 0
	};
	$('.' + name).on('mousedown', function(event) {
		choose = true;
		thidDiv = $(this);
		initPos.x = thidDiv.offset().left;
		initPos.y = thidDiv.offset().top;
		range.x = event.pageX - thidDiv.offset().left;
		range.y = event.pageY - thidDiv.offset().top;
		thidDivWidth = thidDiv.width();
		thidDivHeight = thidDiv.height();
		thidDivHalfW = thidDivWidth / 2;
		thidDivHalfH = thidDivHeight / 2;
		thidDiv.attr("class", name2);
		thidDiv.css({
			left: initPos.x + 'px',
			top: initPos.y + 'px'
		});
		$("<div class='" + name3 + "'></div>").insertBefore(thidDiv);
		tempDiv = $("." + name3);
	});
	$(document).on('mouseup',
	function(event) {
		if (!choose) {
			return false;
		}
		if (!move) {
			thidDiv.attr("class", name);
			tempDiv.remove();
			choose = false;
			return false;
		}
		thidDiv.insertBefore(tempDiv);
		thidDiv.attr("class", name);
		tempDiv.remove();
		move = false;
		choose = false;
	}).on('mousemove',
	function(event) {
		if (!choose) return false;
		move = true;
		lastPos.x = event.pageX - range.x;
		lastPos.y = event.pageY - range.y;
		lastPos.x1 = lastPos.x + thidDivWidth;
		lastPos.y1 = lastPos.y + thidDivHeight;
		thidDiv.css({
			left: lastPos.x + 'px',
			top: lastPos.y + 'px'
		});
		var $main = $('.' + name);
		$main.each(function() {
			tarDiv = $(this);
			tarPos.x = tarDiv.offset().left;
			tarPos.y = tarDiv.offset().top;
			tarPos.x1 = tarPos.x + tarDiv.width() / 2;
			tarPos.y1 = tarPos.y + tarDiv.height() / 2;
			tarFirst = $main.eq(0);
			tarFirstX = tarFirst.offset().left + thidDivHalfW;
			tarFirstY = tarFirst.offset().top + thidDivHalfH;
			if (lastPos.x > tarPos.x) {
				if (lastPos.x >= tarPos.x - thidDivHalfW && lastPos.x1 >= tarPos.x1 && lastPos.y >= tarPos.y - thidDivHalfH && lastPos.y1 >= tarPos.y1) {
					tempDiv.insertAfter(tarDiv);
				}
				if (lastPos.x <= tarFirstX && lastPos.y <= tarFirstY) {
					tempDiv.insertBefore(tarFirst);
				}
			} else {
				if (lastPos.x <= tarFirstX && lastPos.y <= tarFirstY) {
					tempDiv.insertBefore(tarFirst);
				}
				if (lastPos.x >= tarPos.x - thidDivHalfW && lastPos.x1 >= tarPos.x1 && lastPos.y >= tarPos.y - thidDivHalfH && lastPos.y1 >= tarPos.y1) {
					tempDiv.insertAfter(tarDiv);
				}
			}
		});
	});
}