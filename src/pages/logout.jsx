import React from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


function proceed() {
  fetch(`${import.meta.env.VITE_API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  })
    .then((e) => e.json)
    .then((d) => {
      console.log(d.failure);
      document.querySelector(".parent-prompt p").innerText =
        "Logout successfull";
      document.querySelector(".parent-prompt .proceed").remove();
    })
    .catch((err) => alert(err));
}
const Logout = () => {

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
          <p className="lead mb-5">Do you really want to logout?</p>
          <div>
            <Link to={"/"}>
              <button className="action btn pbt">Back</button>
            </Link>
            <button
              className="action btn pbt proceed"
              onClick={() => {
                proceed();
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


export default Logout;
