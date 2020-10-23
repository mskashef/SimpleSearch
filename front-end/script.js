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
      body: `query=${document.getElementById('queryInput').value.trim()}`
    })
    .then(res => res.json())
    .then(result => {
      document.getElementById("searchResult").innerHTML = result.success ? (
        result.docs.length > 0 ? (
          result.docs.map(renderItem).join('')
        ) : (
            `<div id="notFound">
            <h3>404&nbsp;-&nbsp;</h3>
            <p>"${document.getElementById('queryInput').value.trim()}" did not match any token!</p>
          </div>`
          )
      ) : (
          `<div id="error">${result.error}</div>`
        );
      this.removeAttribute('disabled');
    })
    .catch((error) => {
      document.getElementById("searchResult").innerHTML = `<div id="error">Connection Error: Could not connect to the server!</div>`;
      this.removeAttribute('disabled');
    });
});