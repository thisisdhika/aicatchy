---
id: L3-01
title: V1 Minimum Lovable Product — Product Specification
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, specs, v1, mlp, soft-launch, aicatchy]
references: [L1-01, L1-03, L2-03, L2-04, L3-02, L0-02]
---

# V1 Minimum Lovable Product — Product Specification

*The Minimum Lovable Product (MLP) mobile-first web slice for a controlled soft launch (20–100 users). Core workflow: occasion/free text → vibe/expression/shopping intent → 3 outfits → post-result earned authentication → styling memory (saved looks, preferences, body-fit notes) → outbound product links. Active baseline for the MLP build.*

---

## 0. Architecture Summary

This spec is built on a specific architectural philosophy. Know it before reading features:

| Component | Approach |
|-----------|----------|
| **Recommendation engine** | Small human-curated outfit formula library (DB-backed, admin-managed with versioning). Styled formulas map `occasion × vibe × expression → 3 outfits`. No graph database required. |
| **LLM role** | Selection / presentation / rationale only. Deterministic candidate ranking narrows the field first, then the LLM selects the final formula and generates styling rationale. Incorporates light personalization from style preferences and body-fit notes. NOT a fully autonomous fashion brain that creates outfits from scratch. |
| **Persistence** | Hybrid: Stateless for guests (localStorage-based saved looks). Server-side database persistence for authenticated users, storing styling memory (occasion history, saved/liked looks, style preferences, optional body-fit notes). |
| **Authentication** | Earned Auth: Deferred until after the first recommendation is generated. Tapping the heart icon to save prompts signup/login. Pre-login saves are held locally first, then claimed into the account. |
| **Affiliate data** | Static product queries per formula item. Shopee / Involve Asia affiliate links resolved at display time via their API. No product catalog sync. |

<!-- ponytail: DB-backed formula library instead of styling graph, upgrade if scaling limits are hit -->
<!-- ponytail: guest saves in localStorage, server DB sync on auth -->
The outfit formula library is stored in the database and administered through the admin app (~100–300 formulas initially). The application layer narrows candidates via deterministic filtering (occasion + vibe matching), and the LLM selects the final formula and generates styling rationales. This is intentionally far simpler than a knowledge-graph-backed recommendation system — validated first, scaled later if the model proves out.

---

## 1. Feature List

### 1.1 MLP Baseline Features

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| F1 | Occasion input | Chip selector (Hangout, Date Night, Campus, Office, Kondangan) + free text field for custom occasions. Authenticated users see recent occasion history. | P0 |
| F2 | Vibe keywords | Free text input, 3 keyword max, visible character counter | P0 |
| F3 | Expression preference | Chip selector: Confident / Comfortable / Stand Out | P0 |
| F4 | Shopping intent | Chip selector: Just Looking / Ready to Buy / Open to Suggestions | P0 |
| F5 | Outfit generation | Return 3 complete outfits (Safe, Stylish, Bolder) from human-curated formula library + LLM routing. Stylist rationale incorporates light personalization if body-fit/style preferences are present. | P0 |
| F6 | Outfit display | Editorial card per look: item images, prices, styling rationale, purchase links. Mobile-first vertical stack or horizontal carousel. | P0 |
| F7 | Purchase link | Affiliate link per shoppable item (Shopee Affiliate or Involve Asia merchant) | P0 |
| F8 | Save look | Tap heart icon on card to save outfit. Guest saves are held locally (localStorage); saving prompts post-result auth to claim and persist to database. | P0 |
| F9 | Share verdict | Tap share icon to generate WhatsApp share text/card and open WhatsApp | P0 |
| F10 | Earned Authentication | Registration/Login deferred post-recommendation. Triggered by saving a look or accessing styling memory. Guests can continue in limited non-persistent mode. | P0 |
| F11 | Long-Term Memory | Persistent user profile storage for occasion history, saved/liked looks, and explicit style preferences. | P0 |
| F12 | Body-Fit Notes | Optional text/starter fields for fit and silhouette guidance (no beauty or identity inference), used to personalize styling rationales. | P0 |

### 1.2 Feature Description Detail

**F1 — Occasion Input**
- 5 chip options displayed as tappable buttons.
- "Other" chip opens free text input (200 char max).
- Selected chip animates to active state. Multi-select not supported.
- Free text: placeholder "Tulis acara kamu... (contoh: hangout cafe, kondangan sahabat)".
- **Authenticated personalization:** Displays up to 3 recent occasions from the user's styling memory below the chips for quick re-selection.

**F2 — Vibe Keywords**
- Single text input, 3 keywords max.
- Character counter updates in real time: "3/3 kata".
- No autocomplete in the MLP. Autocomplete is a post-launch candidate.
- Validation: must be Indonesian or English adjectives. Minimum 1 keyword required.

