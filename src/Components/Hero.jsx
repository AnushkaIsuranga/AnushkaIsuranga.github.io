import React, { PureComponent } from 'react'
import { TypeAnimation } from 'react-type-animation'
import Cover from '../assets/intro_bg.jpg'

export default class Hero extends PureComponent {
  static propTypes = {}

  render() {
    return (
      <section className='h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center' 
      style={{ backgroundImage: `url(${Cover})` }}>
        <div className='text-center'>
            <h1 className='font-bold text-white text-5xl'>Hi, I&apos;m <span className='font-mono font-bold bg-white text-black'>Anushka</span></h1>
            <TypeAnimation
                className='font-semibold font-mono text-white'
                sequence={[
                    'I develop Desktop Applications', 1000,
                    'I develop Mobile Applications', 1000,
                    'I develop Web Applications', 1000,
                ]}
                wrapper="span"
                speed={20}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={Infinity}
            />
        </div>
      </section>
    )
  }
}