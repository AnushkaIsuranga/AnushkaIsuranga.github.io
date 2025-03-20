import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Me from '../assets/my_pic.webp';
import { FaReact } from 'react-icons/fa';
import { SiCplusplus, SiTailwindcss, SiTypescript, SiJquery, SiSpringboot, SiCsharp, SiHtml5, SiJavascript, SiCss3, SiR, SiPhp, SiPython, SiKotlin, SiBootstrap } from 'react-icons/si';

export default class About extends PureComponent {
  static propTypes = {}

  render() {
    return (
      <section id='About' className='relative mt-0 scroll-mt-5 bg-[rgb(16,17,14)] text-white z-20'>
        <div className='p-10 lg:p-24'> {/* Added a light background for contrast */}
          <h1 className='text-4xl text-center md:text-5xl font-semibold font-mono mb-7 text-white'>
            <b>About Me</b>
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-8'>
            {/* Profile Picture */}
            <div className='flex justify-center'>
              <div
                className='h-60 lg:h-96 w-60 lg:w-96 border-4 border-gray-200 shadow-lg bg-cover bg-center rounded-full transform transition-transform duration-300 hover:scale-105'
                style={{ backgroundImage: `url(${Me})` }}
              ></div>
            </div>

            {/* Personal Details and Description */}
            <div className='text-sm lg:text-lg text-gray-300'>
              <p className='text-justify mb-6 leading-relaxed'>
                I’m a passionate <span className='font-mono font-bold text-white'><b>NIBM student</b></span> studying software engineering, with expertise in <span className='font-mono font-bold text-white'><b>Java, C#, and JavaScript</b></span>. Known for my <span className='font-mono font-bold text-white'><b>project management</b></span> skills, <span className='font-mono font-bold text-white'><b>strong communication</b></span>, and love for learning new technologies, I thrive both <span className='font-mono font-bold text-white'><b>independently</b></span> and in <span className='font-mono font-bold text-white'><b>collaborative teams</b></span>. I’m dedicated to driving innovation and delivering high-quality results in every project.
              </p>

              {/* Personal Details */}
              <div className='bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100'>
                <div className='space-y-3'>
                  <p className='flex items-center'>
                    <span className='font-semibold text-white min-w-[120px]'>Name:</span>
                    <span className='text-white'>Anushka Isuranga Bandara</span>
                  </p>
                  <p className='flex items-center'>
                    <span className='font-semibold text-white min-w-[120px]'>Date of Birth:</span>
                    <span className='text-white'>January 15, 2006</span>
                  </p>
                  <p className='flex items-center'>
                    <span className='font-semibold text-white min-w-[120px]'>Address:</span>
                    <span className='text-white'>Matale, Sri Lanka</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-blue-900 p-5'>
          <h1 className='langframe-topics'><b>Languages in Common</b></h1>
          <div className='flex justify-center gap-6 lg:gap-10 pb-8 flex-wrap'>
            <button className='langframe-buttons'><SiCsharp />C#</button>
            <button className='langframe-buttons'><SiHtml5 />HTML</button>
            <button className='langframe-buttons'><SiJavascript />Javascript</button>
            <button className='langframe-buttons'><SiCss3 />CSS</button>
            <button className='langframe-buttons'><SiCplusplus />C++</button>
            <button className='langframe-buttons'><SiPhp />PHP</button>
            <button className='langframe-buttons'><SiPython />Python</button>
            <button className='langframe-buttons'><SiKotlin />Kotlin</button>
          </div>
          <h1 className='langframe-topics'><b>Frameworks</b></h1>
          <div className='flex justify-center gap-6 md:gap-10 pb-8 flex-wrap'>
            <button className='langframe-buttons'><FaReact />React</button>
            <button className='langframe-buttons'><SiTailwindcss />Tailwind</button>
            <button className='langframe-buttons'><SiTypescript />Typescript</button>
            <button className='langframe-buttons'><SiJquery />JQuery</button>
            <button className='langframe-buttons'><SiSpringboot />Springboot</button>
            <button className='langframe-buttons'><SiBootstrap />Bootstrap</button>
          </div>
        </div>
      </section>
    );
  }
}
