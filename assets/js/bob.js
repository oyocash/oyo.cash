var bitcomPrefixes = []
var bitcomProtocols = {}
var getBitcomProtocols =  function() {
  return new Promise(function(resolve, reject) {
    let queryMatch = {}
    queryMatch['$and'] = []
    queryMatch['$and'].push({"out.tape.cell": {"$all": [{"$elemMatch": {"i": 0, "s": "$"}}, {"$elemMatch": {"i": 1, "s": "echo"}}, {"$elemMatch": {"i": 3, "s": {"$in": ["to", ">"]}}}, {"$elemMatch": {"i": 4, "s": {'$in': ['name']}}}]}})
    queryMatch['$and'].push({'in.e.a': {'$in': bitcomPrefixes}})

    let query = {
      'v': 3,
      'q': {
        'find': queryMatch,
        'skip': 0,
        'limit': 500
      }
    }
    let b64 = btoa(JSON.stringify(query))
    let url = window.bobNode + b64

    let header
    if (window.bitdbApiKey) {
      header = { headers: { key: window.bitdbApiKey } }
    }

    fetch(url, header).then(function(r) {
      return r.json()
    }).then(response => {
      if (response !== undefined && (response.u !== undefined || response.c !== undefined)) {
        let bitcomEchoResults = []
        if (response.u !== undefined) {
          bitcomEchoResults = bitcomEchoResults.concat(response.u.reverse())
        }
        if (response.c !== undefined) {
          bitcomEchoResults = bitcomEchoResults.concat(response.c)
        }

        let bitcomProtocols = {}
        for (let i = 0; i < bitcomEchoResults.length; ++i) {
          for (let j = 0; j < bitcomEchoResults[i]['out'].length; ++j) {
            if (!bitcomEchoResults[i]['out'][j]) {
              continue
            }
            for (let jj = 0; jj < bitcomEchoResults[i]['out'][j]['tape'].length; ++jj) {
              if (bitcomProtocols[bitcomEchoResults[i]['in'][0].e.a] === undefined) {
                bitcomProtocols[bitcomEchoResults[i]['in'][0].e.a] = {}
              }
              if (bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][4] !== undefined) {
                if (bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][0].s === "$" && bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][1].s === "echo" && bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][3].s === "to" && bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][4].s === "name") {
                  let field = bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][4].s
                  if (bitcomProtocols[bitcomEchoResults[i]['in'][0].e.a][field] === undefined) {
                    bitcomProtocols[bitcomEchoResults[i]['in'][0].e.a][field] = bitcomEchoResults[i]['out'][j]['tape'][jj]['cell'][2].s
                  }
                }
              }
            }
          }
        }
        resolve(bitcomProtocols)
      }
    })
    .catch(error => {
      reject(error)
      console.log(error)
    })
  });
}

