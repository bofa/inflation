export function toggle<T>(id: T, list: T[]) {
  return list.includes(id)
    ? list.filter(id2 => id2 !== id)
    : list.concat(id)
}
