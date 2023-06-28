"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppSelector, AppDispatch } from "@redux/store";
import {
  findUser,
  setShowUserProfileModal,
  loadUserProfile,
  setUpdateSessionFlag,
  setResetPasswordModal,
} from "@redux/features/userSlice";
import BounceLoader from "react-spinners/BounceLoader";
import Image from "next/image";
import Button from "@components/button";
import ButtonMini from "@components/buttonMini";
import UserProfileModal from "@components/userProfileModal";
import ResetPasswordModal from "@components/resetPasswordModal";

export default function UserForm() {
  const router = useRouter();
  const { update } = useSession();
  const dispatch = AppDispatch();
  const {
    name,
    userEmail,
    userImage,
    username,
    isPasswordSet,
    signedIn,
    showUserProfileModal,
    updateSessionFlag,
    showResetPasswordModal,
  } = useAppSelector(findUser);
  useEffect(() => {
    const updateSession = async () => {
      const result = await update({
        name,
        email: userEmail,
        image: userImage,
        username,
      });
      dispatch(setUpdateSessionFlag(false));
      router.refresh();
    };
    if (updateSessionFlag) {
      updateSession();
    }
  }, [name, userEmail, userImage, username]);
  return (
    <>
      {signedIn ? (
        <div className="w-[900px] border shadow-md bg-white p-14">
          <div>
            <h1 className="title-font">Hello {name}!</h1>
            <p className="body-font mt-5">Shown below is your profile</p>
          </div>
          <div className="p-14 flex flex-col items-center justify-center">
            <div className="mx-auto flex flex-col items-center">
              <h2 className="title-font">Picture</h2>
              <Image
                src={userImage}
                alt={`Picture of ${name}`}
                width={100}
                height={100}
                className="mt-5 relative object-cover prevent-select border"
                priority
              />
            </div>
            <div className="mt-10 mx-auto flex flex-col items-center">
              <h2 className="title-font">Name</h2>
              <p className="body-font mt-5">{name}</p>
            </div>
            <div className="mt-10 mx-auto flex flex-col items-center">
              <h2 className="title-font">Email</h2>
              <p className="body-font mt-5">{userEmail}</p>
            </div>
            <div className="mt-10 mx-auto flex flex-col items-center">
              <h2 className="title-font">Username</h2>
              <p className="body-font mt-5">
                {username ? (
                  username
                ) : (
                  <span className="title-font text-base">Undecided</span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-10 mx-auto flex flex-col items-center">
            <Button
              clickFn={() => {
                dispatch(setShowUserProfileModal({ show: true, edit: true }));
                dispatch(
                  loadUserProfile({ name, username, userEmail, userImage })
                );
              }}
              text={"Edit"}
            />
          </div>
          <div className="title-font text-base text-right cursor-pointer flex justify-between">
            {isPasswordSet ? (
              <ButtonMini
                text={`Reset password`}
                clickFn={() => dispatch(setResetPasswordModal(true))}
              />
            ) : (
              <ButtonMini
                text={`Set password`}
                clickFn={() => dispatch(setResetPasswordModal(true))}
              />
            )}
            {/* <ButtonMini text={`Set password`} /> */}
            <ButtonMini
              text={`Delete account`}
              clickFn={() => {
                dispatch(setShowUserProfileModal({ show: true, delete: true }));
                dispatch(
                  loadUserProfile({ name, username, userEmail, userImage })
                );
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex-center">
          <BounceLoader color="#153084" size={100} />
        </div>
      )}
      <div>
        {showUserProfileModal && (
          <UserProfileModal
            show={showUserProfileModal}
            dispatchSetShow={setShowUserProfileModal}
            clickOut
          />
        )}
        {showResetPasswordModal && (
          <ResetPasswordModal
            show={showResetPasswordModal}
            dispatchSetShow={setResetPasswordModal}
            clickOut
          />
        )}
      </div>
    </>
  );
}
