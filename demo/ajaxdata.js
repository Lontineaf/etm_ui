//ajax请求列表
var ajaxList = {
	//核心参数
	ajax1 : {
		type:"get",
		url:"http://180.168.4.202:7173/etm/ctrlphp/index.php",
		data:{
			c:'mtest',
			a:'sTableA2',
			hostid:10737,
			itemsid:133979,
			timetype:'latest'
		},
		dataType:'jsonp'
	}
}

//ajax 请求方法
function ajaxRequest(chart,opt,callback){
	chart.showLoading();
	$.ajax({
		type:opt.type,
		url:opt.url,
		data:opt.data,
		dataType:opt.dataType,
		success:function(json){
			chart.hideLoading();
			if(callback&& typeof callback == 'function'){
				callback(json);
			}
		}
	});
}

//请求核心参数
function getMainData(chart,callback){
	ajaxRequest(chart,ajaxList.ajax1,callback);
}
