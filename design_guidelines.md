# MME Modas - Design Guidelines

## Design Approach
**Reference-Based:** Premium masculine e-commerce with barbershop integration, inspired by luxury retail experiences with dark, sophisticated aesthetics.

## Core Design Elements

### Color Palette
- **Primary Black:** #000000 (backgrounds, text on light surfaces)
- **Accent Red:** #e50914 (buttons, highlights, prices, details only)
- **Pure White:** #ffffff (text on dark surfaces, clean accents)
- **Theme:** Dark predominant with strategic red accents for premium masculine feel

### Typography
- **Font Family:** Poppins (primary) or Montserrat (alternative)
- **Hierarchy:**
  - Hero Title: Bold, extra-large (4xl-6xl)
  - Section Headers: Bold, large (3xl-4xl)
  - Product/Service Names: Semibold, medium (xl-2xl)
  - Body Text: Regular, base size
  - Prices: Bold with red accent

### Layout System
- **Spacing Units:** Tailwind 4, 8, 12, 16, 20, 24 for consistent rhythm
- **Container:** Full-width sections with max-w-7xl inner containers
- **Section Padding:** py-20 desktop, py-12 mobile
- **Grid System:** 3-4 columns for products (responsive to 1 column mobile)

## Page Structure & Components

### 1. Header/Navbar
- Fixed top position with semi-transparent black background (bg-black/90)
- Logo "MME Modas" - white text with red accent detail
- Navigation links: Home, Moda Masculina, Barbearia, Agendamento, Contato
- Smooth scroll anchoring to sections
- Responsive hamburger menu for mobile

### 2. Hero Section
- Full viewport height (min-h-screen)
- Background: Stylish masculine lifestyle image with dark overlay (bg-black/60)
- Content centered vertically and horizontally
- Large title: "MME Modas"
- Subtitle: "Moda Masculina & Barbearia Premium"
- Two CTA buttons with blurred backgrounds:
  - "Ver Roupas" (primary red)
  - "Agendar Corte" (outline white)

### 3. Men's Fashion Section
- Product grid: 3-4 columns desktop, 2 tablet, 1 mobile
- Product cards with:
  - Product image (16:9 aspect ratio)
  - Product name
  - Price in red (#e50914)
  - "Comprar" button (red with white text)
- Card styling: Rounded corners (rounded-lg), dark background, subtle hover lift animation

### 4. Barbershop Section
- Attractive barbershop photos in banner or grid
- Compelling copy: "Cortes modernos, barba alinhada, atendimento premium"
- Service cards grid (2x2 or 4 columns):
  - Corte Masculino
  - Barba Completa
  - Pacote Corte + Barba
  - Sobrancelha
- Each card: Service name, price (red), "Agendar" button

### 5. Booking Section
- Centered form with dark card background
- Form fields:
  - Name (text input)
  - Phone (tel input)
  - Service (select dropdown)
  - Date (date picker)
  - Time (time picker)
- Red "Agendar" submit button
- Success modal on submission with confirmation message

### 6. Contact Section
- Two-column layout (desktop):
  - Left: Contact information (address, hours, phone/WhatsApp)
  - Right: Google Maps embed
- Single column on mobile
- Contact details with icons (phone, clock, location)

### 7. Footer
- Dark background (black)
- Three-column layout: Logo, Social media icons, Copyright
- Social icons in white, hover to red
- Minimalist and clean

## Animations & Interactions

### Scroll Animations
- Fade-in effect on all sections as they enter viewport
- Use Intersection Observer API for smooth reveals
- Subtle upward slide (translate-y) combined with opacity change

### Button Hover States
- Red buttons: Darken on hover (brightness-90)
- Outline buttons: Fill with red on hover
- Smooth transitions (300ms)

### Custom Cursor
- Circular white cursor with red border
- Default size: 20px diameter
- Enlarges to 40px when hovering links/buttons
- Smooth scale transition

### Card Interactions
- Product/service cards: Subtle lift on hover (translate-y: -4px)
- Shadow enhancement on hover
- Smooth transitions (200ms)

## Responsive Behavior
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack all grids to single column on mobile
- Hamburger menu for mobile navigation
- Touch-friendly button sizes (min 44px height)

## Images
- **Hero Background:** High-quality masculine fashion/lifestyle image (suited man, modern style, urban setting)
- **Product Images:** Clean product shots on white/neutral backgrounds
- **Barbershop Photos:** Modern barbershop interior, professional cuts, grooming in action
- All images optimized for web, proper aspect ratios maintained

## Premium Details
- Rounded corners throughout (rounded-lg, rounded-xl)
- Subtle shadows for depth (shadow-lg on cards)
- Ample whitespace for breathing room
- Clean, uncluttered layouts
- Professional photography aesthetic
- Consistent 8px grid system alignment