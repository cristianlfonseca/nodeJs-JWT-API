const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('mongoose');

//Importing Routes
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products')
const { request } = require('http');


dotenv.config();

//Aqui podemos usar function ou arrow function
//se vc tem um comando direto não precisa {}
db.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('Conectado ao DB!')
);

// db.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, function() {
//   console.log('Conectado ao DB!');
// });

app.use(
    express.urlencoded({
      extended: true
    })
  )

app.use(express.json());

// Middleware Routes
app.use('/api/user', authRoute);
app.use('/api/product', productsRoute);


app.listen(3000, function() {
  console.log('Servidr roando na porta 3000');
});
