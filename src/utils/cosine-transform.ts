/*
 * Fast discrete cosine transform algorithms (compiled from TypeScript)
 *
 * Copyright (c) 2022 Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/fast-discrete-cosine-transform-algorithms
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */

// DCT type II, unscaled. Algorithm by Byeong Gi Lee, 1984.
// See: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.118.3056&rep=rep1&type=pdf#page=34
export function cosineTransform(vector: Float64Array) {
  const n = vector.length;
  if (n <= 0 || (n & (n - 1)) !== 0)
    throw new RangeError("Length must be power of 2");
  transformInternal(vector, 0, n, new Float64Array(n));
}

// DCT type III, unscaled. Algorithm by Byeong Gi Lee, 1984.
// See: https://www.nayuki.io/res/fast-discrete-cosine-transform-algorithms/lee-new-algo-discrete-cosine-transform.pdf
export function inverseCosineTransform(vector: Float64Array, scale: null|number = null) {
  const n = vector.length;
  if (n <= 0 || (n & (n - 1)) !== 0)
    throw new RangeError("Length must be power of 2");
  vector[0] /= 2;
  inverseTransformInternal(vector, 0, n, new Float64Array(n));
  const scaleFactor = scale ?? 2 / vector.length;
  for (let i = 0; i < vector.length; i++) {
    vector[i] *= scaleFactor;
  }
}

function transformInternal(vector: Float64Array, off: number, len: number, temp: Float64Array) {
  if (len === 1) return;
  const halfLen = Math.floor(len / 2);
  for (let i = 0; i < halfLen; i++) {
    const x = vector[off + i];
    const y = vector[off + len - 1 - i];
    temp[off + i] = x + y;
    temp[off + i + halfLen] = (x - y) / (Math.cos((i + 0.5) * Math.PI / len) * 2);
  }
  transformInternal(temp, off, halfLen, vector);
  transformInternal(temp, off + halfLen, halfLen, vector);
  for (let i = 0; i < halfLen - 1; i++) {
    vector[off + i * 2 + 0] = temp[off + i];
    vector[off + i * 2 + 1] = temp[off + i + halfLen] + temp[off + i + halfLen + 1];
  }
  vector[off + len - 2] = temp[off + halfLen - 1];
  vector[off + len - 1] = temp[off + len - 1];
}

function inverseTransformInternal(vector: Float64Array, off: number, len: number, temp: Float64Array) {
  if (len === 1) return;
  const halfLen = Math.floor(len / 2);
  temp[off + 0] = vector[off + 0];
  temp[off + halfLen] = vector[off + 1];
  for (let i = 1; i < halfLen; i++) {
    temp[off + i] = vector[off + i * 2];
    temp[off + i + halfLen] = vector[off + i * 2 - 1] + vector[off + i * 2 + 1];
  }
  inverseTransformInternal(temp, off, halfLen, vector);
  inverseTransformInternal(temp, off + halfLen, halfLen, vector);
  for (let i = 0; i < halfLen; i++) {
    const x = temp[off + i];
    const y = temp[off + i + halfLen] / (Math.cos((i + 0.5) * Math.PI / len) * 2);
    vector[off + i] = x + y;
    vector[off + len - 1 - i] = x - y;
  }
}
