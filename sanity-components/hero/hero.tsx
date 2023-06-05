import Link from "next/link";
import styles from "./styles.module.css";
import Button from "components/button";

export default function Hero() {
  return (
    <section className={styles.banner}>
      <div className={styles["banner-video"]}>
        <video
          className={`${styles["banner-video__desktop"]} ${styles.video}`}
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
      <div className="flex justify-center items-center h-full">
        <div className="bg-royal-blue/[.5] p-4 rounded-xl sm:rounded-full sm:aspect-square flex items-center">
          <div className=" border-8 border-blue-green/[.5] p-10 rounded-xl sm:rounded-full sm:aspect-square flex items-center">
            <div>
              <h1 className="font-serif text-5xl text-white text-center w-full">
                Moon Jar
              </h1>
              <div className="flex justify-center mt-10">
                <Link href="/about">
                  <Button bgColor="bg-royal-blue"text={"Welcome"} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
