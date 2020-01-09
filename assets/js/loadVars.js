// for Oyo External Link Protocol
window.oyoProRankingPeriod = 30 * 24 * 60 * 60 // 30 days
window.oyoProDefaultLink = "https://link.oyo.cash/?tx={tx_hash}"
// default search period
window.searchPeriodDefault = 30
window.searchPeriod = window.searchPeriodDefault
// bob planaria node
window.bobNodeDefault = 'https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/'
window.bobNode = window.bobNodeDefault
if (localStorage.getItem('bobNode')) {
  if (window.bobNodeDefault === localStorage.getItem('bobNode'))
  {
    localStorage.removeItem('bobNode')
  } else {
    window.bobNode = localStorage.getItem('bobNode')
  }
}
// neongenesis planaria node
window.neongenesisNodeDefault = 'https://neongenesis.bitdb.network/q/1HcBPzWoKDL2FhCMbocQmLuFTYsiD73u1j/'
window.neongenesisNode = window.neongenesisNodeDefault
if (localStorage.getItem('neongenesisNode')) {
  if (window.neongenesisNodeDefault === localStorage.getItem('neongenesisNode'))
  {
    localStorage.removeItem('neongenesisNode')
  } else {
    window.neongenesisNode = localStorage.getItem('neongenesisNode')
  }
}
// bitsocket node
window.bitsocketNodeDefault = 'https://bob.planaria.network/s/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/'
window.bitsocketNode = window.bitsocketNodeDefault
if (localStorage.getItem('bitsocketNode')) {
  if (window.bitsocketNodeDefault == localStorage.getItem('bitsocketNode'))
  {
    localStorage.removeItem('bitsocketNode')
  } else {
    window.bitsocketNode = localStorage.getItem('bitsocketNode')
  }
}
// bitdb api key
window.bitdbApiKeyDefault = 'qpl84tsdqd6yxd3hpxhj5ngr3rp0pvlweqy7p7rzfy'
window.bitdbApiKey = window.bitdbApiKeyDefault
if (localStorage.getItem('bitdbApiKey')) {
  if (window.bitdbApiKeyDefault === localStorage.getItem('bitdbApiKey'))
  {
    localStorage.removeItem('bitdbApiKey')
  } else {
    window.bitdbApiKey = localStorage.getItem('bitdbApiKey')
  }
}
// block explorer rpc
window.blockExplorerRpcDefault = 'https://api.bitindex.network'
window.blockExplorerRpc = window.blockExplorerRpcDefault
if (localStorage.getItem('blockExplorerRpc')) {
  if (window.blockExplorerRpcDefault == localStorage.getItem('blockExplorerRpc'))
  {
    localStorage.removeItem('blockExplorerRpc')
  } else {
    window.blockExplorerRpc = localStorage.getItem('blockExplorerRpc')
  }
}
// results per page
window.resultsPerPageDefault = 20
window.resultsPerPage = window.resultsPerPageDefault
if (localStorage.getItem('resultsPerPage')) {
  if (parseInt(window.resultsPerPageDefault) == parseInt(localStorage.getItem('resultsPerPage')))
  {
    localStorage.removeItem('resultsPerPage')
  } else {
    window.resultsPerPage = localStorage.getItem('resultsPerPage')
  }
}
// protocols
window.protocolsDefault = "{}"
if (!localStorage.getItem('protocols')) {
  window.protocols = window.protocolsDefault
} else {
  window.protocols = localStorage.getItem('protocols')
}
