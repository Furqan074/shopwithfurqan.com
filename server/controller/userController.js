import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Customers from "../modals/customer.js";
import Products from "../modals/product.js";
import Orders from "../modals/order.js";
const JWT_SECRET = process.env.JWT_SECRET;
import { Resend } from "resend";

// login customer
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, Password are required",
      });
    }
    const existingCustomer = await Customers.findOne({ Email: email });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "User does not exist Sign Up",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingCustomer.Password
    );

    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        customerId: existingCustomer.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie(
      "token",
      {
        customerName: existingCustomer.Name,
        customerEmail: existingCustomer.Email,
        customerPhone: existingCustomer.Phone,
        customerAddress: existingCustomer.Address,
        token: token,
      },
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: process.env.NODE_ENV === "production" ? "shopwithfurqan.com" : "",
        maxAge: 3600000, // 1 hour in milliseconds
      }
    );

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const recover = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingCustomer = await Customers.findOne({ Email: email });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email, please signup",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    existingCustomer.ResetPassToken = resetToken;
    existingCustomer.ResetPassTokenExp = Date.now() + 1200000; // 20 minutes

    await existingCustomer.save();

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "shopwithfurqan <noreply@shopwithfurqan.com>",
      to: existingCustomer.Email,
      subject: "Reset your password",
      html: `<main style="text-align: center; font-family: Arial, Helvetica, sans-serif">
      <h1>RESET YOUR PASSWORD</h1>
      <h2>Hi ${existingCustomer.Name},</h2>
      <p style="font-weight: 600">
        You have requested to reset your password. To continue,
      </p>
      <a href="http://localhost:5173/reset/${resetToken}">
        <button
          style="
            border: none;
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
            color: #000;
            background-color: #db4444;
          "
        >
          Click Here
        </button>
      </a>
    </main>`,
    });
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error("Error during recover password:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// reset password
export const reset = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const existingCustomer = await Customers.findOne({
      ResetPassToken: req.params.token,
      ResetPassTokenExp: { $gt: Date.now() },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    existingCustomer.Password = hashedPassword;

    await existingCustomer.save();

    return res.status(201).json({
      success: true,
      message: "Success! Your password has been changed.",
    });
  } catch (err) {
    console.error("Error during recover password:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Register customer here
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Password are required",
      });
    }
    const existingCustomer = await Customers.findOne({ Email: email });

    if (existingCustomer) {
      return res.status(403).json({
        success: false,
        message: "User already exists please login",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCustomer = Customers({
      Name: name,
      Email: email,
      Password: hashedPassword,
    });

    await newCustomer.save();

    const token = jwt.sign(
      {
        customerId: newCustomer.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // save info in cookies
    res.cookie(
      "token",
      {
        customerId: newCustomer.id,
        customerName: newCustomer.Name,
        customerEmail: newCustomer.Email,
        customerPhone: newCustomer.Phone,
        customerAddress: newCustomer.Address,
        token: token,
      },
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: process.env.NODE_ENV === "production" ? "shopwithfurqan.com" : "",
        maxAge: 3600000, // 1 hour in milliseconds
      }
    );

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.log("unknown error happen during registration " + err);
    res.status(500).json({
      message: "unknown error happen during registration",
    });
  }
};

// edit customer profile here
export const profile = async (req, res) => {
  try {
    const {
      name,
      oldEmail,
      newEmail,
      phone,
      address,
      oldPassword,
      newPassword,
    } = req.body;

    if (!oldEmail || !name) {
      return res.status(400).json({
        status: 400,
        message: "First Name and Email can't be empty",
      });
    }

    const existingCustomer = await Customers.findOne({ Email: oldEmail });

    if (!existingCustomer) {
      return res.status(404).json({
        status: 404,
        message: "Customer not found",
      });
    }

    if (newEmail !== oldEmail) {
      const emailTaken = await Customers.findOne({ Email: newEmail });

      if (emailTaken) {
        return res.status(403).json({
          status: 403,
          message: "Email is taken already",
        });
      }
    }

    if (oldPassword) {
      const isValidPassword = await bcrypt.compare(
        oldPassword,
        existingCustomer.Password
      );
      if (!isValidPassword) {
        return res.status(404).json({
          status: 404,
          message:
            "Invalid Previous Password. If you forgot it, recover it by going on /recover",
        });
      }
    }

    let hashedPassword = existingCustomer.Password;
    if (newPassword) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    }

    existingCustomer.Name = name;
    existingCustomer.Email = newEmail;
    existingCustomer.Phone = phone;
    existingCustomer.Address = address;
    existingCustomer.Password = hashedPassword;

    await existingCustomer.save();

    const token = jwt.sign(
      {
        customerId: existingCustomer.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Save info in cookies
    res.cookie(
      "token",
      {
        customerName: existingCustomer.Name,
        customerEmail: existingCustomer.Email,
        customerPhone: existingCustomer.Phone,
        customerAddress: existingCustomer.Address,
        token: token,
      },
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: process.env.NODE_ENV === "production" ? "shopwithfurqan.com" : "",
        maxAge: 3600000, // 1 hour in milliseconds
      }
    );

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.log("Unknown error happened during updating profile: " + err);
    res.status(500).json({
      status: 500,
      message: "Unknown error happened during updating profile",
    });
  }
};

// Get single product
export const getSingleProduct = async (req, res) => {
  try {
    const name = req.params.name;
    const productFound = await Products.findOne({
      Name: name,
      $and: { Stock: { $gte: 1 } },
    });

    const relatedProductsFound = await Products.find({
      Collection: productFound.Collection,
      _id: { $ne: productFound._id },
    });
    const sortedReviews = productFound.Reviews.sort(
      (a, b) => b.Rating - a.Rating
    );
    res.status(200).json({
      success: true,
      productFound: {
        ...productFound.toObject(),
        Reviews: sortedReviews,
      },
      relatedProductsFound,
    });
  } catch (error) {
    console.log("error occur during getting product data:" + error);
  }
};

export const getCollectionProducts = async (req, res) => {
  try {
    const collectionName = req.params.name;
    const {
      brand,
      price_range,
      rating,
      material,
      ribbon,
      page: parsedPage = 1,
      limit: parsedLimit = 16,
    } = req.query;

    const query = {
      Collection: collectionName,
      $and: { Stock: { $gte: 1 } },
    };

    if (brand !== "null") {
      query.Brand = brand;
    }

    if (material !== "null") {
      query.Material = decodeURIComponent(
        material.replace(/%%20/g, "__PERCENT__")
      ).replace(/__PERCENT__/g, "% ");
    }

    if (ribbon) {
      query.Ribbon = ribbon;
    }

    if (rating) {
      query.AverageRating = { $gte: Number(rating) };
    }

    if (price_range) {
      const [minPrice, maxPrice] = price_range.split("-").map(Number);

      query.$and = [];

      query.$and.push({
        $or: [
          { DiscountedPrice: { $gte: minPrice || 0 } },
          { Price: { $gte: minPrice || 0 } },
        ],
      });

      query.$and.push({
        $or: [
          { Price: { $lte: maxPrice || Infinity } },
          { DiscountedPrice: { $lte: maxPrice || Infinity } },
        ],
      });
    }

    const page = parseInt(parsedPage);
    const limit = parseInt(parsedLimit);
    const totalDocs = await Products.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const productsFound = await Products.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const productsCollection = await Products.distinct("Collection", {
      Collection: { $ne: "" },
    });
    const productsMaterial = await Products.distinct("Material", {
      Material: { $ne: "" },
    });
    const productsBrands = await Products.distinct("Brand", {
      Brand: { $ne: "" },
    });

    res.status(200).json({
      success: true,
      productsFound,
      productsCollection,
      productsMaterial,
      productsBrands,
      totalPages: Array.from({ length: totalPages }, (_, index) => index + 1), // covert Number to Array, generated by chatgpt.
    });
  } catch (error) {
    console.log("error occur during getting collection of products:" + error);
  }
};

export const checkout = async (req, res) => {
  try {
    const { name, email, phone, address, items } = req.body;
    const loggedInEmail = req.cookies?.token?.customerEmail;
    const existingCustomer = await Customers.findOne({ Email: email });

    if (existingCustomer?.Email !== loggedInEmail) {
      return res.status(404).json({
        status: 404,
        message:
          "Email taken already! if you own the email please login to place orders.",
      });
    }
    const productNames = items.map((item) => item.productName);
    const itemsFound = await Products.find({ Name: { $in: productNames } });
    const orderedItems = items.map((item) => {
      const foundProduct = itemsFound.find((p) => p.Name === item.productName);
      if (!foundProduct) {
        throw new Error(`Product ${item.productName} not found`);
      }
      return {
        name: item.productName,
        color: item.productColor,
        size: item.productSize,
        qty: item.productQty,
        price: foundProduct.DiscountedPrice || foundProduct.Price,
      };
    });

    const totalAmount = orderedItems.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);

    const orderId = crypto.randomBytes(3).toString("hex");

    const newOrder = new Orders({
      orderId: orderId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress: address,
      orderedItems: orderedItems,
      totalAmount: totalAmount,
    });

    await newOrder.save();

    await Promise.all(
      items.map(async (item) => {
        const foundProduct = itemsFound.find(
          (p) => p.Name === item.productName
        );
        if (!foundProduct) {
          throw new Error(`Product ${item.productName} not found`);
        }
        foundProduct.Stock -= item.productQty;
        await Products.updateOne(
          { _id: foundProduct._id },
          { Stock: foundProduct.Stock }
        );
      })
    );
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "shopwithfurqan <orders@shopwithfurqan.com>",
      to: email,
      subject: "🎉 Your Order Has Been Successfully Placed!",
      html: `<main style="text-align: center; font-family: Arial, Helvetica, sans-serif">
      <h1>Order Received Successfully</h1>
      <h2 style="text-transform: capitalize;">Hi ${name},</h2>
      <p style="font-weight: 600">
        Your Order received Successfully! click below to manage your Orders. it is necessary that you login with the email you gave at checkout.
      </p>
      <a href="http://localhost:5173/orders">
        <button
          style="
            border: none;
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
            color: #000;
            background-color: #db4444;
          "
        >
          Click Here
        </button>
      </a>
    </main>`,
    });
    if (error) {
      console.log("error sending email:" + error);
    }
    return res.status(200).json({
      success: true,
      message: "Order Placed Successfully!",
    });
  } catch (error) {
    console.log("error occur during Order Placing:" + error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const email = req.query.email;
    const ordersFound = await Orders.find({ customerEmail: email });

    res.status(200).json({
      success: true,
      ordersFound,
    });
  } catch (error) {
    console.log("error occur during getting collection of products:" + error);
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = await Products.aggregate([
      {
        $search: {
          index: "product_search",
          autocomplete: {
            query: query,
            path: "Name",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $match: {
          Stock: { $gte: 1 },
        },
      },
      { $limit: 10 },
    ]);
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.log("error occur during getting customers data:" + error);
  }
};
