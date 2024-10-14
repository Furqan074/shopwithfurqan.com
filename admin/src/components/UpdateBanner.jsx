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

function UpdateBanner() {
  document.title = "Update Banner | Shopwithfurqan";
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [base64EncodedMedia, setBase64EncodedMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [delayTime, setDelayTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64EncodedMedia(reader.result);
        setSelectedMedia(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedMedia(null);
      setBase64EncodedMedia("");
      setMediaType("");
    }
  };

  const removeMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia);
      setSelectedMedia(null);
      setBase64EncodedMedia("");
      setMediaType("");
    }
  };

  const handleUpdateBanner = async (event) => {
    const adminToken = cookies.get("adminToken");
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/banners/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            name,
            media: base64EncodedMedia,
            mediaType,
            link,
            delayTime,
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
      } else if (data.success) {
        toast({
          variant: "success",
          description: "Banner Updated Successfully!",
        });
        navigate("/banners");
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occurred! Banner not updated, contact your developer if it persists.",
        });
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occurred! Banner not updated, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleUpdateBanner}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Update Banner</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="media">Banner Media</Label>
            <div className="group relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary">
              <input
                type="file"
                id="media"
                name="media"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                <UploadIcon className="h-8 w-8" />
                <p className="text-sm font-medium">Upload Media</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {selectedMedia && (
                <div className="relative">
                  {mediaType.includes("video") && (
                    <video width="320" height="240" controls>
                      <source src={selectedMedia} type={mediaType} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {mediaType.includes("image") && (
                    <img
                      src={selectedMedia}
                      alt="Upload Preview"
                      className="h-80 w-full object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute flex items-center justify-center top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Banner Name (Optional)</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter banner name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="true"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Resource Link Path (Optional)</Label>
            <Input
              id="link"
              placeholder="Enter banner link Example: /example/link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              autoComplete="true"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="delay">Slide Delay Time (Optional)</Label>
            <Input
              id="delay"
              type="number"
              placeholder="Enter Slide Delay Time default is 2 seconds | for videos add delay equal to video length."
              value={delayTime}
              onChange={(e) => setDelayTime(e.target.value)}
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
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default UpdateBanner;
