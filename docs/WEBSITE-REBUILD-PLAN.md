# Gurnaad Academy Website Rebuild Plan

## 1. Project goal

Make Ustaad Gurmeet Singh Sant Khalsa’s presence feel memorable, authentic, prestigious, and approachable online.

The website should present him as the living centre of Gurnaad Academy—not just as a service provider—and make it easy for a visitor to begin a conversation on WhatsApp.

## 2. Direction to keep

The Replit reference provides the strongest starting point:

- Dark, warm, premium visual atmosphere
- Editorial serif typography
- Calm, deliberate motion
- Instrument-led storytelling
- Clear academy heritage
- Ustaad Ji positioned as founder and teacher
- Curriculum and tuition sections

We should preserve this foundation but make the result more human and specific to Ustaad Ji through real photography, verified history, real recordings, and a clearer contact journey.

## 3. Comparison: old site vs reference vs final direction

| Area | Old Wix site | Replit reference | Final direction |
|---|---|---|---|
| First impression | Plain brochure | Premium cinematic concept | Cinematic introduction centred on Ustaad Ji |
| Main message | Academy introduction | “Where the Guru’s music lives” | A memorable statement about Ustaad Ji preserving and teaching the living tradition |
| Ustaad Ji | Biography lower on page | Strong founder section | Hero-level presence, portrait, voice, teaching philosophy, and legacy |
| Instruments | Mentioned in text | Animated instrument sections | Real or accurately modelled instruments with restrained scroll motion |
| Classes | Basic booking cards | Curriculum categories | Clear learning paths with WhatsApp enquiry actions |
| Contact | Form, email, phone | Contact details and booking | Sticky WhatsApp action plus simple enquiry form |
| Events | Separate gallery/events pages | Supporting content | Real event stories, student moments, and performances |
| Tuition | Accessibility quote only | Full, half, and open access | Keep only after confirming the current policy |
| Trust | Basic claims | Strong numerical claims | Verified statistics, testimonials, media, and teaching evidence |
| Motion | Almost none | Abstract animations | Meaningful instrument, portrait, and text motion with mobile fallback |

## 4. Proposed homepage structure

### Section 1: Opening presence

**Purpose:** Make visitors immediately remember Ustaad Ji.

**Content:**

- Full-screen real portrait or short real video
- Ustaad Ji’s name and title
- One concise mission statement
- Primary WhatsApp action
- Secondary “Explore the tradition” action

**Suggested message:**

> Ustaad Gurmeet Singh Sant Khalsa
> Preserving the living tradition of Gurmat Sangeet.

The first screen should not begin with a generic instrument animation. The instrument can move around the portrait, but Ustaad Ji must remain the emotional anchor.

### Section 2: The living tradition

**Purpose:** Explain what makes the academy different.

Introduce Puratan Reet, Gurbani Kirtan, Gurmat Sangeet, and the academy’s mission in accessible language.

Use a slow reveal of text, hands, instruments, or archival imagery. Avoid overloading visitors with terminology before explaining its meaning.

### Section 3: Instrument journey

**Purpose:** Create the memorable interactive moment.

Show selected instruments one at a time:

- Rabab
- Taus
- Dilruba
- Esraj
- Tar Shehnai
- Harmonium

Each item should include the name, a short explanation, and an optional “hear or learn more” action. The 3D experience should be limited to one carefully designed sequence, with still-image and lightweight animation fallbacks for slower devices.

### Section 4: Ustaad Ji’s story

**Purpose:** Build trust and emotional connection.

Use an authentic portrait, a short biography, teaching philosophy, and a clear list of what he teaches.

Possible supporting content:

- How he began learning
- What Puratan Reet means to him
- Why he teaches
- How online and in-person learning work

### Section 5: Legacy and proof

**Purpose:** Establish credibility without making the page feel promotional.

Display only verified figures, supported by photographs, videos, student stories, or event evidence.

Potential metrics:

- Academy founding year
- Years of teaching
- Students taught
- Current learners
- Countries reached

### Section 6: Learning paths

**Purpose:** Help visitors understand how they can participate.

Recommended categories:

- Gurmat Sangeet vocal
- Gurbani Kirtan
- Tanti Saaz
- Dilruba and Esraj
- Taus and Tar Shehnai
- Rabab
- Harmonium and music theory
- International online learning

