export const SESSIONS_QUERY_KEY = 'sessions';

// RATING

export const SelfRating = {
  POOR: 'poor',
  BELOW: 'below',
  ABOVE: 'above',
  STRONG: 'strong',
} as const;
export type SelfRating = (typeof SelfRating)[keyof typeof SelfRating];

// INSTRUMENT

export const Instrument = {
  // Voice
  VOICE: 'voice',
  // Strings
  GUITAR: 'guitar',
  BASS_GUITAR: 'bass_guitar',
  UKULELE: 'ukulele',
  BANJO: 'banjo',
  MANDOLIN: 'mandolin',
  STEEL_GUITAR: 'steel_guitar',
  VIOLIN: 'violin',
  VIOLA: 'viola',
  CELLO: 'cello',
  UPRIGHT_BASS: 'upright_bass',
  HARP: 'harp',
  // Woodwind
  SAXOPHONE: 'saxophone',
  CLARINET: 'clarinet',
  FLUTE: 'flute',
  OBOE: 'oboe',
  BASSOON: 'bassoon',
  RECORDER: 'recorder',
  HARMONICA: 'harmonica',
  OCARINA: 'ocarina',
  WHISTLE: 'whistle',
  // Brass
  TRUMPET: 'trumpet',
  TROMBONE: 'trombone',
  FRENCH_HORN: 'french_horn',
  EUPHONIUM: 'euphonium',
  TUBA: 'tuba',
  // Keys
  PIANO: 'piano',
  ORGAN: 'organ',
  KEYBOARD: 'keyboard',
  ACCORDION: 'accordion',
  MELODICA: 'melodica',
  // Percussion
  DRUMS: 'drums',
  VIBRAPHONE: 'vibraphone',
  KALIMBA: 'kalimba',
  PERCUSSION: 'percussion',
} as const;
export type Instrument = (typeof Instrument)[keyof typeof Instrument];

export const INSTRUMENT_GROUPS: { label: string; items: Instrument[] }[] = [
  {
    label: 'Strings',
    items: [
      'guitar',
      'bass_guitar',
      'ukulele',
      'banjo',
      'mandolin',
      'steel_guitar',
      'violin',
      'viola',
      'cello',
      'upright_bass',
      'harp',
    ],
  },
  {
    label: 'Woodwind',
    items: [
      'saxophone',
      'clarinet',
      'flute',
      'oboe',
      'bassoon',
      'recorder',
      'harmonica',
      'ocarina',
      'whistle',
    ],
  },
  {
    label: 'Brass',
    items: ['trumpet', 'trombone', 'french_horn', 'euphonium', 'tuba'],
  },
  {
    label: 'Keys',
    items: ['piano', 'organ', 'keyboard', 'accordion', 'melodica'],
  },
  {
    label: 'Percussion',
    items: ['drums', 'vibraphone', 'kalimba', 'percussion'],
  },
];

export const INSTRUMENT_LABELS: Record<Instrument, string> = {
  voice: 'Voice',
  guitar: 'Guitar',
  steel_guitar: 'Steel guitar',
  ukulele: 'Ukulele',
  banjo: 'Banjo',
  mandolin: 'Mandolin',
  bass_guitar: 'Bass guitar',
  upright_bass: 'Upright bass',
  violin: 'Violin',
  viola: 'Viola',
  cello: 'Cello',
  harp: 'Harp',
  saxophone: 'Saxophone',
  clarinet: 'Clarinet',
  flute: 'Flute',
  oboe: 'Oboe',
  bassoon: 'Bassoon',
  recorder: 'Recorder',
  harmonica: 'Harmonica',
  ocarina: 'Ocarina',
  whistle: 'Whistle',
  trumpet: 'Trumpet',
  trombone: 'Trombone',
  french_horn: 'French horn',
  euphonium: 'Euphonium',
  tuba: 'Tuba',
  piano: 'Piano',
  organ: 'Organ',
  keyboard: 'Keyboard',
  accordion: 'Accordion',
  melodica: 'Melodica',
  drums: 'Drums',
  vibraphone: 'Vibraphone',
  kalimba: 'Kalimba',
  percussion: 'Percussion',
};

// FOCUS

