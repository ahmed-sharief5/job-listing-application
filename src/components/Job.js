import React from "react";

const Job = ({ job }) => {
  return (
    <a href={job.applylink} target="_blank" rel="noopener noreferrer">
      <div className="col-lg-3 col-md-3 col-sm-2 job job-card">
        <h4 className="crop black-color">{job.title}</h4>
        <p className="crop">{job.jd}</p>
        <p className="crop">{job.companyname}</p>
        <p className="crop">{job.experience}</p>
        <h5 className="crop black-color">{job.location}</h5>
      </div>
    </a>
    
  );
};

export default Job;
