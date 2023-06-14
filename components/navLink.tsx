"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  page: string;
  index: number;
}

export default function NavLink({ page, index }: NavLinkProps) {
  const path = usePathname();
  const activeLinkStyle = "font-serif text-royal-blue text-3xl opacity-100";
  const inactiveLinkStyleDesktop =
    "font-serif text-royal-blue text-3xl opacity-70 hover:opacity-100 transition-all duration-200";
  return (
    <Link
      href={page === "home" ? "" : page}
      className={`px-5 mx-5 cursor-pointer flex justify-center items-center h-16 ${
        path === "/" + page
          ? activeLinkStyle
          : path === "/" && page === "home"
          ? activeLinkStyle
          : inactiveLinkStyleDesktop
      }`}
      key={`link-${index}`}
    >
      {page.charAt(0).toUpperCase() + page.slice(1)}
    </Link>
  );
}
