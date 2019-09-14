const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_JOBS_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_JOBS_SUCCESS":
      return {
        ...state,
        loading: false,
        jobs: action.payload.jobs,
        experience: action.payload.experience,
        location: action.payload.location,
        company: action.payload.company,
        totalJobs: action.payload.totalJobs
      };
    case "SEARCH_JOBS_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};


export default reducer;
