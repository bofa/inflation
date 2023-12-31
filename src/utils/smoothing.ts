import { mean, sum } from "mathjs"
import { Series } from "../ChartIndex"

const pdfNormal = (x, mean, std) => 1/(std*Math.sqrt(2*Math.PI))*Math.exp(-0.5*((x-mean)/std)**2)

export const gaussianSmoothingFactory = (std: number) => (series: Series) => {
  const kernelHalf = Array(20).fill(0).map((_, x) => pdfNormal(x, 0, std))
  const kernel = [...(kernelHalf.slice(1).reverse()), ...kernelHalf]
  const kernelOffset = Math.round(kernel.length/2)

  const transform = (data, indexData) =>
    sum(kernel.map((w, indexWeight) => w*(data[indexData + indexWeight - kernelOffset]?.y ?? 0)))
    / sum(kernel.map((w, indexWeight) => data[indexData + indexWeight - kernelOffset] ? w : 0))

  return {
    ...series,
    data: series.data.map((d, i, a) => ({
      ...d,
      y: transform(a, i),
      raw: d.y,
      weight: sum(kernel.map((w, indexWeight) => a[i + indexWeight + 1 - kernelOffset] ? w : 0))
    }))
  }
}


export const movingAverageFactory = (window: number) => (series: Series) => ({
  ...series,
  data: series.data.map((d, i, a) => ({
    ...d,
    y: mean(a.slice(Math.max(0, i - window), i + window + 1).map(d => d.y)),
    raw: d.y,
    weight: 1 - Math.max(0, i + 1 + Math.ceil(window/2) - a.length)/(2*window + 1),
  }))
})


export type SmoothKey = typeof smoothOptions[number]['key']
export const smoothOptions = [
  {
    name: 'None',
    key: 'none',
    kernal: (series: Series) => series
  },
  {
    name: 'Moving Average 3',
    key: 'movingAverage3',
    kernal: movingAverageFactory(1),
  },
  {
    name: 'Moving Average 5',
    key: 'movingAverage5',
    kernal: movingAverageFactory(2),
  },
  {
    name: 'Moving Average 7',
    key: 'movingAverage7',
    kernal: movingAverageFactory(3)
  },
  {
    name: 'Gaussian 1',
    key: 'gaussian1',
    kernal: gaussianSmoothingFactory(1)
  },
  {
    name: 'Gaussian 2',
    key: 'gaussian2',
    kernal: gaussianSmoothingFactory(2)
  },
  {
    name: 'Gaussian 3',
    key: 'gaussian3',
    kernal: gaussianSmoothingFactory(3)
  },
  {
    name: 'Gaussian 4',
    key: 'gaussian4',
    kernal: gaussianSmoothingFactory(4)
  }
] as const satisfies readonly { name: string, key: string, kernal: (series: Series) => Series}[]