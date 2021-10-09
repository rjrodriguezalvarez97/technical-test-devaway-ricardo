const express = require('express');

require('./src/DatabaseConnection').connect();

// const router = require('./src/api/routes/router.js');

const app = express();

app.use(express.json());
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
