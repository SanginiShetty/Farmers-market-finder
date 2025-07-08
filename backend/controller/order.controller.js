import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import Product from "../models/product.model.js";
import { Courier } from "../models/courier.model.js";
import { Farmer } from "../models/farmer.model.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";

export const orderProducts = async (req, res) => {
    try {
        const { productId, totalAmount, quantity, paymentMethod, location } =
            req.body;
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let paymentStatus;
        if (paymentMethod != "online") {
            paymentStatus = "pending";
        } else {
            paymentStatus = "completed";
        }
        const randomNumber = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const newOrder = new Order({
            customer: customer._id,
            farmer: product.farmerId,
            product: productId,
            totalAmount: totalAmount,
            quantity: quantity,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            location: location,
            isAvailable: true,
            randomNumber: randomNumber,
        });

        await newOrder.save();
        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const orderAssign = async (req, res) => {
    try {
        const { orderId } = req.params;
        const courier = await Courier.findOne({ user: req.user._id });

        if (!courier) {
            return res.status(404).json({ message: "Courier not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const customer = await Customer.findById(order.customer);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Get the user associated with the customer to get their email
        const user = await User.findById(customer.user);
        if (!user || !user.email) {
            return res
                .status(400)
                .json({ message: "Customer email not found" });
        }

        const product = await Product.findById(order.product);
        const farmer = await Farmer.findById(order.farmer);

        // Update order with courier information
        order.courier = courier._id;
        order.isAvailable = false;
        await order.save();

        // Create transporter with your specific email credentials
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "random53763@gmail.com",
                pass: "fqllnszflzxyfwle",
            },
        });

        // Create farm-themed HTML email template
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Order Has Been Picked Up</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #4CAF50;
                    color: white;
                    border-radius: 8px 8px 0 0;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 20px;
                }
                .order-details {
                    background-color: #f5f9f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #4CAF50;
                }
                .courier-details {
                    background-color: #f0f7ff;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #2196F3;
                }
                .verification-code {
                    background-color: #fff8e1;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #FFC107;
                    text-align: center;
                }
                .verification-number {
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    color: #FF5722;
                    padding: 10px;
                    background-color: #FAFAFA;
                    border-radius: 4px;
                    display: inline-block;
                    margin: 10px 0;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 14px;
                }
                h1 {
                    color: #ffffff;
                    margin: 0;
                }
                h2 {
                    color: #4CAF50;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 15px;
                }
                .divider {
                    height: 1px;
                    background-color: #e0e0e0;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/uploads/farmerLogo.png" alt="Farm Fresh Logo" class="logo">
                    <h1>Your Order Has Been Picked Up!</h1>
                </div>
                <div class="content">
                    <p>Hello ${user.fullName || "Valued Customer"},</p>
                    <p>Great news! Your order has been picked up by our courier and is on its way to you.</p>
                    
                    <div class="order-details">
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Product:</strong> ${product ? product.name : "Your product"}</p>
                        <p><strong>Quantity:</strong> ${order.quantity}</p>
                        <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
                        <p><strong>Farm Source:</strong> ${farmer ? farmer.name : "Local Farm"}</p>
                    </div>
                    
                    <div class="verification-code">
                        <h2>Verification Code</h2>
                        <p>Please provide this code to the courier upon delivery:</p>
                        <div class="verification-number">${order.randomNumber}</div>
                        <p><strong>Important:</strong> This code confirms you've received your order.</p>
                    </div>
                    
                    <div class="courier-details">
                        <h2>Courier Information</h2>
                        <p><strong>Courier Name:</strong> ${courier.fullName}</p>
                        <p><strong>Contact Number:</strong> ${courier.phoneNumber || "Not available"}</p>
                    </div>
                    
                    <p>Your order is expected to arrive at your location soon. The courier may contact you for delivery coordination.</p>
                    
                    <p>If you have any questions about your delivery, please feel free to contact our customer service or reach out directly to the courier.</p>
                    <div class="divider"></div>
                    
                    <p>Thank you for supporting local farmers and choosing fresh, farm-to-table products!</p>
                    
                    <p>Warm regards,<br>The Farm Fresh Team</p>
                </div>
                <div class="footer">
                    <p>© 2023 Farm Fresh Market. All rights reserved.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Debug log to check user email
        console.log("Sending email to:", user.email);

        const mailOptions = {
            from: "random53763@gmail.com",
            to: user.email,
            subject: "Your Order Has Been Picked Up",
            html: emailHtml,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully to:", user.email);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Continue with the response even if email fails
        }

        res.status(200).json({
            message:
                "Order assigned to courier and notification sent to customer",
            success: true,
        });
    } catch (error) {
        console.error("Error in orderAssign:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        const pickupLocations = {};

        for (const order of orders) {
            const farmer = await Farmer.findById(order.farmer);
            if (farmer) {
                const location = farmer.location;
                if (!pickupLocations[location]) {
                    pickupLocations[location] = [];
                }
                pickupLocations[location].push(order);
            }
        }

        res.status(200).json({ pickupLocations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ farmer: req.user._id }).select(
            "totalAmount quantity status"
        );
        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const orders = await Order.find({ customer: customer._id });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deliveryVerification = async (req, res) => {
    try {
        const { orderId, randomNumber } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.randomNumber === randomNumber) {
            order.status = "completed";
            await order.save();
            
            // Get customer and user information
            const customer = await Customer.findById(order.customer);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
            
            const user = await User.findById(customer.user);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            // Get product information
            const product = await Product.findById(order.product);
            
            // Create email transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "random53763@gmail.com",
                    pass: "fqllnszflzxyfwle",
                },
            });
            
            // Create farm-themed HTML email template for delivery confirmation
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Order Has Been Delivered</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background-color: #4CAF50;
                        color: white;
                        border-radius: 8px 8px 0 0;
                    }
                    .logo {
                        max-width: 150px;
                        margin-bottom: 10px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .order-details {
                        background-color: #f5f9f5;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                        border-left: 4px solid #4CAF50;
                    }
                    .success-message {
                        background-color: #e8f5e9;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                        text-align: center;
                        border: 2px dashed #4CAF50;
                    }
                    .success-icon {
                        font-size: 48px;
                        color: #4CAF50;
                        margin-bottom: 10px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-size: 14px;
                        background-color: #f5f5f5;
                        border-radius: 0 0 8px 8px;
                    }
                    h1 {
                        color: #ffffff;
                        margin: 0;
                    }
                    h2 {
                        color: #4CAF50;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin-top: 15px;
                    }
                    .divider {
                        height: 1px;
                        background-color: #e0e0e0;
                        margin: 20px 0;
                    }
                    .rating-request {
                        background-color: #f9fbe7;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .stars {
                        font-size: 24px;
                        color: #FFC107;
                        letter-spacing: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/uploads/farmerLogo.png" alt="Farm Fresh Logo" class="logo">
                        <h1>Your Order Has Been Delivered!</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${user.fullName || "Valued Customer"},</p>
                        
                        <div class="success-message">
                            <div class="success-icon">✓</div>
                            <p>Great news! Your order has been successfully delivered and verified.</p>
                            <p>Thank you for choosing farm-fresh products!</p>
                        </div>
                        
                        <div class="order-details">
                            <h2>Order Summary</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Product:</strong> ${product ? product.name : "Your product"}</p>
                            <p><strong>Quantity:</strong> ${order.quantity}</p>
                            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
                            <p><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <div class="rating-request">
                            <h2>How was your experience?</h2>
                            <p>We'd love to hear your feedback on the product quality and delivery service.</p>
                            <div class="stars">★★★★★</div>
                            <a href="#" class="button">Rate Your Experience</a>
                        </div>
                        
                        <p>We hope you enjoy your farm-fresh products! Your support helps local farmers thrive.</p>
                        
                        <div class="divider"></div>
                        
                        <p>Want to reorder or explore more fresh products?</p>
                        <div style="text-align: center;">
                            <a href="#" class="button">Shop More Products</a>
                        </div>
                        
                        <p>Warm regards,<br>The Farm Fresh Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2023 Farm Fresh Market. All rights reserved.</p>
                        <p>Questions? Contact our support team at support@farmfresh.com</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            
            const mailOptions = {
                from: "random53763@gmail.com",
                to: user.email,
                subject: "Your Order Has Been Delivered Successfully!",
                html: emailHtml,
            };
            
            try {
                await transporter.sendMail(mailOptions);
                console.log("Delivery confirmation email sent successfully to:", user.email);
            } catch (emailError) {
                console.error("Error sending delivery confirmation email:", emailError);
                // Continue with the response even if email fails
            }
            
            res.status(200).json({ message: "Order verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (error) {
        console.error("Error in deliveryVerification:", error);
        res.status(500).json({ message: error.message });
    }
};
