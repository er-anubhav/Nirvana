# Nirvana Design Guide

## Introduction

This design guide documents the comprehensive UI design system for Nirvana, an AI-powered E-Governance Complaint Management System for citizens and government officials. It serves as the definitive reference for maintaining design consistency across all Nirvana interfaces and user touchpoints.

## Brand Identity

### Brand Essence
- **Brand Name**: Nirvana
- **Tagline**: AI-powered E-Governance Complaint Management System
- **Brand Voice**: Professional, innovative, reliable, and solution-oriented
- **Value Proposition**: Smart complaint management system that enables seamless citizen-government communication, ML-powered auto-categorization, real-time tracking, and transparent resolution processes with multi-role access for Citizens, Government Officials, Super-Admins, and Public transparency

### Logo & Brand Assets
- Primary logo features the Nirvana wordmark in a clean, modern serif font
- Brand mark emphasizes intelligence and predictive capabilities
- Color treatment prioritizes white on dark purple backgrounds

## Design System

### Color Palette

#### Primary Colors
- **Base Background**: Dark purple gradient (`linear-gradient(135deg, #0a0613 0%, #150d27 100%)`)
- **Primary Purple**: `#8B5CF6` (`purple-500`) - Used for primary buttons, key UI elements, and focus states
- **Secondary Purple**: `#A78BFA` (`purple-400`) - Used for secondary elements, hover states
- **Tertiary Purple**: `#C4B5FD` (`purple-300`) - Used for subtle accents, borders, and less important elements

#### Text Colors
- **Primary Text**: White (`#FFFFFF`) - Used for headings and important text
- **Secondary Text**: Light purple (`rgba(196, 181, 253, 0.7)` or `text-purple-300/70`) - Used for body text
- **Muted Text**: Translucent purple (`rgba(196, 181, 253, 0.5)` or `text-purple-300/50`) - Used for less important text

#### Semantic Colors
- **Success**: `#10B981` (Green) - Used for positive indicators, success states
- **Warning**: `#FBBF24` (Amber) - Used for caution indicators
- **Error**: `#EF4444` (Red) - Used for critical errors, alerts
- **Info**: `#3B82F6` (Blue) - Used for informational indicators

#### Opacity Variants
- High emphasis: 100% opacity
- Medium emphasis: 70% opacity
- Low emphasis: 50% opacity
- Disabled: 30% opacity

### Typography

#### Font Families
- **Primary Font (Headings)**: Serif font family (`font-serif`) - For headings, key metrics, and brand elements
- **Secondary Font (Body)**: Sans-serif (system default) - For body text, UI elements, and data displays

#### Type Scale
- **Display**: 4xl (2.25rem) - Main page headers
- **Heading 1**: 3xl (1.875rem) - Section headers
- **Heading 2**: 2xl (1.5rem) - Card titles, modal headers
- **Heading 3**: xl (1.25rem) - Subsection headers
- **Body Large**: lg (1.125rem) - Emphasized body text
- **Body**: base (1rem) - Default body text
- **Caption**: sm (0.875rem) - Secondary information, labels
- **Small**: xs (0.75rem) - Footnotes, metadata

#### Font Weights
- **Bold**: 700 - Page titles, key metrics
- **Medium**: 500 - Section headers, buttons
- **Regular**: 400 - Body text
- **Light**: 300 - Secondary text, captions

#### Line Heights
- Headings: 1.2
- Body text: 1.5
- UI elements: 1.25

### Spacing System

#### Base Spacing Unit
- 0.25rem (4px) base unit

#### Spacing Scale
- **xs**: 0.5rem (8px) - Compact elements, tight spacing
- **sm**: 1rem (16px) - Standard spacing between related elements
- **md**: 1.5rem (24px) - Section padding, card padding
- **lg**: 2rem (32px) - Section margins, large component spacing
- **xl**: 3rem (48px) - Page section separation
- **2xl**: 4rem (64px) - Major page section separation

### Border Radius
- **Small**: 0.25rem (4px) - Badges, tags, minor elements
- **Medium**: 0.5rem (8px) - Buttons, cards, standard UI elements
- **Large**: 1rem (16px) - Major containers, modal windows
- **Pill**: 9999px - Pill buttons, status indicators

