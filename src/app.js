const express = require('express');
const ProductManager = require('./productManager'); // importar product manager

const app = express();
const PORT = 8080;
const productos = "./products.json";


const productManager = new ProductManager(productos);
productManager.loadProductsFromFile();

app.use(express.json());

//trae productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//trae productos a traves del id
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Productos:", productManager.getProducts());
});

app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Express');
});