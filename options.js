window.addEventListener('load', function () {
    var btn = document.getElementById('lct-configure');
    btn.addEventListener('click', function () {
        browser.lightningcalendartabs.openOptions();
    });
});