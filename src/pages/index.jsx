import React, { useState } from "react";

function Radio() {
  const [options, setOptions] = useState([{ id: 
    Date.now(), label: "Option" }]);

  const addOption = () => {
    setOptions([
      ...options,
      { id: Date.now(), label: `Option ${options.length + 1}` },
    ]);
  };
  // smells like ass
  const deleteOption = (id) => {
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const updateLabel = (id, newLabel) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, label: newLabel } : opt))
    );
  };

  return (
    <div className="node">
      <input type="text"
        className="description mb-2"
        contentEditable

        placeholder="Question"
        suppressContentEditableWarning
       />
      
      {options.map((opt, idx) => (
        <div key={opt.id} className="d-flex align-items-center gap-2 mb-2">
          <div
            contentEditable
            suppressContentEditableWarning
        role="input"
            className="w-50 node-border form-label px-2 py-1"
            onBlur={(e) => updateLabel(opt.id, e.target.innerText)}
          >
            
          </div>
          <button
            onClick={() => deleteOption(opt.id)}
            className="btn btn-remove btn-sm btn-danger"
          >
            x
          </button>
        </div>
      ))}

      <button onClick={addOption} className="btn btn-sm rounded btn-add btn-primary">
        Add
      </button>
    </div>
  );
}

let components = {
  description: () => (
    <div className="node">
      <input type="text" placeholder="Question" className="description" />
    </div>
  ),
  input: () => (
    <div className="node">
      <input type="text" placeholder="Question" className="description" />
    </div>
  ),
  checkbox: () => (
    <div className="node">
        <div className="sub-wrapper">
      <input disabled checked type="checkbox" />
      <input type="text" placeholder="Question" className="description" />
      </div>
    </div>
  ),
  options: () => <Radio />,
};
let h;
function Field({ component,type,onDelete }) {
  return (
    <div className="field-container" data-type={type}>
      {component}
      <div className="controller btn-group mt-3" data-id={(h = Date.now() + Math.random())}>
        {type != "checkbox" ? <label className="pbt btn" htmlFor={h}>
          <input id={h} type="checkbox" className="" />
          &nbsp;&nbsp;Required
        </label> : ""}
        <label
          onClick={onDelete}
          style={{ borderRadius: "none !important" }}
          className="pbt btn"
        >
          Delete
        </label>
      </div>{" "}
    </div>
  );
}

const Index = () => {
  const [fields, setFields] = useState([]);

  const insertField = (key) => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        component: components[key](),
        key:key
      },
    ]);
  };

  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (<><main>
    <section className="form-builder container my-5">
      <div className="meta">
        <h1>
          <input
            type="text"
            id="title"
            placeholder="Name this form"
            className="inputs"
          />
        </h1>
        <textarea
          name=""
          className="inputs"
          placeholder="Type to add description"
          id="desc"
        ></textarea>
      </div>
      <hr />
      <div className="sandbox p-3" id="sandbox">
        {fields.map((field) => (
          <Field
            key={field.id}
            type={field.key}
            component={field.component}
            onDelete={() => deleteField(field.id)}
          />
        ))}
      </div>
    </section>
    </main>
    <div className="kit btn-group mt-3" role="group">
    <button
      onClick={() => insertField("input")}
      className="btn"
    >
      Input
    </button>
    <button
      onClick={() => insertField("checkbox")}
      className="btn"
    >
      Checkbox
    </button>
    <button
      onClick={() => insertField("options")}
      className="btn"
    >
      Options
    </button>
    <button
      onClick={() => insertField("description")}
      className="btn "
    >
      Description
    </button>
  </div></>
  );
};

export default Index;
