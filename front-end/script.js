const renderItem = ({ docId, name }) => (`
  <div class="itemCard">
    <h3 class="itemCard__id">${docId}</h5>
    <p class="itemCard__name">${name}</p>
  </div>
`);
document.getElementById('searchButton').addEventListener('click', function () {
  this.setAttribute('disabled', 'true');
  document.getElementById("searchResult").innerHTML = `<div class="loading"></div>`;
  window
    .fetch('http://localhost:3000/search', {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `query=${document.getElementById('queryInput').value}`
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        document.getElementById("searchResult").innerHTML = result.docs.map(renderItem).join('');
      } else {
        document.getElementById("searchResult").innerHTML = `<div id="error">${result.error}</div>`;
      }
      this.removeAttribute('disabled');
    })
    .catch(function (error) {
      console.log(error);
      console.log('Request failed', error);
      this.removeAttribute('disabled');
    });
});