import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
function formatDateTime(datetimeString) {
  const date = new Date(datetimeString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString();
  }
}

function compressor(x, z) {
  let y = x.slice(0, z);
  x.length != y.length ? (y += "...") : "";
  return y;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log(data.results);
        setForms(data.results);
        console.log(data.user);

        setUser(data.user);

        if (data.failure === false) {
          setLoading(false);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <main>     
        <div className="strip">
        <div>
          <div className="logo"><Link to={"/"}>Form Mon</Link></div>
        </div>
        <div>
          <button
            onClick={() => {location.href = `/logout`}}
            className="btn pbt"
            id="link"
          >
            Logout          </button>
        </div>
      </div>
    <div className="container">
      <div className="mb-4 mt-4">
        <div className="display-4">Hey! {user}</div>
        <p className="lead mt-1">
          This is your dashboard. Here you can update your profile, create new
          forms and also view responses for existing one's!
        </p>
      </div>
      <div className="container d-flex mb-3" style={{ alignItems: "center" }}>
             <Link to="/new"><button className="pbt btn">Create new form</button></Link>
             <Link to="/updatepassword"><button className="ml-2 pbt btn">Update Password</button></Link>
   
      </div>
      <div className="container">
        <h1 className="display-4">Your Library</h1>

        <div className="container">
          <table className="table">
            <thead>
              <tr className="bold-td">
                <th>Title</th>
                <th>Description</th>
                <th>Submissions</th>
                <th>Date created</th>
                <th>URL</th>
                <th>Responses</th>
              </tr>
            </thead>
            {forms.length > 0 ? (
              <tbody>
                {forms.map((form, index) => (
                  <tr key={index}>
                    <td title={form.form_title}>
                      {compressor(form.form_title, 20)}
                    </td>
                    <td title={form.form_description}>
                      {compressor(form.form_description, 30)}
                    </td>
                    <td>{form.submission_count}</td>
                    <td>{formatDateTime(form.created_at)}</td>
                    <td>
                      <Link to={`/form/${form.identifier}`}>
                        localhost:5173/form/{form.identifier}
                      </Link>
                      <span
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `http://localhost:5173/form/${form.identifier}`
                          )
                        }
                        className="text-muted ml-2"
                        style={{ cursor: "pointer" }}
                      >
                        Copy
                      </span>
                    </td>
                    <td>
                      <Link to={`/responses/${form.identifier}`}>View All</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6">No forms found</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  </main>
);
};

export default Dashboard;
