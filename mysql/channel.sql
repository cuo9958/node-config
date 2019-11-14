CREATE TABLE IF NOT EXISTS `fe_config_channel` (`id` INTEGER auto_increment , `title` VARCHAR(255) DEFAULT '' COMMENT '标题', `key` VARCHAR(20) DEFAULT '' COMMENT 'key值', `remark` VARCHAR(255) DEFAULT '' COMMENT '备注', `nickname` VARCHAR(255) DEFAULT '' COMMENT '发布人', `status` TINYINT DEFAULT 0 COMMENT '状态;0:失效;1:使用', `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `fe_config_channel`