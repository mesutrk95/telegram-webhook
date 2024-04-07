import React, { useEffect, useState } from "react";
import styles from "./SignInTelegramAccount.module.scss";
import { toast } from "react-toastify";
import api from "@/api";

export default function ServerSignInTelegram({ onSignIn }) {
  const [loading, setLoading] = useState({});
  const [status, setStatus] = useState("none");
  const [phone, setPhone] = useState("none");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState("");

  function onAccountActive(account) {
    console.log("Successful sign in to account", account);
    setSession(account.session);
    toast.success(`Successful sign in to account ${account.phone}`);
    onSignIn?.(account);
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
      api
        .post("/telegram/setPassword", { password })
        .then(({ data }) => {
          const { status, account } = data;
          setStatus(status);
          if (status === "active") {
            onAccountActive(account);
          }
          toast.success(data.message);
          setLoading({ ...loading, signIn: false });
        })
        .catch(({ data }) => {
          setStatus(data.status);
          toast.error(data.message);
          setLoading({ ...loading, signIn: false });
        });
    } else {
      api
        .post("/telegram/setCode", { code })
        .then(({ data }) => {
          const { status, account } = data;
          if (status === "password-request") {
            toast.error(`Account ${phone} requires password!`);
          } else if (status === "active") {
            onAccountActive(account);
          }
          setStatus(status);
          toast.success(data.message);
          setLoading({ ...loading, signIn: false });
        })
        .catch(({ data }) => {
          setStatus(data.status);
          toast.error(data.message);
          setLoading({ ...loading, signIn: false });
        });
    }
  }

  async function sendCode() {
    if (loading.sendCode) return;
    setLoading({ ...loading, sendCode: true });

    api
      .post("/telegram/requestCode", { phone })
      .then(({ data }) => {
        const { status, account } = data;
        setStatus(status);
        toast.success(data.message);
        setLoading({ ...loading, sendCode: false });
      })
      .catch(({ data }) => {
        setStatus(data.status);
        toast.error(data.message);
        setLoading({ ...loading, sendCode: false });
      });
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

      {status === "active" && (
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
