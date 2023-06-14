import HoverModal from "components/hoverModal";
import Image from "next/image";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
const inactiveLinkStyleDesktop =
  "font-serif text-royal-blue text-3xl opacity-70 hover:opacity-100 transition-all duration-200";

export default async function NavigationUser() {
  const data = await getServerSession(authOptions);
  const user = data && data.user;
  return (
    <div className="flex items-center">
      {user ? (
        <HoverModal text="sign out">
          <Link
            href="user"
            className={`flex justify-center items-center h-16 cursor-pointer ${inactiveLinkStyleDesktop}`}
          >
            <Image
              src={user.image}
              alt={"User image"}
              width={50}
              height={50}
              className="rounded-full relative prevent-select mr-4"
              priority
            />
            {user.name}
          </Link>
        </HoverModal>
      ) : (
        <Link
          href="/api/auth/signin"
          className={`cursor-pointer flex justify-center items-center h-16 ${inactiveLinkStyleDesktop}`}
        >
          <UserCircleIcon className={`h-16 mr-2`} />
          Sign In
        </Link>
      )}
    </div>
  ) ;
} 
