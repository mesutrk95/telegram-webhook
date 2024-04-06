import "../globals.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
