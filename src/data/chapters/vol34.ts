import type { Chapter } from '../types'

export const VOL3: Chapter[] = [
  {
    id: 'the-suit', volume: 3, title: 'The Suit', minutes: 9,
    dek: 'How to choose, wear and combine the cornerstone of formal dress.',
    garments: ['suit', 'suit-jacket', 'suit-trousers', 'waistcoat', 'double-breasted-jacket'], styles: ['classic-tailoring'],
    blocks: [
      { t: 'p', text: 'A first suit should be navy or charcoal, solid or with a subtle texture, in a mid-weight worsted wool. That suit will serve at interviews, weddings, funerals and business meetings for years.' },
      { t: 'demo', kind: 'preset', preset: 'business-suit' },
      { t: 'h', text: 'Combining shirt, tie and suit' },
      { t: 'list', items: ['Start with the suit, then choose a lighter shirt.', 'The tie should be darker than the shirt.', 'Vary pattern scale between all three.', 'Shoes: black oxfords with charcoal or navy, dark brown with lighter greys and browns.'] },
      { t: 'note', text: '**Interpretation:** wearing a suit with a roll-neck or a polo knit removes its corporate edge — elegant for evening.' },
      { t: 'deeper', title: 'Single- or double-breasted?', body: ['Single-breasted suits are the default. Double-breasted suits are more formal and striking, must be worn fastened, and suit taller frames — though a well-cut DB flatters almost anyone.'] },
    ],
  },
  {
    id: 'smart-casual', volume: 3, title: 'Smart Casual, Decoded', minutes: 8,
    dek: 'The most requested and least defined dress code. Here is a working definition.',
    blocks: [
      { t: 'p', text: 'Smart casual means **neater than weekend, looser than business**. In practice: collared shirts or fine knitwear, chinos or wool trousers, leather shoes or clean minimal sneakers, and an optional unstructured jacket.' },
      { t: 'demo', kind: 'preset', preset: 'navy-blazer' },
      { t: 'list', items: ['Swap the tie for an open collar or a roll-neck.', 'Swap the suit for separates: a [blazer](g:blazer) or [sport coat](g:sport-coat) with contrasting trousers.', 'Choose texture — oxford cloth, flannel, suede — over sheen.'] },
      { t: 'demo', kind: 'challenge', challenge: 'smart-casual-dinner', caption: 'Challenge: assemble a smart-casual dinner outfit.' },
      { t: 'note', text: '**Interpretation:** in creative workplaces, smart casual may include dark jeans. In traditional ones, it rarely does.' },
    ],
  },
  {
    id: 'occasions', volume: 3, title: 'Dressing for Occasions', minutes: 9,
    dek: 'Weddings, interviews, funerals, dinners: how to read a dress code and answer it.',
    blocks: [
      { t: 'p', text: 'Every occasion carries an expected range of formality. Dressing well means landing inside that range — and, if anything, a step above.' },
      { t: 'list', items: ['**Interview** — one step above the workplace norm.', '**Wedding guest** — a suit unless the invitation says otherwise; avoid white and anything that competes with the wedding party.', '**Funeral** — dark suit, white shirt, dark tie, black shoes.', '**Black tie** — see [Evening Dress](c:black-tie).'] },
      { t: 'demo', kind: 'challenge', challenge: 'interview', caption: 'Challenge: dress for a job interview at a traditional firm.' },
      { t: 'demo', kind: 'challenge', challenge: 'summer-wedding', caption: 'Challenge: a summer wedding in the countryside.' },
    ],
  },
  {
    id: 'dressing-for-weather', volume: 3, title: 'Seasons & Weather', minutes: 7,
    dek: 'Cloth weight, colour and layering change with the year.',
    blocks: [
      { t: 'p', text: 'In summer, choose open weaves — linen, seersucker, fresco, cotton — and lighter colours that reflect heat. In winter, choose dense weaves and napped cloths — flannel, tweed, corduroy, heavy knits — and deeper colours.' },
      { t: 'demo', kind: 'preset', preset: 'riviera' },
      { t: 'list', items: ['Spring and autumn are layering seasons: overshirts, light coats, knitwear.', 'Suede and linen dislike rain; wool and waxed cotton shrug it off.', 'Dark colours absorb heat; light ones reflect it.'] },
      { t: 'demo', kind: 'challenge', challenge: 'winter-weekend', caption: 'Challenge: a cold weekend walk.' },
    ],
  },
  {
    id: 'layering', volume: 3, title: 'The Art of Layering', minutes: 7,
    dek: 'Each layer should be slightly larger, slightly heavier, and say something about the one beneath.',
    blocks: [
      { t: 'p', text: 'Good layering builds from thin to thick, close to loose. A tee, then an oxford or flannel, then a knit or overshirt, then a jacket, then a coat.' },
      { t: 'demo', kind: 'preset', preset: 'workwear-layers' },
      { t: 'list', items: ['Vary textures between layers so each is visible.', 'Keep collars and hems orderly — one collar on show is usually enough.', 'Make sure the outermost layer is the most formal or the most rugged, depending on your direction.'] },
      { t: 'note', text: '**Interpretation:** a hoodie under an overcoat is a deliberate high–low contrast. It works when both pieces are good and the rest is simple.' },
    ],
  },
  {
    id: 'ivy-and-preppy', volume: 3, title: 'Ivy, Preppy & the Campus', minutes: 8,
    dek: 'How American students turned British country clothes into an enduring style.',
    styles: ['ivy', 'preppy', 'mod'],
    blocks: [
      { t: 'p', text: '[Ivy style](s:ivy) took the sack jacket, the button-down collar and the loafer and made them a uniform. [Preppy](s:preppy) brightened it; the British [mods](s:mod) sharpened it.' },
      { t: 'demo', kind: 'preset', preset: 'ivy-campus' },
      { t: 'list', items: ['Natural shoulders and soft tailoring', 'Oxford cloth, shetland and khaki', 'Penny loafers and rep ties', 'A certain studied carelessness'] },
      { t: 'demo', kind: 'challenge', challenge: 'ivy', caption: 'Challenge: build an Ivy outfit for an autumn lecture.' },
    ],
  },
  {
    id: 'denim-and-workwear', volume: 3, title: 'Denim & Workwear', minutes: 8,
    dek: 'Hardwearing clothes from the farm, the factory and the railway, now everyday classics.',
    styles: ['workwear', 'americana', 'japanese-americana'],
    blocks: [
      { t: 'p', text: '[Jeans](g:jeans), [chore coats](g:chore-coat), [flannel shirts](g:flannel-shirt) and [work boots](g:work-boots) share a philosophy: honest materials, sturdy construction, and the ability to age well.' },
      { t: 'demo', kind: 'preset', preset: 'workwear-layers' },
      { t: 'h', text: 'Denim on denim' },
      { t: 'p', text: 'Pairing a denim jacket with jeans works best when the two blues differ clearly in depth — a mid-wash jacket over dark raw jeans, for instance. Matching washes exactly reads as a uniform.' },
      { t: 'demo', kind: 'preset', preset: 'amekaji' },
    ],
  },
]

