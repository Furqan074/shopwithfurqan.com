import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
const cookies = new Cookies();

function UpdateCategory() {
  document.title = "Update Category | Shopwithfurqan";
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64EncodedImage, setBase64EncodedImage] = useState("");
  const [name, setName] = useState("");
  const [name_ur, setName_ur] = useState("");
  const [sub_categories, setSub_categories] = useState("");
  const [sub_categories_ur, setSub_categories_ur] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64EncodedImage(reader.result);
        setSelectedImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
    setSelectedImage(null);
  };

  const removeImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
    setBase64EncodedImage("");
  };

  const handleUpdateCategory = async (event) => {
    const adminToken = cookies.get("adminToken");
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/categories/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            image: base64EncodedImage,
            name_ur: name_ur.trim(),
            sub_categories: sub_categories.trim(),
            sub_categories_ur: sub_categories_ur.trim(),
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
            "Unexpected Error occur! Category not updated, contact your developer if it persists.",
        });
      }
      if (data.success) {
        toast({
          variant: "success",
          description: data.message,
        });
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur! Category not updated, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleUpdateCategory}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Update Category</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Category Image</Label>
            <div className="group relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                <UploadIcon className="h-8 w-8" />
                <p className="text-sm font-medium">Upload Image</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Upload Preview"
                    className="h-80 w-full object-cover rounded-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute flex items-center justify-center top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="true"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub_categories">Sub Categories</Label>
            <Input
              id="sub_categories"
              name="sub_categories"
              placeholder="Enter sub categories (optional) (separate them by comma)"
              value={sub_categories}
              onChange={(e) => setSub_categories(e.target.value)}
              autoComplete="true"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Category Info In UR (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name_ur">Category Name UR</Label>
            <Input
              id="name_ur"
              name="name_ur"
              placeholder="Enter category name in UR"
              value={name_ur}
              onChange={(e) => setName_ur(e.target.value)}
              autoComplete="true"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub_categories_ur">Sub Categories UR</Label>
            <Input
              id="sub_categories_ur"
              name="sub_categories_ur"
              placeholder="Enter sub categories in UR (optional) (separate them by comma)"
              value={sub_categories_ur}
              onChange={(e) => setSub_categories_ur(e.target.value)}
              autoComplete="true"
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

export default UpdateCategory;
