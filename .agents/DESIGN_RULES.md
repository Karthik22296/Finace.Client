# Angular Material Design Guidelines & Rules

This document outlines the strict UI/UX and design rules for AI agents working on the Finace.Client application.

## 1. Theming & Color Palette
* **Strict Palette**: The application uses a stark, ultra-clean aesthetic. 
* **Backgrounds**: Must strictly be `#ffffff` (Solid White).
* **Text & Accents**: Must strictly be `#000000` (Solid Black).
* **Primary / Accent Colors**: Map the Angular Material `primary` and `accent` theme palettes to shades of black, gray, and white. Do not use default blue/pink Material themes.
* **Error / Warning**: Use minimal, accessible colors for errors (e.g., `#d32f2f`) only when absolutely necessary for validation.

## 2. Component Usage
* **Angular Material First**: ALWAYS use standard Angular Material components (`MatCard`, `MatButton`, `MatTable`, `MatInput`, etc.) before writing custom HTML/CSS.
* **Avoid Tailwind**: Do not inject or use TailwindCSS or Bootstrap. Rely entirely on plain CSS (or SCSS) and Angular Material's built-in structural classes.
* **Typography**: Use standard Material Typography classes (e.g., `mat-headline-1`, `mat-body-1`). The font family should default to Roboto or Inter.

## 3. Layout & Responsiveness
* **Mobile-First for Data Entry**: The "Daily Collection" and "Collector Route" screens MUST be optimized for mobile screens (portrait orientation). Use flexible grid layouts and `100%` widths for form fields on mobile.
* **Desktop for Back-Office**: Reports, ledgers, and wizards can take advantage of wider desktop screens using Angular CDK or Flexbox.
* **Spacing**: Use consistent padding and margins (e.g., `16px` standard padding). Avoid dense, cluttered interfaces.

## 4. Interactions & Animations
* **Micro-interactions**: Implement subtle hover effects on buttons and table rows (e.g., a slight background color shift to `#f5f5f5` or elevation change) to make the UI feel premium and alive.
* **Feedback**: Always provide visual feedback for actions (e.g., using `MatSnackBar` for success/error messages after submitting a form).

## 5. Development Constraints
* **Standalone Components**: Angular 19 defaults to standalone components. Ensure all Material modules (e.g., `MatButtonModule`) are directly imported into the component's `imports` array.
* **Encapsulation**: Write CSS specifically for the component it belongs to. Do not pollute `styles.css` with component-specific code.
