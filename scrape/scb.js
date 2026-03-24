import axios from 'axios'
import { DateTime } from 'luxon'
// import debug from './debug.json' assert { type: "json" }

const indicies = {
  kpi: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPI2020M', "00000807"],
  kpif: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101G/KPIF2020', "000007ZN"],
  kpifXEnergy: ['https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101J/KPIFXE2020', "000007ZW"]
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
    x: DateTime.fromFormat(d['key'][0], "yyyy'M'MM", { zone: 'utc' }),
    y: d['values'][0]
  })))
}

// TODO Split calls over diffrent categories
// https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__PR__PR0101__PR0101DE/KPI2020COICOPMA/
// const cetegories = ['00']

export function getKPICategories() {
  return axios.post(
 // 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101Z/KPIRBBas1980',
    'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101DE/KPI2020COICOPMA',
    {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": [
              "000007WR"
            ]
          }
        },
        {
          "code": "Tid",
          "selection": {
            "filter": "item",
            "values": [
              // "2025M10",
              // "2025M11",
              // "2025M12",
              "1980M01",
              "1980M02",
              "1980M03",
              "1980M04"

            ]
          }
        }
      ],
      "response": {
        "format": "json-stat2"
      }
    }
  )
  // .then(response => {
  //   console.log('response', response)
  //   return response
  // })
  .then(response => response.data)
  // .then(response => debug)
  .then((data) => {
    const indexCategory = data.dimension.VaruTjanstegrupp.category.index
    const labelCategory = data.dimension.VaruTjanstegrupp.category.label

    const indexTime = data.dimension.Tid.category.index
    const labelTime = data.dimension.Tid.category.label
    
    const values = data.value
    
    const dates = Object.keys(indexTime)
    const stepLengthTime = Object.keys(indexTime).length

    const categories = Object.keys(labelCategory)
      // .slice(0, 2)
      .map(key => labelCategory[key])
      .map((label, labelIndex) => {
        // const dates = labelTime.slice((2*labelIndex+1)*stepLengthTime, (2*labelIndex+2)*stepLengthTime)
        const financialWeights = values.slice(2*labelIndex*stepLengthTime, (2*labelIndex+1)*stepLengthTime)
        const financialIndex = values.slice((2*labelIndex+1)*stepLengthTime, (2*labelIndex+2)*stepLengthTime)
        // const firstSet = values.slice(0, stepLengthTime)
        // const nextSet = values.slice(stepLengthTime, 2*stepLengthTime)
        
        const series = dates.map((x, i) => ({
          x: DateTime.fromFormat(x, "yyyy'M'MM", { zone: 'utc' }),
          weight: financialWeights[i],
          index: financialIndex[i],
        }))
    

        return {
          label,
          data: series,
        }
      })

    // console.log('categories', categories)
    // console.log('nextSet', nextSet.join(', '))

    return categories
  })
}

