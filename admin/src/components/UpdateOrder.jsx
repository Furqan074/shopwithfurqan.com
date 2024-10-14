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
import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
const cookies = new Cookies();

function UpdateOrder() {
  document.title = "Update Order | Shopwithfurqan";
  const navigate = useNavigate();
  const { id } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerTotalAmount, setCustomerTotalAmount] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateOrder = async (event) => {
    const adminToken = cookies.get("adminToken");
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/orders/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken.token}`,
          },
          body: JSON.stringify({
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerTotalAmount,
            orderStatus,
          }),
        }
      );

      const data = await response.json();

      if (
        response.status === 403 ||
        response.status === 400 ||
        response.status === 404
      ) {
        toast({
          variant: "destructive",
          description: data.message,
        });
        return;
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur! Order not updated, contact your developer if it persists.",
        });
      }
      if (data.success) {
        toast({
          variant: "success",
          description: data.message,
        });
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur! Order not updated, contact your developer if it persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleUpdateOrder}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Update Order</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                placeholder="Enter Product Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerEmail">
                Customer Email <br />
                <span className="text-yellow-400">
                  Warning: Anyone who has account with the email can access
                  orders so please verify.
                </span>
              </Label>
              <Input
                id="customerEmail"
                placeholder="Enter Customer Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerMobile">Customer Mobile</Label>
              <Input
                id="customerMobile"
                placeholder="Enter Customer Mobile"
                type="number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="grid sm:grid-flow-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customerAddress">Customer Address</Label>
              <Input
                id="customerAddress"
                placeholder="Enter Customer Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerAmount">Amount</Label>
              <Input
                id="customerAmount"
                placeholder="Enter Customer Amount"
                type="number"
                value={customerTotalAmount}
                onChange={(e) => setCustomerTotalAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Order Status</Label>
              <Select
                onValueChange={(value) => {
                  setOrderStatus(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Pending" className="text-blue-800">
                      Pending
                    </SelectItem>
                    <SelectItem value="Cancelled" className="text-red-800">
                      Cancelled
                    </SelectItem>
                    <SelectItem value="Delivered" className="text-green-800">
                      Delivered
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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

export default UpdateOrder;
