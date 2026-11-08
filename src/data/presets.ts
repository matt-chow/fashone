import type { Fit, Outfit, PatternId, Piece, Preset, Slot } from './types'

type Spec = [Slot, string, string, PatternId?, Fit?]
const fig = { skin: 1, hair: 1, hairStyle: 0 }
const o = (specs: Spec[], figure = fig): Outfit => ({
  figure,
  pieces: Object.fromEntries(specs.map(([slot, garmentId, colour, pattern = 'solid', fit]): [Slot, Piece] =>
    [slot, fit ? { garmentId, colour, pattern, fit } : { garmentId, colour, pattern }])),
})

export const PRESETS: Preset[] = [
  {
    id: 'navy-blazer', name: 'The navy blazer', occasion: 'office', styles: ['ivy', 'classic-tailoring'],
    note: 'Smart casual\'s keystone: navy, grey and blue. Three quiet colours and one texture.',
    outfit: o([['top', 'ocbd', 'light-blue', 'oxford'], ['jacket', 'blazer', 'navy'], ['bottom', 'dress-trousers', 'mid-grey'], ['shoes', 'loafer', 'dark-brown'], ['belt', 'belt', 'dark-brown'], ['pocket', 'pocket-square', 'white']]),
  },
  {
    id: 'winter-dinner', name: 'Winter dinner', occasion: 'dinner', styles: ['classic-tailoring', 'minimalist'],
    note: 'A roll-neck in place of shirt and tie, under flannel and a camel coat — warm, tonal and relaxed.',
    outfit: o([['top', 't-shirt', 'white'], ['mid', 'turtleneck', 'charcoal'], ['jacket', 'sport-coat', 'brown', 'herringbone'], ['bottom', 'dress-trousers', 'charcoal'], ['shoes', 'chelsea-boots', 'dark-brown'], ['coat', 'overcoat', 'camel'], ['scarf', 'scarf', 'burgundy']], { skin: 3, hair: 0, hairStyle: 2 }),
  },
  {
    id: 'ivy-campus', name: 'Ivy campus', occasion: 'weekend', styles: ['ivy', 'preppy'],
    note: 'Shetland, oxford cloth, khakis and loafers — the collegiate uniform of the 1950s.',
    outfit: o([['top', 'ocbd', 'white', 'oxford'], ['mid', 'crewneck-sweater', 'forest'], ['bottom', 'chinos', 'khaki'], ['shoes', 'loafer', 'oxblood'], ['belt', 'belt', 'brown']], { skin: 0, hair: 2, hairStyle: 0 }),
  },
  {
    id: 'workwear-layers', name: 'Workwear layers', occasion: 'weekend', styles: ['workwear', 'americana'],
    note: 'Tee, flannel, chore coat, denim and boots. Each layer is rugged and a slightly different depth of colour.',
    outfit: o([['top', 'flannel-shirt', 'red', 'tartan'], ['jacket', 'chore-coat', 'navy'], ['bottom', 'jeans', 'indigo', 'denim', 'straight'], ['shoes', 'work-boots', 'tan'], ['hat', 'beanie', 'rust', 'rib']], { skin: 4, hair: 0, hairStyle: 1 }),
  },
  {
    id: 'tonal-camel', name: 'Tonal camel', occasion: 'date', styles: ['minimalist', 'italian'],
    note: 'Tonal dressing: one family of colour in different lightnesses and textures.',
    outfit: o([['top', 'polo', 'ecru'], ['mid', 'cardigan', 'camel'], ['bottom', 'pleated-trousers', 'stone', 'solid', 'wide'], ['shoes', 'loafer', 'snuff']], { skin: 2, hair: 1, hairStyle: 2 }),
  },
  {
    id: 'contrast-navy-white', name: 'High contrast', occasion: 'date', styles: ['minimalist', 'mod'],
    note: 'The opposite of tonal: dark against light, clear and graphic.',
    outfit: o([['top', 'dress-shirt', 'white'], ['jacket', 'blazer', 'navy'], ['bottom', 'dress-trousers', 'ecru'], ['shoes', 'loafer', 'black'], ['eyewear', 'rectangular-glasses', 'black']]),
  },
  {
    id: 'relaxed-trousers', name: 'Relaxed line', occasion: 'weekend', styles: ['contemporary-casual', 'japanese-americana'],
    note: 'Wide pleated trousers with an easy top — volume below, a short layer above.',
    outfit: o([['top', 't-shirt', 'ecru'], ['mid', 'overshirt', 'olive'], ['bottom', 'pleated-trousers', 'charcoal', 'solid', 'wide'], ['shoes', 'derby', 'dark-brown']], { skin: 2, hair: 0, hairStyle: 1 }),
  },
  {
    id: 'tailored-trousers', name: 'Tailored line', occasion: 'office', styles: ['classic-tailoring'],
    note: 'The same idea in a slim, pressed silhouette — compare it with the relaxed line.',
    outfit: o([['top', 'ocbd', 'white', 'oxford'], ['mid', 'overshirt', 'olive'], ['bottom', 'dress-trousers', 'charcoal', 'solid', 'slim'], ['shoes', 'derby', 'dark-brown']], { skin: 2, hair: 0, hairStyle: 1 }),
  },
  {
    id: 'business-suit', name: 'Business suit', occasion: 'business', styles: ['classic-tailoring', 'british'],
    note: 'Charcoal, white, burgundy and black: the most dependable combination in tailoring.',
    outfit: o([['top', 'dress-shirt', 'white'], ['jacket', 'suit-jacket', 'charcoal'], ['bottom', 'suit-trousers', 'charcoal'], ['shoes', 'oxford', 'black'], ['neck', 'tie', 'burgundy'], ['pocket', 'pocket-square', 'white'], ['watch', 'watch', 'silver']], { skin: 1, hair: 4, hairStyle: 2 }),
  },
  {
    id: 'black-tie', name: 'Black tie', occasion: 'black-tie', styles: ['classic-tailoring'],
    note: 'Evening dress by convention: shawl collar, white shirt, black bow tie, patent shoes.',
    outfit: o([['top', 'dress-shirt-wing', 'white'], ['jacket', 'dinner-jacket', 'black'], ['bottom', 'dress-trousers-braid', 'black'], ['shoes', 'opera-pumps', 'black'], ['neck', 'bow-tie', 'black', 'satin'], ['pocket', 'pocket-square', 'white']], { skin: 3, hair: 0, hairStyle: 0 }),
  },
  {
    id: 'country-tweed', name: 'Country tweed', occasion: 'outdoors', styles: ['british', 'outdoor'],
    note: 'Tweed, cords, cable knit and brogues: earthy, textured and made for weather.',
    outfit: o([['top', 'ocbd', 'ecru', 'oxford'], ['mid', 'v-neck-sweater', 'forest'], ['jacket', 'sport-coat', 'brown', 'herringbone'], ['bottom', 'corduroys', 'camel', 'cord'], ['shoes', 'brogue', 'brown'], ['hat', 'flat-cap', 'brown', 'herringbone'], ['neck', 'knit-tie', 'burgundy']], { skin: 0, hair: 3, hairStyle: 0 }),
  },
  {
    id: 'mod-sharp', name: 'Mod', occasion: 'date', styles: ['mod'],
    note: 'Slim, clean, and immaculate: a Harrington over a polo, narrow trousers, Chelsea boots.',
    outfit: o([['top', 'polo', 'navy'], ['jacket', 'harrington', 'stone'], ['bottom', 'dress-trousers', 'charcoal', 'solid', 'slim'], ['shoes', 'chelsea-boots', 'black']], { skin: 1, hair: 0, hairStyle: 2 }),
  },
  {
    id: 'military-surplus', name: 'Surplus', occasion: 'weekend', styles: ['military', 'outdoor'],
    note: 'An M-65, fatigues and service boots — military clothes worn casually.',
    outfit: o([['top', 'henley', 'oatmeal'], ['jacket', 'field-jacket', 'olive'], ['bottom', 'fatigue-trousers', 'khaki'], ['shoes', 'service-boots', 'brown']], { skin: 3, hair: 1, hairStyle: 1 }),
  },
  {
    id: 'streetwear-layers', name: 'Street layers', occasion: 'weekend', styles: ['streetwear'],
    note: 'Hoodie under a bomber, relaxed cargos, clean sneakers.',
    outfit: o([['top', 't-shirt', 'white'], ['mid', 'hoodie', 'mid-grey'], ['jacket', 'bomber', 'black'], ['bottom', 'cargo-trousers', 'olive', 'solid', 'relaxed'], ['shoes', 'sneakers', 'white'], ['hat', 'baseball-cap', 'black']], { skin: 4, hair: 0, hairStyle: 1 }),
  },
  {
    id: 'amekaji', name: 'Amekaji', occasion: 'weekend', styles: ['japanese-americana', 'americana'],
    note: 'American workwear and Ivy reinterpreted with obsessive attention to cloth.',
    outfit: o([['top', 'chambray-shirt', 'sky'], ['mid', 'cardigan', 'oatmeal'], ['bottom', 'jeans', 'indigo', 'denim', 'straight'], ['shoes', 'service-boots', 'cognac'], ['eyewear', 'round-glasses', 'tortoise']], { skin: 2, hair: 0, hairStyle: 0 }),
  },
  {
    id: 'riviera', name: 'Riviera', occasion: 'summer-party', styles: ['italian', 'vintage-revival'],
    note: 'Camp collar, pleated linen, suede loafers. Ease and light colours.',
    outfit: o([['top', 'camp-collar-shirt', 'sage'], ['bottom', 'linen-trousers', 'ecru', 'solid', 'wide'], ['shoes', 'loafer', 'snuff'], ['eyewear', 'sunglasses', 'tortoise']], { skin: 3, hair: 1, hairStyle: 2 }),
  },
  {
    id: 'minimal-monochrome', name: 'Monochrome', occasion: 'office', styles: ['minimalist'],
    note: 'Black, grey and white in clean shapes; quality cloth does the talking.',
    outfit: o([['top', 't-shirt', 'white'], ['mid', 'crewneck-sweater', 'charcoal'], ['bottom', 'chinos', 'black', 'solid', 'straight'], ['shoes', 'sneakers', 'white'], ['coat', 'overcoat', 'black']], { skin: 1, hair: 0, hairStyle: 1 }),
  },
  {
    id: 'preppy-summer', name: 'Preppy summer', occasion: 'summer-party', styles: ['preppy'],
    note: 'Bright, crisp and a little sporting.',
    outfit: o([['top', 'polo', 'pink'], ['bottom', 'shorts', 'navy'], ['shoes', 'loafer', 'brown'], ['belt', 'belt', 'navy'], ['eyewear', 'sunglasses', 'black']], { skin: 0, hair: 3, hairStyle: 0 }),
  },
  {
    id: 'contemporary-casual', name: 'Easy Saturday', occasion: 'weekend', styles: ['contemporary-casual'],
    note: 'An overshirt over a tee with straight chinos and white sneakers — the modern default.',
    outfit: o([['top', 't-shirt', 'navy'], ['mid', 'overshirt', 'camel'], ['bottom', 'chinos', 'stone', 'solid', 'straight'], ['shoes', 'sneakers', 'white']], { skin: 4, hair: 0, hairStyle: 2 }),
  },
  {
    id: 'peacoat-weekend', name: 'Harbour weekend', occasion: 'weekend', styles: ['military', 'americana', 'preppy'],
    note: 'A navy peacoat over a cable-knit with dark denim and boots.',
    outfit: o([['top', 'ocbd', 'light-blue', 'oxford'], ['mid', 'cable-knit', 'ecru', 'cable'], ['coat', 'peacoat', 'navy'], ['bottom', 'jeans', 'indigo', 'denim'], ['shoes', 'service-boots', 'dark-brown'], ['hat', 'beanie', 'navy', 'rib']], { skin: 1, hair: 2, hairStyle: 1 }),
  },
  {
    id: 'vintage-1940s', name: 'Forties revival', occasion: 'dinner', styles: ['vintage-revival', 'classic-tailoring'],
    note: 'High-waisted pleated trousers, braces, a waistcoat and a fedora.',
    outfit: o([['top', 'dress-shirt', 'ecru'], ['mid', 'waistcoat', 'brown', 'herringbone'], ['bottom', 'pleated-trousers', 'brown', 'herringbone', 'wide'], ['braces', 'braces', 'burgundy'], ['shoes', 'brogue', 'dark-brown'], ['neck', 'tie', 'forest'], ['hat', 'fedora', 'brown']], { skin: 2, hair: 1, hairStyle: 0 }),
  },
]
export const preset = (id: string) => PRESETS.find(p => p.id === id)
