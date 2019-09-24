const CronJob = require('cron').CronJob;
const qiniu = require('../cache/qiniu');

new CronJob('* */10 * * * *', function() {
    qiniu.update();
}).start();
qiniu.update();
