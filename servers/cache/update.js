/**
 * 更新缓存
 */
const cache_search = require('./search');
const MQ = require('../db/mq');

MQ.onMsg('cpm_publish', function(msg) {
    console.log('收到', msg);
    cache_search.update(msg);
});
