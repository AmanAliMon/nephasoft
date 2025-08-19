import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";

function Export(a, b, title) {
  const questions = a;
  const responses = [];
  for(let B of b){
    const beta   = new Set();
    console.log(B["response_data"]);
    let q = []
    for(let p of JSON.parse(B["response_data"])){
        console.log(p);
        
        if(!beta.has(p.i)){
            beta.add(p.i)
            q.push(p)
        }
    }
    responses.push({response_data:q,submitted_at:new Date(B["submitted_at"]).toLocaleString()})
  }

  const idToQuestion = Object.fromEntries(
    questions.map(q => [q.id.toString(), q.question])
  );

  const headers = ["Submitted At", ...questions.map(q => q.question)];
console.log(responses);

  const rows = responses.map(r => {
    const parsed = r.response_data;
    const answerMap = {};

    parsed.forEach(({ i, a }) => {
      const key = i.toString();
      const val = a == null ? "" : String(a);
      if (answerMap[key]) answerMap[key] += `,${val}`;
      else answerMap[key] = val;
    });

    return [
      r.submitted_at,
      ...questions.map(q => answerMap[q.id.toString()] || "")
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(val => `"${val}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [meta, setMeta] = useState({});
  const [questions, setQuestions] = useState([]);
  const { identifier } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/responses/${identifier}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.admin == 0){
          document.body.innerText = ("404 page not found")
          return;
        }
        if(data.failure){
          location.href = "/login"
        }
        setResponses(data.responses || []); 
        setMeta(data.meta)
        setQuestions(data.questions || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
<main>
      <div className="shaded strip">
        <div>
          <div className="logo"><Link to="/">Form Mon</Link></div>
        </div>
        <div>
          <button className="btn pbt" id="export" onClick={()=>{Export(questions,responses,meta.title)}}>
            Export
          </button>
          <button
            onClick={() => {location.href = `/delete/${identifier}`}}
            className="btn pbt"
            id="link"
          >
            Delete          </button>
        </div>
      </div>

<div className="container mt-4">

        <h1 className="m-0" style={{color:"var(--primary)"}}>{meta.title}</h1>
        <p className="m-0 lead">{meta.description}</p>
        <span className="text-muted">Created at: {new Date(meta.created_at).toLocaleString()}</span>
        <hr />
        <div style={{minWidth:"100%",overflowX:"auto"}}>
      <table style={{minWidth:"100%"}} className="table-auto mt-4 mb-5 border w-full">
        <thead>
            <tr className="border-b bold-td">
        <td className="border px-4 py-2">Submission</td>

          {
            questions.map(e=>
            (
                <td key={e.id}  className="border px-4 py-2">{e.question}</td>
            )
            )
          }</tr>
        </thead>
        <tbody>
          {responses.map((response, index) => {
            const data = JSON.parse(response["response_data"]);
            return (
           <tr key={index} className="border-b">
            <td className="border px-4 py-2">{new Date(response.submitted_at).toLocaleString()}</td>
  {(() => {
    const Squestions = new Set(); // Moved outside
    return data.map((item, j) => {
      if (!Squestions.has(item.i)) {
        Squestions.add(item.i);
        return (
          <td key={j} className="border px-4 py-2">
            {String(item.a??"")}
          </td>
        );
      }
      return null;
    });
  })()}
</tr>

            );
          })}
        </tbody>
      </table></div>
    </div>
  </main>);
};

export default Responses;
