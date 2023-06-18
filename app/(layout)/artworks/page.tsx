"use client";
import { useEffect } from "react";
import UploadArtworkModal from "components/uploadArtworkModal";
import UserArtworks from "@sanity-components/userArtworks/userArtworks";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
  fetchUserArtworks,
  findUser,
  togglePostedView,
  toggleFilterOptions,
  sortArtworksPostedByFilter,
  sortArtworksSavedByFilter,
} from "@redux/features/userSlice";
import { setShowModal, getArtworks } from "@redux/features/artworksSlice";
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
  const {
    artworksSaved,
    artworksPosted,
    artworksLoading,
    signedIn,
    uid,
    postedView,
    filterPosted,
    filterSaved,
  } = useAppSelector(findUser);
  const { showModal } = useAppSelector(getArtworks);
  const dispatch = AppDispatch();
  const filterSavedOptions = ["Updated", "Newest", "Oldest", "Alphabetical"];
  const filterPostedOptions = [
    "Updated",
    "Most Liked",
    "Most Viewed",
    "Alphabetical",
  ];

  useEffect(() => {
    signedIn && dispatch(fetchUserArtworks(uid));
  }, []);

  useEffect(() => {
    signedIn && dispatch(sortArtworksSavedByFilter(filterSaved));
  }, [filterSaved]);

  useEffect(() => {
    signedIn && dispatch(sortArtworksPostedByFilter(filterPosted));
  }, [filterPosted]);

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
                    options={filterPostedOptions}
                    value={filterPosted}
                    clickFn={() =>
                      dispatch(
                        toggleFilterOptions({
                          value: filterPosted,
                          options: filterPostedOptions,
                        })
                      )
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
                    yesno={false}
                    options={filterSavedOptions}
                    value={filterSaved}
                    clickFn={() =>
                      dispatch(
                        toggleFilterOptions({
                          value: filterSaved,
                          options: filterSavedOptions,
                        })
                      )
                    }
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
