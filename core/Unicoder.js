const unicode = (str) => {
  return str
    .split('')
    .map(ch => "\\u" + ch.charCodeAt(0).toString(16).toLowerCase())
    .join('');
}
module.exports = unicode;