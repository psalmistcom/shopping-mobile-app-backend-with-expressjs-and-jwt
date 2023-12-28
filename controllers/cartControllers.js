const Product = require("../models/Product");
const Cart = require("../models/Cart");

module.exports = {
  addCart: async (res, req) => {
    const userId = req.user.id;
    const { cartItem, quantity } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (cart) {
        const exisitingProduct = cart.products.find(
          (product) => product.cartItem.toString() === cartItem
        );

        if (exisitingProduct) {
          exisitingProduct.quantity += 1;
        } else {
          cart.products.push({ cartItem, quantity: 1 });
        }

        await cart.save();
        res.status(200).json("Product added to cart");
      } else {
        const newCart = new Cart({
          userId,
          products: [{ cartItem, quantity: 1 }],
        });

        await newCart.save();
        res.status(200).json("Product added to cart");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
