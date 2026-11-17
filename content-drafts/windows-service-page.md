# Window Installation & Replacement: Services Page Draft

Status: draft, unsourced. No web research was available. Every specific claim not in the confirmed owner facts is tagged [VERIFY]. Nothing here has been entered in Sanity. Confirmed facts used: replacement and new installation, in-house crews, founded 1946, Frederick MD, Hagerstown MD, Chambersburg PA, Reston VA. Shumaker's window service is replacement and new installation only; the copy does not offer repair.

Field names below come from sanity/schemaTypes/service.ts, splitSection.ts, faqItem.ts and seoMetadata.ts. The document type is `services`. Editor-only notes are in the "Editor notes (do not publish)" block near the end; nothing in the field text below is an internal note.

## title
Window Installation & Replacement in Frederick, MD

## menuTitle
Windows

## slug
windows

## servicesImage (Hero Image)
[PLACEHOLDER: real project photo, to be supplied]. The schema has no alt field. The page builds the hero alt text itself as "{title} - Banner Image" (app/(site)/services/[slug]/page.tsx), so there is nothing to enter.

## servicesContent (rich text)

### Windows are part of the wall's water system

A window is a hole cut in a wall that has to stay dry. The glass and frame are the part you see. What keeps rain out for decades is the flashing around the opening, the sealant, and the way those layers lap over each other so water runs down and out instead of in [VERIFY: general building-science claim that flashing is what keeps water out long term, including "for decades"]. When a window fails, the cause is sometimes the opening and not the window itself [VERIFY: how often leaks trace to the opening rather than the unit].

Shumaker Roofing was founded in 1946. We do two kinds of window work: replacing windows that have worn out, and installing new windows where there wasn't one before. Our own in-house crews do the work.

### Signs a window needs attention

Some of these mean a repair will do. Others mean the window is done. A look at the opening usually tells which.

Fogging or condensation between the panes of a double-pane unit usually points to a failed seal [VERIFY: fogging between panes indicates seal failure]. Water stains, soft wood or peeling paint on the sill, the trim or the wall below the window are the other early signs, along with water marks on the drywall under a window after heavy rain. Then there are the things you notice by hand: a sash that sticks, won't stay up or won't lock, drafts on a windy day, a cold spot near the glass in winter, or a frame that has rotted, warped or pulled apart at the corners.

### Window replacement

Replacement means taking out the old window and putting in a new one that fits the same opening. There are two common ways to do it.

Insert (pocket) replacement keeps the existing frame and trim and fits a new window inside it. It's less disruptive and leaves your interior and exterior trim alone. It only makes sense when the existing frame is square, solid and dry [VERIFY: condition required of the existing frame for an insert replacement].

Full-frame replacement removes the whole window down to the rough opening, including the frame. It takes more labor, but it exposes the wall around the opening so rot can be repaired and the flashing rebuilt. If there's water damage behind a window, this is usually the right call [VERIFY: full-frame replacement is the usual choice when there is water damage behind a window].

### New window installation

Adding a window where none exists means cutting a new opening in the wall. That brings structural questions: a header has to carry the load that the cut-out studs used to carry [VERIFY: header sizing and permit requirements are set by local code and engineering, and may differ in each jurisdiction served]. It also means new framing, new flashing, and finishing the inside and outside so the wall looks like the window was always there.

People add windows for light, for ventilation, or for egress from a basement or bedroom. Egress windows have minimum size requirements set by building code [VERIFY: current minimum egress opening dimensions under the code adopted in each jurisdiction].

### How a window gets installed so it stays dry

Water management is the whole job. In general terms, a well-installed window goes in like this.