Every category should end with a short WhatsApp action such as “Ask about this class.”

### Section 7: Academy life

**Purpose:** Show that this is an active, welcoming community.

Use real images or videos of:

- Students learning
- Group performances
- Annual functions
- Instruments in use
- Ustaad Ji teaching

Short captions are more useful than a large undifferentiated image gallery.

### Section 8: Access and tuition

**Purpose:** Communicate the academy’s inclusiveness.

Keep the message about music being available to every heart, but confirm the actual current options before publishing “full tuition,” “half tuition,” or “open access.”

### Section 9: Closing invitation

**Purpose:** Convert interest into a conversation.

Suggested message:

> Begin your journey with the Guru’s music.

Actions:

- WhatsApp Ustaad Ji
- Ask about classes
- Visit the academy

## 5. Proposed site map

### Home

Immersive introduction, Ustaad Ji, instruments, learning paths, proof, and WhatsApp CTA.

### About Ustaad Ji

Detailed biography, philosophy, lineage, teaching approach, and media.

### Instruments

Individual instrument stories, photos or 3D views, recordings, and related classes.

### Classes

Learning options for local, online, and international students. Keep pricing/enquiry information clear.

### Academy life

Events, students, performances, testimonials, and gallery stories.

### Contact

WhatsApp, phone, email, location, hours, map, and enquiry form.

## 6. Keep, redesign, remove

### Keep

- The academy’s founding story
- Ustaad Ji’s central role
- Traditional instrument teaching
- International learning
- The inclusive spirit of the academy
- Dark classic-modern visual foundation
- Instrument-led scrolling concept

### Redesign

- Hero section
- Founder biography
- Instrument presentation
- Class booking journey
- Gallery and events
- Contact experience
- Social proof and statistics

### Remove or avoid

- Generic template-style sections
- Unverified student and experience numbers
- Placeholder social and map links
- Too many decorative particles
- Full 3D across every section
- Autoplay audio
- Long walls of text
- Complicated booking before the visitor understands the academy

## 7. Content and asset requirements

### Highest priority

- Three to five high-quality portraits of Ustaad Ji
- One seated portrait with an instrument
- Teaching photographs
- Instrument photographs from multiple angles
- Short video of Ustaad Ji teaching or performing
- One or two clean audio recordings
- Student and event photographs
- Accurate class list and schedule
- Current WhatsApp number

### Useful later

- Historical photographs
- Student testimonials with permission
- Instrument close-up video
- Gurmukhi or archival visual material
- Location photographs

AI tools such as Higgsfield can help with visual concepts, cinematic transitions, atmospheric scenes, and motion references. They should not fabricate Ustaad Ji’s identity, student outcomes, historical claims, or sacred context.

## 8. Facts requiring confirmation

The two versions currently contain conflicting claims:

- Experience: 25+ years vs 35+ years
- Students taught: 1,000+ vs 10,000+
- Active learners: approximately 200 vs 200+
- Phone numbers: multiple numbers appear across the pages
- Social accounts and map links: some appear to be placeholders

These must be confirmed with Ustaad Ji before the content is finalised.

## 9. Recommended build strategy

### Prototype first

Build only the following as the first visual prototype:

1. Hero with Ustaad Ji
2. One instrument interaction
3. Founder introduction
4. WhatsApp CTA

This will test the visual identity, motion quality, mobile behavior, and emotional impact before we invest in the complete website.

### Technology direction

- React or Next.js
- Three.js / React Three Fiber for the instrument sequence
- GSAP or Motion for scroll choreography
- Optimized real images and video
- Simple editable content layer
- WhatsApp-first enquiry flow

## 10. Approval checkpoint

Before design or development, approve these decisions:

- Ustaad Ji is the primary visual and emotional focus.
- The mood is classic, minimal, spiritual, and modern—not loud or game-like.
- Real media is the source of truth for Ustaad Ji and the academy.
- One high-quality 3D instrument sequence is enough for the first version.
- WhatsApp is the main conversion path.
- All numerical claims and contact details will be verified.

Once these are approved, the next deliverable is a detailed visual brief with colour palette, typography, motion rules, and a desktop/mobile homepage wireframe.
