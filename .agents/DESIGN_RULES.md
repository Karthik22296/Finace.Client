# Generic Angular Material UI/UX Design System

## 1. Purpose

This document defines a reusable UI/UX design system for modern Angular
Material applications.

It is intended for dashboards, data-management screens, forms, profile
pages, workflows, reports, settings, and other enterprise SaaS
interfaces.

**Design direction:** Clean, minimal, professional, enterprise SaaS\
**Design language:** Angular Material / Material 3 inspired\
**Primary canvas:** 1440 × 900px desktop\
**Design approach:** Mobile-first and responsive\
**Color approach:** Black, white, and neutral gray\
**Primary font:** Roboto

The system should be reusable across different products and datasets
rather than being tied to a specific business domain.

------------------------------------------------------------------------

# 2. Core Design Principles

### 2.1 Simplicity

Prioritize useful information and actions. Avoid decorative UI that does
not improve usability.

### 2.2 Consistency

Use the same spacing, typography, controls, icon treatment, and
interaction patterns throughout the application.

### 2.3 Responsive by Default

Every desktop design must have an intentional mobile behavior.

Do not simply shrink the desktop layout.

### 2.4 Accessibility

All important actions and information must remain accessible using
keyboard, touch, and screen readers.

### 2.5 Density With Readability

Enterprise applications often contain a large amount of information. Use
compact but comfortable spacing.

### 2.6 Clear Feedback

Every important user action should have an appropriate feedback
mechanism such as:

-   Loading indicator
-   Progress state
-   Toast/snackbar
-   Inline validation
-   Success confirmation
-   Error message

### 2.7 CSS Overrides and `!important`

When overriding Angular Material or implementing custom styles, **do not use `!important`** unless absolutely unavoidable. 
- Rely on CSS specificity (e.g., using `.component-class ::ng-deep .mat-element`) to override styles.
- Using `!important` breaks the cascade, makes future maintenance difficult, and prevents child components from extending or modifying styles properly.
- If you find yourself needing `!important`, re-evaluate the DOM structure, CSS selector specificity, or consider if Angular Material's structural defaults should be accepted.

------------------------------------------------------------------------

# 3. Color System

Use a neutral monochrome palette as the foundation.

  Token                 Value       Usage
  --------------------- ----------- ------------------------------
  Page Background       `#F7F7F7`   Main application background
  Surface               `#FFFFFF`   Cards, panels and containers
  Primary Text          `#111111`   Main headings and values
  Secondary Text        `#666666`   Supporting information
  Muted Text            `#777777`   Placeholder/meta text
  Disabled Text         `#A0A0A0`   Disabled controls
  Header Background     `#EEEEEE`   Table/list headers
  Border                `#E2E2E2`   Cards and component edges
  Light Border          `#E9E9E9`   Dividers and row separators
  Hover                 `#F5F5F5`   Hover state
  Selected              `#EEEEEE`   Selected state
  Primary Button        `#111111`   Main CTA
  Primary Button Text   `#FFFFFF`   Main CTA text
  Disabled Surface      `#F0F0F0`   Disabled controls

### Semantic states

The product may use subtle semantic colors where required for usability,
especially for success/error/warning information. Keep them restrained
and ensure meaning is never communicated by color alone.

Suggested light semantic treatment:

  State         Use
  ------------- ---------------------------------
  Success       Subtle green tint + icon + text
  Warning       Subtle amber tint + icon + text
  Error         Subtle red tint + icon + text
  Information   Subtle blue tint + icon + text

If strict monochrome is required, use gray backgrounds with distinct
icons and labels.

------------------------------------------------------------------------

# 4. Typography

Use **Roboto** or the standard Angular Material typography system.

  Element                Size   Weight   Suggested Line Height
  ---------------- ---------- -------- -----------------------
  Display / Hero     32--40px      600                40--48px
  Page Title             28px      600                    36px
  Section Title      20--24px      600                28--32px
  Card Title         16--18px      600                    24px
  Body               14--16px      400                20--24px
  Body Strong        14--16px      500                20--24px
  Caption                12px      400                    16px
  Button                 14px      500                    20px
  Input                  14px      400                    20px
  Table Header       13--14px      600                    20px
  Table Body             14px      400                    20px

Avoid excessive font sizes and unnecessary use of bold text.

------------------------------------------------------------------------

# 5. Spacing System

Use an **8px spacing grid**.

  Token     Value Usage
  ------- ------- -------------------------------
  xs          4px Micro spacing
  sm          8px Icon/text and compact spacing
  md         12px Input/internal spacing
  lg         16px Standard component spacing
  xl         24px Section spacing
  2xl        32px Major spacing
  3xl        40px Page spacing
  4xl        48px Large section separation

Prefer multiples of 4/8 wherever practical.

------------------------------------------------------------------------

# 6. Radius System

Use restrained rounding.

  Component          Radius
  -------------- ----------
  Cards                 8px
  Buttons               6px
  Inputs                5px
  Dropdowns             5px
  Dialogs              10px
  Chips/Badges     14--16px
  Avatar                50%
  Icon Button           50%

Avoid excessive pill-shaped components.

------------------------------------------------------------------------

# 7. Elevation & Shadows

Prefer borders over heavy shadows.

### Level 0

Flat content:

``` text
box-shadow: none
```

### Level 1

Cards:

``` text
0 2px 8px rgba(0,0,0,0.04)
```

### Level 2

Dialogs/dropdowns:

``` text
0 8px 24px rgba(0,0,0,0.12)
```

