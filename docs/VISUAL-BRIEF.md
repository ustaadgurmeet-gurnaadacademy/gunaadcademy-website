# Gurnaad Academy Visual Brief

## 1. Creative concept

### The Living Tradition

The website should feel like entering a quiet, beautifully lit room where an old instrument is still being played.

The design combines:

- Classical Indian musical heritage
- Sikh spiritual reverence
- Editorial minimalism
- Modern cinematic movement
- Human warmth and trust

The experience should feel premium without feeling commercial, and modern without making the tradition feel like a technology demo.

## 2. Emotional targets

Within the first 10 seconds, visitors should feel:

1. “This person is a serious master.”
2. “This tradition is alive and worth discovering.”
3. “I can approach this academy.”

The visual system must balance authority with accessibility. Ustaad Ji should feel respected, but never distant.

## 3. Colour palette

### Primary palette

| Role | Colour | Hex |
|---|---|---|
| Night background | Near-black brown | `#100D0A` |
| Deep surface | Warm charcoal | `#1B1611` |
| Ivory text | Soft parchment | `#F2EBDD` |
| Muted text | Aged stone | `#B9AD9B` |
| Heritage accent | Antique gold | `#B98A3E` |
| Bright accent | Warm brass | `#D7B56D` |
| Dark green accent | Forest patina | `#25362F` |

### Usage rules

- Use the near-black brown for the hero and major cinematic sections.
- Use ivory for primary text, never pure white.
- Use gold for borders, small labels, active states, and important highlights.
- Use green sparingly for sections connected to nature, calm, or teaching.
- Do not use gradients that look neon or futuristic.

## 4. Typography

### Display type

Use an elegant high-contrast serif for major headlines. Good candidates for testing:

- Cormorant Garamond
- DM Serif Display
- Playfair Display

### Body type

Use a restrained sans-serif for navigation, descriptions, buttons, and metadata:

- Manrope
- Inter
- IBM Plex Sans

### Typography behavior

- Large headlines should be calm and spacious, not oversized for spectacle.
- Use italic serif sparingly for poetic phrases.
- Use uppercase sans-serif for small labels and section numbers.
- Keep paragraphs short and readable.
- Avoid decorative Gurmukhi text unless it is accurate, intentional, and reviewed by someone qualified.

## 5. Image direction

### Preferred imagery

- Warm natural lighting
- Real portraits of Ustaad Ji
- Hands playing instruments
- Close-ups of wood, strings, bows, cloth, and metal
- Teaching moments with real students
- Quiet academy details
- Event images with visible human connection

### Image treatment

- Slightly warm colour grading
- Natural skin tones
- Soft shadows
- Film-like contrast
- Occasional monochrome or desaturated treatment for archival images

Avoid stock photographs, artificial guru imagery, over-processed portraits, and visuals that invent religious or historical scenes.

## 6. Motion language

### Motion should feel like

- Breath
- Resonance
- A bow moving across a string
- A page turning
- Light passing across polished wood
- A slow, deliberate camera movement

### Motion rules

- Use slow easing and long transitions.
- Instruments should rotate subtly, never spin rapidly.
- Text should reveal through opacity and small vertical movement.
- Use parallax only when it improves depth or storytelling.
- Keep the cursor interactions optional and non-essential.
- Respect `prefers-reduced-motion` and provide a still-image fallback.

### Avoid

- Constant particles
- Glitch effects
- Fast zooms
- Loud page transitions
- Autoplay sound
- Scroll hijacking
- Motion behind dense text

## 7. Homepage wireframe

### Desktop layout

```text
┌────────────────────────────────────────────────────────────┐
│ Logo                         Academy  Gallery  Contact  [WhatsApp] │
│                                                            │
│                 [slow instrument silhouette]               │
│                                                            │
│              USTAAD GURMEET SINGH SANT KHALSA              │
│              Preserving the living tradition               │
│              of Gurmat Sangeet.                            │
│                                                            │
│              [Speak with Ustaad Ji]  [Explore]             │
│                                            Scroll ↓         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 01  THE LIVING TRADITION       [portrait / teaching image] │
│     Short explanation of Puratan Reet and the academy.      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 INSTRUMENT JOURNEY                         │
│       [large instrument model / image moves with scroll]    │
│       Rabab · Taus · Dilruba · Esraj · Tar Shehnai          │
│                 [Learn about this instrument]               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 02  THE USTAAD                    [large real portrait]    │
│     Biography, philosophy, teaching approach, and CTA.      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 VERIFIED LEGACY                             │
│       Founded     Years teaching     Students     Learners  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 LEARNING PATHS                              │
│   Vocal · Tanti Saaz · Strings · Rabab · Theory · Online    │
│              [Ask about a class on WhatsApp]               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 ACADEMY LIFE                                │
│          Real event images / student story / video          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│             Begin your journey with the Guru's music.       │
│                 [WhatsApp Ustaad Ji]                        │
└────────────────────────────────────────────────────────────┘
```

### Mobile layout

On mobile, the page should become a clean vertical story:

1. Portrait-led hero
2. One sentence mission
3. Fixed bottom WhatsApp action
4. Short academy introduction
5. One instrument at a time as static image plus light motion
6. Ustaad Ji biography
7. Two-column or stacked legacy statistics
8. Learning path cards
9. Academy life carousel
10. Final contact block

The mobile version must never require a visitor to rotate the phone, drag a 3D object, or wait for a heavy scene before seeing the contact action.

## 8. Navigation

### Desktop

- Logo on the left
- Home, Academy, Instruments, Classes, Gallery
- WhatsApp button on the right
- Transparent navigation over the hero, solid surface after scrolling

### Mobile

- Logo and menu button at the top
- Persistent bottom WhatsApp bar
- No more than five primary navigation items

## 9. Buttons and interaction labels

Use human, direct language:

- Speak with Ustaad Ji
- Ask about classes
- Book a lesson
- Explore the instruments
- Visit the academy
- Listen to a recording

Avoid generic labels such as “Learn More,” “Discover,” and “Submit” when a more specific label is possible.

## 10. 3D prototype specification

### First object to test

Prototype one instrument first. The Rabab is the strongest storytelling choice because of its connection to Guru Nanak Dev Ji and Bhai Mardana. The Dilruba or Taus may be stronger visually, so the final object should be selected after reviewing available reference images and model quality.

### Interaction

- Instrument enters slowly as the visitor scrolls.
- Camera moves from full silhouette to detail view.
- A few labelled hotspots can identify strings, bow, body, or design features.
- Text stays readable beside the object.
- On mobile, replace hotspots with a simple image-and-caption sequence.

### Performance target

- Do not block the first meaningful paint with 3D.
- Load the 3D scene after the hero is visible.
- Use compressed textures and a low-polygon fallback.
- Keep the primary page useful even if WebGL is unavailable.

## 11. First visual prototype scope

The first prototype should contain only:

- Hero section
- Ustaad Ji portrait treatment
- One moving instrument
- One short introduction section
- One WhatsApp CTA
- Desktop and mobile behavior

Success means the prototype feels unmistakably like Ustaad Ji and Gurnaad Academy within the first screen and first scroll—not merely that it has technically impressive animation.

## 12. Design approval checklist

- Does Ustaad Ji feel like the central presence?
- Does the design feel classic without feeling dated?
- Does the animation feel calm and intentional?
- Can a first-time visitor understand the academy quickly?
- Is WhatsApp visible without being intrusive?
- Does the page work without sound and without 3D?
- Does the mobile version feel designed rather than reduced?
