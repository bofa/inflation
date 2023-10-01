import { DateTime } from 'luxon'

export function getRiksbankIndex(index) {
  return fetch(`https://api-test.riksbank.se/swea/v1/Observations/${index}/1993-01-01`, {
  method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  .then(response => response.json())
  .then(data => data.map(obj => ({
    x: DateTime.fromFormat(obj.date, 'yyyy-MM-dd'),
    y: obj.value / 100,
  })))
}

export function getSWESTR() {
  return fetch('https://api-test.riksbank.se/swestr/v1/all/SWESTR?fromDate=2020-01-01&compoundedAverageId=SWESTRAVG1W', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  .then(response => response.json())
  .then(data => data.map(obj => ({
    x: DateTime.fromFormat(obj.date, 'yyyy-MM-dd'),
    y: obj.rate / 100,
  })))
}