### Level 3

Important overlays:

``` text
0 16px 40px rgba(0,0,0,0.16)
```

Do not apply shadows to every component.

------------------------------------------------------------------------

# 8. Responsive / Mobile-First Strategy

The application must be designed mobile-first.

Recommended breakpoints:

  Device                  Width
  --------------- -------------
  Small Mobile       320--359px
  Mobile             360--599px
  Tablet             600--959px
  Desktop           960--1279px
  Large Desktop         1280px+

These are design reference points, not strict implementation
requirements.

## Mobile Rules

At mobile widths:

-   Use single-column layouts by default.
-   Reduce horizontal padding to `16px`.
-   Allow content to use almost the full screen width.
-   Stack buttons when necessary.
-   Convert multi-column forms to one column.
-   Move secondary actions into menus.
-   Replace large desktop toolbars with compact controls.
-   Avoid tiny controls.
-   Maintain a minimum touch target of approximately `44 × 44px`.
-   Prevent horizontal page scrolling.
-   Use horizontal scrolling only for genuinely wide data tables.
-   Keep important actions visible.
-   Avoid fixed desktop widths.

### Mobile Page Padding

``` text
16px
```

### Tablet Page Padding

``` text
24px
```

### Desktop Page Padding

``` text
32–40px
```

------------------------------------------------------------------------

# 9. Application Shell

Generic structure:

``` text
┌─────────────────────────────────────────────────────────────┐
│ Header / Top Bar                                            │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Sidebar      │ Main Content                                 │
│              │                                              │
│ Navigation   │ Page                                         │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

## Desktop

-   Persistent sidebar or navigation rail.
-   Top app bar.
-   Breadcrumbs where useful.
-   Main content with consistent page padding.

## Mobile

Use:

``` text
Top App Bar
      ↓
Main Content
      ↓
Optional Bottom Navigation / Drawer
```

Sidebar should become:

-   Navigation drawer
-   Hamburger menu
-   Bottom navigation for a small number of primary destinations

Do not keep a full desktop sidebar on a narrow mobile screen.

------------------------------------------------------------------------

# 10. Navigation

Navigation should clearly identify:

-   Current section
-   Parent section
-   Available primary actions

Recommended desktop sidebar row:

-   Height: `44–48px`
-   Horizontal padding: `12–16px`
-   Icon: `20–22px`
-   Label: `14px`
-   Gap between icon and label: `12px`

### Selected Navigation

Use subtle gray/black treatment:

``` text
background: #EEEEEE
font-weight: 500
```

Avoid overly strong colored side indicators unless the product requires
them.

------------------------------------------------------------------------

# 11. Icon System

Use **Angular Material Icons / Material Symbols** consistently.

## Icon Size

  Use                        Size
  -------------------- ----------
  Small inline icon          16px
  Standard icon              20px
  Navigation icon        20--24px
  Large feature icon     32--40px
  Empty state icon       40--48px

## Icon Rules

-   Prefer familiar icons.
-   Do not mix unrelated icon styles.
-   Keep stroke/glyph treatment consistent.
-   Use tooltips for icon-only desktop actions where useful.
-   Always provide accessible labels.
-   Never rely on the icon alone when the action is ambiguous.

## Recommended Common Icons

  Purpose         Material Icon
  --------------- ------------------------
  Dashboard       `dashboard`
  Home            `home`
  Search          `search`
  Filter          `filter_list`
  Sort            `unfold_more`
  Add             `add`
  Edit            `edit`
  Delete          `delete`
  Save            `save`
  Close           `close`
  Check           `check`
  More            `more_vert`
  Menu            `menu`
  Back            `arrow_back`
  Forward         `arrow_forward`
  Notifications   `notifications`
  Settings        `settings`
  Profile         `account_circle`
  Logout          `logout`
  Help            `help_outline`
  Info            `info_outline`
  Warning         `warning_amber`
  Error           `error_outline`
  Success         `check_circle_outline`
  Upload          `upload`
  Download        `download`
  Refresh         `refresh`
  Calendar        `calendar_today`
  Time            `schedule`
  Visibility      `visibility`
  Password        `lock`
  Security        `security`
  Documents       `description`
  Folder          `folder`
  Link            `link`
  Copy            `content_copy`

------------------------------------------------------------------------

# 12. Buttons

## Primary

Use for the main action.

-   Height: `40–44px`
-   Padding: `0 16px`
-   Radius: `6px`
-   Background: `#111111`
-   Text: `#FFFFFF`

## Secondary

-   Background: `#FFFFFF`
-   Border: `1px solid #D6D6D6`
-   Text: `#222222`

## Tertiary

Text-only action:

``` text
background: transparent
border: none
```

## Icon Button

-   Minimum touch target: `44 × 44px`
-   Desktop visual icon: `20–24px`
-   Circular or subtle rounded shape

## Mobile

Primary actions should:

-   remain easy to tap
-   use full width when appropriate
-   stack vertically when two or more actions cannot fit comfortably

------------------------------------------------------------------------

# 13. Forms & Inputs

Default Material input:

-   Height target: `48–56px`
-   Label: 13--14px
-   Text: 14px
-   Radius: 5--6px
-   Border: subtle gray

Use clear labels instead of relying only on placeholders.

### Form Layout

Desktop:

``` text
[Field] [Field] [Field]
[Field] [Field] [Field]
```

Mobile:

``` text
[Field]
[Field]
[Field]
```

### Validation

Show validation close to the affected field.

Example:

``` text
Email
[ example@company.com           ]

This email address is invalid.
```

