import { promises as fs } from 'fs';
import { getIndex } from './api.js'
import { getRiksbankIndex } from './riksbanken.js'

[
  'kpi',
  'kpif',
  'kpifXEnergy'
].map(index => {
  return getIndex(index)
    .then(data => { 
      fs.writeFile(`./public/${index}.json`, JSON.stringify(data, null, 2))
    })
});

[
  'SECBREPOEFF',
  'SEDP1WSTIBORDELAYC',
].map(index => {
  getRiksbankIndex(index).then(repo => {
    // console.log('repo', repo)
    fs.writeFile(`./public/${index}.json`, JSON.stringify(repo, null, 2))
  })
});