### Shadows & Elevation
- **Level 1**: `shadow-sm` - Subtle elevation, dropdown menus
- **Level 2**: `shadow` - Cards, interactive elements
- **Level 3**: `shadow-md` - Floating elements, popovers
- **Level 4**: `shadow-lg` - Modals, spotlight elements
- **Purple Tint**: `shadow-purple-500/10` - Brand-specific shadow with purple tint

### Effects & Treatments
- **Blur Effects**: `backdrop-blur-sm` (4px blur) - Overlays, modals
- **Gradient Overlays**: Linear gradients with brand colors
- **Glass Effect**: Translucent backgrounds with blur for "frosted glass" effect
- **Border Treatments**: Semi-transparent borders (`border-purple-500/20`)

## Component Library

### Navigation Components

#### Sidebar
- Fixed position on desktop, slide-in on mobile
- Dark purple gradient background
- White logo/text
- Active state: Purple highlight, higher brightness
- Inactive state: Reduced opacity, hover effect
- Icons aligned left with labels
- User profile section at bottom
- Implements framer-motion for animations

#### Top Navigation Bar
- Used in responsive layouts when sidebar is hidden
- Sticky positioning
- Minimal design with logo and hamburger menu
- User actions and notifications aligned right
- Transparent background with blur effect

#### Page Headers
- Consistent structure across all dashboard pages
- Title and breadcrumb navigation
- Action buttons aligned right
- Optional description text
- Date/time filters when relevant

#### Tab Navigation
- Underline style for active tabs
- Text color change for active/inactive states
- Equal width distribution for primary tabs
- Scrollable tabs for many options
- Animated underline transitions

### Data Visualization

#### Charts & Graphs
- **Line Charts**: 
  - Purple gradient fills
  - White grid lines
  - Animated on load
  - Interactive tooltips on hover
  - Confidence bands as translucent areas

- **Bar Charts**:
  - Consistent color coding (purple variants)
  - Rounded corners on bars
  - Value labels on significant data points
  - Hover state with enhanced data display

- **Gauge & Circular Charts**:
  - Gradient arcs
  - Center metrics with large typography
  - Animated fills on data change

- **Trend Indicators**:
  - Up/down arrows with semantic colors
  - Percentage change with + or - prefix
  - Concise display integrated with metrics

#### Tables
- Subtle header styling with purple accent
- Alternating row background (optional)
- Compact by default, expandable rows for details
- Sortable columns with clear indicators
- Status badges for state representation
- Pagination with items-per-page control
- Responsive design with horizontal scroll on small screens

#### Status Indicators
- **Badges**:
  - Critical: `bg-red-500/20 text-red-300`
  - Warning: `bg-amber-500/20 text-amber-300`
  - Healthy: `bg-emerald-500/20 text-emerald-300`
  - Default: `bg-purple-500/20 text-purple-300`

- **Progress Bars**:
  - Gradient fills
  - Rounded caps
  - Optional text overlay
  - Animated transitions for value changes

### Cards & Containers

#### Feature Cards
- Subtle purple border (`border-purple-500/20`)
- Dark background with blur effect (`bg-purple-500/5 backdrop-blur-sm`)
- Consistent padding (p-6)
- Hover effects with subtle transitions (`hover:bg-purple-500/10 hover:border-purple-500/30`)
- Optional icon with colored background
- Group hover effects for child elements

#### Metric Cards
- Clear hierarchy with prominent metric
- Secondary label text in muted purple
- Optional trend indicator (up/down) with semantic colors
- Animate values when they change
- Gradient background options for emphasis

#### List Items
- Consistent left-aligned icons
- Two-line structure (title + description)
- Subtle dividers or spacing between items
- Hover states for interactive items
- Optional right-aligned metadata or actions

#### Alert Cards
- Color-coded borders or backgrounds by severity
- Clear icon indicators
- Concise message with action link
- Dismissible when appropriate
- Subtle animation on entrance

### Interactive Elements

#### Buttons
- **Primary**: 
  - Solid purple fill (`bg-purple-600`) 
  - White text
  - Hover state: Darker shade (`hover:bg-purple-700`)

