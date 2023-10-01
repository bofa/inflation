import { DateTime } from 'luxon'

export function getRiksbankIndex(index) {
  return fetch(`https://api-test.riksbank.se/swea/v1/Observations/${index}/2000-01-01`, {
  method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  .then(response => response.json())
  .then(data => data.map(obj => ({
    x: DateTime.fromFormat(obj.date, 'yyyy-MM-dd'),
    y: obj.value
  })))
}
