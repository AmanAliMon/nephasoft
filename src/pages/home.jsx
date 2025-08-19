import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Index from './index'

function Alert(params) {
  document.getElementById("alerts").innerHTML = `<div class="alert alert-primary" role="alert">
  <div><p class="lead">${params}</p></div>
  <button onclick="this.closest('.alert').remove()">x</button>

</div>`+  document.getElementById("alerts").innerHTML
}
function postCompiled(setDisabled,setURL) {
    if(!document.getElementById("title")?.value || !document.getElementById("desc")?.value  ){
    Alert("Title and description required")
    return;
  }
  let data = {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value
  };
  let qs = [];
  let nodes = Array.from(document.querySelectorAll(".field-container"));
  for (let node of nodes) {
    let dt = node.getAttribute("data-type");
    let y = {};
    if (dt == "input") {
      y.question = node.querySelector("input[type='text']").value;
      y.mode = node.querySelector("input[type='checkbox']").checked;
      y.type = "input";
      console.log(y);
    } else if (dt == "description") {
      y.question = node.querySelector("input[type='text']").value;
      y.mode = node.querySelector("input[type='checkbox']").checked;
      y.type = "descriptive";
      console.log(y);
    } else if (dt == "checkbox") {
      y.question = node.querySelector("input[type='text']").value;
      y.type = "checkbox";
      console.log(y);
    } else if ((dt = "options")) {
      y.question = node.querySelector("input[type='text']").value;
      y.options = Array.from(node.querySelectorAll("div[role='input']")).map(
        (e) => e.innerText
      );
      y.mode = node.querySelector("input[type='checkbox']").checked;
      y.type = "options";
    }
if(y?.question){
    qs.push(y);}else{
      Alert("Ignoring empty field")
      node.classList.add("empty-field")
    }
  }
  if(qs.length == 0){
    Alert("Cannot publish empty form")
    return;
  }
  data["questions"] = qs;
    console.log(data);
  let c = document.getElementById("publish")
  c.classList.add("btn-checked")
  c.setAttribute("disabled","true")
  Alert("From uploaded successfully")

    fetch(`${import.meta.env.VITE_API_URL}/form/new`, {
      method: 'POST',
      credentials:'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(d =>{ console.log('Response:', d);setDisabled(false);setURL(d["identifier"]);})
    .catch(err => console.error('Error:', err));
}
const Home = () => {
  const [count, setCount] = useState(0);
  const [isDisabled, setDisabled] = useState(true);
  const [_URL, setURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logged`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.failure) {
          navigate('/login');
        }
      } catch (err) {
        console.error("Error checking session", err);
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
      <div className="strip">
        <div>
          <div className="logo"><Link to="/">Form Mon</Link></div>
        </div>
        <div>
          <button className="btn pbt" id="publish" onClick={() => postCompiled(setDisabled, setURL)}>
            Publish
          </button>
          <button
            disabled={isDisabled}
            onClick={(e) => {navigator.clipboard.writeText(`http://localhost:5173/form/${_URL}`);e.currentTarget.innerText = "Copied"}}
            className="btn pbt"
            id="link"
          >
            Copy Link
          </button>
        </div>
      </div>

      <Index />
      <section className="alerts" id='alerts'>
      </section>
    </>
  );
};

export default Home;
