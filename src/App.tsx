import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HTMLSelect } from '@blueprintjs/core'
import { Index, getIndex } from './api'
import { ChartIndex } from './ChartIndex'
import { SmoothKey, smoothOptions } from './utils/smoothing'
import './App.css'

const indicies: Index[] = ['kpi', 'kpif', 'kpifXEnergy']

export function App() {
  const [index, setIndex] = useState<Index>('kpi')
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('gaussian3')

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

  const inflation = [1, 12].map((distance) => datasets.map(set => ({
      ...set,
      label: set.label + ' ' + distance,
      data: set.data.map((d, i, a) => ({
        ...d,
        y: (d.y - a[i-distance]?.y) / a[i-distance]?.y * 12 / distance
      }))
    }))
  ).flat()

  return (
    <>
      <HTMLSelect value={index} onChange={e => setIndex(e.currentTarget.value as Index)}>
        {indicies.map(o => <option key={o} value={o}>{o}</option>)}
      </HTMLSelect>
      <HTMLSelect value={smoothKey} onChange={e => setSmoothKey(e.currentTarget.value as SmoothKey)}>
        {smoothOptions.map(o => <option key={o.key} value={o.key}>{o.name}</option>)}
      </HTMLSelect>
      <div style={{ width: '800', height: '800' }}>
        <ChartIndex datasets={inflation} />
      </div>
    </>
  )
}
