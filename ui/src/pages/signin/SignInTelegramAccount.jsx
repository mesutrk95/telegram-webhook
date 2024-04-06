import React, { useEffect, useState } from "react";
import styles from "./SignInTelegramAccount.module.scss";
import { toast } from "react-toastify";
import TelegramAccountSingIn from "./telegram-account-signin";
import { waitFor } from "@/utils";

export default function SignInTelegramAccount({ onNewAccount }) {
  const [loading, setLoading] = useState({});
  const [status, setStatus] = useState("none");
  const [phone, setPhone] = useState("none");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState("");
  const [client, setClient] = useState(null);

  useEffect(() => {
    const client = new TelegramAccountSingIn();
    setClient(client);
  }, []);

  function onSignIn() {
    const newSession = client.getSession();
    console.log(newSession);
    setSession(newSession);
    setStatus("signed-in");
    toast.success(`Successful sign in to account ${phone}`);
    onNewAccount?.({ session: newSession, phone });
  }

  function reset() {
    setStatus("none");
    setPhone("");
    setCode("");
  }

  async function signIn() {
    if (loading.signIn) return;
    setLoading({ ...loading, signIn: true });

    if (status === "password-request") {
      client.setPassword(password);
      await waitFor(() => client.status != "password-request");
      if (client.status === "active") {
        onSignIn();
      } else {
        console.error(client.error);
        toast.error(`Error ${phone}: ${client.error.toString()}`);
      }
    } else {
      client.setCode(code);
      await waitFor(() => client.status != "code-sent");
      if (client.status === "password-request") {
        toast.error(`Account ${phone} requires password!`);
        setStatus("password-request");
      } else if (client.status === "active") {
        onSignIn();
      } else {
        console.error(client.error);
        toast.error(`Error ${phone}: ${client.error.toString()}`);
      }
    }

    setLoading({ ...loading, signIn: false });
  }

  async function sendCode() {
    if (loading.sendCode) return;
    setLoading({ ...loading, sendCode: true });
    try {
      client.start(phone);
      await waitFor(() => client.status !== "none" || client.error);

      if (!client.error) {
        setStatus("code-sent");
        toast.success(`Code sent to ${phone}`);
      } else {
        toast.error(`Error requesting code for ${phone}`);
        console.error(client.error);
      }
    } catch (error) {
      toast.error(error.toString());
    }
    setLoading({ ...loading, sendCode: false });
  }

  return (
    <div className={`${styles.newAccount} p-4`}>
      <h2>Sign-in to telegram account ({status})</h2>
      {status === "none" && (
        <>
          <div className="mb-2">
            <label>Phone Number</label>
            <input
              className="form-control "
              type="phone"
              name="phone"
              onChange={(e) => setPhone(e.target.value.trim())}
            />
          </div>
          <div className={` btn btn-primary`} onClick={(e) => sendCode()}>
            Get Code!
          </div>
        </>
      )}
      {(status === "code-sent" || status === "password-request") && (
        <>
          <div>
            <label>Phone:</label>
            <span>{phone}</span>
          </div>
          <div>
            <label>Code:</label>
            <input
              className="form-control "
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
              disabled={status === "password-request" ? 1 : null}
            />
          </div>
          {status === "password-request" && (
            <div>
              <label>Password:</label>
              <input
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          )}
          <div className={`btn btn-primary`} onClick={() => signIn()}>
            Sign In!
          </div>
        </>
      )}

      {status === "signed-in" && (
        <div>
          You have successfully logged in!
          <label>Phone:</label>
          <span>{phone}:</span>
          <br />
          <label>Session:</label>
          <br />
          <p>{session}:</p>
          <div className="btn btn-primary" onClick={(e) => reset()}>
            + Add Another Account
          </div>
        </div>
      )}
    </div>
  );
}
