name: RoadLink Digital Identity
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#434751'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#737782'
  outline-variant: '#c3c6d2'
  surface-tint: '#325ea3'
  primary: '#003470'
  on-primary: '#ffffff'
  primary-container: '#1b4b8f'
  on-primary-container: '#9cbdff'
  inverse-primary: '#abc7ff'
  secondary: '#835500'
  on-secondary: '#ffffff'
  secondary-container: '#feae2c'
  on-secondary-container: '#6b4500'
  tertiary: '#003e23'
  on-tertiary: '#ffffff'
  tertiary-container: '#005834'
  on-tertiary-container: '#6ad196'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#124589'
  secondary-fixed: '#ffddb4'
  secondary-fixed-dim: '#ffb955'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#90f7ba'
  tertiary-fixed-dim: '#74db9f'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#005230'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-lg:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin-mobile: 16px
  container-margin-desktop: 40px
  gutter: 16px
  section-gap: 32px
***
Brand & Style
The design system is built on the intersection of modern fintech reliability and the authoritative clarity of official road infrastructure. It targets vehicle owners and fleet managers who require a high-trust, privacy-first interface for managing digital credentials.

The aesthetic follows a Corporate / Modern style with a focus on high-contrast legibility. It utilizes structured layouts, distinct borders, and a monochromatic foundation punctuated by high-visibility "signal" colors. The emotional goal is to evoke a sense of security, legal compliance, and systematic efficiency. Visual elements are direct and functional, avoiding decorative flourishes to maintain a professional, administrative tone suitable for high-stakes digital identity.

Colors
This design system utilizes a high-contrast palette optimized for outdoor sunlight readability. 

Road Navy (#1B4B8F): Used for primary branding, header backgrounds, and authoritative actions.
Signal Amber (#F5A623): Reserved for secondary actions, pending states, and cautionary alerts.
Asphalt (#1A1A1A): The foundation for text and structural bezels, ensuring maximum contrast against light surfaces.
Verified Green (#1E8E5A) & Alert Red (#D93025): Functional status indicators for successful verification or emergency alerts.
Fog (#F7F8FA) & Plate White (#FFFFFF): The background and surface colors create a layered, clean environment for data-heavy views.

Typography
The typographic hierarchy prioritizes rapid information scanning and data precision.

Headers: Use IBM Plex Sans Condensed (Semibold) for an authoritative, "official" look that mimics government signage.
Body: Inter is used for general interface text to ensure legibility and a neutral, modern feel.
Data/Plate: IBM Plex Mono is the designated typeface for vehicle registration numbers, VINs, and technical codes. This monospaced font, paired with 0.05em letter spacing, ensures every character is distinct and unmistakable.
Case Usage: Labels should often use uppercase with increased tracking to differentiate them from body copy.

Layout & Spacing
The layout follows a strict 8px grid system to maintain alignment and structural integrity. 

Grid: A 12-column fluid grid is used for desktop, transitioning to a single-column stack on mobile.
Margins: 16px lateral margins for mobile devices; 40px for desktop to allow the content to breathe.
Density: Medium density is preferred. Information should be grouped into clear, bordered containers to prevent visual clutter in data-rich environments.
Reflow: On mobile, complex data tables must transform into individual cards to maintain high-contrast legibility.

Elevation & Depth
In line with the "official" aesthetic, this design system eschews soft, diffused shadows in favor of Tonal Layers and Low-Contrast Outlines.

Surfaces: Use #FFFFFF for the primary card surfaces over the #F7F8FA background. 
Borders: Depth is defined by 1px solid strokes using #1A1A1A at low opacity (10-15%) for standard containers.
High-Trust Elevation: For critical components like the "Plate Tag," use a 2px solid stroke of #1A1A1A to create a physical, "stamped" appearance that feels permanent and official.
Shadows: Only used sparingly for primary floating action buttons to provide a slight lift (0px 4px 12px rgba(26, 26, 26, 0.1)).

Shapes
The shape language balances structural rigidity with modern usability. 

Cards & Containers: Use a consistent radius of 12px to 16px (represented by rounded-lg and rounded-xl in the token set).
Interactive Elements: Buttons and input fields should follow the rounded-lg (12px) standard.
Plate Tags: These specific badges use a medium 8px radius to mimic the shape of physical high-security registration plates (HSRP).

Components
Consistent application of these components ensures the interface feels like an official extension of road infrastructure.

Plate Tag (Signature Component): A rounded-rectangle badge with a 2px solid #1A1A1A bezel. Background is #FFFFFF. Text must be data-mono using #1A1A1A. 
Primary Buttons: Solid #1B4B8F background with #FFFFFF text. No gradients. 12px corner radius.
Secondary Actions: Outline style using the primary color or solid #F5A623 for attention-heavy actions (e.g., "Renew License").
Cards: White surfaces with a subtle 1px border. Headlines within cards should use headline-sm.
Status Indicators: Pills using low-opacity versions of Success/Error colors with high-contrast bold text of the same hue.
Input Fields: 1px #1A1A1A border (20% opacity) that thickens to 2px Primary Navy on focus. Labels sit clearly above the field in label-caps.
Lists: Clean, horizontal dividers with 16px vertical padding. Iconography should be thick-stroked and functional.