Use icon + text where useful.

Do not rely on red color alone.

------------------------------------------------------------------------

# 14. Data Table

Use the generic table specification from the original system.

## Table Header

Two-level header when column filters are required:

``` text
Column Name ↕
[ Search... ]
```

Header:

-   `#EEEEEE`
-   Title row: `48px`
-   Filter row: `48–52px`

## Row Height

-   Dense: `44–48px`
-   Standard: `52–60px`
-   Comfortable: `60–68px`

Choose one density consistently.

## Mobile Table

Do not compress every column.

Preferred mobile approaches:

1.  Horizontal scrolling
2.  Sticky first/primary column
3.  Responsive card/list transformation for highly complex data

On small screens, preserve the primary identifier and key value/status.

------------------------------------------------------------------------

# 15. Loader & Loading States

Loaders must communicate system activity without creating visual noise.

## Spinner

Use for short operations.

Angular Material:

``` text
mat-progress-spinner
```

Recommended:

-   Small inline spinner: `18–20px`
-   Button spinner: `16–20px`
-   Page spinner: `32–40px`

## Progress Bar

Use for:

-   Page/data loading
-   Uploading
-   Long-running processes

Angular Material:

``` text
mat-progress-bar
```

## Skeleton Loader

Preferred for content-heavy pages and tables.

Skeleton shapes should match the final layout:

``` text
████████████████
████████
████████████████████
```

Use skeletons for:

-   Dashboard cards
-   Tables
-   Profile data
-   Lists
-   Detail pages

Avoid showing a giant spinner when the structure of the page is already
known.

## Loading Button

While an action is processing:

``` text
[ ◌ Saving... ]
```

Rules:

-   Disable duplicate submission.
-   Preserve button width.
-   Keep users informed.
-   Restore the original action after completion.

## Mobile Loading

Keep loading indicators close to the action/content being loaded.

Avoid blocking the entire screen for small operations.

------------------------------------------------------------------------

# 16. Stepper / Workflow Design

Use steppers for multi-step processes.

Example:

``` text
① Basic Info ─── ② Details ─── ③ Review ─── ④ Complete
```

Angular Material:

``` text
mat-stepper
```

## Desktop Stepper

Horizontal stepper:

-   Step label visible
-   Number/icon visible
-   Progress clearly indicated
-   Current step visually emphasized

## Mobile Stepper

Prefer:

``` text
Step 2 of 4

Details
────────────
████████░░░░
```

or a compact vertical stepper when labels are long.

Do not force a long horizontal stepper onto a narrow screen.

## Step States

-   Completed
-   Current
-   Upcoming
-   Error/Attention

Use icons and labels in addition to color.

## Stepper Rules

-   Users should know what remains.
-   Preserve entered data when moving backward.
-   Show validation at the correct step.
-   Avoid unnecessary steps.
-   Include Back and Next actions consistently.

Mobile bottom action pattern:

``` text
[ Back ]                         [ Next ]
```

------------------------------------------------------------------------

# 17. Toast / Snackbar Design

Use Angular Material `MatSnackBar` for lightweight feedback.

## Use Toasts For

-   Successful save
-   Update confirmation
-   Copy completed
-   Background operation completion
-   Non-blocking system messages

Example:

``` text
✓ Changes saved                         [Dismiss]
```

## Toast Dimensions

Desktop:

-   Width: `320–420px`
-   Minimum height: `48px`
-   Placement: bottom-left or bottom-center depending on product
    conventions

Mobile:

-   Width: `calc(100% - 32px)`
-   Bottom margin: `16px`
-   Respect mobile safe areas

## Toast Content

Use:

``` text
[Icon] Short message                [Action]
```

Keep messages brief.

Good:

``` text
Record updated.
```

Better when action is possible:

``` text
Record archived.  [Undo]
```

Avoid:

``` text
Your record has been successfully updated in the system.
```

## Duration

Typical lightweight messages:

`3–5 seconds`

Important actions should provide an explicit dismiss or action.

Do not use toasts for critical destructive confirmation. Use a dialog
instead.

------------------------------------------------------------------------

# 18. Dashboard Design

Dashboard pages should summarize information before exposing detailed
data.

Recommended structure:

``` text
Page Header
    ↓
KPI Cards
    ↓
Charts / Summary Panels
    ↓
Recent Activity / Tables
    ↓
Secondary Information
```

## KPI Cards

Typical layout:

``` text
Revenue
₹12.4L

↑ 8.2% vs previous period
```

Card:

-   Background: `#FFFFFF`
-   Border: `1px solid #E2E2E2`
-   Radius: `8px`
-   Padding: `20px`
-   Height: approximately `120–150px`

Use 3--5 cards in a row on desktop.

## Dashboard Grid

Desktop:

``` text
[ KPI ] [ KPI ] [ KPI ] [ KPI ]

[      Main Chart      ] [ Side Summary ]

[        Table / Activity Feed        ]
```

Tablet:

``` text
[ KPI ] [ KPI ]
[ KPI ] [ KPI ]

[ Main Chart ]

[ Table ]
```

Mobile:

``` text
[ KPI ]

[ KPI ]

[ KPI ]

[ Main Chart ]

[ Summary ]

[ Recent Activity ]
```

Do not create tiny charts or four-column KPI rows on mobile.

## Charts

Guidelines:

-   Keep backgrounds clean.
-   Use consistent chart spacing.
-   Avoid unnecessary decoration.
-   Always include labels or accessible data representations.
-   Ensure legends do not consume excessive space.
-   Provide a text/table alternative for important data when necessary.

