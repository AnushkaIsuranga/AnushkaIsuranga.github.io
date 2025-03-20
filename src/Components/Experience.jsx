import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

export default class Experience extends PureComponent {
  static propTypes = {}

  render() {
    return (
      <section id='Experience' className='antialiased bg-gray-100 text-gray-800 p-10 pb-24 pt-24 relative sm:-mb-12 z-20'>
          <div className='relative container mx-auto px-6 flex-col space-y-8'>
            <div className='relative text-center z-10 rounded-3xl bg-slate-700 p-5 text-white text-3xl md:text-5xl font-semibold font-mono'><b>My Journey</b></div>
            <div className='absolute z-0 w-2 h-[97%] sm:h-[95%] bg-slate-700 shadow-md inset-0 left-[68px] md:mx-auto md:right-0 md:left-0'></div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container'>
                <div className='timeline-pointer' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>Mar 2024 - Present · 9 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    National Institute of Business Management (NIBM - Sri Lanka)
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    Student (Higher National Diploma in Software Engineering)
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                  Pursuing advanced knowledge in software engineering, with a focus on practical skills and industry-relevant tools.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container timeline-container-left'>
                <div className='timeline-pointer timeline-pointer-left' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>Jan 2023 - Mar 2024 · 1 yr 3 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    National Institute of Business Management (NIBM - Sri Lanka)
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    Student (Diploma in Computer System Designing)
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                    Gained foundational knowledge in IT, programming, and system development. Developed communication skills through presentations and team projects.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container'>
                <div className='timeline-pointer' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>Jun 2023 - Present · 1 yr 4 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    St. Sylvester&apos;s College
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    Vice President of Technology Society
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                    Led initiatives to promote technology awareness and skill development. Collaborated with a team to organize impactful events for students.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container timeline-container-left'>
                <div className='timeline-pointer timeline-pointer-left' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>Apr 2023 - May 2024 · 1 yr 2 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    St. Sylvester&apos;s College
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    Committee Member of IT Society
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                    Contributed to organizing workshops and events, connecting students with industry experts, and supporting the ICT unit.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container'>
                <div className='timeline-pointer' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>May 2022 - Aug 2022 · 4 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    National Institute of Business Management (NIBM - Sri Lanka)
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    Student (Certificate in Software Engineering)
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                    Learned software engineering fundamentals, including programming and system design, while collaborating on team projects.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='timeline-icon'></div>
              <div className='timeline-container timeline-container-left'>
                <div className='timeline-pointer timeline-pointer-left' aria-hidden='true'></div>
                <div className='bg-white p-6 rounded-md shadow-md'>
                  <span className='text-indigo-600 tracking-wide'>Feb 2017 - Jun 2018 · 1 yr 6 mos</span>
                  <h1 className='text-xl lg:text-2xl font-bold pt-1 text-blue-950'>
                    Esoft Metro Collage (Matale)
                  </h1>
                  <h2 className='lg:text-xl pt-1 text-slate-700'>
                    DiTEC (Diploma in Information Technology)
                  </h2>
                  <p className='text-sm lg:text-base pt-2'>
                    Gained basic knowlegde of Information and Communication Technology.
                  </p>
                </div>
              </div>
            </div>
            <div className='relative p-2 z-10'>
              <div className='h-20 w-20 sm:mt-10  shadow-md border-4 border-white xs:mb-10 md:mx-auto md:right-0 md:left-0 rounded-3xl bg-slate-700 '></div>
            </div>
          </div>
      </section>
    )
  }
}
