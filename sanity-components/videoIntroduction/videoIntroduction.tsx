import React from "react";

export default function VideoIntroduction() {
  return (
    <section className="h-screen">
      <div className="flex h-full bg-green-300">
        <div className="bg-red-500 flex-1 relative">
          <div className="top-0 left-0 right-0 bottom-0 absolute overflow-hidden flex justify-center">
            <video
              className={`absolute transform-center min-w-full min-h-full w-auto h-auto object-cover`}
              playsInline
              loop
              autoPlay
              muted
            >
              <source
                src={
                  "https://www.amoca.org/wp-content/uploads/2020/06/NewHomepage_NoTitle.mp4"
                }
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="bg-white flex-1"></div>
      </div>
    </section>
  );
}
