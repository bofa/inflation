import { useEffect } from 'react'
import './App.css'
import { getIndex } from './api'

function App() {
  useEffect(() => {
    getIndex('kpi').then(kpi => console.log('kpi', kpi))
  }, [])

  return (
    <>
      INDEX!
    </>
  )
}

export default App
