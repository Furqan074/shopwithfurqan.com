import jwt from "jsonwebtoken";
import Customers from "../modals/customer.js";
import Categories from "../modals/category.js";
import Products from "../modals/product.js";
import Banners from "../modals/banner.js";
import cloudinary from "../utils/cloudinary.js";
import Orders from "../modals/order.js";
import FlashSale from "../modals/flashsale.js";
const JWT_SECRET = process.env.JWT_SECRET;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const DOMAIN = process.env.DOMAIN;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, Password are required",
      });
    }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Access request denied because of wrong credentials",
      });
    }
    const adminToken = jwt.sign(
      {
        adminEmail: ADMIN_EMAIL,
        adminPassword: ADMIN_PASSWORD,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // save info in cookies
    res.cookie(
      "adminToken",
      {
        token: adminToken,
      },
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: process.env.NODE_ENV === "production" ? DOMAIN : "",
        maxAge: 3600000, // 1 hour in milliseconds
      }
    );

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error("unknown error happened during admin login: ", err);
    res.status(500).json({
      message: `unknown error happened during admin login: ${err}`,
    });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerTotalAmount,
      orderStatus,
    } = req.body;
    const id = req.params.id;

    const orderFound = await Orders.findById(id);

    if (!orderFound) {
      return res.status(404).json({
        success: false,
        message: "Order not found! with that id.",
      });
    }

    orderFound.customerName = customerName || orderFound.customerName;
    orderFound.customerEmail = customerEmail || orderFound.customerEmail;
    orderFound.customerPhone = customerPhone || orderFound.customerPhone;
    orderFound.deliveryAddress = customerAddress || orderFound.deliveryAddress;
    orderFound.totalAmount = customerTotalAmount || orderFound.totalAmount;
    orderFound.orderStatus = orderStatus || orderFound.orderStatus;

    await orderFound.save();

    return res.status(200).json({
      success: true,
      message: "Order Updated Successfully!",
    });
  } catch (error) {
    console.error(
      "Unexpected Error occurred during updating the Order:",
      error
    );
    return res.status(400).json({
      success: false,
      message: "Order Not Updated!",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedOrder = await Orders.deleteOne({ _id: id });

    if (deletedOrder.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully!",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Order Deletion Failed!",
    });
  } catch (error) {
    console.error("Unexpected Error occur during deletion of Order" + error);
    return res.status(400).json({
      success: false,
      message: "Order Deletion Failed!",
    });
  }
};

export const getAllCustomer = async (req, res) => {
  try {
    const allCustomer = await Customers.find().select(["-Password"]);
    res.status(200).json({
      success: true,
      customers: allCustomer,
    });
  } catch (error) {
    console.error("error occur during getting customers data:" + error);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customers.deleteOne({ _id: req.params.id });
    if (deletedCustomer.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Customer Deleted Successfully!",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Customer Deletion Failed!",
    });
  } catch (error) {
    console.error("Unexpected Error occur during deletion of customer" + error);
  }
};

const split_sub_categories = (sub_categories) => {
  if (sub_categories) {
    return sub_categories.split(",").map((item) => item.trim());
  }
  return [];
};

const fix_subCategories = (en_sub_categories, ur_sub_categories) => {
  let difference_length = en_sub_categories.length - ur_sub_categories.length;

  if (difference_length > 0) {
    const additionalCategories = en_sub_categories.slice(
      en_sub_categories.length - difference_length
    );
    ur_sub_categories.push(...additionalCategories);
  }

  return ur_sub_categories;
};

