var getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}
var navToggled = function() {
  if (document.getElementById("nav-list").classList.contains("active")) {
    document.getElementById("nav-list").classList.add('inactive')
    document.getElementById("nav-list").classList.remove('active')
  } else {
    document.getElementById("nav-list").classList.add('active')
    document.getElementById("nav-list").classList.remove('inactive')
  }
}
var navSearchPerformed = function() {
  document.getElementById('navSearchButton').addEventListener("click", function() {
    searchText = document.getElementById('navSearchText').value;
    changeSearchRoute(searchText, 0)
  })
  document.getElementById('navSearchText').addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.getElementById("navSearchButton").click();
    }
  });
}
var changeSearchRoute = function(searchText, offset) {
  if (document.getElementById('navSearchText').value) {
    window.open('/result/?search=' + btoa(searchText) + '&offset=' + offset, "_self")
  }
}
var hexToBase64 = function(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}
