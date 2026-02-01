export function mergeComponentData(defaults?: any, overrides?: any) {
  if (!defaults && !overrides) {
    return undefined
  }

  if (!defaults) {
    return overrides
  }

  if (!overrides) {
    return defaults
  }

  const result: any = {}

  for (const key in defaults) {
    result[key] = defaults[key]
  }

  for (const key in overrides) {
    result[key] = overrides[key]
  }

  return result
}