First the rough opening is checked for rot, level and plumb, and damaged framing is repaired. Then a sill pan or flashing goes in at the bottom of the opening so any water that gets behind the window drains out, not into the wall [VERIFY: sill pan or bottom flashing as standard step; confirm Shumaker's actual method]. The window is set, shimmed and fastened so it's square and operates smoothly. Flashing at the sides and head is lapped shingle-style over the layer below it, with the head flashing tucked under the wall's weather-resistive barrier [VERIFY: lapping order should match the manufacturer's installation instructions and the wall system on each job]. The gap between frame and framing is filled and the exterior joint sealed [VERIFY: low-expansion foam or insulation for the gap, and exterior sealant; confirm Shumaker's actual materials and method]. Trim goes back on inside and out.

### Common window types

General information, not a list of what we stock or install.

Double-hung windows have two sashes that slide up and down [VERIFY: double-hung sash description]. Casements are hinged at the side and crank outward, and are often described as sealing tightly when closed [VERIFY: casement sealing claim]. Sliders move side to side, which suits spots where there's no room to swing a sash. Awning windows hinge at the top, which lets them stay open in light rain [VERIFY: awning in light rain claim]. Picture windows are fixed glass. Bay and bow windows project out from the wall, so they have more joints and more roof above them, and the flashing detail matters more [VERIFY: bay and bow windows have more joints and more roof above them].

### Common frame materials

General information, not a statement of what we install.

Vinyl is usually low maintenance and doesn't need paint [VERIFY: vinyl maintenance claim]. Wood gives a traditional look but needs regular paint or stain and attention to moisture [VERIFY: wood frame maintenance claim]. Fiberglass is stable as temperatures change [VERIFY: fiberglass frame expansion compared to vinyl]. Aluminum-clad wood has wood inside and a metal shell outside to resist weather [VERIFY: aluminum-clad wood construction description].

### Energy performance

Two ratings show up on window labels: U-factor, which measures how much heat passes through the window, and solar heat gain coefficient (SHGC), which measures how much sun-driven heat gets through. A lower U-factor means better insulation [VERIFY: lower U-factor means better insulation; also used in FAQ 6]. The right SHGC depends on which way the window faces and your climate. For recommended values by climate zone, see the ENERGY STAR guide to windows, doors and skylights. [VERIFY: current ENERGY STAR U-factor and SHGC criteria for the climate zone covering Maryland, Virginia and Pennsylvania. Publish no figure until checked.]

## additionalContent

Windows and roofs share a lot of the same problems. A leak that shows up around a window can come from the roof, from a gutter, or from failed flashing above the window. Because we do roofing too, the roofline is part of the picture [VERIFY: whether Shumaker inspects the roof and gutters above a leaking window as part of window work]. If the leak starts higher, replacing the window won't fix it. See our [roof replacement](/services/roof-replacement) and [storm damage restoration](/services/storm-damage-restoration) pages if that sounds like your house. If the siding around the opening is also worn, our [siding](/services/siding) page covers that work.

We serve [Frederick, MD](/service-areas/frederick-md), [Hagerstown, MD](/service-areas/hagerstown-md), [Chambersburg, PA](/service-areas/chambersburg-pa) and [Reston, VA](/service-areas/reston-va).

If you're not sure whether a window needs replacing, or you want a window added, [contact Shumaker Roofing](/contact).

## splitSection (array of references, 3 documents)

The service field `splitSection` holds references to separate `splitSection` documents. Create these 3 documents first, then add them to the service. Fields per document: `splitTitle`, `splitDescriptionContent` (rich text; use this one, it takes precedence over the legacy `splitDescription`), `splitImage`. Do not fill `splitDescription`.

Alt text: splitSection has no alt field. The services page passes no `splitImageAlt` to TwoColumnSection (components/shared/two-column-section.tsx), and the component falls back to `alt={splitImageAlt ?? splitTitle}`. So the image alt will be the splitTitle. Write titles that also work as alt text. Per-image alt text can't be set without a code change.

### Document 1
splitTitle: What to look at before replacing a window
splitDescriptionContent: Many window leaks come from the flashing, not the glass [VERIFY: "Many window leaks come from the flashing"]. Before replacing a window, it helps to look at the sill, the trim, the siding or brick around the opening, and the roof and gutters above it. If the frame is sound and dry, an insert replacement may be all that's needed. If there's rot, a full-frame replacement is usually the better fix.
splitImage: [PLACEHOLDER: crew member checking the sill and trim on an exterior window]

### Document 2
splitTitle: Adding a window to an existing wall
splitDescriptionContent: A new window means a new opening, which means framing, a header, flashing, and finish work inside and out. Egress windows for basements and bedrooms have their own size rules [VERIFY: egress size rules and permit steps vary by jurisdiction].
splitImage: [PLACEHOLDER: new window opening framed with flashing before the window is set]

### Document 3
splitTitle: In-house crews install your windows
splitDescriptionContent: Our own crews install your windows.
splitImage: [PLACEHOLDER: in-house crew installing a window]

## faqItems

Use `answer` (plain text) unless marked `answerContent` (rich text, needed for links).

### 1. question: What's the difference between window replacement and new window installation?
answer: Replacement swaps an existing window for a new one in the same opening. New installation adds a window where there isn't one, which means cutting into the wall and framing a new opening. We do both.

### 2. question: Do I need to replace the whole frame?
answer: Not always. If the existing frame is square, solid and dry, a new window can often be fitted inside it. If there's rot, water damage, or a frame that's out of square, a full-frame replacement lets the wall behind it be repaired [VERIFY: frame conditions that allow an insert versus those that call for full-frame replacement].

### 3. question: How long does a window replacement take?
answer: A typical single window can often be done in a few hours, and a whole house takes longer depending on the number and type of windows and what's behind them [VERIFY: typical time per window and per whole-house project; confirm with Shumaker's crews].

