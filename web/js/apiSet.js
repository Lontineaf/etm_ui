/**
* @Author: ChenChao
* @Date:   2016-04-25 09:25:42
* @Last modified by:   chexingyou
* @Last modified time: 2016-05-06 09:35:23
*/

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
                'test': 'http://www.bapi.com',
                'test1': 'http://10.100.71.73:9401',
                'chenchao': 'http://10.100.71.76:9999',
                'product': ''
            };
        EM.apiConfig = {
            isJsonFile: host.isJsonFile,
            host: host[env] || '',
            apiSet: EM.apiSet[apiSetKey] || {},
            yzmUrl: host[env] + '/api/Addin/YZM?randNum='
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
        //经纪人api
        freeAgent: {
            //register
            'Initialize': 'GET:/etm/ctrlphp/index.php'
        }
    };

    //使用test环境，freeAgent项目的api
    EM.apiSetConfig(window.muiApiEnv || 'product', 'freeAgent');

    return EM;

}(window.EM || {});
