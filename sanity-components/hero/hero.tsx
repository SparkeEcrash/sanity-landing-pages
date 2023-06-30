import Link from "next/link";
import styles from "./styles.module.css";
import Button from "components/button";
import Image from "next/image";

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
      {/* <div className="flex justify-center items-center h-full">
        <Link href="/about">
          <Image
            src={"/pictures/lunar-jar-logo.png"}
            alt={"Company Logo"}
            width={300}
            height={300}
            className="relative mx-auto object-cover prevent-select"
            priority
          />
        </Link>
      </div> */}
    </section>
  );
}
