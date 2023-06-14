"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AppDispatch, useAppSelector } from "@redux/store";
import { signIn, getUser, fetchUserArtworks } from "@redux/features/userSlice";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavigationMobile() {
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const pages = ["about", "gallery", "events", "contact"];
  const path = usePathname();
  const dispatch = AppDispatch();
  const user = useAppSelector(getUser);
  const session = useSession();
  const activeLinkStyle = "font-serif text-royal-blue text-3xl opacity-100";
  const ianctiveLinkStyleMobile = "text-royal-blue text-3xl opacity-100";

  useEffect(() => {
    //check screen size for mobile navigation
    function handleResize() {
      if (window.innerWidth > 1024) {
        setMobileNav(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    //check if user is logged in
    if (session.status === "authenticated" && !user.signedIn) {
      // initialize app for user
      const {
        data: {
          user: { name, uid, image, email },
        },
      } = session;
      dispatch(
        signIn({
          name,
          uid,
          image,
          email,
          provider: "",
          signedIn: true,
          userLoading: false,
          artworksSaved: [],
          artworksPosted: [],
          artworksLoading: true,
          //TODO: rewrite this to not override provider and artworks
        })
      );
      dispatch(fetchUserArtworks(uid));
    }
  }, [session]);
  return (
    <>
      {/* mobile button */}
      <div
        className={`px-6 min-w-full bg-white transparent-highlight flex lg:hidden cursor-pointer justify-between items-center absolute z-10`}
      >
        <div>
          <Link href="/">
            <Image
              src={"/pictures/company-logo.png"}
              alt={"Company Logo"}
              width={100}
              height={100}
              className="relative object-cover prevent-select"
              priority
            />
          </Link>
        </div>
        <button
          className="h-10 w-10 rounded-md border-4 border-blue-green flex flex-col justify-evenly items-center relative"
          onClick={() => setMobileNav(!mobileNav)}
        >
          <span
            className={`h-1 w-8/12 bg-blue-green rounded-md transition-all duration-200 ${
              mobileNav ? "w-10/12 rotate-45 absolute" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-8/12 bg-blue-green rounded-md transition-all duration-200 ${
              mobileNav ? "hidden" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-8/12 bg-blue-green rounded-md transition-all duration-200 ${
              mobileNav ? "w-10/12 rotate-[-45deg] absolute" : ""
            }`}
          ></span>
        </button>
      </div>
      {/* mobile navigation */}
      {/* disable Colorzilla chrome extension to avoid console error */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${mobileNav ? "z-10 w-full bg-white" : "hidden"}`}
        onClick={() => setMobileNav(false)}
      >
        <div className="h-full flex flex-col items-center divide-y divide-border-grey absolute min-w-full">
          {pages.map((page, i) => (
            <Link
              href={page === "home" ? "" : page}
              className={`bg-white h-16 px-5 mx-5 cursor-pointer flex justify-center items-center w-full ${
                path === "/" + page
                  ? activeLinkStyle
                  : path === "/" && page === "home"
                  ? activeLinkStyle
                  : ianctiveLinkStyleMobile
              }`}
              key={i}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
}