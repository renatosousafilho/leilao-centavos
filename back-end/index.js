const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const getConnection = require('./models/connection');

const { ProductsController } = require('./controllers/ProductsController');
const Product = require('./models/Product');

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET']
  }
});

let connection;

(async () => {
  connection = await getConnection();
  
  app.use('/products', ProductsController(connection));

  io.on('connection', (socket) => {
    console.log(`Novo usuário conectado ${socket.id}`);

    socket.on('updateCurrentAuction', async ({ id }) => {
      const result = await Product.updateCurrentAuction(connection)(id);

      const product = await Product.getById(connection)(id);
      
      io.emit('refreshCurrentAuction', product);

      if (product.currentAuction >= product.arremate) io.emit('arremate', product);
    });
  });
})();



http.listen(3001);