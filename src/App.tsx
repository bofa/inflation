import { useQuery } from '@tanstack/react-query'
import { Index, getIndex } from './api'
import { ChartIndex } from './ChartIndex'
import './App.css'
import { HTMLSelect } from '@blueprintjs/core'
import { useState } from 'react'

const indicies: Index[] = ['kpi', 'kpif', 'kpifXEnergy']

function App() {
  const [index, setIndex] = useState<Index>('kpi')

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
    <>
      <HTMLSelect onChange={e => setIndex(e.currentTarget.value as Index)}>
        {indicies.map(o => <option key={o} value={o}>{o}</option>)}
      </HTMLSelect>
      <div style={{ width: '800', height: '800' }}>
        <ChartIndex datasets={datasets} />
      </div>
    </>
  )
}

export default App
