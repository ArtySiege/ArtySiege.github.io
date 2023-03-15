type CardDetails = {
  name: string
  nameParts: [string, string?]
  headerScale: number
  img: string

  // Card categorisation
  number: number
  rarity: 'common' | 'rare' | 'fresh'
  featureType: CardFeatureType
  series: string
  seriesNumber: string
  seriesTotal: string

  // Game mechanics
  grid: readonly [string, string, string, string, string, string, string, string]
  points: number
  specialCost: number
  // Artist details
  artist: string
  artistAlias: string
  artistLinks?: Array<{ title: string; link: string }>
  creditColorOverride?: string
  seriesColorOverride?: string
  // Artist remarks
  description?: string
}

type CardFeatureType =
  | 'Shooter'
  | 'Blaster'
  | 'Roller'
  | 'Brush'
  | 'Charger'
  | 'Bucket'
  | 'Splatling'
  | 'Dualie'
  | 'Brella'
  | 'Stringer'
  | 'Splatana'
  | 'Sub'
  | 'Special'
  | 'NPC'
  | 'Brand'
  | 'Octarian Army'
  | 'Salmonid'
  | 'Key Item'

const FeatureTypeFilterOptions = [
  {
    Weapons: [
      'Shooter',
      'Blaster',
      'Roller',
      'Brush',
      'Charger',
      'Bucket',
      'Splatling',
      'Dualie',
      'Brella',
      'Stringer',
      'Splatana',
    ],
  },
  'Sub',
  'Special',
  'NPC',
  'Brand',
  'Octarian Army',
  'Salmonid',
  'Key Item',
]

type CardRenderingSettings = {
  type: 'rtcg' | 's3'
  effects: 'flashy' | 'color' | 'b&w'
}

export type { CardDetails, CardFeatureType, CardRenderingSettings }
export { FeatureTypeFilterOptions }
