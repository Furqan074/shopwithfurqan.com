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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MoreVertical } from "lucide-react";

import { Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function BannersTable() {
  document.title = "Manage Banners | shopwithfurqan";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const { toast } = useToast();

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages.length) setCurrentPage(currentPage + 1);
  };

  const deleteBanner = async (BannerId, media_id) => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/banners?id=${BannerId}&media_id=${media_id}`,
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
        await getAllBanners();
      } else {
        toast({
          variant: "destructive",
          description:
            "Unexpected Error occur during deleting banner, contact your developer if it persists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          "Unexpected Error occur during deleting banner, contact your developer if it persists.",
      });
      console.error(error);
    }
  };
  const getAllBanners = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/banners?page=${currentPage}&limit=${rowsPerPage}`
      );
      const data = await response.json();

      if (data.success) {
        setBanners(data.paginatedBanners);
        setTotalPages(data.totalPages);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Error Getting Banners:", error);
      setBanners([]);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getAllBanners();
  }, [getAllBanners]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Banners</CardTitle>
        <Link to="/banners/create">
          <Button className="bg-red-600">Add Banner</Button>
        </Link>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Media</TableHead>
            <TableHead className="text-center">Name (Optional)</TableHead>
            <TableHead className="text-center">Delay (Milliseconds)</TableHead>
            <TableHead className="text-center">Created At (Y/M/D)</TableHead>
            <TableHead className="text-center">Updated At (Y/M/D)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners?.map((banner) => (
            <TableRow key={banner._id} className="text-center">
              <TableCell className="inline-block">
                <Popover>
                  <PopoverTrigger>View</PopoverTrigger>
                  <PopoverContent className="w-auto">
                    {banner?.MediaType.includes("video") && (
                      <video className="w-auto h-36" controls>
                        <source src={banner.Media} type={banner?.MediaType} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {banner?.MediaType.includes("image") && (
                      <img
                        src={banner.Media}
                        alt={banner?.Name + " Media"}
                        className="w-auto h-24"
                      />
                    )}
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>{banner?.Name}</TableCell>
              <TableCell>{banner?.SlideDelay}</TableCell>
              <TableCell>
                {new Date(banner.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {new Date(banner.updatedAt).toISOString().split("T")[0]}
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
                    <Link to={`update/${banner._id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => setSelectedBanner(banner._id)}
                    >
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {selectedBanner === banner._id && (
                <AlertDialog
                  open={true}
                  onOpenChange={() => setSelectedBanner(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the banner data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedBanner(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteBanner(banner._id, banner.MediaId);
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
                    to={`/banners?page=${currentPage - 1}&limit=${rowsPerPage}`}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={goToPrevPage}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Banner</span>
                    </Button>
                  </Link>
                </PaginationItem>
              )}
              {totalPages.map((pageNum, index) => (
                <PaginationItem key={index}>
                  <Link
                    to={`/banners?page=${pageNum}&limit=${rowsPerPage}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      getAllBanners;
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
                    to={`/banners?page=${currentPage + 1}&limit=${rowsPerPage}`}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={goToNextPage}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Banner</span>
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

export default BannersTable;
