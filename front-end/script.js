const openUrl = url => {
  console.log(url);
  window.open(url, '_blank');
}
// const renderItem = ({ docId, name, url }) => (`
//   <div class="itemCard" onclick="javascript:openUrl('${url}')">
//     <h3 class="itemCard__id">${docId}</h5>
//     <p class="itemCard__name">${name}</p>
//   </div>
// `);

// document.getElementById('searchButton').addEventListener('click', function () {
//   this.setAttribute('disabled', 'true');
//   document.getElementById("searchResult").innerHTML = `<div class="loading"></div>`;
//   document.getElementById("count").innerText = '';
//   window
//     .fetch('http://localhost:3000/search', {
//       method: 'post',
//       headers: {
//         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
//       },
//       body: `query=${document.getElementById('queryInput').value.trim()}`
//     })
//     .then(res => res.json())
//     .then(result => {
//       try {
//         const count = result.docs.length;

//       } catch { }
//       const count = result.docs.length;
//       document.getElementById("searchResult").innerHTML = result.success ? (
//         count > 0 ? (
//           result.docs.map(renderItem).join('')
//         ) : (
//             `<div id="notFound">
//             <h3>404&nbsp;-&nbsp;</h3>
//             <p>"${document.getElementById('queryInput').value.trim()}" did not match any token!</p>
//           </div>`
//           )
//       ) : (
//           `<div id="error">${result.error}</div>`
//         );
//       document.getElementById("count").innerText = count > 0 ? `${count} result${count > 1 && 's'} found.` : '';
//       this.removeAttribute('disabled');
//     })
//     .catch((error) => {
//       document.getElementById("searchResult").innerHTML = `<div id="error">Connection Error: Could not connect to the server!</div>`;
//       this.removeAttribute('disabled');
//     });
// });

const renderItem = ({ docId, name, url }) => (`
  <div class="itemCard" onclick="javascript:openUrl('${url}')">
    <h3 class="itemCard__id">${docId}</h5>
    <p class="itemCard__name">${name}</p>
  </div>
`);
const showLimit = 1000;
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
      for (const d of result.docs) {
        if (Number(d.docId) > 149661 - 5 && Number(d.docId) < 149661 + 5) {
          console.log(d.docId)
          console.log(d.body)
        }

      }
      document.getElementById("searchResult").innerHTML = result.success ? (
        result.docs.length > 0 ? (
          result.docs.filter((item, index) => index < showLimit).map(renderItem).join('')
        ) : (
            `<div id="notFound">
            <h3>404&nbsp;-&nbsp;</h3>
            <p>"${document.getElementById('queryInput').value.trim()}" did not match any token!</p>
          </div>`
          )
      ) : (
          `<div id="error">${result.error}</div>`
        );
      const count = result.docs.length;
      document.getElementById("count").innerText = count > 0 ? `${count} result${count > 1 ? 's' : ''} found. ${count > showLimit ? `Showing first ${showLimit} documents` : ''}` : '';
      this.removeAttribute('disabled');
    })
    .catch((error) => {
      document.getElementById("searchResult").innerHTML = `<div id="error">Connection Error: Could not connect to the server!</div>`;
      this.removeAttribute('disabled');
    });
});