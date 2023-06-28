"use client";
import { useState, useEffect } from "react";
import Button from "components/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch, useAppSelector } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { fetchResetPassword, findUser } from "@redux/features/userSlice";
import ButtonMini from "@components/buttonMini";
import { addMessage } from "@redux/features/messagesSlice";

interface ResetPasswordModalProps {
  show: boolean;
  setShow?: (show: boolean) => void;
  title?: string;
  dispatchSetShow?: ActionCreatorWithPayload<any, string>;
  clickOut?: boolean;
}

export default function ResetPasswordModal({
  show,
  setShow,
  title,
  dispatchSetShow,
  clickOut,
}: ResetPasswordModalProps) {
  const dispatch = AppDispatch();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    [key: string]: any;
    oldPassword: boolean;
    newPassword: boolean;
    isPasswordUnconfirmed: boolean;
  }>({
    oldPassword: false,
    newPassword: false,
    isPasswordUnconfirmed: false,
  });
  const errorMessages = {
    oldPassword: "Please enter your password",
    newPassword: "Please enter your new password",
    isPasswordUnconfirmed: "Passwords do not match",
  };
  const { isPasswordSet, isResettingPassword, resetPasswordError } =
    useAppSelector(findUser);

  const setModalShow = (boolean: boolean) =>
    setShow ? setShow(boolean) : dispatch(dispatchSetShow!(boolean));

  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const resetPassword = () => {
    const oldPasswordTrimmed = oldPassword.trim();
    const newPasswordTrimmed = newPassword.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();
    let errorChecks: {
      oldPassword: boolean;
      newPassword: boolean;
      isPasswordUnconfirmed: boolean;
      [key: string]: any;
    } = {
      oldPassword: false,
      newPassword: false,
      isPasswordUnconfirmed: false,
    };

    if (isPasswordSet) {
      if (oldPasswordTrimmed.length === 0) {
        errorChecks.oldPassword = true;
      }
    }
    if (newPasswordTrimmed.length === 0) {
      errorChecks.newPassword = true;
    }
    if (newPasswordTrimmed !== confirmPasswordTrimmed) {
      errorChecks.isPasswordUnconfirmed = true;
    }
    setErrors(errorChecks);
    const hasError = Object.keys(errorChecks).some((key) => errorChecks[key]);
    if (!hasError) {
      dispatch(
        fetchResetPassword({
          oldPassword: oldPassword ? oldPassword : "",
          newPassword,
        })
      );
      dispatch(
        addMessage({
          text: isPasswordSet ? "Changing password" : "Setting up password",
          showLoading: true,
          key: "change user password",
          dark: true,
        })
      );
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setModalShow(false)}
    >
      <div
        className="min-w-[500px] bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col border-b shadow-sm p-14">
          <div>
            <XMarkIcon
              className="text-royal-blue absolute h-8 top-5 left-5 prevent-select cursor-pointer"
              onClick={() => setModalShow(false)}
            />
          </div>
          <div className="text-center">
            {isPasswordSet ? (
              <h1 className="title-font">{title ? title : "Reset Password"}</h1>
            ) : (
              <h1 className="title-font">
                {title ? title : "Set Your Password"}
              </h1>
            )}
          </div>
          {isPasswordSet && (
            <>
              <p className="title-font text-base mt-10">Password</p>
              <input
                type={`${showPassword ? "text" : "password"}`}
                value={oldPassword}
                className="input-style"
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
              {errors.oldPassword && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.oldPassword}
                </p>
              )}
            </>
          )}
          <p className="title-font text-base mt-10">New Password</p>
          <input
            type={`${showPassword ? "text" : "password"}`}
            value={newPassword}
            className="input-style"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          {errors.newPassword && (
            <p className="body-font text-red-500 mt-1">
              {errorMessages.newPassword}
            </p>
          )}
          <p className="title-font text-base mt-10">Confirm New Password</p>
          <input
            type={`${showPassword ? "text" : "password"}`}
            value={confirmPassword}
            className="input-style"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          {errors.isPasswordUnconfirmed && (
            <p className="body-font text-red-500 mt-1">
              {errorMessages.isPasswordUnconfirmed}
            </p>
          )}
          <div className="mt-10">
            <ButtonMini
              clickFn={() => setShowPassword((show) => !show)}
              text={`${showPassword ? "Hide Password" : "Show Password"}`}
              dark={true}
            />
          </div>
          <div className="mt-10 flex justify-center">
            {resetPasswordError && (
              <p className="body-font text-red-500">{resetPasswordError}</p>
            )}
          </div>
        </div>
        <div className="p-14 flex justify-evenly">
          <Button
            text={`${isPasswordSet ? "Reset Password": "Set Password"}`}
            disabled={isResettingPassword}
            clickFn={() => {
              resetPassword();
            }}
          />
        </div>
      </div>
    </div>
  );
}
