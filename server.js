const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const app = express();

const apiProxy = proxy.createProxyMiddleware("/api", {
    target: process.env.BACKEND_URL || 'https://rentowne-production.up.railway.app/',
    changeOrigin: true
});
app.use(apiProxy);
app.use(express.static(__dirname + "/dist/rentowne"));

app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/dist/rentowne/index.html")
});

app.listen(process.env.PORT || 3000);