------------------------------------------------------------------------

# 19. Profile Page

Profile pages should present identity and information clearly.

Generic desktop layout:

``` text
┌────────────────────────────────────────────────────────────┐
│ Avatar   Name                         [Edit Profile]       │
│          Role / Description                               │
├────────────────────────────────────────────────────────────┤
│ Overview | Activity | Security | Preferences                │
├────────────────────────────────────────────────────────────┤
│ Personal Information                                       │
│                                                            │
│ [Field]                     [Field]                       │
│ [Field]                     [Field]                       │
└────────────────────────────────────────────────────────────┘
```

## Profile Header

-   Avatar: `72–96px` desktop
-   Name: `24px`
-   Secondary text: `14px`
-   Primary action on right

## Mobile Profile

Stack:

``` text
        [Avatar]

         Name
     Role / Details

      [Edit Profile]

Tabs / sections
```

Use approximately `16px` page padding.

## Avatar

Common sizes:

-   Small: `32px`
-   Standard: `40px`
-   Large: `72px`
-   Profile hero: `96–120px`

Use initials when no image exists.

------------------------------------------------------------------------

# 20. Detail / View Page

Recommended:

``` text
Breadcrumb
Page Title                     [Actions]

Summary Card

Information Sections

Related Data / Activity
```

Use cards only when they provide meaningful grouping.

Avoid wrapping every individual field in its own card.

------------------------------------------------------------------------

# 21. Empty States

Use for lists, dashboards, tables and profile sections with no content.

Example:

``` text
        [Icon]

     No records yet

Add your first record to get started.

       [+ Add Record]
```

Guidelines:

-   Simple icon
-   Short heading
-   One-line explanation
-   Relevant primary action
-   Avoid oversized illustrations in enterprise products

------------------------------------------------------------------------

# 22. Error States

Example:

``` text
        [Error Icon]

   Unable to load data

Something went wrong. Please try again.

          [Retry]
```

For inline errors:

``` text
Field label
[ input ]

Error explanation
```

Errors should explain:

1.  What went wrong
2.  What the user can do next

------------------------------------------------------------------------

# 23. Confirmation Dialogs

Use dialogs for consequential actions.

Example:

``` text
Delete record?

This action cannot be undone.

[Cancel]             [Delete]
```

Rules:

-   Keep title short.
-   Explain consequence.
-   Make the safe action easy to identify.
-   Do not use a toast for destructive confirmations.

Mobile dialogs should fit comfortably within the viewport and avoid
excessive width.

------------------------------------------------------------------------

# 24. Search

## Global Search

Desktop:

``` text
[ 🔍 Search everything... ]
```

Can appear in the top bar.

## Page Search

Place near the page/table toolbar.

## Mobile Search

On mobile, use:

-   Full-width search
-   Expandable search button
-   Search panel

Avoid putting a tiny search field into a crowded toolbar.

------------------------------------------------------------------------

# 25. Filters

Desktop:

``` text
[Search] [Category ▼] [Status ▼] [Date ▼] [Clear]
```

Mobile:

``` text
[ Search........................ ]

[ Filters (3) ]
```

Open filters in:

-   Bottom sheet
-   Dialog
-   Side sheet

Keep the number of visible mobile filter controls small.

------------------------------------------------------------------------

# 26. Tabs

Use tabs to separate related content.

Desktop:

``` text
Overview | Activity | Security | Settings
```

Mobile:

-   Allow horizontal scrolling for many tabs.
-   Keep tab labels short.
-   Do not squeeze tabs until labels become unreadable.

Active tab should use:

-   Dark text
-   Clear indicator
-   Accessible selected state

------------------------------------------------------------------------

# 27. Cards

Cards should group related information.

Recommended:

-   Background: `#FFFFFF`
-   Border: `1px solid #E2E2E2`
-   Radius: `8px`
-   Padding: `16–24px`

Avoid nesting many cards inside cards.

For mobile, reduce card padding to `16px`.

------------------------------------------------------------------------

# 28. Lists

List item:

-   Height: `48–64px`
-   Leading icon/avatar: `32–40px`
-   Primary text: `14px`
-   Secondary text: `12px`
-   Action area: `44px` touch target

Mobile list items can increase to `64–72px` when secondary information
is present.

------------------------------------------------------------------------

# 29. Bottom Sheets / Mobile Actions

Use bottom sheets when several actions or filters need to be exposed on
mobile.

Example:

``` text
────────────────────────────
Filters

Category
[ All ▼ ]

Status
[ Active ▼ ]

Date
[ Select date ]

[ Clear ]          [ Apply ]
────────────────────────────
```

Keep actions visible near the bottom.

------------------------------------------------------------------------

# 30. Navigation Icons & Page Icons

Every primary section may have a consistent icon.

Example application navigation:

``` text
Dashboard       dashboard
Records         table_view
Reports         analytics
Users           group
Documents       description
Notifications   notifications
Settings        settings
Profile         account_circle
Help            help_outline
```

Do not add icons to every heading just for decoration.

Use icons when they improve recognition or navigation.

------------------------------------------------------------------------

# 31. Mobile Navigation

### Option A --- Navigation Drawer

Best for many destinations.

``` text
☰
────────────
Dashboard
Records
Reports
Settings
Profile
```

### Option B --- Bottom Navigation

Best for 3--5 primary destinations.

``` text
──────────────────────────────
 Home   Records   Reports   Profile
  ●       ○         ○         ○
──────────────────────────────
```

