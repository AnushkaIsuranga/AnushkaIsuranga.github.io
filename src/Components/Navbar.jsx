import React, { PureComponent } from 'react'

export default class Navbar extends PureComponent {
    
  render() {
    return (
        <section className='flex text-center justify-center'>
            <nav className='fixed text-center grid grid-cols-4 gap-4 items-center mt-6 h-14 border-2 rounded-3xl bg-slate-700 opacity-90 hover:opacity-100 transition-opacity duration-200'>
                <div className='bg-blue-800 rounded-3xl w-20 p-1 ml-3 border-0 hover:border-2  transition-all duration-400 text-white font-semibold cursor-pointer'>
                About
                </div>
                <div className='bg-blue-800 rounded-3xl p-1 border-0 hover:border-2  transition-all duration-400 text-white font-semibold cursor-pointer'>
                Experience
                </div>
                <div className='bg-blue-800 rounded-3xl p-1 border-0 hover:border-2  transition-all duration-400 text-white font-semibold cursor-pointer'>
                Projects
                </div>
                <div className='bg-blue-800 rounded-3xl p-1 mr-3 border-0 hover:border-2  transition-all duration-400 text-white font-semibold cursor-pointer'>
                Contact
                </div>
            </nav>
        </section>

    )
  }
}
