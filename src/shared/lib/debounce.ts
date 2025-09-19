export type DebouncedFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void
}

export const debounce = <TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 300
): DebouncedFunction<TArgs> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = ((...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as DebouncedFunction<TArgs>

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced
}
