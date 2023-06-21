import Image from "next/image";
import Link from "next/link";
import NavigationMobile from "components/navigationMobile";
import NavigationUser from "components/navigationUser";
import NavLink from "components/navLink";

export default function Navigation() {
  const pages = ["gallery"];
  return (
    <div className="flex flex-col">
      <NavigationMobile />
      {/* desktop navigation */}
      {/* <div className="hidden lg:flex min-w-full justify-evenly bg-black/[.4] absolute z-10"> */}
      <div className="hidden lg:flex min-w-full justify-evenly px-4 bg-white absolute z-10 shadow-sm border-b">
        <div>
          <Link href="/">
            <Image
              src={"/pictures/company-logo.png"}
              alt={"Company Logo"}
              width={100}
              height={100}
              className="relative mx-auto object-cover prevent-select"
              priority
            />
          </Link>
        </div>
        <div className="lg:flex flex items-center">
          {pages.map((page, i) => (
            <NavLink page={page} index={i} />
          ))}
        </div>
        <NavigationUser />
      </div>
    </div>
  );
}
