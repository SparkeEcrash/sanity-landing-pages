"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Button from "@components/button";
import UserProfileModal from "./userProfileModal";
import { useAppSelector, AppDispatch } from "@redux/store";
import {
  findUser,
  setShowUserProfileModal,
  setIsNewAccountCreated,
} from "../redux/features/userSlice";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPortal() {
  const router = useRouter();
  const dispatch = AppDispatch();
  const {
    showUserProfileModal,
    isNewAccountCreated,
    newAccountCredentials,
    userLoading,
    signedIn,
  } = useAppSelector(findUser);
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const usernameOrEmailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const errorFromParam = searchParams.get("error");
  if (errorFromParam !== null) {
    setErrorMessage(errorFromParam);
  }
  useEffect(() => {
    const { userEmail: newUserEmail } = newAccountCredentials;
    setUsernameOrEmail(newUserEmail);
    setPassword("");
    usernameOrEmailRef!.current!.value = newUserEmail;
    passwordRef!.current!.value = "";
    setErrorMessage("");
  }, [isNewAccountCreated]);

  useEffect(() => {
    if (!userLoading && signedIn) {
      router.push("/artworks");
    }
  }, [userLoading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      signInHandler();
    }
  };

  const signInHandler = async () => {
    if (!usernameOrEmail) {
      setErrorMessage("missing email or username");
      return;
    }
    if (!password) {
      setErrorMessage("missing password");
      return;
    }
    setSigningIn(true);
    dispatch(setIsNewAccountCreated(false));
    //const result can be used only if redirect is false
    //auth fail redirects can be set in[...nextauth] api
    const result = await signIn("credentials", {
      usernameOrEmail,
      password,
      redirect: false,
      // callbackUrl: "/artworks",
    });
    if (result && result.error) {
      setErrorMessage(result.error);
    }
    if (result && !result.error && result.ok) {
      router.push("/artworks");
      router.refresh();
      setErrorMessage("user is authenticated");
    }
    setSigningIn(false);
  };

  return (
    <>
      <div className="h-[580px] flex max-w-5xl p-14 flex-col text-center bg-white border shadow-sm relative">
        <h1 className="text-3xl text-royal-blue font-serif text-center">
          Use your Lunar Jar account
        </h1>
        <p className="text-background-black font-sans mt-2">
          New members can sign up{" "}
          <span
            onClick={() => {
              dispatch(setShowUserProfileModal({ show: true }));
            }}
            className="text-royal-blue font-bold cursor-pointer"
          >
            here
          </span>
        </p>
        <p className="title-font text-base mt-10">Your email or username</p>
        <input
          type="text"
          className="input-style"
          ref={usernameOrEmailRef}
          onChange={(e) => {
            setUsernameOrEmail(e.target.value);
          }}
        />
        <p className="title-font text-base mt-10">Your password</p>
        <input
          type="password"
          className="input-style"
          onKeyDown={(e) => handleKeyDown(e)}
          ref={passwordRef}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div>
          <Button
            className="mt-10"
            bgColor="bg-royal-blue"
            text={"Continue"}
            clickFn={() => signInHandler()}
          />
        </div>
        {signingIn && <p className="body-font mt-7">Signing in...</p>}
        {!signingIn && errorMessage === "missing email or username" && (
          <p className="body-font mt-7 text-red-500">
            Please enter your email or username
          </p>
        )}
        {!signingIn && errorMessage === "missing password" && (
          <p className="body-font mt-7 text-red-500">
            Please enter your password
          </p>
        )}
        {!signingIn && isNewAccountCreated && (
          <p className="body-font mt-7">
            Sign into your new account with your password
          </p>
        )}
        {!signingIn && errorMessage === "incorrect password" && (
          <p className="body-font mt-7 text-red-500">
            The password you entered was incorrect
          </p>
        )}
        {!signingIn && errorMessage === "no username or email" && (
          <p className="body-font mt-7 text-red-500">
            No account with username or email was found
          </p>
        )}
        {!signingIn &&
          errorMessage === "account already exists from another provider" && (
            <p className="body-font mt-7 text-red-500">
              Account exists with no password. Set up password.
            </p>
          )}
        {!signingIn && errorMessage === "incorrect credentials provided" && (
          <p className="body-font mt-7 text-red-500">
            Incorrect credentials provided
          </p>
        )}
        {!signingIn && errorMessage === "user is authenticated" && (
          <p className="body-font mt-7">Signing in...</p>
        )}
        {/* <div className="absolute flex justify-end bottom-5 right-5">
          <p className="text-background-black font-sans mt-5">
            Reset{" "}
            <span
              onClick={() => {
                dispatch(setShowUserProfileModal({ show: true, edit: true }));
              }}
              className="text-royal-blue font-bold cursor-pointer"
            >
              password
            </span>
          </p>
        </div> */}
      </div>
      {showUserProfileModal && (
        <UserProfileModal
          show={showUserProfileModal}
          dispatchSetShow={setShowUserProfileModal}
          clickOut
        />
      )}
    </>
  );
}