### 4. question: Why is my double-pane window foggy?
answer: Double-pane windows have a sealed space between the panes. When the seal fails, moisture gets in and shows up as fog you can't wipe off [VERIFY: fogging indicates failed seal]. A failed seal generally can't be repaired, and the glass unit or the whole window needs replacing [VERIFY: failed seal not repairable].

### 5. question: Is a leak around my window always the window's fault?
answer: No. Failed caulk or a bad joint at the trim can let water in, and the roof or gutter above the window can be the real source. If water has been getting into the wall, or the frame is rotted, the damage is behind the surface and sealing the outside alone won't solve it [VERIFY: threshold at which a leak means hidden damage rather than a surface problem].

### 6. question: Will new windows lower my energy bills?
Field: answerContent (rich text, contains a link; link target in Editor notes)
answer text: It depends on what you're replacing and the condition of the rest of the house. Windows with a lower U-factor slow heat loss, and drafts from worn-out windows can be sealed. Attic insulation and air sealing can matter as much [VERIFY: attic insulation and air sealing relative impact]. See the ENERGY STAR windows page for what the ratings mean.

### 7. question: Do you install windows in Pennsylvania and Virginia?
answer: Yes. We serve Frederick and Hagerstown in Maryland, Chambersburg in Pennsylvania, and Reston in Virginia. Permit and code details can differ by location [VERIFY: permit requirements for window work in each jurisdiction. Hagerstown is in Washington County and Reston is in Fairfax County, so county rules may apply].

### 8. question: How do I get started?
Field: answerContent (rich text, contains a link)
answer text: [Contact us](/contact) and tell us what you're seeing, or which rooms need a new window.

## seo

seo.seoTitle: Window Installation & Replacement | Shumaker Roofing
(52 characters, hand-counted)

seo.seoDescription: Window replacement and new window installation by Shumaker Roofing's in-house crews. Serving Frederick and Hagerstown, MD, Chambersburg, PA, Reston, VA.
(153 characters per the second-pass review. My own hand count of the same string came to 152, so recount with a tool before entry. Either way it is under the 160 limit.)

canonicalUrl, noindex, nofollow: leave at defaults (empty, false, false). featuredImage: not set in this draft.

## Style check

