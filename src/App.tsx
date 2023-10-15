import { max, min, sum } from 'mathjs'
import { DateTime, Interval } from 'luxon'
import { useState } from 'react'
import { ChartIndex, colors } from './ChartIndex'
import { SmoothKey, smoothOptions } from './utils/smoothing'
import { DateSlider } from './DateSlider'
import './App.css'
import { Category, SelectCategories, categories } from './SelectCategories'
import { SelectSmooth } from './SelectSmooth'


// const indicies: Index[] = sources[number]['key']  ['kpi', 'kpif', 'kpifXEnergy', 'SEDP1WSTIBORDELAYC', 'SECBREPOEFF']

// const removeSeries = [
//   // Due to null data
//   'Logi',
//   'Hemförsäkr., banktjänster, utbildn.',

//   'TV-licens',
//   'Konsumentprisindex totalt',
//   'H Varor',
//   'H Tjänster exkl. bostad',
//   'H Bostad', 'H Livsmedel, svenska',
//   'H Övriga varor, inhemsk produktion',
//   'H Tjänster',
//   "H Lägenheter, hyra",
//   "H Inhemsk prod, varor och tjänster",
//   "H Övrigt, egnahem",
//   "H Importeradevaror och tjänster",
//   "H Räntor egnahem",
// ]

// const includeSeries = [
//   'H Varor',
//   'H Tjänster exkl. bostad',
//   'H Bostad', 'H Livsmedel, svenska',
//   'H Övriga varor, inhemsk produktion',
//   'H Tjänster',
//   "H Lägenheter, hyra",
//   "H Inhemsk prod, varor och tjänster",
//   "H Övrigt, egnahem",
//   "H Importeradevaror och tjänster",
//   "H Räntor egnahem",
// ]

const totalWeights = categories[0].data.map((_, i) => sum(categories.map(category => category.data[i]?.weight ?? 0)))

const massageData = categories
.map(category => ({
  label: category.label,
  data: category.data.map(d => ({ x: DateTime.fromISO(d.x), y: d.y }))
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
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('gaussian3')

  const smoothKernal = smoothOptions.find(smooth => smooth.key === smoothKey)!.kernal

  const dateInterval = Interval.fromDateTimes(range[0], range[1])

  const selectedLabels = selectedItems.map(item => item.label)
  const datasets = massageData
    .filter(series => selectedLabels.includes(series.label))
    .map(smoothKernal)

  // const datasets = indexQuery.data ? [smoothKernal(indexQuery.data)]: []

  const derivatives = datasets.map((set, i) => ({
      ...set,
      borderColor: colors[i],
      yAxisID: 'y',
      label: set.label,
      data: set.data
      .filter(d => dateInterval.contains(d.x))
    }))

  const seriesTotal = derivatives

  return (
    <>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {/* <HTMLSelect value={sourceKey} onChange={e => setSourceKey(e.currentTarget.value as Index)}>
          {sources.map(source => <option key={source.key} value={source.key}>{source.name}</option>)}
        </HTMLSelect> */}

        <SelectCategories
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />

        <SelectSmooth
          smoothKey={smoothKey}
          setSmoothKey={setSmoothKey}
          disabled={false}
        />

      </div>
      <div style={{ width: '100vw' }}>
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