var getOyoExternalLinkProtocols = function(listBaseProtocols, listApps) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getOyoExternalLinkRankings("149xadSKJcKdhgE4sMmcvx421nsGYwgkWo", "default", ["default"]),
      getOyoExternalLinkRankings("149xadSKJcKdhgE4sMmcvx421nsGYwgkWo", "baseProtocol", listBaseProtocols),
      getOyoExternalLinkRankings("149xadSKJcKdhgE4sMmcvx421nsGYwgkWo", "mapApp", listApps)
    ]).then(function(values) {
      var returnValues = {}
      returnValues.default = values[0].default
      returnValues.baseProtocol = values[1].baseProtocol
      returnValues.mapApp = values[2].mapApp
      resolve(returnValues)
    }).catch(error => {
      reject(error)
      console.log(error)
    })
  })
}
var getOyoExternalLinkRankings = function(address, type, names) {
  return new Promise(function(resolve, reject) {
    if (names.length === 0) {
      var oyoLinks = []
      oyoLinks[type] = {}
      resolve(oyoLinks)
    }

    let endTimestamp = parseInt(new Date().getTime() / 1000)
    let beginTimestamp = parseInt(endTimestamp - window.oyoProRankingPeriod)

    let $or = []
    for (let i = 0; i < names.length; ++i) {
      $or.push({"out.s3": unescape(encodeURIComponent(names[i]))})
    }

    var query = {
      "v": 3,
      "q": {
        "aggregate": [{
          "$match": {
            "$and": [{
              "out.s1": address
            }, {
              "out.s2": type
            }, {
              $or
            }, {
              "out.s4": { "$regex" : "https?:\\/\\/.*\\{tx_hash\\}.*" }
            }, {
              "out.e.a": address
            }, {
              "$or": [{
                "blk.t": {
                      "$gte": beginTimestamp,
                      "$lte": endTimestamp
                    }
                },
                {"blk": null}
              ]
            }]
          }
        }, {
          '$project': {
            "out.s3":1, "out.s4": 1,
            'satoshis': {
              '$cond': {
                'if': {
                  '$eq': [{'$arrayElemAt': ['$out.e.a', 0]}, address]
                },
                'then': {
                  '$arrayElemAt': ['$out.e.v', 0]
                },
                'else': {
                  '$cond': {
                    'if': {
                      '$eq': [{'$arrayElemAt': ['$out.e.a', 1]}, address]
                    },
                    'then': {
                      '$arrayElemAt': ['$out.e.v', 1]
                    },
                    'else': {
                      '$cond': {
                        'if': {
                          '$eq': [{'$arrayElemAt': ['$out.e.a', 2]}, address]
                        },
                        'then': {
                          '$arrayElemAt': ['$out.e.v', 2]
                        },
                        'else': 0
                      }
                    }
                  }
                }
              }
            }
          }
        }, {
          "$group": {
              "_id": {
                "name": "$out.s3",
                "url": "$out.s4"
              },
              "satoshis": {
                "$sum": "$satoshis"
              }
          }
        }],
        "limit": 10000,
        "sort": {"satoshis": -1}
      }
    }
    let b64 = btoa(JSON.stringify(query))
    let url = window.neongenesisNode + b64

    let header
    if (window.bitdbApiKey) {
      header = { headers: { key: window.bitdbApiKey } }
    }

    fetch(url, header).then(function(r) {
      return r.json()
    }).then(response => {
        if (response.c !== undefined || response.u !== undefined) {
          let items = []
          if (response.c !== undefined) {
            items = items.concat(response.c)
          }
          if (response.u !== undefined) {
            for (let i = 0; i < response.u.length; ++i) {
              let added = 0
              for (let j = 0; j < items.length; ++j) {
                if (JSON.stringify(response.u[i]._id) === JSON.stringify(items[j]._id)) {
                  items[j].satoshis += response.u[i].satoshis
                  added = 1
                }
              }
              if (added === 0) {
                items = items.concat(response.u[i])
                added = 1
              }
            }
          }
          // assign items here
          var oyoLinks = []
          oyoLinks[type] = {}
          for (let i = 0; i < items.length; ++i) {
            if (oyoLinks[type][items[i]._id.name] === undefined) {
              oyoLinks[type][items[i]._id.name] = items[i]._id.url
            }
          }
        }
        resolve(oyoLinks)
    }).catch(error => {
      reject(error)
      console.log(error)
    })
  })
}
/*
var getOyoExternalLinkRankings = function(address, type, names) {
  if (names.length === 0) {
    return
  }
  let endTimestamp = parseInt(new Date().getTime() / 1000)
  let beginTimestamp = parseInt(endTimestamp - window.oyoProRankingPeriod)

  let queryMatch = {}
  queryMatch['$and'] = []
  queryMatch['$and'].push({"out.tape.cell": {"$all": [{"$elemMatch": {"i": 0, "s": address}}, {"$elemMatch": {"i": 1, "s": type}}, {"$elemMatch": {"i": 2, "s": {'$in': names}}}, {"$elemMatch": {"i": 3, "s": { "$regex" : "https?:\\/\\/.*\\{tx_hash\\}.*" }}}]}})
  queryMatch['$and'].push({"out.e.a": address})
  queryMatch['$and'].push({"$or": [{"blk.t": {"$gte": beginTimestamp, "$lte": endTimestamp}}, {"blk": null}]})
  var query = {
    "v": 3,
    "q": {
      "aggregate": [{
          "$unwind": "$out"
        },{
          "$unwind": "$out.tape"
        },{
          "$match":  queryMatch
        }, {
        '$project': {
          "nameCell":{'$arrayElemAt': ['$out.tape.cell', 2]},
          "pathCell": {'$arrayElemAt': ['$out.tape.cell', 3]},
          'satoshis': {
            '$cond': {
              'if': {
                '$eq': [{'$arrayElemAt': ['$out.e.a', 0]}, address]
              },
              'then': {
                '$arrayElemAt': ['$out.e.v', 0]
              },
              'else': {
                '$cond': {
                  'if': {
                    '$eq': [{'$arrayElemAt': ['$out.e.a', 1]}, address]
                  },
                  'then': {
                    '$arrayElemAt': ['$out.e.v', 1]
                  },
                  'else': {
                    '$cond': {
                      'if': {
                        '$eq': [{'$arrayElemAt': ['$out.e.a', 2]}, address]
                      },
                      'then': {
                        '$arrayElemAt': ['$out.e.v', 2]
                      },
                      'else': 0
                    }
                  }
                }
              }
            }
          }
        }
      }, {
        "$group": {
            "_id": {
              "name": "$nameCell.s",
              "url": "$pathCell.s"
            },
            "satoshis": {
              "$sum": "$satoshis"
            }
        }
      }],
      "limit": 10000,
      "sort": {"satoshis": -1}
    }
  }
  let b64 = btoa(JSON.stringify(query))
  let url = window.bobNode + b64

  let header
  if (window.bitdbApiKey) {
    header = { headers: { key: window.bitdbApiKey } }
  }

  fetch(url, header).then(function(r) {
    return r.json()
  }).then(response => {
      if (response.c !== undefined || response.u !== undefined) {
        let items = []
        if (response.c !== undefined) {
          items = items.concat(response.c)
        }
        if (response.u !== undefined) {
          for (let i = 0; i < response.u.length; ++i) {
            let added = 0
            for (let j = 0; j < items.length; ++j) {
              if (JSON.stringify(response.u[i]._id) === JSON.stringify(items[j]._id)) {
                items[j].satoshis += response.u[i].satoshis
                added = 1
              }
            }
            if (added === 0) {
              items = items.concat(response.u[i])
              added = 1
            }
          }
        }
        // assign items here
        oyoExternalLinks[type] = {}
        for (let i = 0; i < items.length; ++i) {
          if (oyoExternalLinks[type][items[i]._id.name] === undefined) {
            oyoExternalLinks[type][items[i]._id.name] = items[i]._id.url
          }
        }
      }
  })
}
*/

