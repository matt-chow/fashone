import type { Occasion } from './types'

export const OCCASIONS: Occasion[] = [
  { id: 'weekend', name: 'Weekend', formality: [1, 2], note: 'Errands, coffee, walks. Comfort first, but intention still shows.' },
  { id: 'outdoors', name: 'Outdoors', formality: [1, 2], seasons: ['autumn', 'winter', 'spring'], note: 'Countryside and city parks — practical cloth, sturdy shoes.' },
  { id: 'travel', name: 'Travel', formality: [1, 3], note: 'Layers that pack and survive a long day.' },
  { id: 'date', name: 'Dinner date', formality: [2, 3], note: 'Considered but relaxed. One point of interest is enough.' },
  { id: 'office', name: 'Office', formality: [2, 4], note: 'Business casual: collared shirts, odd trousers, knitwear, optional jacket.' },
  { id: 'interview', name: 'Interview', formality: [3, 4], note: 'Dress one step above the office norm.' },
  { id: 'business', name: 'Business formal', formality: [4, 4], note: 'Suit, shirt and tie; dark colours and quiet patterns.' },
  { id: 'dinner', name: 'Dinner out', formality: [3, 4], note: 'Smart casual into tailored — a jacket is welcome.' },
  { id: 'summer-party', name: 'Summer party', formality: [1, 3], seasons: ['summer'], note: 'Linen, light colours, open collars.' },
  { id: 'wedding', name: 'Wedding guest', formality: [4, 5], note: 'A suit unless told otherwise. Do not compete with the wedding party.' },
  { id: 'funeral', name: 'Funeral', formality: [4, 4], note: 'Dark suit, white shirt, dark tie, black shoes.' },
  { id: 'black-tie', name: 'Black tie', formality: [5, 5], note: 'Dinner suit, evening shirt, black bow tie, black shoes. Conventions are firm.' },
]
export const occasion = (id: string) => OCCASIONS.find(o => o.id === id)
