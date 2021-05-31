const { Router } = require('express');
const Product = require('../models/Product');

module.exports = {
  ProductsController: (conn) => {
    const router = Router();

    router.get('/', async (req, res) => {
      const products = await Product.getAll(conn)();

      res.status(200).json(products);
    });

    return router;
  }
};
