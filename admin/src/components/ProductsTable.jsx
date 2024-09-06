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
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft, MoreVertical } from "lucide-react";

import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function ProductsTable() {
  document.title = "Products | shopwithfurqan";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages.length) setCurrentPage(currentPage + 1);
  };

  const deleteProduct = async (productId, image_ids) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/products?id=${productId}&image_ids=${image_ids}`,
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
        await getAllProducts();
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur during deleting Product, contact your developer if it persists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur during deleting Product, contact your developer if it persists.",
      });
      console.error(error);
    }
  };
  const getAllProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/products?page=${currentPage}&limit=${rowsPerPage}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.paginatedProducts);
        setTotalPages(data.totalPages);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error Getting Homepage products:", error);
      setProducts([]);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <Link to="/products/create">
          <Button className="bg-red-600">Add Product</Button>
        </Link>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Collection</TableHead>
            <TableHead className="text-center">Listed Section</TableHead>
            <TableHead className="text-center">Created At (Y/M/D)</TableHead>
            <TableHead className="text-center">Updated At (Y/M/D)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} className="text-center">
              <TableCell>
                <img
                  src={product.Images[0]}
                  alt="product Image"
                  className="w-12 h-12"
                />
              </TableCell>
              <TableCell>{product.Name}</TableCell>
              <TableCell>{product.Price}</TableCell>
              <TableCell>{product.Stock || "\u221E"}</TableCell>
              <TableCell>{product.Collection}</TableCell>
              <TableCell>{product.ListedSection}</TableCell>
              <TableCell>
                {new Date(product.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {new Date(product.updatedAt).toISOString().split("T")[0]}
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
                    <Link to={`update/${product._id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => setSelectedProduct(product._id)}
                    >
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {selectedProduct === product._id && (
                <AlertDialog
                  open={true}
                  onOpenChange={() => setSelectedProduct(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the Product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedProduct(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteProduct(product._id, product.ImageIds);
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
                    to={`/products?page=${
                      currentPage - 1
                    }&limit=${rowsPerPage}`}
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
                    to={`/products?page=${pageNum}&limit=${rowsPerPage}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      getAllProducts;
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
                    to={`/products?page=${
                      currentPage + 1
                    }&limit=${rowsPerPage}`}
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
