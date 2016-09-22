$(function () {

    "use strict";
	initialize();
    function initialize() {
        loadCornelCharts();
		loadMonitorLayer();
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

			if (time_type === 'latest') {
				timer = setTimeout(renderChart, 3000);
			}
		}

		window.onresize = function () {
			chart = echarts.init(document.getElementById('corelineChart'));
			chart.setOption(option);
		}
    }


	//加载监控层数据
	function loadMonitorLayer() {
		
		//链路层表格配置
		var tableOption = {
			"responsive": true,
			"oLanguage": {
				"oPaginate":
				{
					"sFirst": "首页",
					"sPrevious": "前一页",
					"sNext": "后一页",
					"sLast": "末页"
				}
			},
			"scrollX": true,
			"searching": false,
			"ordering": false,
			"lengthChange": false,
			"info": false,
			"data": null,
			"columns" :[
				{"data":"link_name"},
				{"data":"status"},
				{"data":"utime"},
				{"data":null}
			],
			"columnDefs":[
				{
					"targets" :1,
					"render":function(data,type,row){
						if(data == 1){
							return '<span class="label label-primary">正常</span>';
						}else{
							return '<span class="label label-danger">不正常</span>';
						}
					}
				},
				{
					"targets":3,
					"render":function(data,type,row){
						return "<button class='btn btn-primary'>检测</button>";
					}
				}
			]
		}
		//初始化：获取市场列表
		EM.service({
			action: 'getMarketList',
			showLoading: false,
			success: function (json) {
				if (json.status == 900) {
					renderMarketList(json.data);
					getProduct(json.data[0].id);
					bindEvent('market');
				} else {
					alert(json.message)
				}
			}
		});

		//渲染市场列表dom
		function renderMarketList(data) {
			var $market = $("#marketList");
			var temp = '';
			data.map(function (data,index) {
				if(index==0){
					temp += ' <li data-marketId = ' + data.id + ' class="active"> ';
				}else{
					temp += ' <li data-marketId = ' + data.id + '> ';
				}
				temp += ' <a href="javascript:;">' + data.name + ' </a>';
				temp += ' </li>';
			})
			$market.html(temp);
		}

		//获取市场对应产品
		function getProduct(id) {
			EM.service({
				action: 'getProductList',
				params: {
					market_id: id
				},
				showLoading: false,
				success: function (json) {
					if (json.status == 900) {
						if(json.data.length>0){
							renderProductList(json.data)
							getLinkProduct(json.data[0].id);
							bindEvent('product');
						}
					} else {
						alert(json.message)
					}
				}
			})
		}

		//渲染产品列表dom
		function renderProductList(data) {
			var data = data.splice(0, 4);
			var $market = $("#ProductList");
			var classArr = ['a', 'b', 'c', 'd'];
			var temp = '';
			data.map(function (d, index) {
				temp += '<div class="col-lg-2 col-md-2 col-xs-12" data-productId = ' + d.id + '>';
				temp += '<a class="alert-esmbg-' + classArr[index] + ' esm-monitor-nav">';
				temp += '<h4 class="text-center">' + d.name + '</h4>';
				temp += '<div class="row">';
				temp += '<div class="col-lg-6 col-md-12 col-xs-12 text-center"> <i class="fa fa-warning"></i> 警告数 </div>';
				temp += '<div class="col-lg-6 col-md-12 col-xs-12 text-center"> <i class="fa fa-chain"></i> 链路总数 </div>';
				temp += '<div class="col-lg-6 col-md-12 col-xs-12 text-center"> <i class="fa fa-desktop"></i> 主机数 </div></div></a></div>';
			})
			$market.html(temp);
		}

		//获取产品链路列表
		function getLinkProduct(productID) {
			EM.service({
				action: 'getProductLinkList',
				params: {
					product_id: productID
				},
				showLoading: false,
				success: function (json) {
					console.log(json)
					if (json.status == 900) {
						if(json.data.length>0){
							RenderproductLink(json.data)
						}
					} else {
						alert(json.message)
					}
				}
			})

		}
		//渲染链路表格列表dom
		function RenderproductLink(data) {
			tableOption.data = data;
			var linkTable = $('#esm-monito-lianlu').DataTable(tableOption);
		}
		
		//事件绑定对象
		var clickEvents = {
			'market':function(){
				var $list = $('#marketList>li');
				$list.on('click',function(){
					var $this = $(this);
					var id = $this.attr('data-marketid');
					$this.addClass('active').siblings().removeClass('active');
					getProduct(id);
				})
			},
			'product':function(){
				var $list = $('#ProductList>div');
				$list.on('click',function(){
					var $this = $(this);
					var id = $this.attr('data-productId');
					getLinkProduct(id);
				})
			}
		}
		//绑定tab切换事件
		function bindEvent(type){
			return clickEvents[type]();
		}
	}
});
