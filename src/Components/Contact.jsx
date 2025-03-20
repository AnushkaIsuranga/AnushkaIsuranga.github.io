import React, { PureComponent } from 'react';
import emailjs from 'emailjs-com';
import { SiFacebook, SiGithub, SiInstagram, SiLinkedin, SiWhatsapp } from 'react-icons/si';

export default class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      isSending: false,
      successMessage: '',
      errorMessage: ''
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = this.state;
    this.setState({ isSending: true, successMessage: '', errorMessage: '' });

    emailjs
    .sendForm('service_q0gnjbi', 'template_cyhg4at', e.target, 'nDNf3GocCkCuyD2ii')  
      .then(
        (result) => {
          this.setState({
            isSending: false,
            successMessage: 'Message sent successfully!',
            name: '',
            email: '',
            message: ''
          });
        },
        (error) => {
          this.setState({
            isSending: false,
            errorMessage: 'There was an error sending the message. Please try again later.'
          });
        }
      );
  };

  render() {
    const { name, email, message, isSending, successMessage, errorMessage } = this.state;

    return (
      <section id="Contact" className="antialiased bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white relative items-center">
        <div className="grid grid-cols-1 gap-x-9 md:grid-cols-2 items-center p-12 pb-8">
          <form onSubmit={this.handleSubmit} className="bg-white text-gray-800 w-full h-full p-8 rounded-lg shadow-lg">
            <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-md text-white text-2xl md:text-3xl font-mono font-bold mb-6">
              Contact Me
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={this.handleChange}
                  rows="5"
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 text-white font-medium rounded-md shadow-lg bg-slate-700 transform transition duration-1000 hover:bg-indigo-600 focus:ring"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </form>

          {/* Contact Details */}
          <div className="w-full text-left md:text-center space-y-6 p-3 pr-0 mr-0 transform transition duration-500">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-center text-white">
              Contact Details
            </h2>
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <p className="text-sm sm:text-md md:text-lg">
                  <a
                    href="mailto:isuranga880@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transform transition hover:text-indigo-400"
                  >
                    isuranga880@gmail.com
                  </a> | <a
                    href="https://wa.me/+94771732201"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transform transition hover:text-indigo-400"
                  >
                    +94 77 173 2201
                  </a>
                </p>
              </div>
              <div className="flex justify-center">
                <ul className="flex space-x-6 text-2xl items-center">
                  <li>
                    <a
                      href="https://github.com/AnushkaIsuranga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-400 transform transition duration-300 hover:scale-110"
                      aria-label="GitHub"
                    >
                      <SiGithub />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/anushka-isuranga/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-400 transform transition duration-300 hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <SiLinkedin />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/aka_andy_780/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-400 transform transition duration-300 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <SiInstagram />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://web.facebook.com/anush.780/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-400 transform transition duration-300 hover:scale-110"
                      aria-label="Facebook"
                    >
                      <SiFacebook />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/+94771732201"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-400 transform transition duration-300 hover:scale-110"
                      aria-label="WhatsApp"
                    >
                      <SiWhatsapp />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs md:sm pb-8 pt-0">
          <p>&copy; {new Date().getFullYear()} Anushka Isuranga. All Rights Reserved.</p>
        </footer>
      </section>
    );
  }
}