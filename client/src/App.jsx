import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Preview from "./pages/Preview";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/Resumebuilder";
import Login from "./pages/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import CareerPath from "./Components/CareerPath";
import Jobs from "./Components/Jobs";
import api from "./configs/api";
import { login, setLoading } from "./app/Feautes/authSlice";
export default function App() {
  const dispatch = useDispatch();
  // const getUserData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     if (token) {
  //       const { data } = await api.get("/api/users/data", {
  //         headers: { Authorization: token },
  //       });
  //       if (data.user) {
  //         dispatch(login({ token, user: data.user }));
  //         dispatch(setLoading(false));
  //       } else {
  //         dispatch(setLoading(false));
  //       }
  //     }
  //   } catch (e) {
  //     dispatch(setLoading(false));
  //     console.log(e.message);
  //   }
  // };
  const getUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      const { data } = await api.get("/api/users/data", {
        headers: { Authorization: token },
      });

      if (data.user) {
        dispatch(login({ token, user: data.user }));
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
           <Route path="career-path" element={<CareerPath />} />
        <Route path="jobs" element={<Jobs />} />
        </Route>

       

        <Route path="/view/:resumeId" element={<Preview />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
