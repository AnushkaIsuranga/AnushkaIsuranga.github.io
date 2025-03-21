import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import HMS from '../assets/HMS.png'
import { FiGithub, FiGlobe } from 'react-icons/fi';

export default class Projects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedProject: null,
    };
  }

  handleCardClick = (projectIndex) => {
    this.setState({ selectedProject: projectIndex });
  };

  closeModal = () => {
    this.setState({ selectedProject: null });
  };

  render() {
    const { selectedProject } = this.state;

    const projects = [
      {
        title: "Duskwood Hospital Appointment System",
        image: HMS,
        description: "A system developed for a hospital to manage appointments and patient records.",
        detailedDescription: `This system was developed using <b>React, MySQL, and Spring Boot</b>. It allows patients to <b>book appointments</b> with doctors and manage their medical records. Doctors can <b>view their appointments</b> and manage patient records. Admins can <b>manage doctors, patients, appointments, and generate reports</b>. The system also includes an <b>email system</b> to remind patients of their appointments. The project was developed to demonstrate the use of <b>data structures and algorithms</b> in applications and the use of <b>RESTful APIs</b>.`,
        githubRepo: "https://github.com/AnushkaIsuranga/Hospital_Appointment_System",
        liveDemo: "https://hospital-appointment-system-delta.vercel.app/",
      },
    ];
    
    return (
      <section id="Projects" className="antialiased bg-gray-100 text-gray-800 p-10 pb-24 pt-0 relative scroll-mt-24 z-40">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center rounded-3xl bg-slate-700 p-5 text-white text-3xl md:text-5xl font-semibold font-mono">
            <b>Projects</b>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
              <div
                key={index}
                onClick={() => this.handleCardClick(index)}
                className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-transform ${
                  selectedProject === index ? "scale-105" : "hover:scale-105"
                }`}
              >
                <div 
                  className="h-48 bg-gray-300 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}/>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-blue-950">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal */}
        {selectedProject !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={this.closeModal} // Close modal when clicking outside
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-lg w-full h-1/2 sm:h-fit relative m-3 md:m-0"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={this.closeModal} // Close modal when clicking the close button
                className="absolute text-2xl top-2 right-4 text-gray-500 transition-colors hover:text-gray-800"
              >
                &times;
              </button>
              <div
                className="sm:h-48 h-40 bg-gray-300 rounded-t-lg flex items-center justify-center"
                style={{
                  backgroundImage: `url(${projects[selectedProject].image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="overflow-y-auto max-h-48 p-6">
                <h4 className="text-lg font-semibold text-gray-800">
                  {projects[selectedProject].title}
                </h4>
                <p
                  className="text-sm text-gray-700 mt-4 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: projects[selectedProject].detailedDescription,
                  }}
                />
                <p className="text-lg text-gray-700 mt-4 inline-flex space-x-4">
                  <a
                    href={projects[selectedProject].githubRepo}
                    className="text-gray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiGithub />
                  </a>
                  <a
                    href={projects[selectedProject].liveDemo}
                    className="text-gray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiGlobe />
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}


      </section>
    )
  }
}
