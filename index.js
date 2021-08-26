const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('mongoose');

//Importing Routes
const routes = require('./routes/webRoutes');
// const { request } = require('http');


dotenv.config();

//Aqui podemos usar function ou arrow function
//se vc tem um comando direto não precisa {}
db.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('Conectado ao DB!')
);

app.use(
    express.urlencoded({
      extended: true
    })
  )

app.use(express.json());

// Middleware Routes
app.use('/api/user', routes.auth);
app.use('/api/product', routes.products);

const dirTree = require("directory-tree");
const tree = dirTree('./routes');
for (const key in tree.children) {
  console.log(tree.children[key].name.replace('.js',''));
}

app.listen(3000, function() {
  console.log('Servidr roando na porta 3000');
});