- **Secondary**: 
  - Purple outline with transparent background
  - `border border-purple-500/30 bg-transparent hover:bg-purple-500/10`
  - Hover state: Subtle background fill

- **Tertiary**: 
  - Ghost style (`hover:bg-purple-500/10`)
  - Minimal styling, text-only with hover effect

- **States**:
  - Default: Normal state
  - Hover: Darker/lighter variation with smooth transition
  - Active: Pressed appearance
  - Disabled: Reduced opacity (0.5)
  - Loading: Subtle pulse animation

- **Sizes**:
  - Small: p-2, text-sm
  - Medium: p-3, text-base (default)
  - Large: p-4, text-lg

- **Variants**:
  - Icon + Text
  - Icon Only (square aspect ratio)
  - Text Only
  - Full Width

#### Form Controls
- **Text Inputs**:
  - Dark background with subtle border
  - Focus state with brighter purple border
  - Error state with red border
  - Consistent internal padding
  - Label positioned above input

- **Dropdowns & Select**:
  - Custom styling matching text inputs
  - Purple accent for focused/active states
  - Custom dropdown arrow icon
  - Multi-select with tags for selected items

- **Checkboxes & Radios**:
  - Custom design with purple accents
  - Animated state transitions
  - Clear focus indicators

- **Range Sliders**:
  - Custom thumb with purple gradient
  - Track with fill indicator
  - Tooltip showing current value

#### Modals & Dialogs
- Centered positioning with backdrop blur
- Subtle entrance/exit animations
- Clear header with close button
- Consistent action buttons (primary/cancel)
- Overlay backdrop with semi-transparency

#### Tooltips & Popovers
- Subtle animation on appear/disappear
- Arrow indicator pointing to reference element
- Consistent padding and text styling
- Optional rich content support

### Animations & Transitions

#### Page Transitions
- Subtle fade-in/slide effects
- 300-400ms duration for major transitions
- Easing functions: ease-in-out

#### Component Animations
- List items with staggered reveal (30ms delay between items)
- Card entrance animations
- Value changes with counting animation
- Chart animations for data visualization

#### Micro-interactions
- Button hover/active states
- Form element focus states
- Loading indicators (spinner, progress, pulse)
- Success/error feedback animations

#### Motion Principles
- Natural motion with appropriate physics
- Purposeful animation that guides attention
- Performance optimization for smooth experience
- Reduced motion option for accessibility

### Icons & Visual Elements

#### Icon System
- Lucide icon library as primary source
- Consistent line weight (stroke-width: 2)
- 24x24px default size
- Purple accent colors for highlights
- Contextual colors for status indicators

#### Visual Effects
- Subtle gradients for depth and dimension
- Blur effects for overlay elements (`backdrop-blur-sm`)
- Semi-transparent borders (`border-purple-500/20`)
- Shadow effects for elevation (`shadow-purple-500/10`)
- Hover transitions (0.2-0.3s duration)

#### Illustrations & Graphics
- Abstract data visualization patterns
- Purple-dominant color scheme
- Geometric shapes with meaning (growth, connection)
- Consistent style across platform

## Page Templates & Layouts

### Global Layout Structure
- Persistent sidebar navigation (desktop)
- Responsive adaptation for tablet/mobile
- Consistent page padding
- Maximum content width for readability

### Landing Page
- Hero section with clear value proposition
- Login/Register options with role-based authentication (Supabase Auth)
- Public access to view anonymized complaint statistics
- Problem/solution narrative structure
- Social proof and testimonials
- Clear call-to-action for different user types
- Background with abstract data visualization motifs

### Citizen Dashboard
- Personal complaints overview with status tracking
- Quick "Report New Complaint" action button
- Notifications panel for status updates and feedback requests
- Recent complaint activity feed
- Performance metrics (resolution times, satisfaction scores)

### Report New Complaint Page
- Multi-step form with complaint description, category selection, location mapping
- Image/evidence upload functionality
- ML-powered auto-categorization system
- Real-time form validation and guidance
- Confirmation page with tracking number
- Automated notification system integration

### Complaint Details Page
- Comprehensive complaint tracking with timeline view
- Status indicator with progress visualization
- Comment system for additional evidence or clarification
- Feedback mechanism post-resolution
- Document attachment management
- Communication thread with assigned officials