export const createCategory = async (req, res) => {
  try {
    const { name, name_ur, image, sub_categories, sub_categories_ur } =
      req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and Image are required",
      });
    }

    const existingCategory = await Categories.findOne({ Name: name });
    const existingCategoryUr = await Categories.findOne({ NameInUr: name_ur });

    if (existingCategory) {
      return res.status(403).json({
        success: false,
        message: "Category Name already exists",
      });
    }
    if (existingCategoryUr) {
      return res.status(403).json({
        success: false,
        message: "Category Name in Ur already exists",
      });
    }

    const en_sub_categories = split_sub_categories(sub_categories);
    const ur_sub_categories = split_sub_categories(sub_categories_ur);

    const fixed_sub_categories = fix_subCategories(
      en_sub_categories,
      ur_sub_categories
    );

    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: UPLOAD_PRESET,
    });

    const url = cloudinary.url(uploadResponse.public_id, {
      transformation: [
        { fetch_format: "auto", quality: "100" },
        {
          width: 290,
          height: 350,
          crop: "fill",
          gravity: "auto",
        },
      ],
    });

    const newCategory = new Categories({
      Name: name,
      Image: url,
      ImageId: uploadResponse.public_id,
      NameInUr: name_ur || name,
      SubCategories: en_sub_categories,
      SubCategoriesInUr: fixed_sub_categories,
      ProductsAssigned: 0,
    });

    await newCategory.save();

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully!",
    });
  } catch (error) {
    console.error(
      "Unexpected Error occurred during the creation of category: "
    );
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Category Not Created!",
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, name_ur, image, sub_categories, sub_categories_ur } =
      req.body;
    const id = req.params.id;

    const categoryFound = await Categories.findById(id);

    if (!categoryFound) {
      return res.status(404).json({
        success: false,
        message: "Category not found! with that id.",
      });
    }

    if (name === categoryFound.Name) {
      return res.status(403).json({
        success: false,
        message: "Category Name already exists",
      });
    }
    if (name_ur === categoryFound.NameInUr) {
      return res.status(403).json({
        success: false,
        message: "Category Name in Ur already exists",
      });
    }

    const en_sub_categories = split_sub_categories(sub_categories);
    const ur_sub_categories = split_sub_categories(sub_categories_ur);

    const fixed_sub_categories = fix_subCategories(
      en_sub_categories,
      ur_sub_categories
    );

    let uploadResponse = null;

    if (image) {
      uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: UPLOAD_PRESET,
      });

      categoryFound.Image = uploadResponse.url;
      categoryFound.ImageId = uploadResponse.public_id;
    }

    categoryFound.Name = name || categoryFound.Name;
    categoryFound.NameInUr = name_ur || categoryFound.NameInUr;
    categoryFound.SubCategories =
      en_sub_categories || categoryFound.SubCategories;
    categoryFound.SubCategories =
      fixed_sub_categories || categoryFound.SubCategories;

    await categoryFound.save();

    return res.status(200).json({
      success: true,
      message: "Category Updated Successfully!",
    });
  } catch (error) {
    console.error(
      "Unexpected Error occurred during updating the Category:",
      error
    );
    return res.status(400).json({
      success: false,
      message: "Category Not Updated!",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { page: parsedPage = 1, limit: parsedLimit = 10 } = req.query;
    const page = parseInt(parsedPage);
    const limit = parseInt(parsedLimit);

    const totalDocs = await Categories.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const paginatedCategories = await Categories.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const allCategories = await Categories.find();

    res.status(200).json({
      success: true,
      paginatedCategories,
      allCategories,
      totalPages: Array.from({ length: totalPages }, (_, index) => index + 1), // covert Number to Array, generated by chatgpt.
    });
  } catch (error) {
    console.error("error occur during getting Categories data:" + error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id, image_id } = req.query;

    const deleteResponse = await cloudinary.uploader.destroy(image_id);
    const deletedCategory = await Categories.deleteOne({ _id: id });

    if (deletedCategory.deletedCount === 1 && deleteResponse.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "Category Deleted Successfully!",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Category Deletion Failed!",
    });
  } catch (error) {
    console.error("Unexpected Error occur during deletion of Category" + error);
    return res.status(400).json({
      success: false,
      message: "Category Deletion Failed!",
    });
  }
};

