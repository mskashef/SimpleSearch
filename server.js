const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Query = require('./Query');

// app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const { store, index } = require('./app');

app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.length === 0) {
    res
      .status(400)
      .json({ success: false, error: 'Query Can not be empty!' });
    return;
  }
  let q = new Query(query, index, store);
  let queryResult;
  let error = false;
  try {
    queryResult = q.run();
  } catch {
    error = true;
  }
  if (error) {
    console.log('405 - Wrong Query');
    setTimeout(() => {
      res
        .status(200)
        .json({ success: false, error: 'Wrong Query!' });
    }, 500)
    return;
  } else if (!queryResult || queryResult.isEmpty()) {
    setTimeout(() => {
      res.send({
        success: true,
        docs: []
      });
    }, 500)
  } else {
    let response = [];
    for (const docId of [...queryResult.getDocIds()]) {
      response.push(store.get(docId));
    }
    setTimeout(() => {
      res.send({
        success: true,
        docs: response
      });
    }, 500)
  }
});


app.listen(3000);
