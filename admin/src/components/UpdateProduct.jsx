import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UploadIcon, XIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
const cookies = new Cookies();

function UpdateProduct() {
  document.title = "Update Product | shopwithfurqan";
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImages, setSelectedImages] = useState([]);
  const [base64EncodedImages, setBase64EncodedImages] = useState("");
  const [name, setName] = useState("");
  const [name_bn, setName_bn] = useState("");
  const [material, setMaterial] = useState("");
  const [material_bn, setMaterial_bn] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [ribbon, setRibbon] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [listedSection, setListedSection] = useState("");
  const [collection, setCollection] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [description_bn, setDescription_bn] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewStars, setReviewStars] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getAllCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/categories`
      );
      const data = await response.json();

      if (data.success) {
        // Generated by ChatGPT
        const flattenedCategories = data.allCategories.reduce(
          (acc, category) => {
            acc.push({ Name: category.Name });
            category.SubCategories.forEach((sub) => {
              acc.push({ Name: sub });
            });
            return acc;
          },
          []
        );

        setAllCategories(flattenedCategories);
      } else {
        setAllCategories([]);
      }
    } catch (error) {
      console.error("Error Getting Homepage Categories:", error);
      setAllCategories([]);
    }
  }, []);

  const getProductReviews = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/product/${id}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error Getting Product Reviews:", error);
      setReviews([]);
    }
  }, [id]);

  useEffect(() => {
    getAllCategories();
    getProductReviews();
  }, [getAllCategories, getProductReviews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const encodedImages = [];
    const imageUrls = [];

    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          encodedImages.push(reader.result);
          imageUrls.push(URL.createObjectURL(file));

          if (encodedImages.length === files.length) {
            setBase64EncodedImages(encodedImages);
            setSelectedImages(imageUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    setSelectedImages([]);
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newBase64EncodedImages = [...base64EncodedImages];

    URL.revokeObjectURL(newSelectedImages[index]);
    newSelectedImages.splice(index, 1);
    newBase64EncodedImages.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setBase64EncodedImages(newBase64EncodedImages);
  };

  const handleUpdateProduct = async (event) => {
    const adminToken = cookies.get("adminToken");
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            images: base64EncodedImages,
            name_bn,
            material,
            material_bn,
            brand,
            price,
            ribbon,
            stock,
            colors,
            sizes,
            discountedPrice,
            listedSection,
            collection: collection || null,
            description,
            description_bn,
            reviewText,
            reviewStars,
            reviewerName,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 403 || response.status === 400) {
        toast({
          variant: "destructive",
          description: data.message,
        });
        return;
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur! Product not updated, contact your developer if it persists.",
        });
      }
      if (data.success) {
        toast({
          variant: "success",
          description: "Product Updated Successfully!",
        });
        getProductReviews();
        navigate("/products");
      }
    } catch (error) {
      console.error("Error updating Product:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur! Product not updated, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/product/${id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          description: data.message,
        });
        return;
      }

      toast({
        variant: "success",
        description: "Review deleted successfully!",
      });
      getProductReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        variant: "destructive",
        description: "Unexpected Error occurred!",
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleUpdateProduct}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Update Product</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Product Images</Label>
            <div className="group relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary">
              <input
                type="file"
                id="images"
                accept="images/*"
                onChange={handleImageChange}
                multiple
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                <UploadIcon className="h-8 w-8" />
                <p className="text-sm font-medium">Upload Images</p>
              </div>
            </div>
            <div className="grid gap-4 place-self-center sm:grid-flow-col sm:place-self-start">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload Preview ${index}`}
                    className="h-48 w-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute flex items-center justify-center top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Enter Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                placeholder="Enter Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter Product Price"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Ribbon</Label>
              <Select
                onValueChange={(value) => {
                  setRibbon(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ribbon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ribbon</SelectLabel>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-flow-col gap-4">
            {ribbon === "sale" && (
              <div className="grid gap-2">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  placeholder="Enter Discounted Price"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={1}
                placeholder="Enter Stock quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Colors Available</Label>
              <Input
                id="color"
                placeholder="Separate them by comma"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sizes">Sizes Available</Label>
              <Input
                id="sizes"
                placeholder="Separate them by comma"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>List Section</Label>
              <Select
                onValueChange={(value) => {
                  setListedSection(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="List Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>List Section</SelectLabel>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="BestSelling">Best Selling</SelectItem>
                    <SelectItem value="Explore">Explore</SelectItem>
                    <SelectItem value="NewArrival">New Arrival</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Collection</Label>
              <Select
                onValueChange={(value) => {
                  setCollection(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Collection</SelectLabel>
                    {allCategories.map((category) => (
                      <SelectItem key={category.Name} value={category.Name}>
                        {category.Name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Enter Product Description."
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Product Info In UR (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name_bn">Product Name UR</Label>
              <Input
                id="name_bn"
                placeholder="Enter Product name in UR"
                value={name_bn}
                onChange={(e) => setName_bn(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material_bn">Material UR</Label>
              <Input
                id="material_bn"
                placeholder="Enter Material in UR"
                value={material_bn}
                onChange={(e) => setMaterial_bn(e.target.value)}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description_bn">Description Bn</Label>
            <Textarea
              placeholder="Enter Product Description in Bn."
              id="description_bn"
              value={description_bn}
              onChange={(e) => setDescription_bn(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Add Product Reviews (Optional)</CardTitle>
          <div className="border flex justify-around">
            {reviews.length < 1 && (
              <span className="text-center">No Reviews Found</span>
            )}
            {reviews?.map((review) => (
              <div key={review._id} className="flex gap-3">
                <Popover>
                  <PopoverTrigger>See Details</PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="flex justify-between flex-col">
                      <div>
                        <span className="text-yellow-300">Reviewer Name:</span>{" "}
                        {review.ReviewerName}
                      </div>
                      <div>
                        <span className="text-yellow-300">Review: </span>
                        {review.ReviewText}
                      </div>
                      <div>
                        <span className="text-yellow-300">Stars: </span>
                        {review.Rating}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-600"
                >
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reviewer">Reviewer Name </Label>
              <Input
                id="reviewer"
                placeholder="Enter Reviewer Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stars">Stars (1-5)</Label>
              <Input
                id="stars"
                type="number"
                min={1}
                max={5}
                placeholder="Enter Review Rating Star Qty (1-5)"
                value={reviewStars}
                onChange={(e) => setReviewStars(e.target.value)}
                required={!!reviewerName}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="review">Review</Label>
            <Textarea
              placeholder="Enter Product Review."
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required={!!reviewStars}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default UpdateProduct;
