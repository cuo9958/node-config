const CronJob = require('cron').CronJob;
const ConfigData = require('../model/configs');

new CronJob('0 0 2 * * *', function() {
    ConfigData.clear();
}).start();
