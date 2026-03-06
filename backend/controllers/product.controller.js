/**
 * Product controllers.
 *
 * Key ideas in this project:
 * - Products are publicly browsable (guests can view listings).
 * - Admins can create/update/delete listings.
 * - Listings support an image gallery via `images[]` (and a legacy `image` field).
 */
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, images, category } = req.body;

    const incomingImages = Array.isArray(images) ? images : image ? [image] : [];
    const uploaded = [];

    for (const img of incomingImages) {
      if (!img) continue;
      const r = await cloudinary.uploader.upload(img, { folder: "products" });
      if (r?.secure_url) uploaded.push(r.secure_url);
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: uploaded[0] || "",
      images: uploaded,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allImages = [
      ...(Array.isArray(product.images) ? product.images : []),
      ...(product.image ? [product.image] : []),
    ];

    for (const url of allImages) {
      if (!url) continue;
      const publicId = url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("error deleting image from cloudinary", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          images: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, images } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (typeof name === "string") product.name = name;
    if (typeof description === "string") product.description = description;
    if (price !== undefined) product.price = price;
    if (typeof category === "string") product.category = category;

    // If images is provided, we treat it as "set gallery to exactly this list".
    // Supports mix of existing URLs + new base64 images.
    if (images !== undefined) {
      const incoming = Array.isArray(images) ? images : [];
      const nextImages = [];

      for (const img of incoming) {
        if (!img) continue;
        if (typeof img === "string" && /^https?:\/\//.test(img)) {
          nextImages.push(img);
          continue;
        }
        const r = await cloudinary.uploader.upload(img, { folder: "products" });
        if (r?.secure_url) nextImages.push(r.secure_url);
      }

      product.images = nextImages;
      product.image = nextImages[0] || product.image || "";
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
