import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { TypeAnimation } from "react-type-animation";
import Cover from "../assets/intro_bg.webp";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default class Hero extends PureComponent {
  render() {
    return (
      <section
        id="Hero"
        className="h-screen w-full bg-center bg-cover bg-no-repeat flex p-6 flex-col items-center justify-center relative z-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.2), rgba(16,17,14)100%, rgb(16,17,14)100%), url(${Cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold pb-6 text-white tracking-wide">
            Hi, I&apos;m{" "}
            <span className="text-indigo-500 bg-white px-2 rounded-md">
              Anushka
            </span>
          </h1>

          {/* Typing Animation */}
          <TypeAnimation
            className="text-xl lg:text-2xl font-medium font-mono text-gray-300"
            sequence={[
              "I develop Desktop Applications",
              1500,
              "I develop Mobile Applications",
              1500,
              "I develop Web Applications",
              1500,
            ]}
            wrapper="span"
            speed={30}
            repeat={Infinity}
          />
        </div>

        {/* Social Links */}
        <div className="flex space-x-6 mt-10">
          {[
            {
              href: "https://www.linkedin.com/in/anushka-isuranga/",
              icon: <FaLinkedin />,
            },
            {
              href: "https://www.instagram.com/aka_andy_780/",
              icon: <FaInstagram />,
            },
            {
              href: "https://github.com/AnushkaIsuranga",
              icon: <FaGithub />,
            },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-indigo-500 transition duration-300"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Download CV Button */}
        <a
          href="https://drive.google.com/file/d/1YLrJRjw-5h3Ytc1cRK1eyC3AzJbvg8Df/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 px-6 py-3 text-lg lg:text-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-lg transition-all duration-300"
        >
          Download CV
        </a>
      </section>
    );
  }
}
