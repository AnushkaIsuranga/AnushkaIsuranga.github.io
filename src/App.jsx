import { useState } from 'react'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Hero/>
    </>
  )
}

export default App
