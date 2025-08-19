import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "./form.css";

function submitForm(e) {
  const raw = Array.from(document.querySelectorAll("[data-fetch-id]"));
  let response = [];

  for (let elem of raw) {
    if (elem.nodeName === "INPUT") {
      const type = elem.type;

      if (type === "text") {
        if (elem.hasAttribute("required") && elem.value == "") {
          elem.classList.add("empty-field");
          return;
        }
        response.push({
          i: elem.getAttribute("data-fetch-id"),
          a: elem.value,
        });
      } else if (type === "checkbox") {
        response.push({
          i: elem.getAttribute("data-fetch-id"),
          a: elem.checked,
        });
      }
    } else if (elem.nodeName === "DIV" && elem.hasAttribute("title")) {
      const title = elem.getAttribute("title");
      const selected = document.querySelector(`input[name="${title}"]:checked`);

      if (
        elem.hasAttribute("required") &&
        [null, undefined].includes(selected)
      ) {
        elem.closest(".node").querySelector("p").classList.add("empty-field");
        return;
      }
      response.push({
        i: elem.getAttribute("data-fetch-id"),
        a: selected ? selected.labels[0].innerText : null,
      });
    }
  }
  console.log(response);

  e.currentTarget.setAttribute("disable", "true");
  e.currentTarget.innerText = "Done";

  fetch(`${import.meta.env.VITE_API_URL}/submission`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refer: location.href, attemp: response }),
  });
}

function Radio({ title, options, idef, req }) {
  console.log(req);

  return (
    <div className="node">
      <p>{title + (req == 1 ? "*" : "")}</p>
      {options.map((opt, index) => (
        <div key={index} title={title} data-fetch-id={idef} required={req}>
          <input
            type="radio"
            className="mr-1"
            name={title}
            id={`${title}-${index}`}
          />
          <label htmlFor={`${title}-${index}`}>{opt}</label>
        </div>
      ))}
    </div>
  );
}

let components = {
  description: (title, idef, req) => (
    <div className="node">
      <p>{title}</p>
      <input
        required={req == 1}
        type="text"
        data-fetch-id={idef}
        placeholder={"Answer" + (req ? "*" : "")}
        className="description"
      />
    </div>
  ),
  input: (idef, req) => (
    <div className="node">
      <input
        required={String.toString(req == 1)}
        type="text"
        data-fetch-id={idef}
        placeholder={"Answer" + (req ? "*" : "")}
        className="description"
      />
    </div>
  ),
  checkbox: (title, idef) => (
    <div className="node">
      <div className="sub-wrapper output-wrapper">
        <input data-fetch-id={idef} type="checkbox" />
        <div>
          <label className="description">{title}</label>
        </div>
      </div>
    </div>
  ),
  options: (title, opts, idef, req) => (
    <Radio title={title} idef={idef} options={opts} req={req} />
  ),
};
const FormEngine = () => {
  const { identifier } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/form/saved/${identifier}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.nologin) {
          location.href = "/login";
        }
        setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <main>
      <div className="strip">
        <div>
          <div className="logo">
            <Link to="/">Form Mon</Link>
          </div>
        </div>
        <div>
          <button
            className="btn pbt"
            id="submit"
            onClick={(e) => {
              submitForm(e);
            }}
          >
            Submit
          </button>
          <button
            className="btn pbt"
            id="link"
            onClick={(e) => {
              navigator.clipboard.writeText(window.location.href);
              e.currentTarget.innerText = "Link Copied";
              setTimeout(() => {
                e.currentTarget.innerText = "Share";
              }, 2000);
            }}
          >
            Share
          </button>
        </div>
      </div>
      <section className="form-builder container my-5">
        <div className="meta">
          <h1 style={{ color: "var(--primary)" }}>{form.title}</h1>
          <p>{form.desc}</p>
        </div>
        <hr />
        <div className="sandbox p-3" id="sandbox">
          {form.questions.map((e, index) => (
            <div key={index}>
              {e.type === "input" || e.type === "descriptive"
                ? components.description(e.question, e.id, e.mode)
                : e.type === "checkbox"
                ? components.checkbox(e.question,e.id)
                : e.type === "options"
                ? components.options(e.question, e.options, e.id, e.mode)
                : null}
              <br />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FormEngine;