**F3 — Expression Preference**
- 3 chip options: "Confident (Percaya Diri)", "Comfortable (Nyaman)", "Stand Out (Beda)".
- Single select. One choice only.

**F4 — Shopping Intent**
- 3 chip options: "Just Looking (Lihat-lihat)", "Ready to Buy (Mau Beli)", "Open to Suggestions (Terbuka)".
- Single select. Affects recommendation price anchoring and link prominence.

**F5 — Outfit Generation**
- Takes occasion + vibe + expression + intent as input.
- The application narrows candidates via deterministic filtering, then the LLM selects the final formula from top candidates.
- Returns 3 outfits: Safe (anchor — most versatile), Stylish (aspiration — more curated), Bolder (surprise — higher risk/reward).
- Each outfit: top + bottom + footwear + accessory + outerwear (if needed).
- **Personalized Rationale:** If style preferences or optional body-fit notes are present in the user's profile, the LLM includes light personalization in the styling rationale (e.g. highlighting why the recommended cuts fit their silhouette preferences or why the colors align with their explicit preferences).
- Generation time target: <5 seconds. Loading state: skeleton cards with shimmer animation.
- No budget filtering in the MLP. Prices shown as-is from the formula.

**F6 — Outfit Display**
- Mobile-first: horizontal carousel with visible peeking adjacent cards and page dots on mobile viewports; desktop uses the same layout inside a centered mobile-width container.
- Each card: mood image (product collage), item list with price + link, styling rationale.
- Card interaction: tap to expand items, tap link to open Shopee or merchant page.
- Outfits are viewed, saved, shared, and purchased in-session. Swap and budget-adjust are deferred to P1.

**F7 — Purchase Link**
- Each item links to Shopee or an active Involve Asia merchant page via affiliate link.
- Link opens in-app browser or native app (deep link).
- Disclosure shown per card (incorporated into card design — see L0-02).

**F8 — Save Look**
- Heart icon on each outfit card toggles save state.
- **Pre-Login / Guest State:** Saved outfits are stored locally in the browser's `localStorage`.
- **Earned Auth Trigger:** Tapping the heart icon triggers a prompt to authenticate: *"Save this look, and let's get to know each other."*
- **Post-Auth State:** Saved outfits are synced and persisted to the server-side database. Any outfits saved locally during the guest session are claimed and merged into the user's permanent profile.
- "Saved Looks" view accessible via a bookmark icon on the results screen.
- Displays saved outfits in a vertical list, grouped and organized by occasion.
- Tapping a saved look expands it to show full details (product lists, prices, rationales, purchase links).
- Toggling the heart icon off removes the look from the database (or `localStorage` if still a guest).

**F9 — Share Verdict**
- Share icon on each outfit card opens sharing functionality.
- Client-side only generation: produces pre-formatted WhatsApp share text containing the outfit name, items, price, styling rationale, affiliate links, and affiliate disclosure.
- Generates a lightweight share-card image using a client-side `<canvas>` element (combining hero product image, outfit details, and branding) to share as an image.
- Tapping the share button opens the user's native WhatsApp client with the pre-filled text and/or image.
- If canvas rendering fails, gracefully falls back to sharing the plain text message. No data is sent to a backend server.

**F10 — Earned Authentication**
- **Zero upfront barrier:** Users go through the core generation flow and see recommendations without being forced to sign up.
- **Authentication Triggers:** Prompted only when a user attempts to save a look (F8) or access styling memory features.
- **Guest Fallback:** Users can opt-out of signup and continue in limited non-persistent mode. A warning is displayed: "Saves are stored locally on this device and will be lost if browser cache is cleared."
- **Immediate Post-Signup Profile Setup:** Minimal fields requested to establish value immediately:
  - Name (required)
  - Style-preference starter (optional, e.g., preferred color tones or silhouette style)
  - Body-fit note starter (optional)

**F11 — Long-Term Memory**
- **Styling Memory Scope:** Persists the following on the server-side:
  - Occasion history (recently generated queries)
  - Saved/liked looks
  - Explicit style preferences (e.g. relaxed fit, minimalist, activewear focus)
  - Optional body-fit notes (F12)
- **Application:** Restores saved looks across devices and allows returning users to quickly select previous occasions. Serves as inputs for visible but light recommendation rationale personalization.

**F12 — Body-Fit Notes**
- **Sizing & Silhouette Guidance:** Users can optionally add notes or check starter chips regarding body shape, height, or fit preferences (e.g., "prefer petite/short inseams," "wider shoulders," "high-rise pants").
- **Privacy & Safety Constraints:** Body data is strictly used for fit/silhouette guidance. It is **never** used for beauty or identity inference.
- **LLM Integration:** Used by the LLM routing/presentation system to tailor the styling rationale (e.g. "This jacket is selected in a relaxed cut to accommodate your preference for wider shoulders").

