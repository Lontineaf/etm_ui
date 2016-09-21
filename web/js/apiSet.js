

/**
 * @namespace EM
 */
var EM = function (EM) {

    "use strict";

    /**
     * @namespace
     * @memberof EM
     * @description 项目接口集合
     * @type {object}
     */
    EM.apiConfig = {};

    /**
     * @function apiSetConfig
     * @description 设置使用api配置
     * @memberof EM
     * @param env {string} 指定的环境（host地址）
     * @param apiSetKey {string} 指定环境中的项目(具体项目名称如：freeAgent、trade等)
     * @returns {{}} 具体的接口配置对象EM.apiConfig
     */
    EM.apiSetConfig = function (env, apiSetKey) {
        var host = window.muiApiConfig || {
                'test': 'http://180.168.4.202:7173',
                'product': ''
            };
        EM.apiConfig = {
            isJsonFile: host.isJsonFile,
            host: host[env] || '',
            apiSet: EM.apiSet[apiSetKey] || {}
        };
        return EM.apiConfig;
    };
     
    /**
     * @namespace
     * @memberof EM
     * @description 所有api接口集合
     * @type {object}
     */
    EM.apiSet = {
        //监控api
        etmAPI: {
            //etmTest
            'etmAPITEST': 'GET:/etm/ctrlphp/index.php',

            //核心 tcpconn/tcpwait连接数 
            'IdxCorelineData':'GET:/etm/ctrlphp/index.php?c=mtest&a=sTableA2',

             //核心链接数 hostID
            'IdxCorelineHostID':'GET:/etm/ctrlphp/index.php?c=mtest&a=sTableA0',

             //核心监控项目列表
            'IdxCorelineprojlist':'GET:/etm/ctrlphp/index.php?c=mtest&a=sTableA1',
            
            //获取市场列表
            'getMarketList':'GET:/etm/ctrlphp/index.php?c=monitor&a=mMonitorL01',
            
            //获取市场对应产品列表
            'getProductList':'GET:/etm/ctrlphp/index.php?c=monitor&a=mMonitorL02',
            
            //获取产品链路列表
            'getProductLinkList':'GET:/etm/ctrlphp/index.php?c=monitor&a=mMonitorL03'
        }
    };

    //使用test环境，freeAgent项目的api
    EM.apiSetConfig(window.muiApiEnv || 'test', 'etmAPI');

    return EM;

}(window.EM || {});
