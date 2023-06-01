import styles from "./styles.module.css";
import Button from "./../../components/buttton";

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
        <div className="bg-black/[.5] p-10 rounded-xl">
          <h1 className="font-serif text-5xl text-white text-center w-full">
            Moon Jar
          </h1>
          <div className="flex justify-center mt-10">
            <a href="/about">
              <Button text={"Welcome"} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
