import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    const items = user.cardItems || [];

    if (!items.length) return res.json([]);

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const quantityById = new Map(
      items.map((i) => [String(i.product), i.quantity || 1]),
    );

    const cart = products.map((p) => ({
      ...p,
      quantity: quantityById.get(String(p._id)) || 1,
    }));

    res.json(cart);
  } catch (error) {
    console.log("error with getCartProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const user = req.user;
    const existingItem = user.cardItems.find(
      (item) => String(item.product) === String(productId),
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cardItems.push({ product: productId, quantity: 1 });
    }

    await user.save();
    return res.json({ message: "Added to cart" });
  } catch (error) {
    console.log("error with addToCart controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body || {};
    const user = req.user;

    if (!productId) {
      user.cardItems = [];
    } else {
      user.cardItems = user.cardItems.filter(
        (item) => String(item.product) !== String(productId),
      );
    }

    await user.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;

    const user = req.user;
    const item = user.cardItems.find(
      (i) => String(i.product) === String(productId),
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity === 0) {
      user.cardItems = user.cardItems.filter(
        (i) => String(i.product) !== String(productId),
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    console.log("error with updateQuantity controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