var searchQueryCreator = function(searchPhrase, beginTimestamp, endTimestamp) {
  let matchPhrase = searchPhrase
  let queryMatch = {}
  queryMatch['$and'] = []

  // transform prefix "h" to prefix "b"
  if (matchPhrase.match(/prefix:\s*[0-9a-fA-F]+\b\s*/)) {
    let match = matchPhrase.match(/(?:^|\s+)prefix:\s*([0-9a-fA-F]+)\s*/u)
    if (match && match[1]) {
      var bPrefix = hexToBase64(match[1])
      matchPhrase = matchPhrase.replace(/(?:^|\s+)prefix:\s*[0-9a-fA-F]+\s*/gu, ' prefix:' + bPrefix + ' ')
    }
  }

  // prefix "b"
  if (matchPhrase.match(/prefix:\s*\S+=\s*/)) {
    let match = matchPhrase.match(/(?:^|\s+)prefix:\s*(\S+=)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({"out.tape.cell": {"$all": [{"$elemMatch": {"i": 0, "b": match[1]}}]}})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)prefix:\s*\S+=\s*/gu, ' ')
    }
  }
  // prefix "s"
  if (matchPhrase.match(/prefix:\s*\S+\s*/)) {
    let match = matchPhrase.match(/(?:^|\s+)prefix:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({"out.tape.cell": {"$all": [{"$elemMatch": {"i": 0, "s": match[1]}}]}})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)prefix:\s*\S+\s*/gu, ' ')
    }
  }
  // MAP app
  if (matchPhrase.match(/app:\s*\S+\s*/)) {
    let match = matchPhrase.match(/(?:^|\s+)app:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({"$or": [{"out.tape.cell": {"$all": [{"$elemMatch": {"i": 2, "s": "app"}}, {"$elemMatch": {"i": 3, "s": match[1]}}]}}, {"out.tape.cell": {"$all": [{"$elemMatch": {"i": 14, "s": "app"}}, {"$elemMatch": {"i": 15, "s": match[1]}}]}}, {"out.tape.cell": {"$all": [{"$elemMatch": {"i": 16, "s": "app"}}, {"$elemMatch": {"i": 17, "s": match[1]}}]}}]})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)app:\s*\S+\s*/gu, ' ')
    }
  }
  if (matchPhrase.includes("from:")) {
    let match = matchPhrase.match(/(?:^|\s+)from:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({'in.e.a': window.convertAddress(match[1])})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)from:\s*\S+\s*/gu, ' ')
    }
  }
  if (matchPhrase.includes("notfrom:")) {
    let match = matchPhrase.match(/(?:^|\s+)notfrom:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({'in.e.a': { '$ne': window.convertAddress(match[1]) }})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)notfrom:\s*\S+\s*/gu, ' ')
    }
  }
  if (matchPhrase.includes("to:")) {
    let match = matchPhrase.match(/(?:^|\s+)to:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({'out.e.a': window.convertAddress(match[1])})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)to:\s*\S+\s*/gu, ' ')
    }
  }
  if (matchPhrase.includes("notto:")) {
    let match = matchPhrase.match(/(?:^|\s+)notto:\s*(\S+)\s*/u)
    if (match && match[1]) {
      queryMatch['$and'].push({'out.e.a': { '$ne': window.convertAddress(match[1]) }})
      matchPhrase = matchPhrase.replace(/(?:^|\s+)notto:\s*\S+\s*/gu, ' ')
    }
  }
  // datetime:
  if (matchPhrase.includes("datetime:")) {
    let match = matchPhrase.match(/(?:^|\s+)datetime:\s*(\S+)\s*/u)
    if (match && match[1]) {
      let endDate = new Date(Date.UTC(match[1].substring(0,4), parseInt(match[1].substring(4,6)) - 1, match[1].substring(6,8), 23, 59, 59, 0))
      endTimestamp = parseInt(endDate.getTime() / 1000) + 1
      beginTimestamp = parseInt(endTimestamp - window.oyoProRankingPeriod)
      matchPhrase = matchPhrase.replace(/(?:^|\s+)datetime:\s*\S+\s*/gu, ' ')
    }
  }
  // period:
  if (matchPhrase.includes("period:")) {
    let match = matchPhrase.match(/(?:^|\s+)period:\s*(\S+)\s*/u)
    if (match && match[1]) {
      beginTimestamp = parseInt(endTimestamp - (match[1] * 24 * 60 * 60))
      matchPhrase = matchPhrase.replace(/(?:^|\s+)period:\s*\S+\s*/gu, ' ')
    }
  }
  matchPhrase = matchPhrase.trim()
  //quoting words containing '.'
  let tmpMatchPhraseArray = matchPhrase.match(/\S+|"[^"]+"/gu) || []
  for (let i = 0; i < tmpMatchPhraseArray.length; ++i) {
    if (tmpMatchPhraseArray[i].includes('.') && !tmpMatchPhraseArray[i].includes('"')) {
      tmpMatchPhraseArray[i] = '"' + tmpMatchPhraseArray[i] + '"'
    }
  }
  matchPhrase = tmpMatchPhraseArray.join(" ")

  if (matchPhrase) {
    queryMatch['$and'].push({'$text': {'$search': '\"' + matchPhrase + '\"'}})
  }
  queryMatch['$and'].push({'blk.t': {'$gte': beginTimestamp, '$lte': endTimestamp}})

  return queryMatch
}
