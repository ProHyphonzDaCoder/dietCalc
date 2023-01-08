// Create a react component that inputs a textarea message then performs a fetch request to localhost:3001, gets back a response as data.message and displays that message in a box below

// import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
// import Highlight from "react-highlight-js";
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInput(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);
    console.log("stringify", JSON.stringify(input))
    fetch(`http://localhost:3001?object=${JSON.stringify(input)}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setResponse(data["answer"]); 
      })
  };
  

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label>Age (Years)</label><br/>
        <input type="number" name="age" onChange={handleChange} value={input.age || ""} /><br/>

        <label>Height (CM)</label><br/>
        <input type="number" name="height" onChange={handleChange} value={input.height || ""}/><br/>

        <label>Weight (KG)</label><br/>
        <input type="number" name="weight" onChange={handleChange} value={input.weight || ""}/><br/>

        <label>Activity Level (Hours)</label><br/>
        <input type="number" name="activityLevel" onChange={handleChange} value={input.activityLevel || ""}/><br/>

        <label>Gender (Male/Female)</label><br/>
        <input type="text" name="gender" onChange={handleChange} value={input.gender || ""}/><br/>
        
        <input type="submit" />
      </form>
      <p id="results">{response}</p>
    </React.Fragment>
  );
}

export default App;