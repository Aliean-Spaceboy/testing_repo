const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

code = code.replace(
    "window.initCloudSync = cloud.initCloudSync;",
    "window.initCloudSync = cloud.initCloudSync;\nwindow.setupCloudSync = cloud.initCloudSync;"
);

fs.writeFileSync('js/app.js', code);
console.log("patched app.js");
