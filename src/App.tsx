import { max, min, std, sum } from 'mathjs'
import { DateTime, Interval } from 'luxon'
import { useState } from 'react'
import { ChartIndex, Series, colors } from './ChartIndex'
import { SmoothKey, smoothOptions } from './utils/smoothing'
import { DateSlider } from './DateSlider'
import { Category, SelectCategories, categories } from './SelectCategories'
import { SelectSmooth } from './SelectSmooth'
import './App.css'


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

// const totalWeights = categories[0].data.map((_, i) => sum(categories.map(category => category.data[i]?.weight ?? 0)))

const massageData = categories
.map(category => ({
  label: category.label,
  data: category.data.map(d => ({ x: DateTime.fromISO(d.x), y: d.y }))
}))

const allDatesAsMillis = massageData
  .flatMap(series => series.data)
  .map(d => d.x.toMillis())
const minDate = DateTime.fromMillis(min(allDatesAsMillis) - 100)
const maxDate = DateTime.fromMillis(max(allDatesAsMillis) + 100)

export function App() {
  const [selectedItems, setSelectedItems] = useState<Category[]>(categories.slice(2,3))
  const [range, setRange] = useState([minDate, maxDate])
  const [smoothKey, setSmoothKey] = useState<SmoothKey>('gaussian3')

  const smooth = smoothOptions.find(smooth => smooth.key === smoothKey)!
  const smoothKernal = smooth.kernal

  const dateInterval = Interval.fromDateTimes(range[0], range[1])

  const selectedLabels = selectedItems.map(item => item.label)

  const datasetsRaw = massageData
    .filter(series => selectedLabels.includes(series.label))
  
  const datasets = datasetsRaw.map(smoothKernal)

  // const datasets = indexQuery.data ? [smoothKernal(indexQuery.data)]: []

  const derivatives: Series[] = datasets.map((set, i) => ({
      ...set,
      borderColor: colors[i],
      yAxisID: 'y',
      label: set.label,
      data: set.data
      .filter(d => dateInterval.contains(d.x))
    }))

  const confidence: Series[] = datasets.flatMap((set, i) => {
    const Y = set.data.filter(d => d.y && !isNaN(d.y)).map((d: any) => d.raw ?? 0)
    const stdSeries = std(...Y)

    const backgroundColor = addAlpha(colors[i], 0.2)

    return [
      {
        label: set.label + ' minus hide',
        borderWidth: 0,
        pointHitRadius: 0,
        fill: i,
        backgroundColor,
        data: set.data
          .filter(d => dateInterval.contains(d.x))
          .map((d: any) => ({ x: d.x, y: d.y - stdSeries*(1 - d.weight) }))
      },
      {
        label: set.label + ' plus hide',
        borderWidth: 0,
        pointHitRadius: 0,
        fill: i,
        backgroundColor,
        data: set.data
          .filter(d => dateInterval.contains(d.x))
          .map((d: any) => ({ x: d.x, y: d.y + stdSeries*(1 - d.weight) }))
      }
    ]
  })

  const seriesTotal = derivatives.concat(confidence)

  return (
    <div style={{ width: '100vw', padding: 20 }}>
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
      <div>
        <ChartIndex datasets={seriesTotal} />
      </div>
      <DateSlider
        min={minDate}
        max={maxDate}
        onRange={setRange}
      />
    </div>
  )
}


function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}