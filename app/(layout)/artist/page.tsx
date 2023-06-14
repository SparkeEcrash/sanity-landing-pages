"use client";
import { useEffect } from "react";
import Image from "next/image";
import UploadArtworkModal from "components/uploadArtworkModal";
import { trimString } from "utils";
import UserArtworks from "@sanity-components/userArtworks/userArtworks";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
  getUser,
  sortArtworksSavedByUploadDate,
} from "@redux/features/userSlice";
import {
  setShowModal,
  togglePostedView,
  toggleFilterPosted,
  toggleFilterSaved,
  getArtworks,
} from "@redux/features/artworksSlice";
import Toggle from "components/toggle";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

//build infinite scroll component
//https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
// https://www.npmjs.com/package/react-infinite-scroller
// https://www.npmjs.com/package/react-infinite-scroll-component

//store concept
// https://www.cheshireartgallery.co.uk/product/kit-andrews-large-kintsugi-pot-12l/

//image compression
// https://www.npmjs.com/package/browser-image-compression

//api: check_booked_dates

export default function Artist() {
  const { artworksSaved, artworksPosted, artworksLoading, signedIn } =
    useAppSelector(getUser);
  const { showModal, postedView, filterPosted, filterSaved } =
    useAppSelector(getArtworks);
  const dispatch = AppDispatch();

  useEffect(() => {
    signedIn && dispatch(sortArtworksSavedByUploadDate(filterSaved));
  }, [filterSaved]);

  return (
    <>
      <main className="py-[100px]">
        <section className="flex flex-col justify-center items-center">
          <div className="max-w-7xl">
            <div className="mt-10 flex justify-between">
              <div>
                <Toggle
                  toggle={postedView}
                  yesno={true}
                  options={["Saved", "Posted"]}
                  clickFn={() => dispatch(togglePostedView())}
                />
              </div>
              <div>
                <DocumentPlusIcon
                  className={`h-10 text-royal-blue prevent-select cursor-pointer`}
                  onClick={() => dispatch(setShowModal(true))}
                />
              </div>
            </div>
            {postedView ? (
              <div className="p-14">
                <p className="text-3xl text-royal-blue font-serif text-center">
                  Your artworks posted on the gallery
                </p>
                <div className="mt-10 flex justify-center">
                  <Toggle
                    yesno={false}
                    options={["Latest", "Most Viewed", "Most Liked"]}
                    value={filterPosted}
                    clickFn={() =>
                      dispatch(toggleFilterPosted((filterPosted + 1) % 3))
                    }
                  />
                </div>
                <div className="flex mt-10">
                  <UserArtworks
                    artworks={artworksPosted}
                    loading={artworksLoading}
                    dispatchClickFn={setShowModal}
                  />
                </div>
              </div>
            ) : (
              <div className="p-14">
                <p className="text-3xl text-royal-blue font-serif text-center">
                  Your artworks saved on your account
                </p>
                <div className="mt-10 flex justify-center">
                  <Toggle
                    toggle={filterSaved}
                    yesno={true}
                    options={["Latest", "Oldest"]}
                    clickFn={() => dispatch(toggleFilterSaved(!filterSaved))}
                  />
                </div>
                <div className="flex mt-10">
                  <UserArtworks
                    artworks={artworksSaved}
                    loading={artworksLoading}
                    dispatchClickFn={setShowModal}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      {showModal && (
        <UploadArtworkModal show={showModal} dispatchSetShow={setShowModal} />
      )}
    </>
  );
}

const nameExample = "My super duper awesome emperor jade green porcelain";

const DataPosted = () => (
  <div className="w-[300px] relative border shadow-md cursor-pointer">
    <div className="w-full h-[300px] relative">
      <Image
        src={
          "https://images.unsplash.com/photo-1590600504282-30e4dc6f8fcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
        }
        alt={"alt tag"}
        className="object-cover prevent-select"
        fill
        priority
      />
    </div>
    <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
      <div>
        <h2 className="w-full title-font text-xl text-center">
          {trimString(75, nameExample)}
        </h2>
      </div>
      <div className="w-full mt-2">
        <div className="flex justify-between">
          <p className="body-font text-sm">Views: 25</p>
          <p className="body-font text-sm">Likes: 255</p>
        </div>
      </div>
    </div>
  </div>
);
