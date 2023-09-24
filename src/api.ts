import axios from "axios"
import { DateTime } from "luxon"

export type Index = 'kpi'|'kpif'|'kpifXEnergy'
export function getIndex(index: Index) {
  return axios.get<{ x: string, y: number }[]>(index + '.json')
    .then(r => r.data.map(({ x, y }) => ({ x: DateTime.fromISO(x), y })))
}