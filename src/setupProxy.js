const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        proxy("/api_config", {
            target: "http://127.0.0.1:18062",
            changeOrigin: true
        })
    );
};
