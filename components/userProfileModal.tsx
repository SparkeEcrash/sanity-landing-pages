"use client";
import { useState, useEffect, useRef } from "react";
import Button from "components/button";
import ButtonMini from "components/buttonMini";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch, useAppSelector } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import {
  findUser,
  UserProfileData as UserProfileDataInterface,
  onChangeUserForm,
  fetchEditUserProfile,
  fetchAddUserProfile,
  fetchDeleteUserProfile,
} from "../redux/features/userSlice";
import { verifyEmail } from "utils";

interface UserFormModalProps {
  show: boolean;
  setShow?: (show: boolean) => void;
  dispatchSetShow?: ActionCreatorWithPayload<
    {
      show: boolean;
      edit?: boolean | undefined;
      delete?: boolean | undefined;
      _id?: string | undefined;
    },
    "user/setShowUserProfileModal"
  >;
  clickOut?: boolean;
}

export default function UserFormModal({
  show,
  setShow,
  dispatchSetShow,
  clickOut,
}: UserFormModalProps) {
  const dispatch = AppDispatch();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [images, setImages] = useState<(File | string)[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [textDelete, setTextDelete] = useState<string>("");
  const [imageDetails, setImageDetails] = useState<
    {
      name: string;
      path: string;
      dimensions?: { height: number; width: number };
    }[]
  >([]);
  const {
    uid,
    userProfileData,
    isSendingUserProfile,
    editUserProfileModal,
    deleteUserProfileModal,
    addUserProfileError,
  } = useAppSelector(findUser);
  const {
    name,
    userEmail,
    userImage,
    username,
    password,
    confirmPassword,
    errors,
  } = userProfileData;
  type Errors = {
    value: {
      [key: string]: any;
      name?: boolean;
      userEmail?: boolean;
      isUserEmailInvalid?: boolean;
      isUserImageInvalid?: boolean;
      password?: boolean;
      isPasswordUnconfirmed?: boolean;
      delete?: boolean;
    };
    field: string;
  };
  let errorChecks: Errors[] = [];
  const errorMessages = {
    name: "Please enter your name",
    userEmail: "Please enter your email",
    isUserEmailInvalid: "Please enter a valid email address",
    isUserImageInvalid: "Please select a file with a valid image format",
    password: "Please enter your password",
    isPasswordUnconfirmed: "Passwords do not match",
    delete: "The text you entered did not match your name",
  };
  const setModalShow = (boolean: boolean) =>
    setShow ? setShow(boolean) : dispatch(dispatchSetShow!({ show: boolean }));
  const imageFileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const addPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const acceptedImageTypes = [
      "image/png",
      "image/svg",
      "image/jpeg",
      "image/gif",
      "image/tiff",
    ];
    if (e.target.files && e.target.files.length !== 0) {
      const fileList: File[] = Array.from(e.target.files);
      const myFileList = fileList.filter((file) =>
        acceptedImageTypes.includes(file.type)
      );
      if (fileList.length !== myFileList.length) {
        onChange([
          { value: { ...errors, isUserImageInvalid: true }, field: "errors" },
        ]);
      } else {
        onChange([
          { value: { ...errors, isUserImageInvalid: false }, field: "errors" },
        ]);
      }
      const myFilePaths = myFileList.map((file) => ({
        name: file.name,
        path: URL.createObjectURL(file),
      }));
      setImages([...myFileList]);
      setImageDetails([...myFilePaths]);
    }
  };

  const removePicture = () => {
    setImages([]);
    setImageDetails([]);
  };

  const removeExistingPicture = () => {
    onChange([{ value: "", field: "userImage" }]);
  };

  const confirmDelete = () => {
    const trimmedLowerCaseTextDelete = textDelete.trim().toLowerCase();
    const trimmedLowerCaseName = name.trim().toLowerCase();
    if (trimmedLowerCaseTextDelete === trimmedLowerCaseName) {
      dispatch(fetchDeleteUserProfile({ uid }));
      signOut();
      onChange([{ value: { ...errors, delete: false }, field: "errors" }]);
    } else {
      onChange([{ value: { ...errors, delete: true }, field: "errors" }]);
    }
  };

  const sendData = () => {
    const nameTrimmed = name.trim();
    const userEmailTrimmed = userEmail.trim();
    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();
    const confirmPasswordTrimmed = confirmPassword.trim();

    errorChecks.push({
      value: {
        ...errors,
        name: nameTrimmed.length === 0,
        userEmail: userEmailTrimmed.length === 0,
        isUserEmailInvalid:
          userEmailTrimmed.length > 0 ? !verifyEmail(userEmail) : false,
        password: !editUserProfileModal && passwordTrimmed.length === 0,
        isPasswordUnconfirmed:
          !editUserProfileModal && passwordTrimmed !== confirmPasswordTrimmed,
      },
      field: "errors",
    });
    onChange(errorChecks);
    const errorValues = errorChecks[0].value;
    const hasError = Object.keys(errorValues).some((key) => errorValues[key]);

    if (!hasError) {
      const data = new FormData();
      const json = JSON.stringify({
        name: nameTrimmed,
        userEmail: userEmailTrimmed,
        userImage,
        username: usernameTrimmed,
        password: passwordTrimmed,
        imageDetails,
      });
      const blob = new Blob([json], { type: "application/json" });
      data.append("blob", blob);
      if (images.length > 0) {
        images.forEach((image) => {
          data.append("image", image);
        });
      }
      editUserProfileModal
        ? dispatch(fetchEditUserProfile(data))
        : dispatch(fetchAddUserProfile(data));
    }
  };

  const onChange = (inputs: { value: any; field: string }[]) => {
    const validKeys = [
      "name",
      "userImage",
      "userEmail",
      "username",
      "password",
      "confirmPassword",
      "errors",
    ];
    let userForm = { ...userProfileData };
    inputs.forEach(({ value, field }) => {
      if (validKeys.includes(field)) {
        userForm[field as keyof UserProfileDataInterface] = value;
      }
    });
    dispatch(onChangeUserForm(userForm));
  };

  return (
    <div
      className="fixed top-0 left-0 z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setModalShow(false)}
    >
      <div
        className="bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey w-[600px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col border-b shadow-sm p-14">
          <div>
            <XMarkIcon
              className="text-royal-blue absolute h-8 top-5 left-5 prevent-select cursor-pointer"
              onClick={() => setModalShow(false)}
            />
          </div>
          {!deleteUserProfileModal ? (
            <>
              <div className="text-center">
                <h1 className="title-font">Enter your profile</h1>
              </div>
              <p className="title-font text-base mt-10">Picture</p>
              <div className="flex justify-center">
                <input
                  type="file"
                  hidden
                  ref={imageFileRef}
                  onChange={(e) => {
                    addPicture(e);
                  }}
                  onClick={(e) => {
                    (e.target as HTMLInputElement).value = "";
                  }}
                />
                {userImage ? (
                  <div className="relative">
                    <Image
                      src={userImage}
                      alt={`Picture of ${name}`}
                      width={100}
                      height={100}
                      className="relative object-cover prevent-select border cursor-pointer"
                    />
                    <div className="absolute transform-center left-[150px]">
                      <ButtonMini
                        text={`remove`}
                        clickFn={() => removeExistingPicture()}
                      />
                    </div>
                  </div>
                ) : imageDetails.length > 0 ? (
                  <div className="h-[100px] w-[100px] relative">
                    <Image
                      src={imageDetails[0].path}
                      alt={imageDetails[0].name}
                      fill
                      className="object-cover prevent-select border cursor-pointer"
                      onClick={() => imageFileRef.current!.click()}
                      onLoad={({
                        currentTarget,
                      }: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        if (!imageDetails[0]["dimensions"]) {
                          setImageDetails((imageDetails) => {
                            imageDetails[0]["dimensions"] = {
                              height: currentTarget.naturalHeight,
                              width: currentTarget.naturalWidth,
                            };
                            return imageDetails;
                          });
                        }
                      }}
                    />
                    <div className="absolute transform-center left-[150px]">
                      <ButtonMini
                        text={`remove`}
                        clickFn={() => removePicture()}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-[100px] w-[100px] border shadow-md flex-center bg-input-grey cursor-pointer relative"
                    onClick={() => imageFileRef.current!.click()}
                  >
                    <CameraIcon className="text-border-grey h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {errors.isUserImageInvalid && (
                  <p className="body-font text-red-500 mt-1">
                    {errorMessages.isUserImageInvalid}
                  </p>
                )}
              </div>
              <p className="title-font text-base mt-10">Name</p>
              <input
                type="text"
                value={name}
                className="input-style"
                onChange={(e) => {
                  onChange([{ value: e.target.value, field: "name" }]);
                }}
              />
              {errors.name && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.name}
                </p>
              )}
              <p className="title-font text-base mt-10">Email</p>
              <input
                type="text"
                value={userEmail}
                className="input-style"
                onChange={(e) => {
                  onChange([{ value: e.target.value, field: "userEmail" }]);
                }}
              />
              {errors.userEmail && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.userEmail}
                </p>
              )}
              {errors.isUserEmailInvalid && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.isUserEmailInvalid}
                </p>
              )}
              <p className="title-font text-base mt-10">Username</p>
              <input
                type="text"
                value={username}
                className="input-style"
                onChange={(e) => {
                  onChange([{ value: e.target.value, field: "username" }]);
                }}
              />
              {!editUserProfileModal && !deleteUserProfileModal && (
                <>
                  <p className="title-font text-base mt-10">Password</p>
                  <input
                    type="password"
                    value={password}
                    className="input-style"
                    onChange={(e) => {
                      onChange([{ value: e.target.value, field: "password" }]);
                    }}
                  />
                  {errors.password && (
                    <p className="body-font text-red-500 mt-1">
                      {errorMessages.password}
                    </p>
                  )}
                  <p className="title-font text-base mt-10">Confirm Password</p>
                  <input
                    type="password"
                    value={confirmPassword}
                    className="input-style"
                    onChange={(e) => {
                      onChange([
                        { value: e.target.value, field: "confirmPassword" },
                      ]);
                    }}
                  />
                  {errors.isPasswordUnconfirmed && (
                    <p className="body-font text-red-500 mt-1">
                      {errorMessages.isPasswordUnconfirmed}
                    </p>
                  )}
                  <div className="mt-10">
                    <ButtonMini
                      clickFn={() => setShowDisclaimer(!showDisclaimer)}
                      text={`Please Note`}
                      dark={!showDisclaimer}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      showDisclaimer
                        ? "opacity-100 max-h-[500px] mt-5"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    <p className="body-font">
                      When you create a new account on Lunar Jar it is highly
                      recommended you create a new password that is not shared
                      with any of your other accounts. If you prefer not
                      creating a new password you can create a new account by
                      signing into Lunar Jar using an account from another
                      platform such as Google or Facebook. Your account will be
                      created with the email address provided from the other
                      platform.
                    </p>
                  </div>
                  <div className="mt-10 flex justify-center">
                    {addUserProfileError && (
                      <p className="body-font text-red-500">
                        {addUserProfileError}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="title-font">Are you sure?</h1>
              </div>
              <div className="pt-14 pr-14 pl-14 flex flex-col">
                <p className="title-font text-base">
                  Please enter your name to continue
                </p>
                <input
                  type="text"
                  className="input-style"
                  value={textDelete}
                  onChange={(e) => {
                    setTextDelete(e.target.value);
                  }}
                />
                {errors.delete && (
                  <p className="body-font text-red-500 mt-1">
                    {errorMessages.delete}
                  </p>
                )}
              </div>
            </>
          )}{" "}
        </div>

        <div className="p-14 mx-auto flex flex-col items-center">
          {deleteUserProfileModal ? (
            <Button
              text={"Delete"}
              disabled={isSendingUserProfile}
              clickFn={() => confirmDelete()}
            />
          ) : (
            <Button
              text={"Submit"}
              disabled={isSendingUserProfile}
              clickFn={() => sendData()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