export const VOL4: Chapter[] = [
  {
    id: 'personal-style', volume: 4, title: 'Finding a Personal Style', minutes: 7,
    dek: 'Style is the sum of repeated choices. Here is how to make yours deliberate.',
    blocks: [
      { t: 'p', text: 'Personal style comes from noticing what you return to. Which outfits make you feel most like yourself? Which traditions — [Ivy](s:ivy), [workwear](s:workwear), [minimalism](s:minimalist) — feel natural?' },
      { t: 'list', items: ['Collect references: photographs, films, people whose clothes you admire.', 'Find the common threads: colours, silhouettes, textures.', 'Build a small uniform around them, then vary it.'] },
      { t: 'note', text: '**Interpretation:** it is fine to belong to more than one tradition. Many of the best-dressed people combine two — tailoring with workwear, Ivy with streetwear.' },
      { t: 'demo', kind: 'preset', preset: 'contemporary-casual' },
    ],
  },
  {
    id: 'tonal-dressing', volume: 4, title: 'Tonal & Contrast Dressing', minutes: 6,
    dek: 'Two strategies for colour: shades of one family, or clear opposition.',
    blocks: [
      { t: 'p', text: 'Tonal dressing uses one colour family in several lightnesses — ecru, camel, stone, brown — and relies on texture to separate the layers. Contrast dressing places light against dark for a graphic, crisp effect.' },
      { t: 'demo', kind: 'preset', preset: 'tonal-camel', caption: 'Tonal: one family, many textures.' },
      { t: 'demo', kind: 'preset', preset: 'contrast-navy-white', caption: 'Contrast: dark against light.' },
      { t: 'note', text: '**Interpretation:** tonal outfits feel calm and expensive; contrast outfits feel sharp and energetic. Neither is more correct.' },
    ],
  },
  {
    id: 'black-tie', volume: 4, title: 'Evening Dress', minutes: 7,
    dek: 'Black tie is the most codified dress code in menswear. Learn it once and it is easy.',
    garments: ['dinner-jacket', 'dinner-suit', 'dress-shirt-wing', 'bow-tie', 'opera-pumps'],
    blocks: [
      { t: 'demo', kind: 'preset', preset: 'black-tie' },
      { t: 'list', items: ['Black or midnight-navy [dinner jacket](g:dinner-jacket) with silk-faced shawl or peak lapels', 'Matching [trousers](g:dress-trousers-braid) with a silk braid', 'White [evening shirt](g:dress-shirt-wing) with a turndown collar', 'Black self-tied [bow tie](g:bow-tie)', 'Black patent or highly polished [shoes](g:opera-pumps)'] },
      { t: 'note', text: '**Convention:** notch lapels, long ties and brown shoes are out of place at black tie.' },
      { t: 'demo', kind: 'challenge', challenge: 'black-tie', caption: 'Challenge: assemble correct black tie.' },
    ],
  },
  {
    id: 'buying-well', volume: 4, title: 'Buying Well', minutes: 7,
    dek: 'How to judge quality, spend sensibly, and avoid regret.',
    blocks: [
      { t: 'p', text: 'Price is a poor guide to quality. Construction, cloth and fit are better ones.' },
      { t: 'list', items: ['**Seams** should be straight and dense, with patterns matched at seams on good shirts and jackets.', '**Cloth** should feel substantial for its type.', '**Construction** — canvassed jackets, welted shoes and loopwheel cottons last longer and can be repaired.', '**Second-hand** is an excellent way to buy quality tailoring and outerwear cheaply.'] },
      { t: 'note', text: '**Interpretation:** cost-per-wear is a useful idea — a coat worn two hundred times is cheaper than a bargain worn twice.' },
    ],
  },
  {
    id: 'care', volume: 4, title: 'Care & Repair', minutes: 6,
    dek: 'Clothes last longer when you look after them — and good care is mostly about doing less.',
    blocks: [
      { t: 'list', items: ['Rest tailoring and shoes a day between wears.', 'Use cedar shoe trees and wide hangers.', 'Brush wool instead of dry-cleaning it.', 'Fold knitwear; hanging stretches it.', 'Wash denim rarely and cold.', 'Resole and repair rather than replace.'] },
      { t: 'p', text: 'Each [encyclopedia entry](/encyclopedia) has a care section for that garment.' },
    ],
  },
  {
    id: 'tailor', volume: 4, title: 'Working with a Tailor', minutes: 5,
    dek: 'Small alterations transform off-the-peg clothes. Know what is easy and what is not.',
    blocks: [
      { t: 'list', items: ['**Easy:** hemming trousers, shortening sleeves, taking in a waist or a shirt\'s sides.', '**Moderate:** tapering trouser legs, adjusting jacket waist.', '**Difficult or impossible:** shoulders, jacket length, collar issues.'] },
      { t: 'note', text: '**Convention:** buy for the shoulder and the length; alter the rest.' },
    ],
  },
  {
    id: 'rules-and-breaking', volume: 4, title: 'Conventions & When to Break Them', minutes: 6,
    dek: 'The rules exist for reasons. Knowing them lets you play.',
    blocks: [
      { t: 'p', text: 'Every convention in this book can be broken — and many of the best-dressed people do. The difference between a mistake and a decision is that a decision is made knowingly and carried out with confidence.' },
      { t: 'list', items: ['Break one convention at a time.', 'Keep the rest of the outfit precise.', 'Know your context: a broken rule at a party is charming; at a funeral, careless.'] },
      { t: 'demo', kind: 'preset', preset: 'streetwear-layers' },
      { t: 'p', text: 'When you are ready, the [Studio](/studio) is a place to experiment without consequences.' },
    ],
  },
]
