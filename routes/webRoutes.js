const dirTree = require("directory-tree");
const files = dirTree('./routes');
const routeFile = files.children
for (const key in routeFile) {
  var file = routeFile[key].name.replace('.js','');
  module.exports[file] = require('./'+file);
}
