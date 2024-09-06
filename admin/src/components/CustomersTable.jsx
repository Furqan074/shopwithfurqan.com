import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function CustomersTable() {
  document.title = "Customers | shopwithfurqan";
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { toast } = useToast();

  const deleteCustomer = async (customerId, setToast) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setToast(data.message, "success");
        getAllCustomers();
      } else if (data.success === false) {
        setToast(
          data.message + " contact your developer if it persists.",
          "destructive"
        );
      } else {
        setToast(
          "Unexpected Error occur during deleting customer data, contact your developer if it persists.",
          "destructive"
        );
      }
    } catch (error) {
      console.error(
        "Unexpected Error occur during deleting customers contact your developer if it persists. ",
        error
      );
    }
  };

  const getAllCustomers = useCallback(async () => {
    const adminToken = cookies.get("adminToken");
    if (!adminToken) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/customers`,
        {
          headers: {
            Authorization: `Bearer ${adminToken.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAllCustomers(data.customers);
      } else {
        setAllCustomers([]);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setAllCustomers([]);
    }
  }, []);

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-center">Address</TableHead>
            <TableHead className="text-center min-w-[150px]">
              Joined At (Y/M/D)
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCustomers.map((customer) => (
            <TableRow key={customer._id} className="text-center">
              <TableCell className="w-[200px]">{customer.Name}</TableCell>
              <TableCell>{customer?.Email}</TableCell>
              <TableCell>{customer?.Phone}</TableCell>
              <TableCell className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                {customer?.Address}
              </TableCell>
              <TableCell>
                {new Date(customer.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => setSelectedCustomer(customer._id)}
                    >
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {selectedCustomer === customer._id && (
                <AlertDialog
                  open={true}
                  onOpenChange={() => setSelectedCustomer(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the customer data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedCustomer(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteCustomer(customer._id, (message, variant) => {
                            toast({
                              variant: variant,
                              description: message,
                            });
                          });
                          setSelectedCustomer(null);
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
