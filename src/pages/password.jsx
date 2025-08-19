import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";

function successAnimation(x) {
  x.innerHTML = "";
  x.classList.add("success-login");
  setTimeout(() => {
    document.querySelector("#loginform").style.display = "none";
    setTimeout(() => {
      document.querySelector(".post-login").classList.add("done-login");
    }, 200);
  }, 1000);
}

const Password = () => {
  const [state, setState] = useState("");
  const [form, setForm] = useState({
    password: "",
    email: "",
    New: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function inValidPass(setInfo,e="Password") {
  setInfo(`${e} might have 6 characters atleast`)
}

  const handleSubmit = (e,setState) => {
    e.preventDefault();
    console.log(form);
    if(form.New.length < 6){inValidPass(setState);return}
    fetch(`${import.meta.env.VITE_API_URL}/updatepassword`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        if (!data["failure"]) {
          successAnimation(document.getElementById("loginform"));
        }else{
          setState("Wrong Credentials")
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <main className="center-xy">
      <div className="container login-form" id="loginform">
        <div>
          <h1 className="t-primary">Update password</h1>
        <p style={{color:"red"}}>{state}</p>

        </div>

        <form className="form-elements" action="" onSubmit={(e)=>{handleSubmit(e,setState)}}>
          <div className="container">
            <div>Your email address</div>
            <div>
              <input
                required
                type="email"
                placeholder="Your E-mail"
                className="form-comp"
                value={form.email}
                onChange={handleChange}
                name="email"
              />
            </div>
          </div>
          <div className="container">
            <div>Your old password</div>
            <div>
              <input
                required
                value={form.password}
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="Old Password"
                className="form-comp"
              />
            </div>
          </div>
          <div className="container">
            <div>Your new password</div>
            <div>
              <input
                required
                value={form.New}
                onChange={handleChange}
                type="password"
                placeholder="********"
                className="form-comp"
                name="New"
              />
            </div>
          </div>
          <div className="container mt-3">
            <div>
              <button className="pbt btn mr-2">Continue</button>
            </div>
            <div></div>
          </div>
        </form>
      </div>
      <div className="post-login container">
        <h1 className="display-4" style={{ fontSize: "xx-large" }}>
          Password updated successfully
        </h1>
        <ul>
          <h3 className="display-4" style={{ fontSize: "x-large" }}>
            <Link to="/">Visit dashboard</Link>
          </h3>
          <h3 className="display-4" style={{ fontSize: "x-large" }}>
            <Link to="/new">Create a form</Link>
          </h3>
          <Link to="/logout">
            <button className="mt-2  color-white btn pbt">Logout</button>
          </Link>
        </ul>
      </div>
    </main>
  );
};

export default Password;
