//Write Text File
var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
if (path.match(/^\/([A-Z]\:)/)) {
    path = path.slice(1);
}
path = decodeURIComponent(path) + "save.txt";
var fs = require('fs');
fs.writeFile(path, "Game Complete", function(err) {
    if(err) {
        return console.log(err);
    }
});


//Read Text File
var xhr = new XMLHttpRequest();
xhr.open("GET","data/save.txt",false);
xhr.send(null); 

var fileContent = xhr.responseText;
if(fileContent === "Game Complete") {
    $gameVariables.setValue(1, 1);
}