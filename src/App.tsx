import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HTMLSelect } from '@blueprintjs/core'
import { Index, getIndex } from './api'
import { ChartIndex } from './ChartIndex'
import { SmoothKey, smoothOptions } from './utils/smoothing'
import sources from './assets/sources.json'
import './App.css'

// const indicies: Index[] = sources[number]['key']  ['kpi', 'kpif', 'kpifXEnergy', 'SEDP1WSTIBORDELAYC', 'SECBREPOEFF']

export function App() {
  const [sourceKey, setSourceKey] = useState<Index>('kpi')
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('gaussian3')

  const source = sources.find(source => source.key === sourceKey)

  const indexQuery = useQuery({
    queryKey: ['source', sourceKey],
    queryFn: () => getIndex(sourceKey).then(data => ({
      label: sourceKey,
      data,
    })),
    staleTime: Infinity
  })

  const smoothKernal = smoothOptions.find(smooth => smooth.key === smoothKey)!.kernal

  const datasets = indexQuery.data ? [smoothKernal(indexQuery.data)] : []

  const derivatives = source?.index ? [
    { step: 1, label: 'Month to Month' },
    { step: 12, label: 'Year to Year' },
  ].map((operator) => datasets.map(set => ({
      ...set,
      yAxisID: 'y',
      label: operator.label,
      data: set.data.map((d, i, a) => ({
        ...d,
        y: (d.y - a[i-operator.step]?.y) / a[i-operator.step]?.y * 12 / operator.step
      }))
    }))
  ).flat()
  : []

  const seriesTotal = datasets
    .map(series => ({
      ...series,
      yAxisID: source?.index ? 'y2' : 'y'
    }))
    .concat(derivatives)

  return (
    <>
      <HTMLSelect value={sourceKey} onChange={e => setSourceKey(e.currentTarget.value as Index)}>
        {sources.map(source => <option key={source.key} value={source.key}>{source.name}</option>)}
      </HTMLSelect>
      <HTMLSelect disabled={!source?.index} value={smoothKey} onChange={e => setSmoothKey(e.currentTarget.value as SmoothKey)}>
        {smoothOptions.map(o => <option key={o.key} value={o.key}>{o.name}</option>)}
      </HTMLSelect>
      <div style={{ width: '800', height: '800' }}>
        <ChartIndex datasets={seriesTotal} />
      </div>
    </>
  )
}
