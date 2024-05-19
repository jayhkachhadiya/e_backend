const userModel = require('../models/user')
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const os = require('os');
const sessionConfig = require('../middlewares/session_middleware');

const register = async (req, res) => {
    try {
        const { email, password, macAddress } = req.body;
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({
                status: 400,
                message: "record already exists"
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            console.log(hashPassword)
            await userModel.create({
                email,
                password: hashPassword,
                macAddress
            })
            return res.json({
                status: 200,
                message: "register successfully"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // const user = await userModel.findOne({ email }).populate('cart');
        const user = await userModel.findOne({ email })
        console.log(user)
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (user.email == email && isMatch) {
                const secret = process.env.JWT_SECRATE_KEY
                console.log(secret)
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '5d' })
                return res.json({
                    status: 200,
                    message: "login success",
                    "token": token
                })
            } else {
                return res.json({
                    status: 400,
                    message: 'bad request'
                })
            }
        } else {
            return res.json({
                status: 400,
                message: "user not found"
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMac = async (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    const macAddress = networkInterfaces['Ethernet'][0].mac;
    return res.json({
        status: 200,
        macAddress
    })
}

// ------------------------------------------------------------------

const carts = {}
const addProduct = async (req, res) => {
    try {
        var { productId, size, quantity } = req.body;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const macAddress = req.macAddress;
        if (!carts[macAddress]) {
            carts[macAddress] = [];
        }
        // carts[macAddress].push(product)

        console.log(productId)
        // const existingProductIndex = carts[macAddress].findIndex(item => {
        //     console.log(item._id, productId);
        //     return item._id === productId;
        // });
        // if (existingProductIndex !== -1) {
        //     carts[macAddress][existingProductIndex].quantity += 1;
        // } else {
        //     product.quantity = 1;
        //     carts[macAddress].push(product);
        // }
        // const existingProductIndex = carts[macAddress].findIndex(item =>{
        //     item.id === productId
        // });
        const existingProductIndex = carts[macAddress].findIndex(item => {
            return item._id.toString() === productId
        })
        console.log(existingProductIndex, "existingProductIndex")
        if (existingProductIndex !== -1) {
            // If the product exists, increment its quantity
            carts[macAddress][existingProductIndex].quantity += 1;
        } else {
            // If the product doesn't exist, add it to the cart with the specified quantity
            // product.quantity = 1;
            quantity = 1
            carts[macAddress].push({ ...product.toObject(), quantity })
        }
        return res.json({ message: 'Item added to cart', cart: carts[macAddress] });
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

const getCart = async (req, res) => {
    try {
        const macAddress = req.macAddress;
        console.log(" carts[macAddress] carts[macAddress] carts[macAddress] carts[macAddress]", carts[macAddress])
        const cartItems = await carts[macAddress];
        console.log(cartItems, "cartItemscartItems")
        if (cartItems == undefined) {
            return res.json({
                status: 400,
                message: 'cart is empty'
            })
        }
        else {
            const products = await Promise.all(cartItems?.map(async (productId) => {
                const product = await productModel.findById(productId);
                return product;
            }));
            return res.json({
                status: 200,
                carts: products
            });
        }
    } catch (error) {
        console.log(error.message, "error.messageerror.message")
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

const removeCart = async (req, res) => {
    try {
        const macAddress = req.macAddress;
        console.log(macAddress, "macAddressmacAddress")
        const { productId } = req.params;
        console.log(productId, "productIdproductId")
        const cartItems = await carts[macAddress];

        if (cartItems) {
            const updatedCartItems = cartItems.filter(item => item.id !== productId);
            console.log(updatedCartItems, "updatedCartItemsupdatedCartItems")
            carts[macAddress] = updatedCartItems;
            console.log(carts[macAddress] = updatedCartItems, "carts[macAddress] = updatedCartItems;")
            return res.json({
                status: 200,
                message: "Item removed from cart successfully",
                updatedCartItems
            });
        } else {
            return res.json({
                status: 400,
                message: "cart is empty"
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            message: 'internal server error'
        })
    }
}

// ---------------------------------------------------------------

const getAllProductFromCart = async (macAddress) => {
    try {
        if (carts[macAddress]) {
            const cartItems = await carts[macAddress];
            return cartItems;
        } else {
            return [];
        }
    } catch (error) {
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

const addProductInCart = async (req, res) => {
    try {
        const macAddress = req.macAddress;
        const userId = req.user.id;
        const cartItem = await getAllProductFromCart(macAddress)
        if (cartItem) {
            cartItem.map(async (item) => {
                try {
                    const doc = new cartModel({
                        userId,
                        productId: item._id,
                        quantity: item.quantity,
                        amount: item.amount
                    });
                    await doc.save();
                } catch (error) {
                    console.error("Error saving cart item:", error.message);
                }
            });
            return res.json({
                status: 200,
                message: "data save in cart",

            })
        } else {
            return res.json({
                status: 400,
                message: "not item in cart"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// this is wrok using sessionid
// const carts = {}
// const addProduct = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const sessionId = req.sessionID;
//         const product = await productModel.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         console.log(sessionId)
//         if (!carts[sessionId]) {
//             carts[sessionId] = [];
//         }
//         carts[sessionId].push(product);

//         res.json({ message: 'Item added to cart', cart: carts[sessionId] });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({
//             status: 500,
//             message: "Internal server error"
//         });
//     }
// };

// const getProductFromCart = (sessionId) => {
//     if (carts[sessionId]) {
//         return carts[sessionId];
//     } else {
//         return [];
//     }
// };

// const getCart = async (req, res) => {
//     try {
//         const sessionId = req.sessionID;
//         const cartItems = getProductFromCart(sessionId);
//         return res.json({ cart: cartItems });

//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({
//             status: 500,
//             message: "Internal server error"
//         });
//     }
// };

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports = {
    register,
    login,
    getMac,
    addProduct,
    getCart,
    addProductInCart,
    removeCart
}