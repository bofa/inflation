import axios from "axios"
import { DateTime } from "luxon"
import sources from './assets/sources.json'

export type Index = typeof sources[number]['key']
export function getIndex(index: Index) {
  return axios.get<{ x: string, y: number }[]>(index + '.json')
    .then(r => r.data.map(({ x, y }) => ({ x: DateTime.fromISO(x), y })))
}