import axios from "axios"
import { DateTime } from "luxon"

type Index = 'kpi'|'kpif'|'kpifXEnergy'
export function getIndex(index: Index) {
  return axios.get<{ x: DateTime, y: number }[]>(index + '.json')
}