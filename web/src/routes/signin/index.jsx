import { useEffect, useState } from "react";
// import SignInTelegramAccount from "./SignInTelegramAccount";
import { toast } from "react-toastify";
import api from "../../api";
import ServerSignInTelegram from "./ServerSignInTelegam";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  async function onSignIn({ phone, session }) {
    setAccount({ phone, session });
  }
  async function signOut() {
    await api
      .post("/telegram/signOut")
      .then(({ data }) => {
        setAccount(null);
        toast.success("Successfully signed out!");
      })
      .catch((err) => {
        toast.error("Couldn't sign out successfully.");
      });
  }

  useEffect(() => {
    setLoading(true);
    api
      .get("/telegram")
      .then(({ data }) => {
        setLoading(false);
        const { session, phone } = data;
        setAccount({ session, phone });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <></>;

  return (
    <div className="App">
      {account && (
        <div>
          <h4>Account Phone: {account.phone}</h4>
          {/* <MiniTelegramAccount
            session={account.session}
            subscribeUsernames={channels}
          /> */}
          <div className="btn btn-danger" onClick={signOut}>
            Sign out
          </div>
          <Link className="btn btn-primary" to="/">
            Back
          </Link>
        </div>
      )}
      {!account && (
        <div className="p-4">
          <ServerSignInTelegram onSignIn={onSignIn} />

          <Link className="btn btn-secondary mt-5" to="/">
            Back
          </Link>
        </div>
      )}
    </div>
  );
}