### 1.3 Post-MLP Candidates

These features are explicitly deferred. They are NOT promised post-release — they are candidates to be evaluated based on soft-launch data.

| Feature | Cut rationale | Revisit trigger |
|---|---|---|
| Budget filter (price slider/input) | Adds UI complexity and re-filtering logic. Soft-launch learns whether users need it without building it first. | User feedback consistently requests price filtering. |
| Swap item (replace one item with alternative) | Requires alternative-item data and in-session state. Can be added post-launch as a display-only swap from a precomputed set. | >30% of users interact with a single outfit for >30s. |

Decision rule: a feature graduates from candidate to V2+ if (a) soft-launch users explicitly request it in >10% of sessions, AND (b) the manual tracking signal aligns, AND (c) the build cost (estimated <1 week) fits the current sprint capacity.

---

## 2. User Flows

### 2.1 Happy Path — First Visit & Earned Auth

```
[Landing] → "What's the occasion?" → Select chip (e.g. "Date Night")
    → "Describe the vibe in 3 words?" → Type "romantic, elegant, simple"
    → "How do you want to feel?" → Select "Confident"
    → "Shopping intent?" → Select "Open to Suggestions"
    → [Generate] → Loading state (≤5s)
    → [Results: 3 outfit cards — Safe, Stylish, Bolder]
        → Tap "Stylish" to expand → View item list + prices + links
        → Tap heart icon on "Stylish" card 
        │
        └─→ [Earned Auth Prompt]: "Save this look, and let's get to know each other."
            → Choose "Sign Up" → Enter Name, optional Style Preferences, and optional Body-Fit notes
            → [Account Created]: localStorage save claimed & merged to database
            → Toast: "Outfit disimpan ke Style Memory!"
            → Tap share icon on "Stylish" card → Generates canvas card and opens WhatsApp
            → Navigate to "Saved Looks" screen → View saved outfit card retrieved from DB
            → Tap purchase link → Opens Shopee in in-app browser
```

### 2.2 Empty Results

```
[If 0 results from query] → Fallback message: "Maaf, belum ada rekomendasi
    untuk kombinasi ini. Coba occasion atau vibe lain?"
    → Suggested next actions: try different occasion, different vibe, or
      describe more specifically
    → Log the query for formula library gap analysis
```

### 2.3 Return User — Authenticated

```
User returns days later → Opens app (automatically authenticated)
    → Landing displays personalized greeting: "Hi, [Name]!"
    → "What's the occasion?" → Displays "From your history: Date Night, Office"
    → User inputs occasion & vibe → LLM identifies user's saved Style Preferences & Body-Fit notes
    → [Generate] → Results load with lightweight personalization (e.g. styling rationales reference body-fit compatibility)
    → Tapping heart saves directly to database (no auth prompt)
```

### 2.4 Return User — Guest Flow (No Account)

```
User returns days later → Opens app (not authenticated)
    → Can view "Saved Looks" retrieved from local localStorage
    → Starts fresh query flow from start. No previous query inputs or profile preferences are applied.
```

---

## 3. Acceptance Criteria

### F1 — Occasion Input
```
Given a user on the input screen
When they tap an occasion chip
Then the chip highlights and the free text field becomes optional

Given a user taps "Other" chip
When they type a custom occasion
Then the input accepts up to 200 characters

Given a user is authenticated
When they open the input screen
Then they see up to 3 of their most recent generated occasions as history chips
```

### F2 — Vibe Keywords
```
Given a user is typing vibe keywords
When they reach 3 keywords
Then the input blocks additional text and shows "Maksimal 3 kata"

Given a user types fewer than 3 keywords
When they tap "Generate"
Then validation allows 1–3 keywords (minimum 1 required)
```

### F3 — Expression Preference
```
Given expression chips are displayed
When a user taps one
Then the chip highlights and others unselect (single select)
```

### F5 — Outfit Generation
```
Given valid input (occasion + vibe + expression + intent)
When user taps "Generate"
Then a loading state appears within 200ms
And results render within 5 seconds (P95)
And exactly 3 outfits are displayed (Safe, Stylish, Bolder)
And each outfit contains at least 3 item categories (top, bottom, footwear)

Given a user has saved Style Preferences or Body-Fit Notes
When outfits are generated
Then the LLM routing output incorporates these preferences
And styling rationales include light personalization copy highlighting fit/silhouette match
```

### F6 — Outfit Display
```
Given 3 outfits are rendered
When a user taps an outfit card
Then the card expands to show full item list with prices and links

Given an outfit card is expanded
Then item prices are displayed in IDR
And styling rationale text is visible
And purchase links are tappable

Given a mobile viewport (<768px)
Then outfits render as a horizontal swipeable carousel with peeking adjacent cards
And dot indicators display below the carousel showing the active card
```

