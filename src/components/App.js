import React, { useReducer, useEffect, useState } from "react";
import "../App.css";
import Header from "./Header";
import Job from "./Job";
import ExpiringJob from "./ExpiringJobs";
import spinner from "../ajax-loader.gif";
import Select from "./Select";
import Filter from "./Filter";
import reducer from "./reducers/reducers"

const JOB_API_URL = "https://nut-case.s3.amazonaws.com/jobs.json";

const initialState = {
  itemsPerPage: 12,
  pageNumbersPerClick : 5,
  loading: true,
  jobs: [],
  expiringJobs: [],
  experience: [],
  location: [],
  company: [],
  totalJobs: 0,
  errorMessage: null
};

let experienceArray = [], locationArray = [], companyArray = [], jobsArray, expiringJobs = []

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Dispatching/adding to state 
  const dispatchSuccessJobs = (response) => {
    dispatch({
      type: "SEARCH_JOBS_SUCCESS",
      payload: {
        jobs: response.data,
        expiringJobs,
        experience: [...new Set(experienceArray)],
        location: [...new Set(locationArray)],
        company: [...new Set(companyArray)],
        totalJobs: response.data.length
      }
    });
  }

  // Hooks to fetch the items and dispatch
  useEffect(() => {
    fetch(JOB_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        jobsArray = jsonResponse.data
        jsonResponse.data.map(data => {
          if(data.experience !== "")
            experienceArray.push(data.experience)
          if(data.location !== "")
            locationArray.push(data.location)
          if(data.companyname !== "")
            companyArray.push(data.companyname)
          if(data.enddate !== "")
            expiringJobs.push(data)
        })
        dispatchSuccessJobs(jsonResponse)  
      })
      .catch(error => {
          dispatch({
            type: "SEARCH_JOBS_FAILURE",
            error: error
          });
      })
  }, []);


  // Select filters
  const select = selectValue => {
    dispatchSuccessJobs({data: jobsArray})
    let selectArray = Object.values(selectValue)
    
    let finalSelectArray = selectArray.filter(Boolean)

    let filterJobs = jobsArray.filter(job => {
      let selectExperience = job.experience;
      let selectLocation = job.location;
      let selectSkills = job.skills;
      
      return finalSelectArray.indexOf(selectExperience) > -1 ||
             finalSelectArray.indexOf(selectLocation) > -1 ||
             finalSelectArray.indexOf(selectSkills) > -1
   });
    dispatchSuccessJobs({data: filterJobs})
  };

  // Filter filters
  const filter = filterValue => {
    dispatchSuccessJobs({data: jobsArray})
    let selectArray = Object.values(filterValue)

    let filterJobs = jobsArray.filter(job => {
      let filterCompany = job.companyname;
      return selectArray.indexOf(filterCompany) > -1   
   });
   dispatchSuccessJobs({data: filterJobs})
   console.log(filterJobs.length)
  };

  // Sorting jobs
  const callSortFunction = e => {
    let sortedJobs = jobs.sort((a, b) => {
      return e.target.value === "location" ?
             a.location.localeCompare(b.location !== "") : 
             a.experience.localeCompare(b.experience)
    });
    dispatchSuccessJobs({data: sortedJobs})
  };

  const [activePage, setActivePage] = useState(1);
  const [currentPagination, setcurrentPagination] = useState(0);
  const [activeClass, setActiveClass] = useState("active");
  const [disableClass, setDisableClass] = useState("disabled");
  
  const { jobs, 
          errorMessage, 
          loading, 
          experience, 
          location, 
          company, 
          totalJobs, 
          itemsPerPage, 
          pageNumbersPerClick
        } = state;

  // Handling the data items display
  const handleClickPage = e => {
    setActiveClass("active")
    setActivePage(Number(e.target.id))
  }

  // Handling the page number display
  const handleClickPrevNext = e => {
    setActivePage(Number(e.target.id) + 1)
    setDisableClass(e.target.id <= 0 ? "disabled" : "")
    setcurrentPagination(Number(e.target.id))
  }

  /////// For All Jobs
  // Logic for displaying items
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = jobs.slice(indexOfFirstItem, indexOfLastItem);

  // Logic for displaying page numbers
  const pageNumbers = [];
   for (let i = 1; i <= Math.ceil(totalJobs / itemsPerPage); i++) {
     pageNumbers.push(i);
  }

  // Logic for displaying pageNumbers
  const indexOfLastItemPage = currentPagination + pageNumbersPerClick;
  const indexOfFirstItemPage = indexOfLastItemPage - pageNumbersPerClick;
  const currentPageNumber = pageNumbers.slice(indexOfFirstItemPage, indexOfLastItemPage);

  const renderPageNumbers = currentPageNumber.map(number => {
  return (
    <span key={number} id={number} className={activePage === number ? `pagination ${activeClass}` : `pagination`} onClick={handleClickPage}>{number}</span>
    );
  });


  /////// For Expiring Jobs
  // Logic for displaying items
  const indexOfLastItemExpiring = activePage * itemsPerPage;
  const indexOfFirstItemExpiring = indexOfLastItemExpiring - itemsPerPage;
  const currentItemExpiring = expiringJobs.slice(indexOfFirstItemExpiring, indexOfLastItemExpiring);

  // Logic for displaying page numbers
  const pageNumbersExpiring = [];
   for (let i = 1; i <= Math.ceil(expiringJobs.length / itemsPerPage); i++) {
     pageNumbersExpiring.push(i);
  }

  // Logic for displaying pageNumbers
  const indexOfLastItemPageExpiring = currentPagination + pageNumbersPerClick;
  const indexOfFirstItemPageExpiring = indexOfLastItemPageExpiring - pageNumbersPerClick;
  const currentPageNumberExpiring = pageNumbersExpiring.slice(indexOfFirstItemPageExpiring, indexOfLastItemPageExpiring);

  const renderPageNumbersExpiring = currentPageNumberExpiring.map(number => {
  return (
    <span key={number} id={number} className={activePage === number ? `pagination ${activeClass}` : `pagination`} onClick={handleClickPage}>{number}</span>
    );
  });


  let filters = {
    experience,
    location,
    company
  }

  return (
    <div className="App">
      <Header text="Job Search Application" />
      <div className="container">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <Select select={select} props={filters}/>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <Filter filter={filter} props={filters}/>
            <div className="form-group sort">
              <label>Sory By: </label>
              <button className="btn btn-success" value="location" onClick={callSortFunction} type="submit">Location</button>
              <button className="btn btn-success" value="experience" onClick={callSortFunction} type="submit">Experience</button> 
            </div>
            <div className="form-group">
              <label>Total Jobs: </label>
              <label>{jobs.length}</label>
            </div>
          </div>
        </div>
        <div className="tabs">
          <div id="tab1" className="tab">
            <ul className="nav nav-tabs">
              <li className="active"><a href="#tab1">Expiring Jobs</a></li>
              <li><a href="#tab2">All Jobs</a></li>
            </ul>
            {/* Rendering expiring Jobs Page number */}
            <div className="container">
              <ul id="page-numbers">
                <span id={currentPagination - 5} className={`pagination ${disableClass}`} onClick={handleClickPrevNext}>&laquo; Previous</span>
                {renderPageNumbersExpiring}
                <span id={currentPagination + 5} className="pagination" onClick={handleClickPrevNext}>&raquo; Next</span>
              </ul>
            </div>
            {/* Rendering expiring jobs */}
            <div className="jobs">
              {loading && !errorMessage ? (
                <img className="spinner" src={spinner} alt="Loading spinner" />
              ) : errorMessage ? (
                <div className="errorMessage">{errorMessage}</div>
              ) : (
                currentItemExpiring.length > 0 ? 
                  currentItemExpiring.map((job, index) => (
                    <Job key={`${index}-${job._id}`} job={job} />
                  ))
                : <div className="errorMessage">No Jobs Found</div>
              )}
            </div>           
          </div>
          <div id="tab2" className="tab">
            <ul className="nav nav-tabs">
              <li><a href="#tab1">Expiring Jobs</a></li>
              <li className="active"><a href="#tab2">All Jobs</a></li>
            </ul>
            {/* Rendering All Jobs Page number */}
            <div className="container">
              <ul id="page-numbers">
                <span id={currentPagination - 5} className={`pagination ${disableClass}`} onClick={handleClickPrevNext}>&laquo; Previous</span>
                {renderPageNumbers}
                <span id={currentPagination + 5} className="pagination" onClick={handleClickPrevNext}>&raquo; Next</span>
              </ul>
            </div>
            {/* Rendering the all jobs */}
            <div className="jobs">
              {loading && !errorMessage ? (
                <img className="spinner" src={spinner} alt="Loading spinner" />
              ) : errorMessage ? (
                <div className="errorMessage">{errorMessage}</div>
              ) : (
                currentItem.length > 0 ? 
                  currentItem.map((job, index) => (
                    <Job key={`${index}-${job._id}`} job={job} />
                  ))
                : <div className="errorMessage">No Jobs Found</div>
              )}
            
            </div>
          </div>         
        </div>
      </div>  
    </div>     
  );
};

export default App;
