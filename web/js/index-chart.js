$(function () {

    "use strict";
	initialize();



    function initialize() {
        loadPage();
        loadEvents();
    }


    function loadPage() {
       	var $hostID = $('#coreline-select-hostID'),
			$projlist = $('#coreline-select-projlist');
		var HostIdData = [],
		    projData=[];
		//select2初始化数据
		function initSelect2Input(data, obj,placeholder) {
			obj.select2({
				placeholder:placeholder,
				
				minimumResultsForSearch: -1,
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

				} else {
					alert(json.message)
				}
			}
		});
          // 监控项目列表 数据 初始化
		EM.service({
			action: 'IdxCorelineprojlist',
			showLoading: false,
			params: {
				hostid: 10708,
			},
			success: function (json) {
				if (json.status == 900) {
					var res = json.data.map(function (data) {
                        projData.push({
							id: data.id,
							text: data.items_id,
						});
					}).join('');
 console.log(projData);
					// init for first data source
					initSelect2Input(projData, $projlist,json.data[0].items_id);

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
                        projData =[];
						var res2 = json.data.map(function (data) {
                        projData.push({
								id: data.id,
								text: data.items_id,
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



    }

    function loadEvents() {

    }


});
