const createProxyMiddleware = require("http-proxy-middleware");

module.exports = (app) => {
	app.use(
		["/api/*", "/api", "/auth/google"],
		createProxyMiddleware({
			target: "http://localhost:5000",
			headers: {
				Connection: "keep-alive",
			},
		})
	);
};
