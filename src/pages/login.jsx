import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
function inValidPass(setInfo,e="Password") {
  setInfo({t:`${e} might have 6 characters atleast`,c:"red"})
}

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

const Login = () => {
  const [state, setState] = useState("");
  const [info, setInfo] = useState({t:"And create custom forms for any purpose",c:""});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e,setInfo) => {
    e.preventDefault();
    console.log(form);
    if(form.password.length < 6){inValidPass(setInfo);return}
    fetch(`${import.meta.env.VITE_API_URL}/auth`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        setState(data["message"]);
        if (!data["failure"]) {
          successAnimation(document.getElementById("loginform"));
        }else{
          setInfo({t:"Wrong credentials",c:"red"});
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <main className="center-xy">
      <div className="container login-form" id="loginform">
        <div>
          <h1 className="t-primary">Access your account</h1>
          <p style={{color:info.c}}>{info.t}</p>
        </div>
        <form className="form-elements" action="" onSubmit={(e)=>{handleSubmit(e,setInfo)}}>
          <div className="container">
            <div>Your full name</div>
            <div>
              <input
                required
                type="text"
                placeholder="Example Name"
                className="form-comp"
                value={form.name}
                onChange={handleChange}
                name="name"
              />
            </div>
          </div>
          <div className="container">
            <div>Your email address</div>
            <div>
              <input
                required
                value={form.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="example@gmail.com"
                className="form-comp"
              />
            </div>
          </div>
          <div className="container">
            <div>Create a strong password</div>
            <div>
              <input
                required
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="********"
                className="form-comp"
                name="password"
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
          {state}
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

export default Login;
