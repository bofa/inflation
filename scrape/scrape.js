import { promises as fs } from 'fs';
import { getIndex, getKPICategories } from './scb.js'
// import { getRiksbankIndex, getSWESTR } from './riksbanken.js'

const scb = [
  { key: 'kpi', name: 'KPI', index: true },
  { key: 'kpif', name: 'KPI Fast ränta', index: true },
  { key: 'kpifXEnergy', name: 'PKI Fast ränta exluderat energi', index: true },
]

// const riksbank = [
//   { key: 'SECBREPOEFF', name: 'REPO', index: false },
//   { key: 'SEDP1WSTIBORDELAYC', name: 'STIBOR', index: false },
// ]

// const swestr = [
//   { key: 'getSWESTR', name: 'Styrränta?', index: false},
// ]

const sources = scb // .concat(riksbank).concat(swestr)

fs.writeFile(`./src/assets/sources.json`, JSON.stringify(sources, null, 2))

scb.map(source => {
  return getIndex(source.key)
    .then(data => { 
      fs.writeFile(`./src/assets/${source.key}.json`, JSON.stringify(data, null, 2))
    })
})

// riksbank.map(source => {
//   getRiksbankIndex(source.key).then(data => {
//     // console.log('repo', repo)
//     fs.writeFile(`./public/${source.key}.json`, JSON.stringify(data, null, 2))
//   })
// });

// swestr.map(source => {
//   getSWESTR(source.key).then(data => {
//     // console.log('repo', repo)
//     fs.writeFile(`./public/${source.key}.json`, JSON.stringify(data, null, 2))
//   })
// });

getKPICategories()
.then(data => {
  // console.log('repo', repo)
  fs.writeFile(`./src/assets/categories.json`, JSON.stringify(data, null, 2))
})
.then(() => console.log('Done getKPICategories'))