The banned-word check was manual only. scripts/ban-words-scan.py reads published documents from Sanity and needs .env.local and network, and it takes no draft file, so it was not run. The draft was read by hand against docs/content-style/banned-ai-words.md: no em or en dashes, no listed banned words or phrases, no brand claims, dealer or certification claims, warranty terms, pricing, free-estimate claims, licensing or EPA claims, financing, or tax credits. "ENERGY STAR" appears only as the name of a government program that the copy points to for reference. It is a program name, not a brand claim, and the copy does not say Shumaker sells or installs ENERGY STAR products.

## Editor notes (do not publish)

- ENERGY STAR link to add, in two places: (a) servicesContent, Energy performance: make the words "ENERGY STAR guide to windows, doors and skylights" a link; (b) FAQ 6 answerContent: make the words "ENERGY STAR windows page" a link. Target for both: https://www.energystar.gov/products/res_windows_doors_skylights. This URL is unchecked (no web access). Confirm it resolves before entry. It is not a body tag, so it is not in the closing list.
- H1/title area scope is an owner decision. The title currently says "in Frederick, MD" (Frederick only), while the page and FAQs cover four areas (Frederick, Hagerstown, Chambersburg, Reston). The owner should choose Frederick only or a four-area framing before publish. The seoTitle is already area-neutral.
- The page must not be read as offering window repair. Several sections give general homeowner information about repairs (Signs section, FAQ 4, FAQ 5); keep them framed that way.
- Rich-text fields: use `splitDescriptionContent` for all three split documents, not the legacy `splitDescription`.

## [VERIFY] items (one per body tag, in page order)

1. Flashing is what keeps water out long term, including "for decades" (servicesContent intro).
2. How often leaks trace to the opening rather than the window (servicesContent intro).
3. Fogging between panes indicates seal failure (Signs section).
4. Condition required of the existing frame for an insert replacement: square, solid, dry (Window replacement).
5. Full-frame replacement is usually the right call when there is water damage behind a window (Window replacement).
6. Header sizing and permit requirements for new openings, per jurisdiction (New window installation).
7. Minimum egress opening dimensions under the code in each jurisdiction (New window installation).
8. Sill pan or bottom flashing as the standard step, and Shumaker's actual method (install section).
9. Flashing lap order matches the manufacturer's instructions and wall system (install section).
10. Low-expansion foam or insulation and exterior sealant, and Shumaker's actual materials (install section).
11. Double-hung windows have two sashes that slide up and down (Common window types).
12. Casement sealing tightly when closed (Common window types).
13. Awning windows staying open in light rain (Common window types).
14. Bay and bow windows have more joints and more roof above them (Common window types).
15. Vinyl low maintenance, no paint (Common frame materials).
16. Wood needs regular paint or stain (Common frame materials).
17. Fiberglass stability compared to vinyl (Common frame materials).
18. Aluminum-clad wood construction: wood inside, metal shell outside to resist weather (Common frame materials).
19. Lower U-factor means better insulation (Energy performance; same claim in FAQ 6).
20. Current ENERGY STAR U-factor and SHGC criteria for the MD, VA, PA climate zone (Energy performance). No figures are in the draft.
21. Whether Shumaker inspects the roof and gutters above a leaking window (additionalContent).
22. "Many window leaks come from the flashing" (splitSection document 1).
23. Egress size rules and permit steps vary by jurisdiction (splitSection document 2).
24. Frame conditions that allow an insert versus a full-frame replacement (FAQ 2).
25. Typical install time per window and whole house (FAQ 3).
26. Fogging indicates failed seal (FAQ 4).
27. Failed seal not repairable (FAQ 4).
28. Threshold at which a leak means hidden damage rather than a surface problem (FAQ 5).
29. Attic insulation and air sealing relative impact (FAQ 6).
30. Permit requirements for window work in each jurisdiction; Hagerstown is Washington County, Reston is Fairfax County (FAQ 7).

Assets needed (not [VERIFY] items): hero image for servicesImage, and 3 real project photos for the splitSection documents.
