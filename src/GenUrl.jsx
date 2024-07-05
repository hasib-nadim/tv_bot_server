import { React, useEffect, useState } from "react";
import axios from "axios";
const api = "http://localhost:8080";
function GenUrl() {
  const [urls, setUrls] = useState({});
  const [name, setName] = useState("");
  console.log(urls);
  const urlHandler = async () => {
    const res = await axios.get(api + "/generate-url?name=" + name);
    setUrls((pv) => ({
      ...pv,
      [res.data["url"]]: name,
    }));
  };
  const loadData = async () => {
    const res = await axios.get(api + "/url-list");
    setUrls(res.data.data);
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      <div>
        <h1>Generate Your Url</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            urlHandler();
          }}
        >
          <input
            type="text"
            placeholder="name"
            value={name}
            required
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <button type="submit">New ApiKey</button>
        </form>
        <div style={{ maxWidth: "768px", width: "100%" }}>
          {Object.keys(urls).map((v) => (
            <p
              key={v}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <span>{urls[v]}:</span>
              <code>{v}</code>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenUrl;
