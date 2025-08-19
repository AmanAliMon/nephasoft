import React from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function proceedDelete(a) {
  fetch(`${import.meta.env.VITE_API_URL}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier: a }),
  })
    .then((e) => e.json)
    .then((d) => {
      console.log(d.failure);
      document.querySelector(".parent-prompt p").innerText =
        "Form deleted successfully";
      document.querySelector(".parent-prompt .proceed").remove();
    })
    .catch((err) => alert(err));
}

const Delete = () => {
  const navigate = useNavigate();
  let { identifier } = useParams();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logged`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.failure) {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error checking session", err);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
      <div className="parent-prompt container">
        <div className="prompt">
          <p className="lead mb-5">You are about to delete this form</p>
          <div>
            <Link to={'/'}>
              <button className="action btn pbt">Back</button>
            </Link>
            <button
              className="action btn pbt proceed"
              onClick={() => {
                proceedDelete(identifier);
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delete;
