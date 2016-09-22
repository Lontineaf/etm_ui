$(function () {

    "use strict";
	initialize();
    function initialize() {
        loadCornelCharts();
//		loadMonitorLayer();
    }
	
	//加载核心参数表格
    function loadCornelCharts() {
       	var $hostID = $('#coreline-select-hostID'),
			$projlist = $('#coreline-select-projlist');
		var HostIdData = [],
			projData = [];

		//select2初始化数据
		function initSelect2Input(data, obj, placeholder) {
			obj.select2({
				//placeholder: placeholder,
				minimumResultsForSearch: -1,
				allowClear: false,
				data: data
			});
		}

		// hostID 数据 初始化
		EM.service({
			action: 'IdxCorelineHostID',
			showLoading: false,
			success: function (json) {
				if (json.status == 900) {
					var res = json.data.map(function (data) {
                        HostIdData.push({
							id: data.host_id,
							text: data.name,
						});
					}).join('');

					// init for first data source
					initSelect2Input(HostIdData, $hostID, json.data[0].name);
                    $hostID.val(HostIdData[0].id).trigger("change");

				} else {
					alert(json.message)
				}
			}
		});

        //hostID 下拉框联动改变 项目列表
		$hostID.on("change", function (e) {
			var $v = $(this).val();
			EM.service({
				action: 'IdxCorelineprojlist',
				showLoading: false,
				params: {
					hostid: $v,
				},
				success: function (json) {
					if (json.status == 900) {
                        projData = [];
						var res2 = json.data.map(function (data) {
							projData.push({
								id: data.items_id,
								text: data.key,
							});
						}).join('');

                        // destroy for new data soruce init!
						$projlist.select2('destroy');

						// init for secound data source
						initSelect2Input(projData, $projlist);
						$projlist.val(projData[0].id).trigger("change");

					} else {
						alert(json.message)
					}
				}
			});
		});

		$projlist.on('change', function () {
			renderChart();
		})
		$('#coreline-select-time').on('change', function () {
			renderChart();
		})

		jQuery('#coreline-select-time').select2({
			minimumResultsForSearch: -1
		});

		//图标配置
		var option = {
			title: {
				text: '核心内参',
				subtext: '数据来自东方财富',
				x: 'center',
				align: 'right'
			},
			grid: {
				left: '10%',
				right: '10%',
				bottom: 80
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false
				}
			},
			dataZoom: [
				{
					type: 'slider',
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
			xAxis: [
				{
					type: 'time',
					boundaryGap: false,
					splitLine: {
						show: false
					},
					axisLabel: {
						formatter: function (value, index) {
							var t = new Date(value);
							var result = '';
							result += t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDay() + '\n';
							result += (t.getHours() > 10 ? t.getHours() : '0' + t.getHours()) + ":";
							result += t.getMinutes() > 10 ? t.getMinutes() : '0' + t.getMinutes();
							return result;
						}
					},
					//	 interval:3*60*60*1000
				}
			],
			yAxis: [
				{
					type: 'value',
				}
			],
			series: [
				{
					name: '测试线',
					type: 'line',
					animation: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgb(255, 158, 68)'
							}, {
									offset: 1,
									color: 'rgb(255, 70, 131)'
								}])
						}
					},
					data: null
				}
			]
		};

		var chart = echarts.init(document.getElementById('corelineChart'));
		var timer = null;
		function renderChart() {
			clearTimeout(timer);
			var host_id = $('#coreline-select-hostID').select2("val");
			var items_id = $('#coreline-select-projlist').select2("val");
			var time_type = $('#coreline-select-time').val();
			EM.service({
				action: 'IdxCorelineData',
				showLoading: false,
				params: {
					hostid: host_id,
					itemsid: items_id,
					timetype: time_type
				},
				success: function (json) {
					if (json.status == 900) {
						option.series[0].data = json.data;
						chart.setOption(option);

					} else {
						alert(json.message)
					}
				}
			});
			if(time_type === 'latest'){
				timer = setTimeout(renderChart,3000);
				console.log('获取数据');
			}
		}

		window.onresize = function () {
			chart = echarts.init(document.getElementById('corelineChart'));
			chart.setOption(option);
		}
    }


	//加载监控层数据
	function loadMonitorLayer() {
		
		
		
		//获取市场列表
		EM.service({
			action:'getMarketList',
			showLoading: false,
			success: function (json) {
				if (json.status == 900) {
					renderMarketList(json.data);
					getProduct(1);
				} else {
					alert(json.message)
				}
			}
		});
		
		//渲染市场列表dom
		function renderMarketList(data){
			var data = data.splice(0,4);
			var $market = $("#marketList");
			var classArr = ['a','b','c','d'];
			var temp = '';
			data.map(function(d,index){
				temp+= '<div class="col-lg-3 col-md-3 col-xs-12" data-marketId = '+d.id+'>';
				temp+= '<a class="alert-esmbg-'+classArr[index]+' esm-monitor-nav">';
				temp+= '<h1 class="text-center">'+d.name+'</h1>';
				temp+= '<div class="row">';
				temp+= '<div class="col-lg-4 col-md-12 col-xs-12 text-center"> <i class="fa fa-warning"></i> 警告数 </div>';
				temp+= '<div class="col-lg-4 col-md-12 col-xs-12 text-center"> <i class="fa fa-chain"></i> 链路总数 </div>';
				temp+= '<div class="col-lg-4 col-md-12 col-xs-12 text-center"> <i class="fa fa-desktop"></i> 主机数 </div></div></a></div>';
			})
			$market.html(temp);
		}
		
		//获取市场对应产品
		function getProduct(id){
			EM.service({
				action:'getProductList',
				params:{
					market_id : id
				},
				showLoading:false,
				success:function(json){
					console.log(json);
					if (json.status == 900) {
						//表格配置项
						var table = $('#esm-monito-lianlu').DataTable({
							"responsive":true,
							//"processing": true,
							// "serverSide": true,
							//"ajax" : "load",
							//"scrollX": true,
							"searching": false,
							// "paging": false,
							"ordering": false,
							"lengthChange":false,
							"info": false,
//							"columns": [
//					            { "data": "name" },
//					            { "data": "status" },
//					            { "data": "utime" },
//					        ],
							"columnDefs": [ 
								{
							    	"targets": 0,
							    	"data":"[id,name]",
							    	"render": function ( data, type, val) {
							    		return '<a href="" data-productId = '+data+'>'+data+'</a>';
							    	}
							  	} ,
//								{
//							    	"targets": 1,
//							    	"data": function ( row, type, val, meta ) {
//							    		return '<a href="">'+val+'</a>';
//							    	}
//							  	} ,
//								{
//							    	"targets": 2,
//							    	"data": function ( row, type, val, meta ) {
//							    		return '<a href="">'+val+'</a>';
//							    	}
//							  	} ,
//								{
//							    	"targets": 3,
//							    	"data": function ( row, type, val, meta ) {
//							    		return '<a href="">'+val+'</a>';
//							    	}
//							  	}
							],
				         	data:json.data
						});
					} else {
						alert(json.message)
					}
				}
			})
		}
		
	}

});
