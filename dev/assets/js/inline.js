var ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i), browser;
if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
  browser = "msie";
} else {
  browser = ua[1].toLowerCase();
}
var element = document.getElementById('html');
element.classList.add(browser);