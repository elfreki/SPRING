import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './styles.css'

const cards = [
  'https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg'
  ,'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg'
  
]


const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set()) 
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) 
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 
    const dir = xDir < 0 ? -1 : 1 
    if (!down && trigger) gone.add(index) 
    set(i => {
      if (index !== i) return 
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) 
      const scale = down ? 1.1 : 1 
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      {}
      <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${cards[i]})` }} />
    </animated.div>
  ))
}

render(<Deck />, document.getElementById('root'))