Do not put 7--10 destinations in bottom navigation.

------------------------------------------------------------------------

# 32. Touch Targets

For mobile:

-   Minimum target: approximately `44 × 44px`
-   Comfortable target: `48 × 48px`

This applies to:

-   Buttons
-   Icon buttons
-   Checkboxes
-   Navigation items
-   Pagination
-   List actions

Keep sufficient spacing between adjacent controls to avoid accidental
taps.

------------------------------------------------------------------------

# 33. Mobile Table Rules

For a wide data table:

``` text
┌─────────────────────────────────┐
│ ID │ Name       │ Status  │ ... │
├─────────────────────────────────┤
│ → horizontal scroll →           │
└─────────────────────────────────┘
```

Recommended:

-   Sticky first column where useful
-   Sticky header
-   Minimum readable text size
-   Horizontal scrolling within the table container, not the entire page

For highly complex data, consider converting rows into cards:

``` text
Record ID
Primary Name
Status

Secondary information
Secondary information

[View] [More]
```

------------------------------------------------------------------------

# 34. Mobile Dashboard Rules

Avoid:

-   4-column KPI cards
-   Side-by-side tiny charts
-   Large desktop tables
-   Dense multi-column forms

Prefer:

``` text
Full-width KPI
Full-width KPI
Full-width KPI

Full-width chart

Full-width summary

Recent activity list
```

------------------------------------------------------------------------

# 35. Loading + Mobile UX

Mobile loading should avoid unnecessary full-screen blocking.

Prefer:

-   Skeleton cards
-   Skeleton lists
-   Button spinner
-   Pull-to-refresh where appropriate
-   Inline progress for local operations

For route transitions, use lightweight loading feedback without
introducing jarring animations.

------------------------------------------------------------------------

# 36. Motion

Animations should be subtle and purposeful.

Recommended:

-   Hover: `100–150ms`
-   Dropdown/dialog: `150–250ms`
-   Content transitions: `150–250ms`

Avoid:

-   Large bouncing animations
-   Decorative motion
-   Long transitions
-   Motion that blocks user interaction

Respect reduced-motion preferences.

------------------------------------------------------------------------

# 37. Accessibility

All components should follow accessible interaction patterns.

Requirements:

-   Keyboard navigation
-   Visible focus state
-   Semantic HTML
-   Accessible names for icons
-   Screen-reader-friendly status text
-   Proper labels for forms
-   Accessible dialogs
-   Accessible tables
-   Accessible steppers
-   Correct `aria-*` usage where necessary
-   Do not rely on color alone
-   Maintain readable contrast

------------------------------------------------------------------------

# 38. Angular Material Component Mapping

Recommended components:

``` text
mat-toolbar
mat-sidenav
mat-nav-list
mat-menu
mat-icon
mat-button
mat-icon-button
mat-card
mat-form-field
mat-input
mat-select
mat-checkbox
mat-radio
mat-slide-toggle
mat-datepicker
mat-dialog
mat-snack-bar
mat-progress-spinner
mat-progress-bar
mat-stepper
mat-tabs
mat-table
mat-sort
mat-paginator
mat-list
mat-chip
mat-tooltip
mat-expansion-panel
```

Use Angular Material components consistently and customize them through
a shared design theme.

------------------------------------------------------------------------

# 39. Reusable Component Architecture

Create reusable components instead of styling each screen independently.

Suggested component structure:

``` text
AppShell
├── TopBar
├── Sidebar
├── MobileNavigation
└── PageContainer

UI
├── PageHeader
├── DataTable
├── SearchBar
├── FilterBar
├── EmptyState
├── ErrorState
├── LoadingState
├── Skeleton
├── ToastService
├── Stepper
├── ConfirmDialog
├── Pagination
├── StatusBadge
├── Avatar
├── ProfileHeader
├── StatCard
└── MobileActionSheet
```

------------------------------------------------------------------------

# 40. Design Tokens

Store shared design values as variables/tokens.

Example:

``` css
:root {
  --color-page: #f7f7f7;
  --color-surface: #ffffff;
  --color-text: #111111;
  --color-text-secondary: #666666;
  --color-border: #e2e2e2;
  --color-border-light: #e9e9e9;
  --color-header: #eeeeee;
  --color-hover: #f5f5f5;

  --radius-sm: 5px;
  --radius-md: 6px;
  --radius-lg: 8px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;

  --touch-target: 44px;
}
```

Use tokens rather than hard-coding different values throughout the
application.

------------------------------------------------------------------------

# 41. Responsive Component Behavior

Every reusable component should define:

``` text
Desktop behavior
Tablet behavior
Mobile behavior
```

Example:

### Data Table

``` text
Desktop:
Full table

Tablet:
Reduced columns + horizontal scroll

Mobile:
Horizontal scroll or card transformation
```

### Sidebar

``` text
Desktop:
Persistent sidebar

Mobile:
Drawer
```

### Toolbar

``` text
Desktop:
Title + filters + actions

Mobile:
Title
Primary action
Filter/search controls below
```

### Form

``` text
Desktop:
2–3 columns

Mobile:
1 column
```

### Stepper

``` text
Desktop:
Horizontal

Mobile:
Compact/vertical
```

### Dashboard

``` text
Desktop:
Multi-column grid

Mobile:
Single-column stacked sections
```

------------------------------------------------------------------------

# 42. Quality Checklist

Before considering a page complete, verify:

### Visual

