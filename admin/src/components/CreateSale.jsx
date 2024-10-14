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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function CreateSale() {
  document.title = "Create Flash Sale | Shopwithfurqan";
  const [isLoading, setIsLoading] = useState(false);
  const [saleTitle, setSaleTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isCreatedId, setIsCreatedId] = useState("");
  const { toast } = useToast();

  const getFlashSale = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sale`
      );
      const data = await response.json();
      if (data.success) {
        setIsCreatedId(data.flashsale[0]._id);
        setEndDate(data.flashsale[0].endDate);
        setSaleTitle(data.flashsale[0].title);
        setIsActive(true);
      }
    } catch (error) {
      console.error("Error fetching flash sale data:", error);
    }
  };

  useEffect(() => {
    getFlashSale();
  }, []);

  const handleCreateSale = async (event) => {
    event.preventDefault();
    const adminToken = cookies.get("adminToken");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sale/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            saleTitle,
            endDate,
            isActive,
          }),
        }
      );

      const data = await response.json();
      if (response.status === 403 || response.status === 400) {
        toast({
          variant: "destructive",
          description: data.message,
        });
      } else if (data.success) {
        toast({
          variant: "success",
          description: "Flash Sale Created Successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occurred! Flash Sale not created, contact your developer if it persists.",
        });
      }
    } catch (error) {
      console.error("Error creating flash sale:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occurred! Flash Sale not created, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateSale = async (event) => {
    event.preventDefault();
    const adminToken = cookies.get("adminToken");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sale/update/${isCreatedId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            saleTitle,
            endDate,
            isActive,
          }),
        }
      );

      const data = await response.json();
      if (response.status === 403 || response.status === 400) {
        toast({
          variant: "destructive",
          description: data.message,
        });
      } else if (data.success) {
        toast({
          variant: "success",
          description: "Flash Sale updated Successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occurred! Flash Sale not updated, contact your developer if it persists.",
        });
      }
    } catch (error) {
      console.error("Error updating flash sale:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occurred! Flash Sale not updated, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={isCreatedId ? handleUpdateSale : handleCreateSale}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Manage Flash Sale</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Sale Title</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter sale title"
              value={saleTitle}
              onChange={(e) => setSaleTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required={!isCreatedId}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="isActive">Active</Label>
            <Select
              onValueChange={(value) => {
                setIsActive(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isActive ? "true" : "false"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available?</SelectLabel>
                  <SelectItem value="true">true</SelectItem>
                  <SelectItem value="false">false</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isCreatedId ? (
              "update"
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default CreateSale;
