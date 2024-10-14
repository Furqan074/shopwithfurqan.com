import { NavLink } from "react-router-dom";

import {
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
  GalleryHorizontalEnd,
  Group,
  CirclePercent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-4 p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <NavLink
              to="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Shopwithfurqan</span>
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <Package className="h-5 w-5" />
              Products
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <Users2 className="h-5 w-5" />
              Customers
            </NavLink>
            <NavLink
              to="/banners"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <GalleryHorizontalEnd className="h-5 w-5" />
              Banners
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <Group className="h-5 w-5" />
              Categories
            </NavLink>
            <NavLink
              to="/sale/create"
              className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }  hover:text-foreground`
              }
            >
              <CirclePercent className="h-5 w-5" />
              FlashSale
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default Header;
