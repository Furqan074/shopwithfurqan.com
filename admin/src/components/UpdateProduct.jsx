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
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Loader2,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
const cookies = new Cookies();

function UpdateProduct() {
  document.title = "Update Product | Shopwithfurqan";
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMedias, setSelectedMedias] = useState([]);
  const [name, setName] = useState("");
  const [name_ur, setName_ur] = useState("");
  const [material, setMaterial] = useState("");
  const [material_ur, setMaterial_ur] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [shipping, setShipping] = useState("");
  const [ribbon, setRibbon] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [listedSection, setListedSection] = useState("");
  const [collection, setCollection] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [description_ur, setDescription_ur] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewStars, setReviewStars] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilesUploaded, setIsFilesUploaded] = useState(false);
  const { toast } = useToast();
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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

  const getProductData = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/product/${id}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data?.reviews);
        setSelectedMedias(data.product.Media);
        setIsFilesUploaded(true);
        setName(data.product.Name);
        setName_ur(data.product.NameInBn);
        setMaterial(data.product.Material);
        setMaterial_ur(data.product.MaterialInBn);
        setBrand(data.product.Brand);
        setPrice(data.product.Price);
        setDiscountedPrice(data.product.DiscountedPrice);
        setShipping(data.product.Shipping);
        setRibbon(data.product.Ribbon);
        setStock(data.product.Stock);
        setColors(data.product.Colors[0] !== "" ? data.product.Colors : "");
        setSizes(data.product.Sizes[0] !== "" ? data.product.Sizes : "");
        setListedSection(data.product.ListedSection);
        setCollection(data.product.Collection);
        setDescription(data.product.Description);
        setDescription_ur(data.product.DescriptionInBn);
      }
    } catch (error) {
      console.error("Error Getting Product Reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    getAllCategories();
    getProductData();
  }, [getAllCategories, getProductData]);

  const chunkSize = 5 * 1024 * 1024; // 5MB

  const handleMediaChange = async (e) => {
    const files = e.target.files;
    const mediaUploaded = [];

    toast({
      title: (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Uploading files</span>
        </div>
      ),
      description: "Your files are being uploaded...",
      duration: Infinity,
    });

    const uploadFile = async (file) => {
      setIsFilesUploaded(false);
      const uniqueName = `uuid-${Date.now()}`;
      const totalChunks = Math.ceil(file.size / chunkSize);
      const responses = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min((i + 1) * chunkSize, file.size);
        const response = await uploadChunk(start, end, file, uniqueName);
        responses.push(response);
      }

      return responses;
    };

    const uploadChunk = async (start, end, file, uniqueName) => {
      const formData = new FormData();
      formData.append("file", file.slice(start, end));
      formData.append("cloud_name", CLOUD_NAME);
      formData.append("upload_preset", UPLOAD_PRESET);
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
          {
            method: "POST",
            body: formData,
            headers: {
              "X-Unique-Upload-Id": uniqueName,
              "Content-Range": contentRange,
            },
          }
        );
        const data = await response.json();

        if (data?.error?.message) {
          return `error: ${data.error.message}`;
        }

        if (data.url) {
          return {
            source: data.url,
            mediaType: data.resource_type,
            mediaId: data.public_id,
          };
        }
      } catch (error) {
        console.error(`Error uploading file`, error);
        return `error: ${error.message}`;
      }
    };

    let uploadError = undefined;

    for (const file of files) {
      const responses = await uploadFile(file);
      for (const response of responses) {
        if (response) {
          if (response?.toString().includes("error")) {
            uploadError = response;
          }
          mediaUploaded.push(response);
        }
      }
      setIsFilesUploaded(files.length === mediaUploaded.length);
    }

    if (!uploadError) {
      toast({
        variant: "success",
        title: "Upload successful 🎉",
        description: "All files have been uploaded successfully.",
        duration: 3000,
      });
      setSelectedMedias((prev) => [...prev, ...mediaUploaded]);
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: uploadError,
        duration: 3000,
      });
    }
  };

  const removeMedia = (index) => {
    const newSelectedMedias = [...selectedMedias];

    URL.revokeObjectURL(newSelectedMedias[index]);
    newSelectedMedias.splice(index, 1);

    setSelectedMedias(newSelectedMedias);
  };

  const moveMedia = (index, direction) => {
    const newSelectedMedias = [...selectedMedias];

    const [movedMedia] = newSelectedMedias.splice(index, 1);

    const newIndex = direction === "up" ? index - 1 : index + 1;

    newSelectedMedias.splice(newIndex, 0, movedMedia);

    setSelectedMedias(newSelectedMedias);
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
            medias: selectedMedias,
            name_ur,
            material,
            material_ur,
            brand,
            price,
            shipping,
            ribbon,
            stock,
            colors,
            sizes,
            discountedPrice,
            listedSection,
            collection: collection || null,
            description,
            description_ur,
            reviewText,
            reviewStars,
            reviewerName,
          }),
        }
      );

      const data = await response.json();
      const errorCodes = [404, 403, 400];
      if (errorCodes.includes(response.status)) {
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
        getProductData();
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
      getProductData();
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
            <Label htmlFor="media">
              Product Medias
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="group relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary">
              <input
                type="file"
                id="medias"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                multiple
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                <UploadIcon className="h-8 w-8" />
                <p className="text-sm font-medium">Upload Medias</p>
              </div>
            </div>
            <div className="grid gap-4 place-self-center sm:grid-flow-col sm:place-self-start">
              {selectedMedias.map((media, index) => (
                <div key={index} className="relative">
                  {media.mediaType.includes("video") && (
                    <video width="320" height="240" controls>
                      <source src={media.source} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {media.mediaType.includes("image") && (
                    <img
                      src={media.source}
                      alt={`Upload Preview ${index}`}
                      className="h-48 w-48 object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute flex items-center justify-center top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <XIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMedia(index, "up")}
                    disabled={index === 0}
                    className="absolute bottom-1 left-1 bg-gray-300 text-black p-1 rounded-full"
                  >
                    <ArrowUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMedia(index, "down")}
                    disabled={index === selectedMedias.length - 1}
                    style={{
                      opacity: index === selectedMedias.length - 1 ? 0.3 : 1,
                    }}
                    className="absolute bottom-1 right-1 bg-gray-300 text-black p-1 rounded-full"
                  >
                    <ArrowDownIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Product Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">
                Material
                <span className="text-red-500 ml-1">*</span>
              </Label>
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
              <Label htmlFor="price">
                Price
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex flex-row">
                <span className="bg-slate-300 flex justify-center px-1 text-3xl">
                  PKR
                </span>
                <Input
                  className="rounded-l-none border-l-0"
                  id="price"
                  type="number"
                  placeholder="Enter Product Price"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>
                Shipping Fee
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={shipping}
                onValueChange={(value) => {
                  setShipping(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Shipping Fee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Shipping Fee</SelectLabel>
                    <SelectItem value="false">Free</SelectItem>
                    <SelectItem value="true">Not Free</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Ribbon</Label>
              <Select
                value={ribbon}
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
                <Label htmlFor="discountedPrice">
                  Discounted Price
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex flex-row">
                  <span className="bg-slate-300 flex justify-center px-1 text-3xl">
                    PKR
                  </span>
                  <Input
                    className="rounded-l-none border-l-0"
                    id="discountedPrice"
                    type="number"
                    min={1}
                    placeholder="Enter Discounted Price"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    required={ribbon === "sale"}
                  />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="stock">
                Stock
                <span className="text-red-500 ml-1">*</span>
              </Label>
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
              <Label>
                List Section
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={listedSection}
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
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="bestselling">Best Selling</SelectItem>
                    <SelectItem value="explore">Explore</SelectItem>
                    <SelectItem value="NewArrival">New Arrival</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {collection && (
              <div className="grid gap-2">
                <Label>
                  Collection
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={collection}
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
            )}
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">
              Description
              <span className="text-red-500 ml-1">*</span>
            </Label>
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
              <Label htmlFor="name_ur">Product Name UR</Label>
              <Input
                id="name_ur"
                placeholder="Enter Product name in UR"
                value={name_ur}
                onChange={(e) => setName_ur(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material_ur">Material UR</Label>
              <Input
                id="material_ur"
                placeholder="Enter Material in UR"
                value={material_ur}
                onChange={(e) => setMaterial_ur(e.target.value)}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description_ur">Description Ur</Label>
            <Textarea
              placeholder="Enter Product Description in Ur."
              id="description_ur"
              value={description_ur}
              onChange={(e) => setDescription_ur(e.target.value)}
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
              <Label htmlFor="reviewer">
                Reviewer Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="reviewer"
                placeholder="Enter Reviewer Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stars">
                Stars (1-5)
                <span className="text-red-500 ml-1">*</span>
              </Label>
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
            <Label htmlFor="review">
              Review
              <span className="text-red-500 ml-1">*</span>
            </Label>
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
          {isFilesUploaded && (
            <Button type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

export default UpdateProduct;
