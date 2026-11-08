import data from './photos.json'

/** Openly licensed photographs of real garments and people; photos.json is the provenance manifest for them. */
export type Photo = Omit<(typeof data)[number], 'usage'> & { usage: { garments: string[]; body: string[]; styles: string[] } }
export const PHOTOS: Photo[] = data

export const photoFor = (kind: 'garments' | 'body' | 'styles', id: string) => PHOTOS.find(p => p.usage[kind].includes(id))
