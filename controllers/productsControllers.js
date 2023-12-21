const Product = require("../models/Product");

module.exports = {
  createProduct: async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      await newProduct.save();
      res.status(200).json("Product created");
    } catch (error) {
      res.status(500).json("Failed to create product");
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Failed to get the product");
    }
  },

  getProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);
      const { __v, createdAt, ...productData } = product._doc;
      res.status(200).json(productData);
    } catch (error) {
      res.status(500).json("Failed to get the product");
    }
  },

  searchProduct: async (req, res) => {
    try {
      const results = await Product.aggregate([
        {
          $search: {
            index: "shoes",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json("Failed to get the product");
    }
  },
};
