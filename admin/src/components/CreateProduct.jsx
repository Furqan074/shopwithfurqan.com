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
import { useNavigate } from "react-router-dom";
import Tiptap from "./Tiptap";
const cookies = new Cookies();

function CreateProduct() {
  document.title = "Create Product | Shopwithfurqan";
  const navigate = useNavigate();
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

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

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

  const handleCreateProduct = async (event) => {
    const adminToken = cookies.get("adminToken");
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/create`,
        {
          method: "POST",
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
            collection,
            description,
            description_ur,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 403 || response.status === 400) {
        toast({
          variant: "destructive",
          description: data.message,
          duration: 5000,
        });
        return;
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur! Product not created, contact your developer if it persists.",
          duration: 5000,
        });
      }
      if (data.success) {
        toast({
          variant: "success",
          description: "Product Created Successfully!",
          duration: 5000,
        });
        navigate("/products");
      }
    } catch (error) {
      console.error("Error creating Product:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur! Product not created, contact your developer if it persists.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleCreateProduct}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
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
                required
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
                required
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
                required
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
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>
                Shipping Fee
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setShipping(value);
                }}
                required
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
                required
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
                onValueChange={(value) => {
                  setListedSection(value);
                }}
                required
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
            <div className="grid gap-2">
              <Label>
                Collection
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setCollection(value);
                }}
                required
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
            <Label htmlFor="description">
              Description
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Tiptap value={description} setValue={setDescription} />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Product Info In Urdu (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name_ur">Product Name Urdu</Label>
              <Input
                id="name_ur"
                placeholder="Enter Product name in Urdu"
                value={name_ur}
                onChange={(e) => setName_ur(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material_ur">Material Urdu</Label>
              <Input
                id="material_ur"
                placeholder="Enter Material in Urdu"
                value={material_ur}
                onChange={(e) => setMaterial_ur(e.target.value)}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description_ur">Description in Urdu</Label>
            <Tiptap value={description_ur} setValue={setDescription_ur} />
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
                "Save"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

export default CreateProduct;
