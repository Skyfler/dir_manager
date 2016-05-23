"use strict";

var Page = require('./page.js');

(function(){
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/dir_manager', true);

    xhr.addEventListener('load', function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log('Got dirTree.');
            var page = new Page({
                elem: document.querySelector('[data-component="page"]'),                
                dirObject: JSON.parse(xhr.responseText)
            });
        }
    });

    xhr.send();
})();