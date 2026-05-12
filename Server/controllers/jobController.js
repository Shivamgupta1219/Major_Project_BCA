// import fetch from "node-fetch";

// export const getJobs = async (req, res) => {
//   try {
//     const {
//       query = "developer jobs in india",
//       page = 1,
//       country = "in",
//       date_posted = "all",
//       employment_types,
//     } = req.query;

//     const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&country=${country}&date_posted=${date_posted}${
//       employment_types ? `&employment_types=${employment_types}` : ""
//     }`;

//     const options = {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
//         "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//       },
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();


//     const jobs = data.data.map((job) => ({
//       title: job.job_title,
//       company: job.employer_name,
//       location: job.job_city || job.job_country,
//       description: job.job_description,
//       apply_link: job.job_apply_link,
//       salary: job.job_salary || "Not disclosed",
//     }));

//     return res.json({ jobs });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Failed to fetch jobs" });
//   }
// };

// export const getJobs = async (req, res) => {
//   try {
//     const {
//       query = "developer",
//       location = "india",
//       country = "in",
//       work_from_home = false,
//     } = req.query;

//     const url = `https://jsearch.p.rapidapi.com/search?query=${query}&location=${location}&country=${country}&work_from_home=${work_from_home}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
//         "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//       },
//     });

//     const data = await response.json();

//     const jobs = data.data.map((job) => ({
//       title: job.job_title,
//       company: job.employer_name,
//       location: job.job_city || job.job_country,
//       description: job.job_description,
//       apply_link: job.job_apply_link,
//       salary: job.job_salary || "Not disclosed",
//     }));

//     res.json({ jobs });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error fetching jobs" });
//   }
// };
export const getJobs = async (req, res) => {
  try {
    const {
      query = "developer",
      location = "india",
      country = "in",
      page = 1, 
    } = req.query;

    const url = `https://jsearch.p.rapidapi.com/search?query=${query}&location=${location}&country=${country}&page=${page}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const data = await response.json();

    const jobs = data.data.map((job) => ({
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      description: job.job_description,
      apply_link: job.job_apply_link,
      salary: job.job_salary || "Not disclosed",
    }));

    res.json({
      jobs,
      total: data.total || 0, 
      page: Number(page),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};