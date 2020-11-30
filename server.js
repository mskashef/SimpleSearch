const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Query = require('./core/Query');
const unicode = require('./core/Unicoder');
// app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { store, index } = require('./core/app');
const sendResponse = (res, status, data) => {
  setTimeout(() => {
    res
      .status(status)
      .json(data);
  }, 500)
}

app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.length === 0) {
    sendResponse(res, 200, { success: false, error: 'Query Can not be empty!' })
    return;
  }
  let q = new Query(query.toLowerCase().trim(), index, store);
  let queryResult;
  let error = false;
  try {
    queryResult = q.run();
  } catch (e) {
    error = true;
  }
  if (error)
    sendResponse(res, 200, { success: false, error: 'Wrong Query!' });
  else if (!queryResult || queryResult.length === 0)
    sendResponse(res, 200, { success: true, docs: [] });
  else {
    let response = new Set();
    for (const docId of [...queryResult.map(posList => posList.docId)])
      response.add(store.get(docId));
    sendResponse(res, 200, { success: true, docs: [...response] });
  }
});

app.listen(3000);