-   Consistent typography
-   Consistent spacing
-   Neutral color hierarchy
-   Minimal shadows
-   Clear visual hierarchy
-   Consistent icon style

### UX

-   Primary action is obvious
-   Loading state exists
-   Empty state exists
-   Error state exists
-   Success feedback exists
-   Destructive actions have confirmation
-   Filters can be cleared
-   Mobile actions are easy to access

### Responsive

-   No accidental horizontal page scrolling
-   Text remains readable
-   Buttons remain tappable
-   Forms stack correctly
-   Tables have an intentional mobile strategy
-   Navigation adapts to mobile
-   Dialogs and bottom sheets fit the viewport

### Accessibility

-   Keyboard navigation works
-   Focus states are visible
-   Labels are present
-   Icons have accessible names
-   Color is not the only indicator
-   Touch targets are sufficiently large

------------------------------------------------------------------------

# 43. Final Design Direction

Create a **generic, reusable Angular Material design system** that
feels:

**Minimal · Neutral · Professional · Structured · Responsive ·
Accessible · Production-ready**

Use:

**Angular Material + Material 3 + modern enterprise SaaS patterns**

The system should work equally well for:

-   Dashboards
-   Data tables
-   Reports
-   Forms
-   CRUD applications
-   Profile pages
-   Settings
-   Workflows
-   Multi-step forms
-   Notifications
-   Search/filter experiences
-   Mobile applications

Design every desktop component with its mobile version in mind from the
beginning.

Avoid:

-   Bright decorative UI
-   Excessive gradients
-   Heavy shadows
-   Excessive rounded cards
-   Tiny mobile controls
-   Desktop-only layouts
-   Overcrowded mobile toolbars
-   Long horizontal steppers on mobile
-   Tiny charts on mobile
-   Toasts for critical destructive actions
-   Full-screen spinners when skeletons are more appropriate

# 43. Responsive Design Requirement

## Core Requirement

The entire design system is **responsive by default** and must support:

- Desktop
- Tablet
- Mobile

Mobile is not a reduced desktop layout. Every component must have an intentional responsive behavior.

The same design system, component library, typography, spacing tokens, and interaction patterns should work across screen sizes.

### Primary Rule

> Every desktop component must have a defined tablet and mobile behavior before it is considered complete.

Do not use fixed-width layouts that cause page-level horizontal scrolling.

---

## 43.1 Responsive Breakpoints

Use responsive breakpoints as design guidance:

| Device | Width |
|---|---:|
| Small Mobile | 320–359px |
| Mobile | 360–599px |
| Tablet | 600–959px |
| Desktop | 960–1279px |
| Large Desktop | 1280px+ |

Breakpoints may be adjusted to suit the application's actual content.

---

## 43.2 Responsive Page Container

### Large Desktop

- Horizontal padding: `40px`
- Maximum content width: `1360px`

### Desktop

- Horizontal padding: `32px`

### Tablet

- Horizontal padding: `24px`

### Mobile

- Horizontal padding: `16px`

The page must never create unnecessary horizontal scrolling.

---

## 43.3 Responsive Layout Rules

### Desktop

Use multi-column layouts where they improve information density.

Example:

```text
┌───────────────────────────────────────────────┐
│ Header                                        │
├──────────────┬────────────────────────────────┤
│ Sidebar      │ Main Content                   │
│              │                                │
│              │ [Card] [Card] [Card]           │
│              │                                │
│              │ [        Main Content        ] │
└──────────────┴────────────────────────────────┘
```

### Tablet

Reduce columns and spacing where necessary.

```text
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ [Card] [Card]                       │
│ [Card] [Card]                       │
│                                     │
│ [          Main Content           ] │
└─────────────────────────────────────┘
```

### Mobile

Use a single-column layout.

```text
┌───────────────────────┐
│ Compact Header        │
├───────────────────────┤
│ Page Title            │
│                       │
│ [Primary Card]        │
│                       │
│ [Secondary Card]      │
│                       │
│ [Full-width Content]  │
└───────────────────────┘
```

---

## 43.4 Responsive Navigation

### Desktop

Use:

- Persistent sidebar
- Top app bar
- Optional breadcrumbs

### Tablet

Use:

- Collapsed navigation rail or sidebar
- Top app bar

### Mobile

Use:

- Compact top app bar
- Hamburger menu + navigation drawer

or:

- Bottom navigation for 3–5 primary destinations

Never display a full desktop sidebar on a narrow screen.

---

## 43.5 Responsive Header

### Desktop

```text
[Logo] [Navigation]                    [Search] [Notifications] [Profile]
```

### Mobile

```text
[☰] [Page Title]                 [Profile]
```

Secondary actions should move into an overflow menu.

The header should not overflow horizontally.

---

## 43.6 Responsive Page Header

### Desktop

```text
Page Title                              [Primary Action]
Description
```

### Mobile

```text
Page Title

Description

[Primary Action]
```

When space is limited, stack actions vertically.

---

## 43.7 Responsive Dashboard

### Desktop

```text
[KPI] [KPI] [KPI] [KPI]

[             Main Chart             ] [Summary]

[                    Table / Activity                ]
```

### Tablet

```text
[KPI] [KPI]
[KPI] [KPI]

[              Main Chart             ]

[                Summary              ]

[                Table                ]
```

### Mobile

```text
[KPI]

[KPI]

[KPI]

[Full-width Chart]

[Summary]

[Activity/List]
```

Rules:

- Never use tiny KPI cards on mobile.
- Stack dashboard content vertically.
- Charts should become full width.
- Keep important metrics visible near the top.
- Avoid dense multi-column dashboards on mobile.

