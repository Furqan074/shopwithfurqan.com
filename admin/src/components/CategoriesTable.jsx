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
import { Button } from "./ui/button";
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
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MoreVertical } from "lucide-react";

import { Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function CategoriesTable() {
  document.title = "Categories | shopwithfurqan";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { toast } = useToast();

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages.length) setCurrentPage(currentPage + 1);
  };

  const deleteCategory = async (categoryId, image_id) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/categories?id=${categoryId}&image_id=${image_id}`,
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
        await getAllCategories();
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur during deleting category, contact your developer if it persists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur during deleting category, contact your developer if it persists.",
      });
      console.error(error);
    }
  };
  const getAllCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/categories?page=${currentPage}&limit=${rowsPerPage}`
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.paginatedCategories);
        setTotalPages(data.totalPages);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error Getting Homepage Categories:", error);
      setCategories([]);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Link to="/categories/create">
          <Button className="bg-red-600">Add Category</Button>
        </Link>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Image</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Sub Categories</TableHead>
            <TableHead className="text-center">Products</TableHead>
            <TableHead className="text-center">Created At (Y/M/D)</TableHead>
            <TableHead className="text-center">Updated At (Y/M/D)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id} className="text-center">
              <TableCell className="inline-block">
                <img
                  src={category.Image}
                  alt={category.Name + " Image"}
                  className="w-auto h-12"
                />
              </TableCell>
              <TableCell>{category.Name}</TableCell>
              <TableCell>
                {category.SubCategories && (
                  <div className="flex justify-center flex-wrap gap-1">
                    {category.SubCategories.map((subCategory) => (
                      <span
                        key={subCategory}
                        className="px-2 py-1 bg-blue-200 text-blue-800  rounded-md"
                      >
                        {subCategory}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>{category?.ProductsAssigned}</TableCell>
              <TableCell>
                {new Date(category.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {new Date(category.updatedAt).toISOString().split("T")[0]}
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
                    <Link to={`update/${category._id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => setSelectedCategory(category._id)}
                    >
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {selectedCategory === category._id && (
                <AlertDialog
                  open={true}
                  onOpenChange={() => setSelectedCategory(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the category data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedCategory(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteCategory(category._id, category.ImageId);
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
                    to={`/categories?page=${
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
                    to={`/categories?page=${pageNum}&limit=${rowsPerPage}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      getAllCategories;
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
                    to={`/categories?page=${
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

export default CategoriesTable;
