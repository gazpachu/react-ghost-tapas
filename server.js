const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/dist`));

app.get('*', (req, res) => {
  const file = `${__dirname}/dist/index.html`;
  res.sendFile(file);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
});
