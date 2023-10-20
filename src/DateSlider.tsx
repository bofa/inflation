import { NumberRange, RangeSlider } from "@blueprintjs/core";
import { DateTime } from "luxon";
import { useState } from "react";

export function DateSlider(props: {
  min: DateTime
  max: DateTime
  onRange(value: [DateTime, DateTime]): void
}) {
  const max = props.max.diff(props.min, 'months').months
  const [value, setValue] = useState<NumberRange>([0, max])

  return <RangeSlider
    min={0}
    max={max}
    value={value}
    labelStepSize={2*12}
    labelRenderer={month => props.min.plus({ month }).toFormat('yyyy')}
    onChange={value => {
      setValue(value)
      props.onRange(value.map(month => props.min.plus({ month })) as [DateTime, DateTime])
    }}
    // onRelease={value => props.onRange(value.map(month => props.min.plus({ month })) as [DateTime, DateTime])}
  />
}