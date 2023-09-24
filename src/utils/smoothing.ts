import { sum } from "mathjs"

const pdfNormal = (x, mean, std) => 1/(std*Math.sqrt(2*Math.PI))*Math.exp(-0.5*((x-mean)/std)**2)
const kernelHalf = Array(20).fill(0).map((_, x) => pdfNormal(x, 0, 3))
const kernel = [...(kernelHalf.slice(1).reverse()), ...kernelHalf]
const kernelOffset = Math.floor(kernel.length/2)

export const gaussianSmoothing = (data, indexData) =>
  sum(kernel.map((w, indexWeight) => w*(data[indexData + indexWeight - kernelOffset]?.y ?? 0)))
  / sum(kernel.map((w, indexWeight) => data[indexData + indexWeight - kernelOffset] ? w : 0))
