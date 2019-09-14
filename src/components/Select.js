import React, { useState } from "react";

const Select = ({ select, props }) => {
  const [state, setState] = useState({
    experienceSelect: "",
    locationSelect: "",
    skillSelect: ""
  });
  
  const handleSelectInputChanges = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const callSelectFunction = e => {
    e.preventDefault();
    select(state)
  };

  const { experience, location } = props;

  return (
    <form>
      <div className="form-group">
      <label htmlFor="experienceSelect">Experience</label>
      {/* <input
        value={state.experienceSelect}
        name="experienceSelect"
        onChange={handleSelectInputChanges}
        type="text"
      /> */}
      <select 
        className="form-control" 
        name="experienceSelect" 
        id="experienceSelect" 
        onChange={handleSelectInputChanges} 
        value={state.experienceSelect}
        >
        <option value="0">Select Experience</option>
        {experience.length > 0 ?
          (
            experience.map((exp, index) => (
              <option key={`${index}-${exp}`} value={exp}>{exp}</option>
            ))
          ) : <option value="0">Select Experience</option>
        }
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="locationSelect">Location</label>
      {/* <input
        value={state.locationSelect}
        name="locationSelect"
        onChange={handleSelectInputChanges}
        type="text"
      /> */}
      <select 
        className="form-control" 
        name="locationSelect" 
        id="locationSelect" 
        onChange={handleSelectInputChanges} 
        value={state.locationSelect}
        >
        <option value="0">Select Location</option>
        {location.length > 0 ?
          (
            location.map((loc, index) => (
              <option key={`${index}-${loc}`} value={loc}>{loc}</option>
            ))
          ) : <option value="0">Select Location</option>
        }
      </select>
      </div>
      <div className="form-group">
        <label htmlFor="skillSelect">Skills</label>
        <input
          id="skillSelect"
          value={state.skillSelect}
          name="skillSelect"
          className="form-control" 
          aria-describedby="emailHelp" 
          placeholder="Enter the skills"
          onChange={handleSelectInputChanges}
          type="text"
        />
        <br></br>
        <button className="btn btn-primary" onClick={callSelectFunction} type="submit">Search</button>
      </div>
    </form>
  );
};

export default Select;
