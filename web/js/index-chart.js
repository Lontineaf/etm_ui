jQuery(document).ready(function() {
    
    "use strict";
    
    function showTooltip(x, y, contents) {
	jQuery('<div id="tooltip" class="tooltipflot">' + contents + '</div>').css( {
	    position: 'absolute',
	    display: 'none',
	    top: y + 5,
	    left: x + 5
	}).appendTo("body").fadeIn(200);
    }
    
    /*****SIMPLE CHART*****/
    
    var firefox = [[0, 9], [1, 7], [2,10], [3, 8], [4, 10], [5, 5], [6, 8]];
    var chrome = [[0, 7], [1, 5], [2,8], [3, 6], [4, 8], [5, 3], [6, 6]];
	
    var plot = jQuery.plot(jQuery("#basicflot"),
	[{
	    data: firefox,
	    label: "Firefox",
	    color: "#D9534F"
	},
        {
	    data: chrome,
	    label: "Chrome",
	    color: "#428BCA"
        }
	],
	{
	    series: {
		lines: {
		    show: true,
		    fill: true,
		    lineWidth: 1,
		    fillColor: {
		    colors: [ { opacity: 0.5 }, { opacity: 0.5 } ]
		    }
		},
		points: {
		    show: true
		},
		shadowSize: 0
	    },
	    legend: {
		position: 'nw'
	    },
	    grid: {
		hoverable: true,
		clickable: true,
		borderColor: '#ddd',
		borderWidth: 1,
		labelMargin: 10,
		backgroundColor: '#fff'
	    },
	    yaxis: {
		min: 0,
		max: 15,
		color: '#eee'
	    },
	    xaxis: {
		color: '#eee'
	    }
	});
		
	var previousPoint = null;
	jQuery("#basicflot").bind("plothover", function (event, pos, item) {
	jQuery("#x").text(pos.x.toFixed(2));
	jQuery("#y").text(pos.y.toFixed(2));
			
	if(item) {
	    if (previousPoint != item.dataIndex) {
		previousPoint = item.dataIndex;
						
		jQuery("#tooltip").remove();
		var x = item.datapoint[0].toFixed(2),
		y = item.datapoint[1].toFixed(2);
	 			
		showTooltip(item.pageX, item.pageY,
		item.series.label + " of " + x + " = " + y);
	    }
			
	} else {
	    jQuery("#tooltip").remove();
	    previousPoint = null;            
	}
		
    });
		
    jQuery("#basicflot").bind("plotclick", function (event, pos, item) {
	if (item) {
	    plot.highlight(item.series, item.datapoint);
	}
    });
    
  });
