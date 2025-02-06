import axios from 'axios'
import { DateTime } from 'luxon'

const history = [
  416.75,
  263.81,
  248.23,
]

function getSnabbInflation() {
  axios.post('https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101SK/SnabbKPI', {
    "query": [
      {
        "code": "ContentsCode",
        "selection": {
          "filter": "item",
          "values": [
            "000007LR"
          ]
        }
      },
      {
        "code": "Tid",
        "selection": {
          "filter": "item",
          "values": [
            DateTime.now().minus({ month: 1 }).toFormat("yyyy'M'MM")
          ]
        }
      }
    ],
    "response": {
      "format": "json"
    }
  }).then(response => {
    const data = response.data

    data.data.map((index, i) => {
      const name = index.key
      const value = +index.values[0]
      const valueOld = history[i]

      const newIndex = valueOld * (value/100 + 1)
      console.log(name, value, newIndex)

      return newIndex
    })
  })
}

getSnabbInflation()