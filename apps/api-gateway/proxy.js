const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
let proxy = {};

const movieProxy = createProxyMiddleware({
    target: `http://${process.env.INVENTORY_HOST}:${process.env.INVENTORY_PORT}/api/movies`, // target host with the same base path
    changeOrigin: true, // needed for virtual hosted sites
	on: {
		proxyReq: fixRequestBody
	}
});

proxy.movie = movieProxy

module.exports = proxy;