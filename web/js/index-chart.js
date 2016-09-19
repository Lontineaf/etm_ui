$(function () {

    "use strict";
	initialize();

    function initialize() {
        loadPage();
        loadEvents();


    }


    function loadPage() {
		var HostIdData = [];
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
					console.log(HostIdData)



				} else {
					alert(json.message)
				}
			}
		});


		EM.service({
			action: 'IdxCorelineData',
			showLoading: false,
			params: {
				hostid: 10737,
				itemsid: 133979,
				timetype: 'latest'
			},
			success: function (json) {
				if (json.status == 900) {
					console.log(json.data)

				} else {
					alert(json.message)
				}
			}
		});
    }

    function loadEvents() {

    }


});