---

## 43.8 Responsive Data Table

Tables are inherently wide, so define a deliberate mobile strategy.

### Desktop

Display all relevant columns.

```text
┌────┬────────────┬────────────┬───────────┬─────────┐
│ ID │ Name       │ Category   │ Date      │ Status  │
├────┼────────────┼────────────┼───────────┼─────────┤
│ 01 │ Item One   │ Category A │ 12 Jan    │ Active  │
└────┴────────────┴────────────┴───────────┴─────────┘
```

### Tablet

- Reduce non-essential column widths.
- Keep important columns visible.
- Enable horizontal scrolling inside the table container.

### Mobile Option A — Horizontal Table

Use when users need to compare rows and columns.

```text
┌───────────────────────────────┐
│ ID │ Name │ Status │ ...      │
├───────────────────────────────┤
│ 01 │ Item │ Active │ ...      │
└───────────────────────────────┘

        ← horizontal scroll →
```

Rules:

- Horizontal scrolling must be contained within the table.
- Do not make the entire page horizontally scroll.
- Consider sticky first column.
- Keep header sticky when appropriate.

### Mobile Option B — Responsive Row/Card

Use when the table contains many columns or complex cell content.

```text
┌─────────────────────────────┐
│ Primary Name            ⋮   │
│ ID: 001                      │
│ Category: Category A        │
│ Date: 12 Jan 2026           │
│ Status: ● Active             │
│                             │
│ [View Details]              │
└─────────────────────────────┘
```

Choose the strategy based on the user's task, not simply screen size.

---

## 43.9 Responsive Table Filters

### Desktop

Show filters inline:

```text
[Search...] [Category ▼] [Status ▼] [Date ▼] [Clear]
```

### Mobile

Use:

```text
[ Search........................ ]

[ Filters (3) ]
```

Open filters in:

- Bottom sheet
- Dialog
- Side sheet

Do not place six or seven filter controls in a single mobile toolbar.

---

## 43.10 Responsive Forms

### Desktop

Use 2–3 columns where fields are independent.

```text
[Field]       [Field]       [Field]

[Field]       [Field]       [Field]
```

### Tablet

Use 2 columns where practical.

### Mobile

Always stack fields unless there is a strong usability reason not to.

```text
[Field]

[Field]

[Field]

[Field]
```

Rules:

- Full-width inputs
- Clear labels
- Adequate vertical spacing
- Comfortable touch targets
- Validation text remains visible

---

## 43.11 Responsive Stepper

### Desktop

Use a horizontal stepper:

```text
① Basic Info ─── ② Details ─── ③ Review ─── ④ Complete
```

### Tablet

Use horizontal stepper with reduced labels where necessary.

### Mobile

Use a compact progress pattern:

```text
Step 2 of 4

Details
━━━━━━━━━━━━░░░░
```

or a vertical stepper for complex workflows.

Bottom actions:

```text
[ Back ]                         [ Next ]
```

Keep the primary navigation action accessible without excessive scrolling.

---

## 43.12 Responsive Dialogs

### Desktop

Use a centered modal with a reasonable maximum width.

Recommended:

- Small dialog: `400–480px`
- Medium dialog: `520–640px`
- Large dialog: `720–900px`

### Mobile

Use almost the full available width:

```text
┌───────────────────────────┐
│ Dialog Title          ×   │
├───────────────────────────┤
│                           │
│ Content                   │
│                           │
├───────────────────────────┤
│ [Cancel]       [Confirm]  │
└───────────────────────────┘
```

For long actions or filters, prefer a bottom sheet where appropriate.

---

## 43.13 Responsive Toast / Snackbar

### Desktop

Place the toast in a consistent corner:

```text
                         ┌──────────────────────┐
                         │ ✓ Saved successfully │
                         └──────────────────────┘
```

### Mobile

Use:

```text
┌──────────────────────────────┐
│ ✓ Saved successfully         │
└──────────────────────────────┘
```

Rules:

- Width: `calc(100% - 32px)`
- Respect safe areas.
- Do not cover primary mobile navigation or important bottom actions.
- Keep the message concise.

---

## 43.14 Responsive Profile Page

### Desktop

```text
┌────────────────────────────────────────────┐
│ Avatar   Name                    [Edit]     │
│          Description                       │
├────────────────────────────────────────────┤
│ Overview | Activity | Security | Settings  │
├────────────────────────────────────────────┤
│ Personal Information                       │
│                                             │
│ [Field]                 [Field]             │
│ [Field]                 [Field]             │
└────────────────────────────────────────────┘
```

### Mobile

```text
          [Avatar]

           Name
      Role / Details

        [Edit]

Overview
Activity
Security
Settings

[Information Section]
```

Rules:

- Center or logically stack profile identity.
- Stack information fields.
- Make primary profile action easy to reach.
- Allow tabs to scroll horizontally when needed.

---

## 43.15 Responsive Cards

### Desktop

Cards can sit beside each other.

```text
[ Card ] [ Card ] [ Card ]
```

### Tablet

```text
[ Card ] [ Card ]
[ Card ] [ Card ]
```

### Mobile

```text
[ Card ]

[ Card ]

[ Card ]
```

Card padding:

- Desktop: `20–24px`
- Mobile: `16px`

---

## 43.16 Responsive Lists

### Desktop

Use compact list rows.

### Mobile

Increase vertical space when secondary information exists.

Recommended mobile row height:

`60–72px`

