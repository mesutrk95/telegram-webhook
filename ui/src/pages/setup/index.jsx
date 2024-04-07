import api from "@/api";
import React, { useEffect, useState } from "react";

export default function Setup() {
  const [webhooks, setWebhooks] = useState([]);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    api
      .get("/webhooks")
      .then(({ data }) => {
        setWebhooks(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function saveWebhook() {
    api
      .post("/webhooks", { url: newUrl })
      .then(({ data }) => {
        setWebhooks([...webhooks, data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteWebhook(item) {
    api
      .delete(`/webhooks/${item.id}`)
      .then(({ data }) => {
        const list = webhooks.filter((w) => w.id !== item.id);
        setWebhooks(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="p-5">
      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <label>New Url </label>
        </div>
        <div className="col">
          <input
            className="form-control "
            placeholder="Webhook Url"
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <div className="btn btn-primary" onClick={saveWebhook}>
            Save
          </div>
        </div>
      </div>

      <div className=" mt-5">
        {webhooks.map((w) => (
          <div key={w.id} className="row align-items-center bg-light rounded border mb-2">
            <div className="col  p-3">{w.url}</div>
            <div className="col-auto">
              <div className="btn btn-danger" onClick={(e) => deleteWebhook(w)}>
                Delete
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
