const express = require('express');
const router = require('./src/Routes/router');

require('./src/DatabaseConnection').connect();

// const router = require('./src/api/routes/router.js');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(router());
const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
