"use client"
import React, { ReactNode, useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/customFunctions/animation'

interface Props {
  children: ReactNode
  parentClass: string
}

const TextSlideUp: React.FC<Props> = ({ children, parentClass }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentRef.current) {
      const element = parentRef.current
      const spans = element.querySelectorAll('span')

      // Set initial styles for each letter
      spans.forEach((span) => {
        const spanElement = span as HTMLElement
        spanElement.style.opacity = '0'
        spanElement.style.transform = 'translateY(30px)'
      })

      // Calculate start and end triggers based on element position
      const viewportHeight = window.innerHeight
      const elementRect = element.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const elementOffsetTop = elementRect.top + scrollY

      // Trigger when the element reaches half of the viewport height
      const startTrigger = elementOffsetTop - viewportHeight / 1.5
      const endTrigger = elementOffsetTop + elementRect.height

      ScrollTrigger(element, {
        startTrigger: startTrigger,
        endTrigger: endTrigger,
        unit: 'px',
        onStart: () => {
          // Animate each letter with a delay
          spans.forEach((span, index) => {
            const spanElement = span as HTMLElement
            setTimeout(() => {
              spanElement.style.transition = 'transform 1s ease, opacity 1s ease'
              spanElement.style.opacity = '1'
              spanElement.style.transform = 'translateY(0)'
            }, index * 200) // Increased delay between letters
          })
        },
        setPin: false,
      })
    }
  }, [])

  return (
    <div ref={parentRef}>
      {children}
    </div>
  )
}

export default TextSlideUp