# Research into action — design specification

The complete primary screen is `concept-desktop.png`, generated with the built-in Image Gen tool. It is a design reference; the interface and interactive map are native HTML/CSS/SVG.

- Background: warm white `#faf9f6`; primary ink `#173f35`; secondary text `#53645b`; muted borders `#d9dfd5`; sage surface `#e2ecde`; active green `#32704a`; inactive node surface `#f0f0eb`.
- Typography: Lora, medium/semibold for the wordmark, headline, map centre and panel heading; DM Sans for all body text and controls. Hero 58px, panel heading 36px, section headings 20px, body 16px. Italic serif for the second headline line.
- Layout: 1536×1024 reference. 60px outer gutters, 74px header, 200px hero, rule, then three open columns in approximately 23% / 44% / 33% proportions. Subtle vertical separators; only the action-detail panel uses a rounded container.
- Components: quiet header links; ten role buttons; labelled SVG radial map with ten numbered button nodes; selected-role centre; active/inactive legend; accessible list alternative; strategy detail panel; wide green save button. 18px panel radius, 8px role radius, no shadows or gradients.
- Icons: custom 20px outline SVG, 1.7px stroke, round caps/joins: external-link, right-arrow, plus, check, close, download, copy. No decorative pictorial assets.
- Motion: 160–220ms colour transitions and panel entrance. Reduced motion disables animation and smooth scrolling.
- Mobile: replace the role rail with a labelled native select; stack the same map/list and detail panel, keeping every strategy accessible. Support 320px and wider.

## Copy lock for the opening screen

Research into action; About the study; Read the paper; Stronger behavioural research.; What can you do?; Choose your role. Explore the strategies. Find your next step.; 58 participants; 5 workshops; 10 strategies; Insights from a UK cross-sector study.; 01 Choose your role; 02 Explore your strategies; 03 Put it into practice; all ten role labels and all ten short strategy labels in the reference; Researchers; 5 relevant strategies; Relevant to your role; Explore other strategies; View as a list; STRATEGY 01; Make research easier to use; Help people understand and apply behavioural research.; A place to start; See strategy 1 in Table 3; Save this strategy; These are participant-proposed strategies, not tested interventions.; Yang et al. · PLOS One · 2026.

## Necessary extensions and intentional content corrections

- User-requested revision: strategy titles and actions in “Put it into practice” and saved/exported plans now reproduce Table 3 verbatim. They are derived directly from the source table, preserving wording, punctuation and order. Paraphrased summaries and “A place to start” were removed. This exact wording supersedes the corresponding copy in the original generated concept and copy lock above; short map/list labels remain navigation aids.
- Exact source actor mappings determine all highlighting. Numbers are source row references, not priority rankings. A muted strategy remains explorable, with an explicit note when it is not mapped to the selected role.
- Saved-plan dialog and tray, source/about dialog, list view, copy/download/print controls, URL sharing and export layout are functional extensions of the same typography, colours, buttons and open-list components. They are required to make saving and dissemination useful; they introduce no new visual system.
- Expanded mobile layout prioritises readable labels and touch targets. The diagram retains the reference geometry. All ten roles remain selectable.
- No photographs, raster hero assets, overlays, glows or gradients.
- User-requested BR-UK branding: add the existing official 44px colour icon and “Behavioural Research UK” subtitle in the header, following the BR-UK AI repository. Reuse the same header treatment in the LinkedIn exports. The mark’s colours remain unchanged; the small organisation subtitle uses BR-UK teal `#007288`. All other design tokens and the exact Table 3 content remain as specified.