### Government Official Dashboard
- Assigned complaints overview with priority indicators
- Department-specific filtering and sorting
- Performance analytics and resolution metrics
- Bulk action tools for complaint management
- Escalation workflows and approval systems
- Communication tools for citizen interaction

### Super-Admin Dashboard
- System-wide analytics and reporting
- User role management interface
- Audit logs and system monitoring
- Data export and backup tools
- System configuration and settings management
- Department performance comparison

### Public Dashboard (No Authentication Required)
- Live anonymized complaint statistics
- Interactive map showing complaint density and types
- Resolution time analytics and trends
- Transparency metrics and government performance indicators
- Public complaint categories and frequency data
- Real-time system status and availability

### Data Management Pages (Complaints, Departments, Users)
- Powerful filter bar at top
- Primary data table with sorting/filtering
- Detail view for selected items
- Batch action tools
- Export/import functionality
- Performance optimization for large datasets

### Detail Pages
- Consistent header with breadcrumbs and role-based navigation
- Primary data visualization for complaint analytics
- Supporting metrics and KPIs (resolution times, satisfaction scores)
- Action panel or sidebar with role-specific tools
- Related complaints or recommendations
- Tabbed interface for different data views (timeline, evidence, communications)
- ML categorization confidence scores and manual override options

### Settings & Configuration
- Role-based settings sections (Citizen, Official, Super-Admin)
- User profile management with authentication settings
- Notification preferences and communication channels
- Department assignment and workflow configuration
- ML model training and categorization rules (Super-Admin only)
- System audit and security settings
- Data retention and privacy controls
- Save/cancel actions with confirmation
- Preview capabilities where applicable

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Strategies
- Sidebar collapses to top navigation on mobile
- Card layouts shift from multi-column to single column
- Tables adapt with horizontal scroll or responsive reflow
- Font sizes adjust for readability on small screens
- Touch targets increase on mobile devices
- Role-based navigation adapts to screen size
- Public dashboard optimized for mobile viewing
- Complaint form adapts to mobile input patterns

## Accessibility Guidelines

### Color & Contrast
- Maintain WCAG 2.1 AA compliance (minimum 4.5:1 for normal text)
- Avoid using color alone to convey meaning
- Test color contrast between text and backgrounds
- Provide sufficient contrast for UI controls

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators on interactive elements
- Logical tab order following visual layout
- Keyboard shortcuts for power users

### Screen Reader Support
- Semantic HTML structure
- Appropriate ARIA labels where needed
- Alt text for all images and icons
- Announcements for dynamic content changes

### Reduced Motion
- Respect user preferences for reduced motion
- Provide alternative non-animated states
- Essential animations only when motion is reduced

## Implementation Notes

The UI emphasizes modern AI capabilities through a sophisticated, tech-forward design language that combines dark mode aesthetics with purple accent colors to suggest innovation and intelligence. The design supports multiple user roles (Citizens, Government Officials, Super-Admins, and Public users) with role-based interfaces and ML-powered features.

When implementing new components or pages, maintain consistency with these guidelines to ensure a cohesive user experience throughout the Nirvana E-Governance Complaint Management System.

### Component Implementation
- Use Tailwind CSS for styling with consistent class patterns
- Leverage Framer Motion for animations
- Create reusable React components for UI elements
- Document components with clear props interfaces
- Use TypeScript for type safety

### Performance Considerations
- Optimize renders with React.memo and useMemo
- Virtualize long lists and large tables
- Lazy load components not needed on initial render
- Code-split by route for faster initial load
- Optimize images and assets

## Design-to-Development Workflow

### Design Assets
- Component designs maintained in Figma
- Shared design tokens for colors, spacing, etc.
- Component library documentation
- Interactive prototypes for complex interactions

### Collaboration Process
- Design reviews for new features
- Developer handoff with clear specifications
- Design QA for implemented features
- Iterative improvement based on user feedback

## Version Control & Updates

This design guide is a living document that will evolve as the Nirvana platform matures. Major updates will be tracked with version numbers and changelog entries.

Current Version: 1.0
Last Updated: July 19, 2025