export const Focus = {
  // General
  WARMUP: 'warmup',
  TECHNIQUE: 'technique',
  // Technique detail
  SCALES: 'scales',
  ARPEGGIOS: 'arpeggios',
  ARTICULATION: 'articulation',
  ORNAMENTS: 'ornaments',
  PHRASING: 'phrasing',
  PICKING: 'picking',
  BENDING: 'bending',
  // Tone
  TONE: 'tone',
  INTONATION: 'intonation',
  VIBRATO: 'vibrato',
  DYNAMICS: 'dynamics',
  // Rhythm
  RHYTHM: 'rhythm',
  TIMING: 'timing',
  GROOVE: 'groove',
  STRUMMING: 'strumming',
  // Harmony
  COMPING: 'comping',
  VOICINGS: 'voicings',
  CHORDS: 'chords',
  THEORY: 'theory',
  // Improv
  IMPROVISATION: 'improvisation',
  LICKS: 'licks',
  RIFFS: 'riffs',
  TRANSCRIPTION: 'transcription',
  // Reading & ear
  SIGHT_READING: 'sight_reading',
  AURAL: 'aural',
  // Creative
  COMPOSITION: 'composition',
  SONGWRITING: 'songwriting',
  ARRANGING: 'arranging',
  RECORDING: 'recording',
  // Repertoire & playing
  REPERTOIRE: 'repertoire',
  PERFORMANCE: 'performance',
  ENSEMBLE: 'ensemble',
  // Style
  JAZZ: 'jazz',
  CLASSICAL: 'classical',
  BLUES: 'blues',
  ROCK: 'rock',
  POP: 'pop',
  FOLK: 'folk',
  LATIN: 'latin',
  FUNK: 'funk',
  RB_SOUL: 'rb_soul',
  COUNTRY: 'country',
  WORLD: 'world',
  ELECTRONIC: 'electronic',
  METAL: 'metal',
  REGGAE: 'reggae',
  THEATER: 'theater',
} as const;
export type Focus = (typeof Focus)[keyof typeof Focus];

export const FOCUS_GROUPS: { label: string; items: Focus[] }[] = [
  { label: 'General', items: ['warmup', 'technique'] },
  {
    label: 'Technique',
    items: [
      'scales',
      'arpeggios',
      'articulation',
      'ornaments',
      'phrasing',
      'picking',
      'bending',
    ],
  },
  { label: 'Tone', items: ['tone', 'intonation', 'vibrato', 'dynamics'] },
  { label: 'Rhythm', items: ['rhythm', 'timing', 'groove', 'strumming'] },
  { label: 'Harmony', items: ['comping', 'voicings', 'chords', 'theory'] },
  {
    label: 'Improv',
    items: ['improvisation', 'licks', 'riffs', 'transcription'],
  },
  { label: 'Reading & ear', items: ['sight_reading', 'aural'] },
  {
    label: 'Creative',
    items: ['composition', 'songwriting', 'arranging', 'recording'],
  },
  { label: 'Repertoire', items: ['repertoire', 'performance', 'ensemble'] },
  {
    label: 'Style',
    items: [
      'jazz',
      'classical',
      'blues',
      'rock',
      'metal',
      'pop',
      'folk',
      'latin',
      'reggae',
      'funk',
      'rb_soul',
      'country',
      'world',
      'electronic',
      'theater',
    ],
  },
];

export const STYLE_FOCUSES = new Set<Focus>(
  FOCUS_GROUPS.find(g => g.label === 'Style')!.items
);
export const isStyle = (f: Focus) => STYLE_FOCUSES.has(f);

export const FOCUS_LABELS: Record<Focus, string> = {
  warmup: 'Warmup',
  technique: 'Technique',
  scales: 'Scales',
  arpeggios: 'Arpeggios',
  articulation: 'Articulation',
  ornaments: 'Ornaments',
  phrasing: 'Phrasing',
  picking: 'Picking',
  bending: 'Bending',
  tone: 'Tone',
  intonation: 'Intonation',
  vibrato: 'Vibrato',
  dynamics: 'Dynamics',
  rhythm: 'Rhythm',
  timing: 'Timing',
  groove: 'Groove',
  strumming: 'Strumming',
  comping: 'Comping',
  voicings: 'Voicings',
  chords: 'Chords',
  theory: 'Theory',
  improvisation: 'Improvisation',
  licks: 'Licks',
  riffs: 'Riffs',
  transcription: 'Transcription',
  sight_reading: 'Reading',
  aural: 'Aural',
  composition: 'Composition',
  songwriting: 'Songwriting',
  arranging: 'Arranging',
  recording: 'Recording',
  repertoire: 'Repertoire',
  performance: 'Performance',
  ensemble: 'Ensemble',
  jazz: 'Jazz',
  classical: 'Classical',
  blues: 'Blues',
  rock: 'Rock',
  metal: 'Metal',
  pop: 'Pop',
  folk: 'Folk',
  latin: 'Latin',
  funk: 'Funk',
  reggae: 'Reggae',
  rb_soul: 'R&B / Soul',
  country: 'Country',
  world: 'World',
  electronic: 'Electronic',
  theater: 'Musical',
};
