import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const StickyPageWrapper = styled.div`
  position: relative;
  top: ${({theme}) => theme.mapRevealHeight};
  pointer-events: none;
`

function StickyPage({ children }: { children: any }) {
  const [intersects, setIntersects] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const r = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        const [{isIntersecting}] = entries;
        setIntersects(isIntersecting)
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    )
    if (r) {
      observer.observe(r)
    }
    return () => {
      if (r) {
        observer.unobserve(r)
      }
    }
  }, [ref])
  return <div><StickyPageWrapper ref={ref}>{children(intersects)}</StickyPageWrapper></div>
}

export default StickyPage
