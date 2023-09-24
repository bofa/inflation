// import { useEffect, useState } from 'react'
import './App.css'
import { getIndex } from './api'
import { ChartIndex, Series } from './ChartIndex'
import { useQuery } from '@tanstack/react-query'

const indicies = ['kpi', 'kpif', 'kpifXEnergy'] as const
const index = indicies[2]

function App() {
  const indexQuery = useQuery({
    queryKey: ['index', index],
    queryFn: () => getIndex(index).then(data => ({
      label: index,
      data,
    })),
    staleTime: Infinity
  })

  const datasets = indexQuery.data ? [indexQuery.data] : []

  return (
    <div style={{ width: '800', height: '800' }}>
      <ChartIndex datasets={datasets} />
    </div>
  )
}

export default App
