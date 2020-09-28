const ChannelModel = require('../model/channel');
const ConfigsModel = require('../model/configs');
const LogsModel = require('../model/logs');
const SnapshotModel = require('../model/snapshot');
const UserhotModel = require('../model/user');

//重新创建频道表
ChannelModel.install();
//重新创建配置表
ConfigsModel.install();
//重新创建日志表
LogsModel.install();
//重新创建配置快照表
SnapshotModel.install();
//重新创建用户表
UserhotModel.install();
