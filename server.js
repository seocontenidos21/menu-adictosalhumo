const express = require('express');
const app = express();
app.use(express.static(__dirname, { maxAge: 0, etag: false }));
app.listen(process.env.PORT || 3000);
