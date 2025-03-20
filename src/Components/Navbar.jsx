import React, { PureComponent } from 'react'

export default class Navbar extends PureComponent {
    
  render() {
    return (
        <section className='relative z-50 flex text-center justify-center'>
          <nav className='fixed text-center grid grid-cols-5 text-sm lg:text-lg items-center lg:mt-6 h-14 lg:border-2 w-full lg:w-3/5 rounded-none lg:rounded-3xl sm:divide-x divide-gray-600 bg-slate-700 bg-opacity-60 backdrop-blur-lg leading-none'>
              <div className='nav-item nav-item-begining'>
                <button>
                  <a href="#Hero">Home</a>
                </button>
              </div>
              <div className='nav-item'>
                <button>
                  <a href="#About">About</a>
                </button>
              </div>
              <div className='nav-item'>
                <button>
                  <a href="#Experience">Experience</a>
                </button>
              </div>
              <div className='nav-item'>
                <button>
                  <a href="#Projects">Projects</a>
                </button>
              </div>
              <div className='nav-item nav-item-end'>
                <button>
                  <a href="#Contact">Contact</a>
                </button>
              </div>
          </nav>
        </section>

    )
  }
}
