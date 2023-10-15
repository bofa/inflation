import { FormGroup, HTMLSelect } from "@blueprintjs/core"
import { SmoothKey, smoothOptions } from './utils/smoothing'

export function SelectSmooth(props: {
  smoothKey: SmoothKey
  setSmoothKey(key: SmoothKey): void
  disabled: boolean
}) {
  return (
    <FormGroup
      label="Smoothing"
    >
      <HTMLSelect disabled={props.disabled} value={props.smoothKey} onChange={e => props.setSmoothKey(e.currentTarget.value as SmoothKey)}>
        {smoothOptions.map(o => <option key={o.key} value={o.key}>{o.name}</option>)}
      </HTMLSelect>
    </FormGroup>
  )
}