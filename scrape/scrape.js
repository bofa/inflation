import { promises as fs } from 'fs';
import { getIndex } from './api.js'

[
  'kpi',
  'kpif',
  'kpifXEnergy'
].map(index => {
  return getIndex(index)
    .then(data => { 
      fs.writeFile(`./public/${index}.json`, JSON.stringify(data, null, 2))

    })
})
