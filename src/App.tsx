import { max, min, sum } from 'mathjs'
import { DateTime, Interval } from 'luxon'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HTMLSelect } from '@blueprintjs/core'
import { Index, getIndex } from './api'
import { ChartIndex, colors } from './ChartIndex'
import { SmoothKey, smoothOptions } from './utils/smoothing'
import sources from './assets/sources.json'
import { DateSlider } from './DateSlider'
import './App.css'
import { Category, SelectCategories, categories } from './SelectCategories'


// const indicies: Index[] = sources[number]['key']  ['kpi', 'kpif', 'kpifXEnergy', 'SEDP1WSTIBORDELAYC', 'SECBREPOEFF']

const removeSeries = [
  // Due to null data
  'Logi',
  'Hemförsäkr., banktjänster, utbildn.',

  'TV-licens',
  'Konsumentprisindex totalt',
  'H Varor',
  'H Tjänster exkl. bostad',
  'H Bostad', 'H Livsmedel, svenska',
  'H Övriga varor, inhemsk produktion',
  'H Tjänster',
  "H Lägenheter, hyra",
  "H Inhemsk prod, varor och tjänster",
  "H Övrigt, egnahem",
  "H Importeradevaror och tjänster",
  "H Räntor egnahem",
]

const includeSeries = [
  'H Varor',
  'H Tjänster exkl. bostad',
  'H Bostad', 'H Livsmedel, svenska',
  'H Övriga varor, inhemsk produktion',
  'H Tjänster',
  "H Lägenheter, hyra",
  "H Inhemsk prod, varor och tjänster",
  "H Övrigt, egnahem",
  "H Importeradevaror och tjänster",
  "H Räntor egnahem",
]

const categoriesFiltered = categories
.filter(series => !removeSeries.includes(series.label))
// .slice(0, 12)

const totalWeights = categoriesFiltered[0].data.map((_, i) => sum(categoriesFiltered.map(category => category.data[i].weight)))

const massageData = categoriesFiltered.map(category => ({
  label: category.label,
  data: category.data.map(d => ({ x: DateTime.fromISO(d.x), y: d.index }))
}))

const allDatesAsMillis = massageData
  .flatMap(series => series.data)
  .map(d => d.x.toMillis())
const minDate = DateTime.fromMillis(min(allDatesAsMillis))
const maxDate = DateTime.fromMillis(max(allDatesAsMillis))


console.log('massageData', totalWeights, massageData.map(series => series.label))

export function App() {
  const [selectedItems, setSelectedItems] = useState<Category[]>([])
  const [range, setRange] = useState([minDate, maxDate])
  const [sourceKey, setSourceKey] = useState<Index>('kpi')
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('gaussian3')

  const source = sources.find(source => source.key === sourceKey)
  const smoothKernal = smoothOptions.find(smooth => smooth.key === smoothKey)!.kernal

  const dateInterval = Interval.fromDateTimes(range[0], range[1])

  // const indexQuery = useQuery({
  //   queryKey: ['source', sourceKey],
  //   queryFn: () => getIndex(sourceKey).then(data => ({
  //     label: sourceKey,
  //     data,
  //   })),
  //   staleTime: Infinity
  // })

  const selectedLabels = selectedItems.map(item => item.label)
  const datasets = massageData
    .filter(series => selectedLabels.includes(series.label))
    .map(smoothKernal)

  // const datasets = indexQuery.data ? [smoothKernal(indexQuery.data)]: []

  const derivatives = source?.index ? [
    // { step: 1, label: 'Month to Month' },
    { step: 12, label: 'Year to Year' },
  ].map((operator) => datasets.map((set, i) => ({
      ...set,
      borderColor: colors[i],
      yAxisID: 'y',
      // label: operator.label,
      label: set.label,
      data: set.data.map((d, i, a) => ({
        ...d,
        // y: (d.y - a[i-operator.step]?.y) / a[i-operator.step]?.y * 12 / operator.step
        y: (d.y - a[i-operator.step]?.y) / a[i-operator.step]?.y * 12 / operator.step
      }))
      .filter(d => dateInterval.contains(d.x))
      // .map(d => ({ x: d.x, y: Math.max(0, d.y)}))
    }))
  ).flat()
  : []

  // const derivativesPositive = derivatives.map(series => ({
  //   ...series,
  //   data: series.data.map(({ x, y }) => ({ x, y: y > 0 ? y : null  }))
  // }))

  // const derivativesNegative = derivatives.map(series => ({
  //   ...series,
  //   data: series.data.map(({ x, y }) => ({ x, y: y < 0 ? y : null }))
  // }))

  const seriesTotal = derivatives // derivativesPositive.concat(derivativesNegative)
  // const seriesTotal = datasets
  //   .map(series => ({
  //     ...series,
  //     yAxisID: source?.index ? 'y2' : 'y'
  //   }))
  //   .concat(derivatives)

  return (
    <>
      <HTMLSelect value={sourceKey} onChange={e => setSourceKey(e.currentTarget.value as Index)}>
        {sources.map(source => <option key={source.key} value={source.key}>{source.name}</option>)}
      </HTMLSelect>
      <HTMLSelect disabled={!source?.index} value={smoothKey} onChange={e => setSmoothKey(e.currentTarget.value as SmoothKey)}>
        {smoothOptions.map(o => <option key={o.key} value={o.key}>{o.name}</option>)}
      </HTMLSelect>
      <SelectCategories
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <div style={{ width: '800', height: '800' }}>
        <ChartIndex datasets={seriesTotal} />
      </div>
      <DateSlider
        min={minDate}
        max={maxDate}
        onRange={setRange}
      />
    </>
  )
}
