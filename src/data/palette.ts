/** Fabric colours shared by every garment. `neutral` marks the colours menswear treats as backgrounds. */
export interface Colour {
  id: string
  name: string
  hex: string
  neutral: boolean
}

export const COLOURS: Colour[] = [
  { id: 'white', name: 'White', hex: '#f3f0e8', neutral: true },
  { id: 'ecru', name: 'Ecru', hex: '#e6dcc4', neutral: true },
  { id: 'oatmeal', name: 'Oatmeal', hex: '#cbbb9c', neutral: true },
  { id: 'stone', name: 'Stone', hex: '#bfb39a', neutral: true },
  { id: 'khaki', name: 'Khaki', hex: '#b59d6e', neutral: true },
  { id: 'camel', name: 'Camel', hex: '#b5895a', neutral: true },
  { id: 'tan', name: 'Tan', hex: '#a7754a', neutral: true },
  { id: 'brown', name: 'Brown', hex: '#6e4a32', neutral: true },
  { id: 'chocolate', name: 'Chocolate', hex: '#45301f', neutral: true },
  { id: 'light-grey', name: 'Light grey', hex: '#b9b7b1', neutral: true },
  { id: 'mid-grey', name: 'Mid grey', hex: '#85847f', neutral: true },
  { id: 'charcoal', name: 'Charcoal', hex: '#3d3d3f', neutral: true },
  { id: 'black', name: 'Black', hex: '#1d1c1e', neutral: true },
  { id: 'navy', name: 'Navy', hex: '#26324d', neutral: true },
  { id: 'olive', name: 'Olive', hex: '#5d6038', neutral: true },
  { id: 'light-blue', name: 'Light blue', hex: '#aebfd6', neutral: false },
  { id: 'sky', name: 'Chambray', hex: '#7f98b6', neutral: false },
  { id: 'indigo', name: 'Raw indigo', hex: '#2b3550', neutral: true },
  { id: 'mid-wash', name: 'Mid wash', hex: '#5a7396', neutral: true },
  { id: 'light-wash', name: 'Light wash', hex: '#8fa6c2', neutral: true },
  { id: 'pink', name: 'Pale pink', hex: '#dcb4b0', neutral: false },
  { id: 'burgundy', name: 'Burgundy', hex: '#6b2430', neutral: false },
  { id: 'rust', name: 'Rust', hex: '#9c4a26', neutral: false },
  { id: 'mustard', name: 'Mustard', hex: '#b88a2c', neutral: false },
  { id: 'forest', name: 'Bottle green', hex: '#2f4a3a', neutral: false },
  { id: 'sage', name: 'Sage', hex: '#8f9a7a', neutral: false },
  { id: 'cobalt', name: 'Cobalt', hex: '#2f4f9a', neutral: false },
  { id: 'red', name: 'Red', hex: '#a3302c', neutral: false },
  { id: 'cognac', name: 'Cognac leather', hex: '#8a4b22', neutral: true },
  { id: 'dark-brown', name: 'Dark brown leather', hex: '#4a2c1a', neutral: true },
  { id: 'oxblood', name: 'Oxblood', hex: '#55201f', neutral: true },
  { id: 'snuff', name: 'Snuff suede', hex: '#8c6a48', neutral: true },
  { id: 'gold', name: 'Gold', hex: '#b8973e', neutral: false },
  { id: 'silver', name: 'Silver', hex: '#a8aaae', neutral: true },
  { id: 'tortoise', name: 'Tortoiseshell', hex: '#5a3a22', neutral: true },
]

const byId = new Map(COLOURS.map(c => [c.id, c]))
export const colour = (id: string): Colour => byId.get(id) ?? COLOURS[0]
export const hasColour = (id: string) => byId.has(id)
