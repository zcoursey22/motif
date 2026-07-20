import 'dotenv/config';
import { db } from '../src/lib/db/client';
import { sessions, entries } from '../src/lib/db/schema';
import { Entry, Session } from '@/src/lib/schemas';
import { SelfRating } from '@/src/lib/constants';

type SeedEntry = Omit<Entry, 'id' | 'sessionId'>;

type SeedSession = Omit<Session, 'id'> & {
  entries: SeedEntry[];
};

const seedData: SeedSession[] = [
  {
    rawText:
      'Worked on ii-V-I voicings for 40 min on keys, then ran Giant Steps changes, felt shaky on the bridge',
    occurredAt: new Date('2026-06-22'),
    createdAt: new Date('2026-06-22'),
    entries: [
      {
        instrument: 'piano',
        focus: ['jazz', 'voicings', '251'],
        durationMin: 40,
        selfRating: SelfRating.ABOVE,
      },
      {
        instrument: 'piano',
        focus: ['jazz', 'changes'],
        durationMin: 25,
        selfRating: null,
      },
    ],
  },
  {
    rawText:
      'Practiced comping Autumn Leaves with a Charleston rhythm and felt good. Practiced the head to with some variations to prep for learning to solo over it.',
    occurredAt: new Date('2026-06-25'),
    createdAt: new Date('2026-06-25'),
    entries: [
      {
        instrument: 'guitar',
        focus: ['jazz', 'comping', 'rhythm'],
        durationMin: null,
        selfRating: SelfRating.STRONG,
      },
      {
        instrument: 'guitar',
        focus: ['jazz', 'lead', 'head'],
        durationMin: null,
        selfRating: null,
      },
    ],
  },
  {
    rawText:
      "Segovia studies, ran through clean in 5 minutes. Did it again but it wasn't quite as clean and took more like 6.",
    occurredAt: new Date('2026-06-28'),
    createdAt: new Date('2026-06-29'),
    entries: [
      {
        instrument: 'guitar',
        focus: ['classical', 'scales'],
        durationMin: 11,
        selfRating: SelfRating.ABOVE,
      },
    ],
  },
  {
    rawText:
      'Brass drills today. Ran scales on trombone but my intonation was a little off. Ended with ten minutes of long tones and trills on trumpet',
    occurredAt: new Date('2026-07-10'),
    createdAt: new Date('2026-07-10'),
    entries: [
      {
        instrument: 'trumpet',
        focus: ['long tones', 'trills'],
        durationMin: 10,
        selfRating: null,
      },
      {
        instrument: 'trombone',
        focus: ['scales'],
        durationMin: null,
        selfRating: SelfRating.BELOW,
      },
    ],
  },
  {
    rawText:
      "Trombone again, still not landing the intonation on the upper register but a little steadier than last time. Also picked up violin for the first time in a while, 15 mins, didn't feel good about it at all.",
    occurredAt: new Date('2026-07-13'),
    createdAt: new Date('2026-07-13'),
    entries: [
      {
        instrument: 'trombone',
        focus: ['scales', 'intonation'],
        durationMin: 20,
        selfRating: SelfRating.BELOW,
      },
      {
        instrument: 'violin',
        focus: [],
        durationMin: 15,
        selfRating: SelfRating.POOR,
      },
    ],
  },
  {
    rawText:
      "Back on piano after way too long, voicings felt rusty at first but came back. Also comped over Autumn Leaves again, that's feeling really solid now.",
    occurredAt: new Date('2026-07-15'),
    createdAt: new Date('2026-07-15'),
    entries: [
      {
        instrument: 'piano',
        focus: ['jazz', 'voicings', '251'],
        durationMin: 30,
        selfRating: SelfRating.BELOW,
      },
      {
        instrument: 'guitar',
        focus: ['jazz', 'comping'],
        durationMin: 20,
        selfRating: SelfRating.STRONG,
      },
    ],
  },
  {
    rawText:
      'Violin again, second time this week. Still rough but noticeably less bad than last time.',
    occurredAt: new Date('2026-07-16'),
    createdAt: new Date('2026-07-16'),
    entries: [
      {
        instrument: 'violin',
        focus: ['intonation'],
        durationMin: 15,
        selfRating: SelfRating.BELOW,
      },
    ],
  },
  {
    rawText:
      'Trumpet long tones, feeling more consistent with breath support. Ten minutes of trills after.',
    occurredAt: new Date('2026-07-17'),
    createdAt: new Date('2026-07-17'),
    entries: [
      {
        instrument: 'trumpet',
        focus: ['long tones', 'breath support'],
        durationMin: 15,
        selfRating: SelfRating.ABOVE,
      },
      {
        instrument: 'trumpet',
        focus: ['trills'],
        durationMin: 10,
        selfRating: null,
      },
    ],
  },
  {
    rawText:
      'Theory session, went through minor ii-V-i and some modal interchange stuff for about 25 min. Felt like it clicked.',
    occurredAt: new Date('2026-07-18'),
    createdAt: new Date('2026-07-18'),
    entries: [
      {
        instrument: null,
        focus: ['theory', 'harmony', 'modal interchange'],
        durationMin: 25,
        selfRating: SelfRating.STRONG,
      },
    ],
  },
  {
    rawText:
      "Trombone finally clicked, intonation felt genuinely good today, not just 'less bad.'",
    occurredAt: new Date('2026-07-19'),
    createdAt: new Date('2026-07-19'),
    entries: [
      {
        instrument: 'trombone',
        focus: ['scales', 'intonation'],
        durationMin: 25,
        selfRating: SelfRating.ABOVE,
      },
    ],
  },
  {
    rawText:
      "I studied some theory stuff like 2 5 1s and different ways to resolve them looking at jazz standards, probably half an hour. Then I played violin for 15 mins and didn't feel good about it at all.",
    occurredAt: new Date('2026-07-20'),
    createdAt: new Date('2026-07-20'),
    entries: [
      {
        instrument: null,
        focus: ['theory', 'harmony', 'jazz'],
        durationMin: 30,
        selfRating: SelfRating.ABOVE,
      },
      {
        instrument: 'violin',
        focus: [],
        durationMin: 15,
        selfRating: SelfRating.POOR,
      },
    ],
  },
];

async function main() {
  for (const s of seedData) {
    const [session] = await db.insert(sessions).values(s).returning();
    await db
      .insert(entries)
      .values(s.entries.map(e => ({ ...e, sessionId: session.id })));
  }
}

main()
  .then(() => {
    console.log('DB seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
