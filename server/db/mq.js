const amqplib = require('amqplib');
const config = require('config');

const options = config.get('amq');
const cache_list = new Map();
let open;

amqplib
    .connect(options)
    .then(res => {
        return res.createChannel();
    })
    .then(res => {
        console.log('MQ已经运行', options.hostname);
        open = res;
        return cache_list.forEach((v, k) => runAction(k, v));
    })
    .catch(err => console.log(err));

async function runAction(name, fn) {
    try {
        await open.assertExchange(name, 'fanout', { durable: false });
        const qok = await open.assertQueue('', { exclusive: true });
        await open.bindQueue(qok.queue, name, '');
        open.consume(qok.queue, function(msg) {
            if (!msg) return;
            fn(msg.content.toString());
            open.ack(msg);
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    //发布消息
    async publish(name, data) {
        if (!open) return;
        try {
            await open.assertExchange(name, 'fanout', { durable: false });
            await open.publish(name, '', Buffer.from(data));
        } catch (error) {
            console.log(error);
        }
    },
    //接受消息
    async onMsg(name, fn) {
        if (!open) {
            cache_list.set(name, fn);
        } else {
            runAction(name, fn);
        }
    }
};
