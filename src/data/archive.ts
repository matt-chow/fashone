import data from './archive.json'

/** Curated public-domain / openly licensed archival images; archive.json is also the machine-readable provenance manifest. */
export type ArchiveImage = Omit<(typeof data)[number], 'usage'> & { usage: { garments: string[]; styles: string[]; chapters: string[]; home: boolean } }
export const ARCHIVE: ArchiveImage[] = data

export const archiveFor = (kind: 'garments' | 'styles' | 'chapters', id: string) => ARCHIVE.find(a => a.usage[kind].includes(id))

/** Where an image is shown first, for linking from the home page. */
export const archiveHref = (a: ArchiveImage) =>
  a.usage.styles[0] ? `/atlas/${a.usage.styles[0]}` : a.usage.garments[0] ? `/encyclopedia/${a.usage.garments[0]}` : a.usage.chapters[0] ? `/handbook/${a.usage.chapters[0]}` : `/credits#${a.id}`
