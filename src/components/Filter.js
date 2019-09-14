import React, { useState } from "react";

const Filter = ({ filter, props }) => {
  const [state, setState] = useState({
    companyFilter: ""
  });
  
  const handleFilterInputChanges = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const callFilterFunction = e => {
    e.preventDefault();
    filter(state)
  };

  const { company } = props;

  return (
    <form>
      <div className="form-group">
       <label htmlFor="companyFilter">Select Company</label>
        <select 
          className="form-control" 
          name="companyFilter" 
          id="companyFilter" 
          onChange={handleFilterInputChanges} 
          value={state.companyFilter}
        >
          <option value="0">Select Company</option>
          {company.length > 0 ?
            (
              company.map((comp, index) => (
                <option key={`${index}-${comp}`} value={comp}>{comp}</option>
              ))
            ) : <option value="0">Select Company</option>
          }
        </select>
      </div>
      <button className="btn btn-primary" onClick={callFilterFunction} type="submit">Filter</button>
    </form>
  );
};

export default Filter;