Actions should use `44px+` touch targets.

---

## 43.17 Responsive Buttons

### Desktop

Buttons may use content-based width.

### Mobile

Primary actions should be:

- Full width when used as a major form/page action.
- Or at least `44px` tall with comfortable horizontal padding.

For two actions:

```text
[ Secondary ]   [ Primary ]
```

When labels become too long:

```text
[ Secondary ]

[ Primary Action ]
```

Do not allow buttons to overflow or truncate important action labels.

---

## 43.18 Touch Targets

For mobile and touch devices:

- Minimum target: approximately `44 × 44px`
- Preferred target: `48 × 48px`

Apply to:

- Buttons
- Icon buttons
- Navigation
- Checkboxes
- Pagination
- Menus
- List actions

Maintain spacing between neighboring controls.

---

## 43.19 Responsive Icon Rules

Icons must scale appropriately.

| Component | Desktop | Mobile |
|---|---:|---:|
| Inline icon | 16–20px | 16–20px |
| Standard icon | 20–24px | 20–24px |
| Navigation | 20–24px | 20–24px |
| Feature icon | 32–40px | 28–36px |
| Empty state | 40–48px | 40–48px |

Do not reduce touch targets simply because the icon itself is small.

---

## 43.20 Responsive Typography

Do not scale text too aggressively.

### Desktop

Page title:

`28px`

### Mobile

Page title:

`24px`

### Recommended Mobile

- Section title: `18–20px`
- Body: `14px`
- Caption: `12px`
- Button: `14px`

Keep body text comfortably readable.

---

## 43.21 Responsive Charts

Charts should become full-width on mobile.

Rules:

- Avoid charts that become too narrow.
- Reduce chart height moderately.
- Simplify legends.
- Move long legends below the chart.
- Use horizontal scrolling only for charts that genuinely require it.
- Provide accessible labels or tabular alternatives for important data.

---

## 43.22 Responsive Loading

Desktop and mobile should use the same loading strategy but adapt presentation.

### Desktop

Use:

- Skeleton cards
- Skeleton table rows
- Inline spinner
- Progress bar

### Mobile

Prefer:

- Full-width skeleton cards
- Skeleton list rows
- Button spinner
- Inline progress

Avoid blocking the entire mobile screen for a small operation.

---

## 43.23 Responsive Empty & Error States

### Desktop

Use centered content within the available panel.

### Mobile

Use a compact stacked state:

```text
[Icon]

No records found

Try changing your filters.

[Clear Filters]
```

Ensure the action remains easy to tap.

---

## 43.24 Responsive Overflow Rules

The application must not create accidental page-level horizontal scrolling.

### Allowed Horizontal Scrolling

Only use horizontal scrolling when content is inherently wide, such as:

- Data tables
- Large comparison matrices
- Special timelines

### Not Allowed

Do not use horizontal scrolling for:

- Page containers
- Forms
- Dashboard cards
- Navigation
- Dialogs
- Profile pages

When content does not fit, reflow or stack it.

---

## 43.25 Responsive Visibility

Classify UI elements as:

### Primary

Always visible when possible.

Examples:

- Page title
- Primary action
- Main status
- Primary navigation

### Secondary

Can move or collapse on mobile.

Examples:

- Export
- Advanced filters
- Secondary actions
- Descriptive metadata

### Tertiary

Can move into menus or expandable sections.

Examples:

- Additional metadata
- Advanced settings
- Rarely used actions

Never hide information that users need to complete the current task.

---

## 43.26 Responsive Accessibility

Responsive design must preserve accessibility.

Ensure:

- Touch targets remain large enough.
- Text remains readable.
- Focus states remain visible.
- Keyboard navigation remains functional.
- Screen readers receive logical content order.
- Hidden mobile/desktop elements are not incorrectly exposed to assistive technology.
- Dialogs trap focus appropriately.
- Bottom sheets are keyboard accessible.
- Horizontal table scrolling is discoverable and accessible.

---

## 43.27 Responsive Component Contract

Every reusable component should define these four things:

```text
1. Desktop layout
2. Tablet layout
3. Mobile layout
4. Overflow behavior
```

Example:

### Data Table

```text
Desktop:
Full multi-column table

Tablet:
Reduced columns + horizontal scroll

Mobile:
Horizontal scroll OR responsive row cards
```

### Navigation

```text
Desktop:
Persistent sidebar

Tablet:
Collapsed sidebar

Mobile:
Drawer / bottom navigation
```

### Form

```text
Desktop:
2–3 columns

Tablet:
2 columns

Mobile:
1 column
```

### Stepper

```text
Desktop:
Horizontal

Tablet:
Horizontal compact

Mobile:
Compact progress / vertical
```

---

## 43.28 Design Review Requirement

Before approving any page or component, review it at minimum at:

```text
320px
375px
768px
1024px
1440px
```

Verify:

- No unwanted page scrolling
- No clipped content
- No overlapping controls
- No unreadable text
- No inaccessible actions
- Correct stacking behavior
- Correct toolbar behavior
- Correct table behavior
- Correct navigation behavior
- Correct modal/dialog behavior

---

# 44. Final Responsive Principle

The product is **one responsive design system**, not separate desktop and mobile designs.

The same component should preserve:

- Visual identity
- Content hierarchy
- Interaction model
- Accessibility
- Design tokens

while adapting its:

- Width
- Height
- Layout
- Visibility
- Stacking
- Navigation
- Actions
- Overflow behavior

according to the available screen size.

**Design desktop and mobile together from the beginning.**
