var Buffer
var CryptoJS
var datapay
var blockExplorerRpc
var initWallet = function (BufferInit, CryptoJSInit, datapayInit, blockExplorerRpcInit) {
  Buffer = BufferInit
  CryptoJS = CryptoJSInit
  datapay = datapayInit
  blockExplorerRpc = blockExplorerRpcInit
}

var getUserPasswordHash = function () {
  const userPasswordHashLocalStorage = localStorage.getItem('user.userPasswordHash')
  const userPasswordHashSessionStorage = sessionStorage.getItem('user.userPasswordHash')

  if (userPasswordHashSessionStorage) {
    return userPasswordHashSessionStorage
  }
  if (userPasswordHashLocalStorage) {
    return userPasswordHashLocalStorage
  }
  return
}
var getPin = function () {
  const pinLocalStorage = localStorage.getItem('user.pin')
  const pinSessionStorage = sessionStorage.getItem('user.pin')
  if (pinSessionStorage) {
    return pinSessionStorage
  }
  if (pinLocalStorage) {
    return pinLocalStorage
  }
  return
}
var getPrivateKey = function () {
  const privateKeyLocalStorage = localStorage.getItem('user.privateKey')
  const privateKeySessionStorage = sessionStorage.getItem('user.privateKey')

  if (privateKeySessionStorage) {
    return privateKeySessionStorage
  }
  if (privateKeyLocalStorage) {
    return privateKeyLocalStorage
  }
  return
}
var getAddress = function () {
  const addressLocalStorage = localStorage.getItem('user.address')
  const addressSessionStorage = sessionStorage.getItem('user.address')
  if (addressSessionStorage) {
    return addressSessionStorage
  }
  if (addressLocalStorage) {
    return addressLocalStorage
  }
  return
}
var loggedViewMode = function () {
  if ((getPrivateKey() || getUserPasswordHash()) && !getPin()) {
    return true
  }
  return false
}
var loggedSpendMode = function () {
  if ((getPrivateKey() || getUserPasswordHash()) && getPin()) {
    return true
  }
  return false
}
var calculatePrivateKey = function () {
  if (!getPin()) {
    return
  }
  if (getPrivateKey()) {
    var bytes  = CryptoJS.AES.decrypt(getPrivateKey().toString(), getPin())
    return bytes.toString(CryptoJS.enc.Utf8)
  }
  if (getUserPasswordHash()) {
    const pinHash = bsv.crypto.Hash.sha256(Buffer.from(getPin()))
    const buffArray = [Buffer.from(getUserPasswordHash(), 'hex'), pinHash]
    const hash = bsv.crypto.Hash.sha256(Buffer.concat(buffArray))
    const bn = bsv.crypto.BN.fromBuffer(hash)
    const pk = bsv.PrivateKey(bn).toString()
    return pk
  }
  return
}
var addressFromPrivateKey = function () {
  try {
    const pk = calculatePrivateKey().toString()
    if (bsv.PrivateKey.isValid(pk)) {
      return bsv.PrivateKey(pk).toAddress().toString()
    }
  } catch (err) {
    return
  }
  return
}
var getAddressInfo = function () {
  return new Promise(function(resolve, reject) {
    if (getAddress()) {
      const insight = datapay.connect(blockExplorerRpc)
      insight.getUnspentUtxos(getAddress(), function (err, res) {
        let balanceSat  = 0
        for (let i = 0; i < res.length; ++i) {
          balanceSat += res[i].satoshis
        }
        var addressInfo = {balanceSat: balanceSat}
        resolve(addressInfo)
      })
    } else {
      reject("No address")
    }
  });
}
var addressStream = function () {
  if (getAddress()) {
    let address = getAddress()
    address = address.replace('bitcoincash:', '')
    let query = {
      'v': 3,
      'q': {
        'find': {
          '$or': [
            {'in.e.a': address},
            {'out.e.a': address}
          ]
        }
      }
    }
    const b64 = Base64.encode(JSON.stringify(query))
    const url = bitsocketNode + b64

    let es = new EventSource(url);
    es.addEventListener('message', event => {
      getAddressInfo()
      receivedTxs = JSON.parse(event.data)
    }, false)
    es.addEventListener('error', event => {
      if (event.readyState == EventSource.CLOSED) {
        console.log('Event was closed')
        console.log(EventSource)
      }
    }, false);
  }
}
var sendTransaction = function (dataArray = [], toArray = [], balanceSat) {
  return new Promise(function(resolve, reject) {
    let amountSat = 0
    for (let i = 0; i < toArray.length; ++i) {
      if (toArray[i].value < 546) {
        reject({'type': 'error', 'notification': 'Amount is less than the minimum dust limit (546 sat).'})
      }
      amountSat += toArray[i].value
    }
    if (balanceSat < amountSat) {
      reject({'type': 'error', 'notification': 'Wallet has insufficient funds'})
    }

    let datapayTx = {}
    datapayTx['safe'] = true
    datapayTx['pay'] = {}
    if (dataArray) {
      datapayTx['data'] = dataArray
    }
    datapayTx['pay']['rpc'] = blockExplorerRpc
    datapayTx['pay']['key'] = calculatePrivateKey()
    if (toArray) {
      datapayTx['pay']['to'] = toArray
    }

    datapay.build(datapayTx, function(error, res) {
      if (error) {
        console.log('datapay build failed: ', error)
        reject({'type': 'error', 'notification': 'datapay build failed: ' + error})
      }
      if (balanceSat <= amountSat + parseInt(res._estimateSize() * 1.4)) {
        reject({'type': 'error', 'notification': 'Wallet has insufficient funds for fee (' + parseInt(res._estimateSize() * 1.4) + 'sat).'})
      }

      datapay.send(datapayTx, function(error, hash) {
        if (error) {
          console.log('datapay failed: ', JSON.stringify(error))
          reject('Transaction failed: ' + JSON.stringify(error))
        }
        resolve('Transaction sent successfully. Transaction hash: ' + hash)
      })
    })
  })
}
var logout = function () {
  sessionStorage.removeItem('user.userPasswordHash')
  sessionStorage.removeItem('user.pin')
  sessionStorage.removeItem('user.privateKey')
  sessionStorage.removeItem('user.address')
  localStorage.removeItem('user.userPasswordHash')
  localStorage.removeItem('user.pin')
  localStorage.removeItem('user.privateKey')
  localStorage.removeItem('user.address')
}

var openModal = function (modalId) {
    const modal = document.getElementById(modalId)
    modal.style.display = "block"
}
var closeModal = function (modalId) {
    const modal = document.getElementById(modalId)
    modal.style.display = "none"
}
