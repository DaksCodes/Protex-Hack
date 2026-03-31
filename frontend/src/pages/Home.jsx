import React from "react";
import Carousel from "../components/Carousel";
import About from "../components/About";
import Facts from "../components/Facts";
import Features from "../components/Features";
import Services from "../components/Services";
import CallBack from "../components/CallBack";
import Projects from "../components/Projects";
import Team from "../components/Team";
import Testimonial from "../components/Testimonial";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
    <Header />
      <Carousel />
      <About />
      <Facts />
      <Features />
      <CallBack />
      <Team />
      <Testimonial />
    </>
  );
};

export default Home;
