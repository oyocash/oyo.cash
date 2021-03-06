async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}
async function loadHead() {
    document.head.innerHTML += await fetchHtmlAsText("/includes/head.html");
}
async function loadNav() {
    const contentDiv = document.getElementById("nav");
    if (contentDiv !== null) {
      contentDiv.innerHTML = await fetchHtmlAsText("/includes/nav.html");
    }
}
async function loadFooter() {
    const contentDiv = document.getElementById("footer");
    if (contentDiv !== null) {
      contentDiv.innerHTML = await fetchHtmlAsText("/includes/footer.html");
    }
}
async function loadWalletPinModal() {
    const contentDiv = document.getElementById("walletPinModal");
    if (contentDiv !== null) {
      contentDiv.innerHTML = await fetchHtmlAsText("/includes/wallet/pin.html");
    }
}
