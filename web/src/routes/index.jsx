import { Link } from "react-router-dom";
import styles from "./index.module.scss";

export default function Index() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>Welcome to telegram webhooks</p>
          {/* <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div> */}
        </div>

        <div className={styles.center}>
          <h2>Welcome to Telegram Webhooks!</h2>
        </div>

        <div className={styles.grid}>
          <Link to="/signin" className={styles.card}>
            <h2>
              Account <span>-&gt;</span>
            </h2>
            <p>Sign-in to your telegram account</p>
          </Link>

          <Link to="/setup" className={styles.card}>
            <h2>
              Setup <span>-&gt;</span>
            </h2>
            <p>Setup webhook urls to receive events!</p>
          </Link>
          {/* 
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a> */}
        </div>
      </main>
    </>
  );
}
