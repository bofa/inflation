import { useEffect, useState } from 'react'
import './App.css'
import { getIndex } from './api'
import { ChartIndex, Series } from './ChartIndex'

function App() {
  const [datasets, setDatasets] = useState<Series[]>([])

  useEffect(() => {
    getIndex('kpi').then(data => setDatasets([{
      label: 'kpi',
      data,
    }]))
  }, [])

  return (
    <div style={{ width: 800, height: 800 }}>
      <ChartIndex datasets={datasets} />
    </div>
  )
}

export default App
