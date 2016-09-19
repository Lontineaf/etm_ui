var EM = function (EM) {

    "use strict";
    
 /**
     * @namespace
     * @memberof EM
     * @description 公共方法集合
     * @type {object}
     */
    EM.util = {
        callAppInterface: function(iosAddress, andriodAPI, params){
            if(EM.util.isIos){
                //ios freeAgent://
                !!iosAddress && (window.location = iosAddress);
            }else{
                //andriod
                if(window.eastmoney && window.eastmoney[andriodAPI]){
                    !!params ? window.eastmoney[andriodAPI](params) : window.eastmoney[andriodAPI]();
                }
            }
        },

        /**
         * 判断当前设备是否为ios设备
         * @type {boolean}
         */
        // isIos: isIos(),

        /**
         * 判断当前设备是否为 winphone
         * @type {boolean}
         */
        isWinPhone: function(){
            return navigator.userAgent.match(/windows (ce|phone|nt)/i);
        }(),

        /**
         * 获取cookie
         * @param {string} name
         */
        getCookie: function(name){
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr != null){
                return unescape(arr[2]);
            }
            return null;
        },

        /**
         * 调用Loading遮罩层
         * @param {string} text 文本提示信息，可使用html
         */
        showLoading: function(text, isPageLoading){
            var cls = isPageLoading ? 'fullLoading-cover' : 'fullLoading';
            var $loading = $('<div class="'+ cls +'"><div class="fullLoadingBox"><i></i>' + (text || '') + '</div></div>');
            $('body').append($loading);
        },

        /**
         * 关闭Loading遮罩层
         */
        hideLoading: function(isPageLoading){
            var cls = isPageLoading ? 'fullLoading-cover' : 'fullLoading';
            $('.' + cls).eq(0).remove();
        }

    };


    /**
     * @memberof EM
     * @description 接口调用方法
     * @param options {object} 参数对象
     * <br>options.action 具体接口名称，对应apiConifg里的接口key
     * <br>options.params 参数对象
     * <br>options.showLoading 是否开启遮罩层，默认为true
     * <br>options.message 交互中提示的文本信息，支持html
     * <br>options.success 成功回调
     * <br>options.beforeSend 发送前执行的方法
     * <br>options.error 错误回调
     * <br>options.complete 请求完成的回调
     * @example
        EM.service({
            action: 'Initialize',
            showLoading: false,
            success: function (json) {
                if (json.Status == 0) {
                    EM.ls.set('smsRndKey', json.Result[0]);
                    EM.ls.set('smsRndValue', json.Result[1]);
                } else {
                    EM.alert('网络出错！');
                }
            }
        });
     */
    EM.service = function (options) {
        var actionUrl = EM.apiConfig.apiSet[options.action];
        // console.log(actionUrl)
        options = $.extend({
            showLoading: true
        }, options);
        if (actionUrl) {
            actionUrl = actionUrl.split(':');
            //alert(actionUrl);
            var ajaxReq = $.ajax({
                 url: EM.apiConfig.host + actionUrl[1],
                //url: options.action == EM.apiConfig.host + actionUrl[1],
                type: actionUrl[0],
                data: options.params,
                dataType: 'jsonp',
                timeout: 0,
                beforeSend: function (xhr, settings) {
                    options.showLoading && EM.util.showLoading(options.message || '', options.showLoading == 'page');
                    options.beforeSend && options.beforeSend(xhr, settings);
                },
                success: function (data, status, xhr) {
                    EM.util.hideLoading(options.showLoading == 'page');
       
                    if (data){
                        if(data.Status == -1000) {
                            //接口异常
                            if(data.OtherInfo && data.OtherInfo.rmstatus){
                                try{
                                    var json = JSON.parse(data.OtherInfo.rmstatus);
                                    // EM.alert('<div style="text-align: left">ResultStatus:' + json.ResultStatus + '<br>ResultMsg:' + json.ResultMsg + '</div>');
                                    consolel.log('<div style="text-align: left">ResultStatus:' + json.ResultStatus + '<br>ResultMsg:' + json.ResultMsg + '</div>')
                                  
                                }catch(e){
                                   alert(data.OtherInfo.rmstatus);
                                }
                            }else{
                               alert(data.Message);
                            }
                        } else {
                            options.success && options.success(data);
                        }
                    }
                },
                error: function (xhr, errorType, error) {
                 //   EM.util.hideLoading(options.showLoading == 'page');
                    //授权过期
                    if(xhr.status == 401){
                       
                        alert(error+"401")
                        return;
                    }
                    options.onError && options.onError(xhr, errorType, error);
                },
                complete: function (xhr, status) {
                  //  EM.util.hideLoading(options.showLoading == 'page');
                    if(status == 'timeout'){
                        ajaxReq.abort();
                       alert("网络超时，请刷新尝试");
                        return;
                    }
                    options.onComplete && options.onComplete(xhr, status);
                }
            });
        } else {
            throw '所请求的API不存在：' + options.action;
        }
    };

        return EM;
}(window.EM || {});