// create banner
export const createBanner = async (req, res) => {
  try {
    const { name, media, mediaType, delayTime, link } = req.body;

    if (!media) {
      return res.status(400).json({
        success: false,
        message: "Media file is required",
      });
    }

    const resourceType = mediaType.includes("video") ? "video" : "image";

    const uploadResponse = await cloudinary.uploader.upload(media, {
      resource_type: resourceType,
      upload_preset: UPLOAD_PRESET,
    });

    const url = cloudinary.url(uploadResponse.public_id, {
      secure: true,
      resource_type: resourceType,
    });

    const newBanner = new Banners({
      Name: name,
      Media: url,
      MediaType: mediaType,
      MediaId: uploadResponse.public_id,
      SlideDelay: delayTime,
      Link: link,
    });
    await newBanner.save();

    return res.status(200).json({
      success: true,
      message: "Banner created Successfully!",
    });
  } catch (error) {
    console.error("Unexpected Error occurred during the creation of banner: ");
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Banner Not Created!",
    });
  }
};
// update banner
export const updateBanner = async (req, res) => {
  try {
    const { name, media, mediaType, delayTime, link } = req.body;
    const id = req.params.id;

    const bannerFound = await Banners.findById(id);

    if (!bannerFound) {
      return res.status(404).json({
        success: false,
        message: "Banner not found! with that id.",
      });
    }

    const resourceType =
      mediaType && mediaType.includes("video") ? "video" : "image";

    let uploadResponse = null;

    if (media) {
      uploadResponse = await cloudinary.uploader.upload(media, {
        resource_type: resourceType || bannerFound.MediaType,
        upload_preset: UPLOAD_PRESET,
      });

      bannerFound.Media = uploadResponse.url;
      bannerFound.MediaId = uploadResponse.public_id;
      bannerFound.MediaType = mediaType;
    }

    bannerFound.Name = name;
    bannerFound.SlideDelay = delayTime;
    bannerFound.Link = link;

    await bannerFound.save();

    return res.status(200).json({
      success: true,
      message: "Banner updated Successfully!",
    });
  } catch (error) {
    console.error("Unexpected Error occurred during updating the banner:");
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Banner Not Updated!",
    });
  }
};

