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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { CircleCheck, CircleDashed, CircleX, MoreVertical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
const cookies = new Cookies();

export default function OrdersTable() {
  document.title = "Manage Orders | Shopwithfurqan";
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();
  const DOMAIN = import.meta.env.VITE_DOMAIN;

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages.length) setCurrentPage(currentPage + 1);
  };

  const deleteOrder = async (orderId) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/orders?id=${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast({
          variant: "success",
          description: data.message,
        });
        await getAllOrders();
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur during deleting order, contact your developer if it persists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur during deleting order, contact your developer if it persists.",
      });
      console.error(error);
    }
  };
  const getAllOrders = useCallback(async () => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/orders?page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken.token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.paginatedOrders);
        setTotalPages(data.totalPages);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error Getting Orders:", error);
      setOrders([]);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">OrderID</TableHead>
            <TableHead className="text-center">Customer</TableHead>
            <TableHead className="text-center">Contact</TableHead>
            <TableHead className="text-center">Ordered Items</TableHead>
            <TableHead className="text-center">Total amount</TableHead>
            <TableHead className="text-center">Delivery Address</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created Date</TableHead>
            <TableHead className="text-center">Updated Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} className="text-center">
              <TableCell>{order.orderId}</TableCell>
              <TableCell>
                <div className="font-medium">{order.customerName}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {order.customerEmail}
                </div>
              </TableCell>
              <TableCell>{order.customerPhone}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>See Details</PopoverTrigger>
                  <PopoverContent className="w-96">
                    {order.orderedItems.map((item) => (
                      <div key={item._id} className="flex gap-3 mt-1 border-t">
                        <div>
                          <div>Name:</div>
                          <div>Color:</div>
                          <div>Size:</div>
                          <div>Quantity:</div>
                        </div>
                        <div>
                          <div>
                            <a
                              href={`https://${DOMAIN}/products/${item.name}`}
                              target="_blank"
                              className="text-blue-700"
                            >
                              {item.name}
                            </a>
                          </div>
                          <div>{item.color || "Not Specified"} </div>
                          <div>{item.size || "Not Specified"}</div>
                          <div>{item.qty || 1}</div>
                        </div>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              <TableCell>{order.deliveryAddress}</TableCell>
              <TableCell>
                {order.orderStatus === "Cancelled" ? (
                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded-md">
                    <CircleX className="w-4 h-4 inline-block mr-1" />
                    {order.orderStatus}
                  </span>
                ) : order.orderStatus === "Pending" ? (
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-md">
                    <CircleDashed className="w-4 h-4 inline-block mr-1" />
                    {order.orderStatus}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-md">
                    <CircleCheck className="w-4 h-4 inline-block mr-1" />
                    {order.orderStatus}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {new Date(order.updatedAt).toISOString().split("T")[0]}
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
                    <Link to={`update/${order._id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => setSelectedOrder(order._id)}
                    >
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {selectedOrder === order._id && (
                <AlertDialog
                  open={true}
                  onOpenChange={() => setSelectedOrder(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setSelectedOrder(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteOrder(order._id);
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
      <div className="mt-3 flex flex-row gap-2 float-right px-4 my-2">
        <Select
          onValueChange={(value) => {
            setRowsPerPage(parseInt(value));
            setCurrentPage(currentPage);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rows per page</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="border rounded px-4">
          <Pagination>
            <PaginationContent>
              {currentPage !== 1 && (
                <PaginationItem>
                  <Link
                    to={`/orders?page=${currentPage - 1}&limit=${rowsPerPage}`}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={goToPrevPage}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </Link>
                </PaginationItem>
              )}
              {totalPages.map((pageNum, index) => (
                <PaginationItem key={index}>
                  <Link
                    to={`/orders?page=${pageNum}&limit=${rowsPerPage}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      getAllOrders;
                    }}
                  >
                    <PaginationLink isActive={currentPage === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </Link>
                </PaginationItem>
              ))}
              {totalPages.length > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {currentPage < totalPages.length && (
                <PaginationItem>
                  <Link
                    to={`/orders?page=${currentPage + 1}&limit=${rowsPerPage}`}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={goToNextPage}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </Link>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
}
