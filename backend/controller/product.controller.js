import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            unit,
            description,
            category,
            stock,
            isAvailable,
            location,
        } = req.body;
        
        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }
        
        // Get the image URL from the uploaded file
        const imageUrl = req.file.location;
        console.log("Product image URL:", imageUrl);

        const product = await Product.create({
            name,
            price,
            unit,
            description,
            image: imageUrl,
            category,
            stock,
            isAvailable: isAvailable === undefined ? true : isAvailable,
            userId: req.user._id,
            farmerId: req.farmer._id,
            location,
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
};

export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
        success: true,
        product,
    });
};

export const getProductsByCategory = async (req, res) => {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json({
        success: true,
        products,
    });
};  

export const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    });
};

export const deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
};
