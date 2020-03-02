import { useRef, useEffect } from 'react'

export default function useUpdate(hook, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current)
      hook()
    else
      didMountRef.current = true
  }, inputs)
}