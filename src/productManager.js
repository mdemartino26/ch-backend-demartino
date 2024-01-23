const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.productIdCounter = 1;
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.productIdCounter = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    } catch (error) {
      this.products = [];
    }
  }
  saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }

  addProduct(productData) {
    // como me fijo si se completaron todos los campos
    if (!productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }
  
    // verificar si ya existe un producto con el mismo código
    if (this.products.some(product => product.code === productData.code)) {
      console.error("Ya existe un producto con el mismo código.");
      return;
    }
  
    // id autoincrementable
    const product = {
      id: this.productIdCounter++,
      ...productData,
    };
  
    this.products.push(product);
    this.saveProductsToFile();
    console.log("Producto agregado:", product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado.");
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      //actualiza el producto con los campos que se necesiten actualizar
      this.products[index] = {
        ...this.products[index],
        ...updatedFields,
        id: this.products[index].id, //no cambia el ID
      };

      this.saveProductsToFile();
      console.log("Producto actualizado:", this.products[index]);
    } else {
      console.error("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProductsToFile();
      console.log("Producto eliminado:", deletedProduct);
    } else {
      console.error("Producto no encontrado.");
    }
  }
}


module.exports = ProductManager;
