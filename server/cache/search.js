// const LRU = require('lru-cache');
// const ConfigsModel = require('../model/configs');
// const JSON5 = require('json5');

// //住缓存，缓存1分钟
// const cache = new LRU({
//     maxAge: 60000,
//     updateAgeOnGet: true
// });
// //备份数据，缓存1天
// const cache_bak = new LRU({
//     maxAge: 86400000,
//     updateAgeOnGet: true
// });
// //缓存乐观锁
// const cache_lock = {};

// async function searchFromData(channel) {
//     const data = [];
//     try {
//         const list = await ConfigsModel.search(channel);
//         list.forEach(item => {
//             const result = JSON5.parse(item.result_data);
//             data.push({
//                 result,
//                 state: item.state,
//                 task_start_time: item.task_start_time,
//                 task_end_time: item.task_end_time,
//                 proption: item.proption
//             });
//         });
//     } catch (error) {
//         console.log(error);
//     }
//     return data;
// }

// async function getList(channel) {
//     if (cache.has(channel)) {
//         return cache.get(channel);
//     }
//     if (cache_lock[channel] && cache_bak.has(channel)) {
//         return cache_bak.get(channel) || {};
//     }
//     cache_lock[channel] = true;
//     const data = await searchFromData(channel);
//     cache.set(channel, data);
//     cache_lock[channel] = false;
//     return data;
// }

// const check_list = [
//     '0',
//     '1',
//     '2',
//     '3',
//     '4',
//     '5',
//     '6',
//     '7',
//     '8',
//     '9',
//     'a',
//     'b',
//     'c',
//     'd',
//     'e',
//     'f',
//     'g',
//     'h',
//     'i',
//     'j',
//     'k',
//     'l',
//     'm',
//     'n',
//     'o',
//     'p',
//     'q',
//     'r',
//     's',
//     't',
//     'u',
//     'v',
//     'w',
//     'x',
//     'y',
//     'z'
// ];

// /**
//  * 根据clientid计算是否在灰度中
//  * @param {*} clientid
//  * @param {*} proption
//  */
// function checkActive(clientid, proption) {
//     if (!clientid || proption === 0) return false;
//     if (proption === 100) return true;
//     let checkStr = clientid.toLowerCase();
//     if (checkStr.length < 2) return false;
//     let prece = check_list.indexOf(checkStr[checkStr.length - 1]);
//     prece += check_list.indexOf(checkStr[checkStr.length - 2]) * 10;
//     if (isNaN(prece)) return false;
//     return prece % 100 < proption;
// }

// module.exports = {
//     async update(channel) {
//         console.log('更新一次', channel);
//         const data = await searchFromData(channel);
//         cache.set(channel, data);
//         return data;
//     },
//     async search(channel = '', clientid = '') {
//         const list = await getList(channel);
//         const now = Date.now();
//         const result = {};
//         list.forEach(item => {
//             //兼容空配置
//             if (!item.result) return;
//             //如果是普通配置
//             if (item.state === 0) {
//                 result[item.result.key] = item.result.val;
//             }
//             //如果是定时任务
//             if (item.state === 1) {
//                 if (item.task_start_time === 0 && item.task_end_time === 0) {
//                     result[item.result.key] = item.result.val;
//                 }
//                 if (item.task_start_time > 0 && item.task_end_time > 0) {
//                     if (now > item.task_start_time && now < item.task_end_time) {
//                         result[item.result.key] = item.result.val;
//                     }
//                 }
//                 if (item.task_start_time > 0 || item.task_end_time > 0) {
//                     if (item.task_end_time === 0 && now > item.task_start_time) {
//                         result[item.result.key] = item.result.val;
//                     }
//                     if (item.task_start_time === 0 && now < item.task_end_time) {
//                         result[item.result.key] = item.result.val;
//                     }
//                 }
//             }
//             //如果是灰度任务
//             if (item.state === 2 && checkActive(clientid, item.proption)) {
//                 result[item.result.key] = item.result.val;
//             }
//         });
//         return result;
//     }
// };
const ResourceCache = require('./resource');

module.exports = {
    search(channel, clientid) {
        const data = ResourceCache.get(channel);

        return data;
    },
};
