// for Oyo External Link Protocol
window.oyoProRankingPeriod = 30 * 24 * 60 * 60 // 30 days
window.oyoProDefaultLink = "https://link.oyo.cash/?tx={tx_hash}"
// default search period
window.searchPeriodDefault = 30
window.searchPeriod = window.searchPeriodDefault
// bob planaria node
window.bobNodeDefault = 'https://bob.bitbus.network/block/'
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
window.neongenesisNodeDefault = 'https://txo.bitbus.network/block/'
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
// planaria token
window.planariaTokenDefault = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxS3NOWUE5Y0RHZ2tzcW5SUG1CVm9lQnl1RXpianFlaERLIiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SDZxQ08zN0tGVWE4VkFWTG9CQTgxNGlGZkNNTEhRSmRTdzZkb0dQZGp1cklhTU9KYXQ5Nmx6dVVwM09Xa3pCaXc5ZkJhejdvV0lOcHlnMEhpRVJlSnd3PQ'
window.planariaToken = window.planariaTokenDefault
if (localStorage.getItem('planariaToken')) {
  if (window.planariaTokenDefault === localStorage.getItem('planariaToken'))
  {
    localStorage.removeItem('planariaToken')
  } else {
    window.planariaToken = localStorage.getItem('planariaToken')
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