export const getAllBanner = async (req, res) => {
  try {
    const { page: parsedPage = 1, limit: parsedLimit = 10 } = req.query;
    const page = parseInt(parsedPage);
    const limit = parseInt(parsedLimit);

    const totalDocs = await Banners.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const paginatedBanners = await Banners.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const allBanners = await Banners.find();

    res.status(200).json({
      success: true,
      paginatedBanners,
      allBanners,
      totalPages: Array.from({ length: totalPages }, (_, index) => index + 1), // covert Number to Array, generated by chatgpt.
    });
  } catch (error) {
    console.error("error occur during getting Banners data:" + error);
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id, media_id, media_type } = req.query;

    const resourceType = media_type.includes("video") ? "video" : "image";

    const deleteResponse = await cloudinary.uploader.destroy(media_id, {
      resource_type: resourceType,
    });

    const deletedBanner = await Banners.deleteOne({ _id: id });

    if (deletedBanner.deletedCount === 1 && deleteResponse.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "Banner Deleted Successfully!",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Banner Deletion Failed!",
    });
  } catch (error) {
    console.error("Unexpected Error occur during deletion of Banner");
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Banner Deletion Failed!",
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      name_ur,
      medias,
      material,
      material_ur,
      brand,
      price,
      discountedPrice,
      shipping,
      ribbon,
      stock,
      colors,
      sizes,
      listedSection,
      collection,
      description,
      description_ur,
    } = req.body;

    const requiredFields = [
      "name",
      "medias",
      "price",
      "shipping",
      "material",
      "listedSection",
      "collection",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following fields are required: ${missingFields.join(
          ", "
        )}.`,
      });
    }

    const existingProduct = await Products.findOne({ Name: name });
    const existingProductUr = await Products.findOne({ NameInUr: name_ur });

    if (existingProduct) {
      return res.status(403).json({
        success: false,
        message: "Product Name already exists",
      });
    }
    if (existingProductUr) {
      return res.status(403).json({
        success: false,
        message: "Product Name in Ur already exists",
      });
    }

    const transformedMedia = medias.map((media) => {
      const transformationOptions =
        media.mediaType === "image"
          ? [{ fetch_format: "auto", quality: "60" }]
          : [{ quality: "60" }];

      const url = cloudinary.url(media.mediaId, {
        transformation: transformationOptions,
        resource_type: media.mediaType,
        secure: true,
      });

      return {
        source: url,
        mediaType: media.mediaType,
        mediaId: media.mediaId,
      };
    });

    const newProduct = new Products({
      Name: name,
      NameInUr: name_ur || name,
      Media: transformedMedia.map((media) => {
        return {
          source: media.source,
          mediaType: media.mediaType,
          mediaId: media.mediaId,
        };
      }),
      Material: material,
      MaterialInUr: material_ur || material,
      Brand: brand,
      Price: price,
      Shipping: shipping,
      Ribbon: ribbon,
      DiscountedPrice: discountedPrice,
      DiscountPercentage: Math.ceil(((price - discountedPrice) / price) * 100),
      Stock: stock,
      Colors: colors?.split(",").map((item) => item.trim()),
      Sizes: sizes?.split(",").map((item) => item.trim()),
      ListedSection: listedSection,
      Collection: collection,
      Description: description,
      DescriptionInUr: description_ur || description,
    });

    await newProduct.save();

    // Update the products assigned value of category
    const relatedCategory = await Categories.findOne({
      Name: newProduct.Collection,
    });
    if (relatedCategory) {
      relatedCategory.ProductsAssigned =
        Number(relatedCategory.ProductsAssigned) || 0;

      relatedCategory.ProductsAssigned += 1;
      await relatedCategory.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product created successfully!",
    });
  } catch (error) {
    console.error("Unexpected Error occurred during the creation of product: ");
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Product Not Created!",
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      name_ur,
      medias,
      material,
      material_ur,
      brand,
      price,
      discountedPrice,
      shipping,
      ribbon,
      stock,
      colors,
      sizes,
      listedSection,
      collection,
      description,
      description_ur,
      reviewText,
      reviewStars,
      reviewerName,
    } = req.body;
    const id = req.params.id;

    const productFound = await Products.findById(id);

    if (!productFound) {
      return res.status(404).json({
        success: false,
        message: "Product not found! with the id.",
      });
    }

    const existingProductName = await Products.findOne({ Name: name });
    const existingProductNameUr = await Products.findOne({ NameInUr: name_ur });

    if (existingProductName && existingProductName.Name !== productFound.Name) {
      return res.status(403).json({
        success: false,
        message: "Product Name already exists",
      });
    }
    if (
      existingProductNameUr &&
      existingProductNameUr.NameInUr !== productFound.NameInUr
    ) {
      return res.status(403).json({
        success: false,
        message: "Product Name in Ur already exists",
      });
    }

    if (medias.length > 0) {
      const updatedMediaIds = new Set(medias.map((media) => media.mediaId));

      const mediaToDelete = productFound.Media.filter(
        (media) => !updatedMediaIds.has(media.mediaId)
      );

      const deletionPromises = mediaToDelete.map(async (media) => {
        try {
          await cloudinary.api.delete_resources(media.mediaId, {
            resource_type: media.mediaType,
          });
        } catch (error) {
          console.error(`Failed to delete media ${media.mediaId}`, error);
        }
      });

      await Promise.all(deletionPromises);

      const transformedMedia = medias.map((media) => {
        const transformationOptions =
          media.mediaType === "image"
            ? [{ fetch_format: "auto", quality: "60" }]
            : [{ quality: "60" }];

        const url = cloudinary.url(media.mediaId, {
          transformation: transformationOptions,
          resource_type: media.mediaType,
          secure: true,
        });

        return {
          source: url,
          mediaType: media.mediaType,
          mediaId: media.mediaId,
        };
      });

      productFound.Media = transformedMedia.map((media) => ({
        source: media.source,
        mediaType: media.mediaType,
        mediaId: media.mediaId,
      }));
    }

    productFound.Name = name || productFound.Name;
    productFound.NameInUr = name_ur || productFound.NameInUr;
    productFound.Material = material || productFound.Material;
    productFound.MaterialInUr = material_ur || productFound.MaterialInUr;
    productFound.Brand = brand;
    productFound.Price = price || productFound.Price;
    productFound.Shipping = shipping || productFound.Shipping;
    productFound.Ribbon = ribbon;
    productFound.DiscountedPrice = ribbon === "sale" ? discountedPrice : null;
    productFound.DiscountPercentage =
      ribbon === "sale"
        ? Math.ceil(((price - discountedPrice) / price) * 100)
        : 0;
    productFound.Stock = stock || productFound.Stock;
    productFound.Colors = Array.isArray(colors)
      ? colors
      : colors?.split(",").map((item) => item.trim());
    productFound.Sizes = Array.isArray(sizes)
      ? sizes
      : sizes?.split(",").map((item) => item.trim());
    productFound.ListedSection = listedSection || productFound.ListedSection;
    productFound.Collection = collection || productFound.Collection;
    productFound.Description = description || productFound.Description;
    productFound.DescriptionInUr =
      description_ur || productFound.DescriptionInUr;
    if (reviewStars && reviewText && reviewerName) {
      productFound.Reviews.push({
        Rating: reviewStars,
        ReviewText: reviewText,
        ReviewerName: reviewerName,
      });
    }

    await productFound.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated successfully!",
    });
  } catch (error) {
    console.error("Unexpected Error occurred during updating product: ");
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Product Not Updated!",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page: parsedPage = 1, limit: parsedLimit = 10 } = req.query;
    const page = parseInt(parsedPage);
    const limit = parseInt(parsedLimit);

    const totalDocs = await Products.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const paginatedProducts = await Products.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const TodayProducts = await Products.find({
      ListedSection: "today",
      $and: [{ Stock: { $gte: 1 } }],
    });

    const BestSellingProducts = await Products.find({
      ListedSection: "bestselling",
      $and: [{ Stock: { $gte: 1 } }],
    });

    const ExploreProducts = await Products.find({
      ListedSection: "explore",
      $and: [{ Stock: { $gte: 1 } }],
    });

    const NewArrivalProducts = await Products.find({
      ListedSection: "NewArrival",
      $and: [{ Stock: { $gte: 1 } }],
    });

    res.status(200).json({
      success: true,
      paginatedProducts,
      TodayProducts,
      BestSellingProducts,
      ExploreProducts,
      NewArrivalProducts,
      totalPages: Array.from({ length: totalPages }, (_, index) => index + 1),
    });
  } catch (error) {
    console.error("Error occurred while getting products data:", error);
    res.status(500).json({ success: false, message: error });
  }
};

// Get single product with id
export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const productFound = await Products.findById(id);

    if (!productFound) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      reviews: productFound?.Reviews,
      product: productFound,
    });
  } catch (error) {
    console.error("error occur during getting products reviews:" + error);
  }
};

// Delete review of product
export const deleteProductReview = async (req, res) => {
  try {
    const { reviewId, id } = req.params;

    const productFound = await Products.findById(id);

    if (!productFound) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    productFound.Reviews = productFound.Reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    await productFound.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (error) {
    console.error("Error occurred during deleting product review: " + error);
    res.status(400).json({
      success: false,
      message: "Error occurred during deleting review!",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const media = JSON.parse(req.query.media);

    media.map(async (media) => {
      const resourceType = media.mediaType.includes("video")
        ? "video"
        : "image";
      await cloudinary.api.delete_resources(media.mediaId, {
        resource_type: resourceType,
      });
    });

    const deletedProduct = await Products.deleteOne({ _id: id });

    if (deletedProduct.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully!",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Product Deletion Failed!",
    });
  } catch (error) {
    console.error("Unexpected Error occur during deletion of Product" + error);
    return res.status(400).json({
      success: false,
      message: "Product Deletion Failed!",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page: parsedPage = 1, limit: parsedLimit = 10 } = req.query;
    const page = parseInt(parsedPage);
    const limit = parseInt(parsedLimit);

    const totalDocs = await Orders.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const paginatedOrders = await Orders.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      paginatedOrders,
      totalPages: Array.from({ length: totalPages }, (_, index) => index + 1), // covert Number to Array, generated by chatgpt.
    });
  } catch (error) {
    console.error("error occur during getting orders data:" + error);
  }
};

export const createSale = async (req, res) => {
  try {
    const { saleTitle, endDate } = req.body;

    if (!saleTitle || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newSale = new FlashSale({
      title: saleTitle,
      endDate: endDate,
    });

    await newSale.save();

    return res.status(200).json({
      success: true,
      message: "Sale created Successfully!",
    });
  } catch (error) {
    console.error(
      "Unexpected Error occurred during the creation of Sale: " + error
    );
    return res.status(400).json({
      success: false,
      message: "Sale Not Created!",
    });
  }
};
// update sale
export const updateSale = async (req, res) => {
  try {
    const { saleTitle, endDate, isActive } = req.body;

    if (!saleTitle || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const saleFound = await FlashSale.findById(req.params.id);

    saleFound.title = saleTitle;
    saleFound.endDate = endDate;
    saleFound.isActive = isActive;

    await saleFound.save();

    return res.status(200).json({
      success: true,
      message: "Sale Updated Successfully!",
    });
  } catch (error) {
    console.error(
      "Unexpected Error occurred during Updating the Sale: " + error
    );
    return res.status(400).json({
      success: false,
      message: "Sale Not Updated!",
    });
  }
};
export const getFlashSale = async (req, res) => {
  try {
    const flashsale = await FlashSale.find();
    res.status(200).json({
      success: true,
      flashsale,
    });
  } catch (error) {
    console.error("error occur during getting customers data:" + error);
  }
};
