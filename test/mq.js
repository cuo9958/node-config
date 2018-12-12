const MQ = require("../lib/mq");

let mq = new MQ("a1838ab4-fb43-41a4-9fe9-2f364a20805e");

mq.on("test");


setTimeout(() => {
    mq.push("test", "a1838ab4-fb43-41a4-9fe9-2f364a20805e", {
        a: 1,
        b: 2
    })
}, 1000);