### F8 — Save Look & Claiming Saves
```
Given a guest user is on the outfit results screen
When they tap the heart icon on an outfit card
Then the outfit is temporarily saved to browser localStorage
And the system displays the auth modal: "Save this look, and let's get to know each other."

Given the auth modal is displayed to a guest user
When the user clicks "Continue as Guest"
Then the modal closes and the outfit remains saved in localStorage only
And a toast notification displays: "Outfit disimpan lokal!"

Given a guest user has outfits saved in localStorage
When they complete the Earned Authentication flow
Then the system claims the local saved looks
And copies/merges them as server-side database records associated with the new user account
And clears the corresponding localStorage items (or marks them synced)
```

### F10 — Earned Authentication
```
Given a guest user is navigating the app
When they input occasion/vibe and tap "Generate"
Then the system does NOT show any login or registration barriers before showing results

Given a user decides to register after generating recommendations
When the signup screen is presented
And the user submits valid name + optional preferences
Then a user account is created immediately
And the previously saved outfits (from localStorage) are claimed and merged into the database

Given a user is already authenticated
When they tap the heart icon on an outfit card
Then the outfit saves directly to the server-side database without prompting authentication
```

### F9 — Share Verdict
```
Given a user is on the outfit results screen
When they tap the share icon on an outfit card
Then a share card image (canvas) is generated client-side
And WhatsApp is opened with pre-filled text and/or image
And no data is sent to an external server

Given canvas rendering fails
When the share icon is tapped
Then the system gracefully falls back to sharing plain text only
```

### F11 — Long-Term Memory
```
Given a user is authenticated
When they access the app
Then their style preferences and body-fit notes are loaded from the server-side database
And recent occasion history is displayed as quick-select options

Given an authenticated user saves a new outfit
When the save action is completed
Then the outfit is stored in the server-side database associated with their account
And is accessible from any device on their next login
```

### F12 — Body-Fit Notes
```
Given an authenticated user
When they access the profile or onboarding flow
Then optional body-fit note fields are presented (not required)

Given a user has saved body-fit notes
When outfits are generated
Then the styling rationale may reference fit compatibility based on those notes
And no body-fit data is used for beauty inference, identity analysis, or shared externally
```

### F4 — Shopping Intent
```
Given shopping intent chips are displayed
When a user taps one
Then the chip highlights and others unselect (single select)
And the selected intent is passed to the generation pipeline for price anchoring
```

### F7 — Purchase Link
```
Given an outfit card is displayed
When a user taps a purchase link
Then the link opens in an in-app browser or system browser
And the affiliate tracking link is resolved server-side before redirect

Given an affiliate link has expired
When a user taps the link
Then the system re-generates the link if possible
And falls back to a standard search link if regeneration fails
```

### Edge Case: Combined Loading & Error States
```
Given a user taps "Generate"
When network connectivity is lost
Then the error state displays: "Koneksi terputus. Coba lagi."
And a retry button is shown

Given generation succeeds but less than 3 outfit formulas match the input
When results are returned
Then exactly 1–2 complete outfits are displayed
And a note explains fewer results: "Beberapa kombinasi tidak tersedia untuk acara ini."
```

---

## 4. Error States & Edge Cases

| Scenario | Handling | User Impact |
|----------|----------|-------------|
| LLM API unreachable | Fall back to direct formula library match (no LLM rationale). Log alert. | Outfits shown without styling rationale text |
| Formula library miss (no match) | Return "Maaf, belum ada rekomendasi" state. Log query for gap analysis. | Empty state with guidance to try different input |
| Affiliate API down for link generation | Serve product info without link. Show "Tautan belum tersedia" badge. | Items shown but not clickable to purchase |
| Authentication service down | Guest flow remains functional. Saved outfits stay in localStorage. | Cannot create account or access cross-device memory |
| localStorage full | Catch QuotaExceededError, show warning: "Penyimpanan penuh. Hapus beberapa outfit tersimpan." | Outfit not saved locally |
| Browser doesn't support canvas (share) | Skip image generation, use plain text share only | No card image in share, only text |
| XSS attempt in free-text fields | Sanitize all free-text input server-side before LLM injection. Client-side validation mirrors server. | Invalid input rejected with clear message |
| Rate limiting (generation) | Exponential backoff. If >3 retries fail, show degraded empty state. | Up to 10s delay before empty state |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 0.1 | Initial draft (pre-sprint) | Architect |
| 2026-06-25 | 0.1 | Governance fix: status→draft, reviewers aligned to BLUEPRINT, references→add L0-02 | Scribe |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
