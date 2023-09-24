import axios from 'axios'
import { DateTime } from 'luxon'

const indicies = {
  kpi: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPItotM', "000004VU"],
  kpif: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101G/KPIF', "000005HR"],
  kpifXEnergy: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101J/KPIFexEN', "000005HP"]
}

export function getIndex(index) {
  return axios.post(
    indicies[index][0],
    {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": [
              indicies[index][1]
            ]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    },
  )
  // .then(response => {
  //   console.log('response', response)
  //   return response
  // })
  .then(response => response.data.data.map(d => ({
    x: DateTime.fromFormat(d['key'][0], "yyyy'M'MM"),  
    y: d['values'][0]
  })))
}