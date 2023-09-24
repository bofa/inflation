import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HTMLSelect } from '@blueprintjs/core'
import { mean } from 'mathjs'
import { Index, getIndex } from './api'
import { ChartIndex, Series } from './ChartIndex'
import './App.css'

const indicies: Index[] = ['kpi', 'kpif', 'kpifXEnergy']

type SmoothKey = typeof smoothOptions[number]['key']
const smoothOptions = [
  {
    name: 'None',
    key: 'none',
    kernal: (series: Series) => series
  },
  {
    name: 'Moving Average 3',
    key: 'movingAverage3',
    kernal: (series: Series) => ({
      ...series,
      data: series.data.map((d, i, a) => ({
        ...d,
        y: mean(a.slice(Math.max(0, i-1), i+2).map(d => d.y))
      }))
    }),
  },
  {
    name: 'Moving Average 5',
    key: 'movingAverage5',
    kernal: (series: Series) => ({
      ...series,
      data: series.data.map((d, i, a) => ({
        ...d,
        y: mean(a.slice(Math.max(0, i-2), i+3).map(d => d.y))
      }))
    })
  },
] as const satisfies readonly { name: string, key: string, kernal: (series: Series) => Series}[]

export function App() {
  const [index, setIndex] = useState<Index>('kpi')
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('none')

  const indexQuery = useQuery({
    queryKey: ['index', index],
    queryFn: () => getIndex(index).then(data => ({
      label: index,
      data,
    })),
    staleTime: Infinity
  })

  const smoothKernal = smoothOptions.find(smooth => smooth.key === smoothKey)!.kernal

  const datasets = indexQuery.data ? [smoothKernal(indexQuery.data)] : []

  return (
    <>
      <HTMLSelect onChange={e => setIndex(e.currentTarget.value as Index)}>
        {indicies.map(o => <option key={o} value={o}>{o}</option>)}
      </HTMLSelect>
      <HTMLSelect onChange={e => setSmoothKey(e.currentTarget.value as SmoothKey)}>
        {smoothOptions.map(o => <option key={o.key} value={o.key}>{o.name}</option>)}
      </HTMLSelect>
      <div style={{ width: '800', height: '800' }}>
        <ChartIndex datasets={datasets} />
      </div>
    </>
  )
}
