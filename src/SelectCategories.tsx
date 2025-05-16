import { useState } from "react"
import { Checkbox, Divider, FormGroup, Menu, MenuItem } from "@blueprintjs/core"
import { MultiSelect } from "@blueprintjs/select"
import { toggle } from "./utils/toggle"
import categoriesImport from './assets/categories.json'
import kpi  from './assets/kpi.json'
import kpif from './assets/kpif.json'
import kpifXEnergy from './assets/kpifXEnergy.json'
// import russia from './assets/russia.json'

export type Category = {
  label: string
  shortname?: string
  step?: number
  data: {
    x: string
    y: number
    weight?: number
  }[]
}

const indexSeries: Category[] = [
  {
    label: 'KPI',
    shortname: 'KPI',
    data: kpi
  },
  {
    label: 'KPIF',
    shortname: 'KPIF',
    data: kpif
  },
  {
    label: 'KPIF x Energy',
    shortname: 'KPIFxE',
    data: kpifXEnergy
  },
  // {
  //   label: 'CPI Russia',
  //   shortname: 'CPIRUS',
  //   data: russia
  // }
].map(s => ({
  ...s,
  data: s.data.map(d => ({ x: d.x, y: Number(d.y) }))
}))

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

export const categoriesTyped = categoriesImport as any[]

export const categories = indexSeries
.concat(categoriesTyped
  .filter(series => !removeSeries.includes(series.label))
  .map(s => ({
    ...s,
    data: s.data.map(d => ({ ...d, y: d.index }))
  })) 
)
.flatMap(category => [
  category,
  ...[
    { step: 1, label: ' M2M' },
    { step: 12, label: ' Y2Y' }
  ].map(operator => ({
    label: category.label + operator.label,
    shortname: (category.shortname ?? category.label) + operator.label,
    step: operator.step,
    data: category.data.map((d, i, a) => ({
      ...d,
      y: (d.y - a[i-operator.step]?.y) / a[i-operator.step]?.y * 12 / operator.step
    }))
  }))
])

export function SelectCategories (props: {
  selectedItems: Category[]
  setSelectedItems(items: Category[]): void 
}) {
  const [showIndex, setShowIndex] = useState(false)
  const [showM2M, setShowM2M] = useState(true)
  const [showY2Y, setShowY2Y] = useState(true)

  const selectedIds = props.selectedItems.map(item => item.label)

  return ( 
    <FormGroup
      label="Categories"
      style={{ width: '100%' }}
    >
      <MultiSelect<Category>
        fill={true}
        resetOnSelect={false}
        resetOnQuery={false}
        itemPredicate={(query, item) =>
          (showIndex || item.step !== undefined)
          && (showM2M || item.step !== 1)
          && (showY2Y || item.step !== 12)
          && item.label.toLocaleLowerCase().includes(query.toLowerCase())}
        items={categories}
        itemListRenderer={({ filteredItems, renderItem }) =>
          <Menu>
            <Checkbox
              checked={showIndex}
              onChange={(e: any) => setShowIndex(e.target.checked)}
            >
              Index
            </Checkbox>
            <Checkbox
              checked={showM2M}
              onChange={(e: any) => setShowM2M(e.target.checked)}
            >
              Month to Month
            </Checkbox>
            <Checkbox
              checked={showY2Y}
              onChange={(e: any) => setShowY2Y(e.target.checked)}
            >
              Year to Year
            </Checkbox>
            <Divider/>
            {filteredItems.map(renderItem)}
          </Menu>
        }
        itemRenderer={(item, { handleClick, modifiers }) => <MenuItem
          {...modifiers}
          icon={selectedIds.includes(item.label) ? 'small-tick' : null}
          onClick={handleClick}
          key={item.label}
          text={item.label}
          shouldDismissPopover={false}
        />}
        selectedItems={props.selectedItems}
        onItemSelect={item => props.setSelectedItems(toggle(item, props.selectedItems))}
        tagRenderer={item => item.label}
        onRemove={item => props.setSelectedItems(toggle(item, props.selectedItems))}
        popoverProps={{
          usePortal: false
        }}
      />
    </FormGroup>
  )
}