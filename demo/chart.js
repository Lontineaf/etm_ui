//图标配置
option = {
    title : {
        text: '核心内参',
        subtext: '数据来自东方财富',
        x: 'center',
        align: 'right'
    },
    grid: {
    	left:'5%',
    	right:'5%',
        bottom: 80
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    dataZoom: [
        {
        	type:'slider',
            show: true,
            realtime: true,
            start: 0,
            end: 10
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 10
        }
    ],
    xAxis : [
        {
            type : 'time',
            boundaryGap : false,
            splitLine :{
            	show:false
            },
            axisLabel:{
            	formatter:function(value,index){
            		var t = new Date(value);
            		var result = '';
            		result+= t.getFullYear()+'/'+(t.getMonth()+1)+'/'+t.getDay()+'\n';
            		result+= (t.getHours()>10? t.getHours():'0'+t.getHours())+":";
            		result+= t.getMinutes()>10? t.getMinutes():'0'+t.getMinutes();
            		return result;
            	}
            },
//	            interval:3*60*60*1000
        }
    ],
    yAxis: [
        {
            type: 'value',
        }
    ],
    series: [
        {
            name:'测试线',
            type:'line',
            animation: false,
            showSymbol:false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle:{
            	normal:{
            		color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    	offset: 0,
                    	color: 'rgb(255, 158, 68)'
                	}, {
                    	offset: 1,
                    	color: 'rgb(255, 70, 131)'
                	}])
            	}
            },
            data:null
        }
    ]
};

	
var chart = echarts.init(document.getElementById('chart'));
var $select1 = $('#select1');
var $select2 = $('#select2');
var $select3 = $('#select3');

//获取数据
function getData(para,callback){
	EM.service({
		action: 'etmAPITEST',
	    showLoading: false,
	    params: para,
	    success: function(json) {
	    	callback(json);
	    }
	})
}
//渲染select
function renderSelect(data,v,$select){
	$select.empty();
	for (var i = 0; i< data.length; i++){
		var $option = $('<option value='+data[i][v]+'>'+data[i][v]+'</option>');
		$select.append($option);
	}
}

function renderChart(){
	var host_id = $select1.val();
	var items_id = $select2.val();
	var time_type = $select3.val();
	getData({
		c:'mtest',
        a:'sTableA2',
        hostid:host_id,
        itemsid:items_id,
        timetype:time_type
	},function(json){
		console.log(json.data);
		option.series[0].data = json.data;
		chart.setOption(option);
	})
}
window.onload = function(){
	//获取select1 内容
	getData({
		c:'mtest',
        a:'sTableA0'
	},function(json){
		renderSelect(json.data,'host_id',$select1);
		getData({
			c:'mtest',
        	a:'sTableA1',
        	hostid:json.data[0].host_id,
		},function(json){
			renderSelect(json.data,'items_id',$select2);
			renderChart();
		})
	})
}

$select1.on('change',function(){
	var $v = $(this).val();
	getData({
		c:'mtest',
    	a:'sTableA1',
    	hostid:$v,
	},function(json){
		renderSelect(json.data,'items_id',$select2);
		renderChart();
	})
})
$select2.on('change',function(){
	renderChart();
})
$select3.on('change',function(){
	renderChart();
})

window.onresize = function(){
	var chart = echarts.init(document.getElementById('chart'));
	chart.setOption(option);
}