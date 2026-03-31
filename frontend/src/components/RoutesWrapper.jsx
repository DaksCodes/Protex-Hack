import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Feature from "../pages/Feature.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import Project from "../pages/Project.jsx";
import Service from "../pages/Service.jsx";
import Team from "../pages/Team.jsx";
import Testimonial from "../pages/Testimonial.jsx";
import Copyright from "./Copyright.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

const RoutesWrapper = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/service" element={<Service />} /> */}
        {/* <Route path="/project" element={<Project />} /> */}
        <Route path="/feature" element={<Feature />} />
        <Route path="/team" element={<Team />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <Footer /> */}
      <Copyright />
    </>
  );
};

export default RoutesWrapper;
