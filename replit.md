# MME Modas - Premium Men's Fashion & Barbershop

## Overview

MME Modas is a full-stack e-commerce and appointment booking platform specializing in premium men's fashion and barbershop services. The application combines an online clothing store with integrated barbershop appointment scheduling, creating a unified digital experience for masculine lifestyle services.

The platform features a modern, dark-themed interface with a sophisticated black, red, and white color scheme designed to appeal to a masculine audience. Built as a single-page application, it showcases products, displays barbershop services, and handles appointment bookings through an intuitive user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast hot module replacement (HMR)
- Single-page application (SPA) architecture using Wouter for lightweight client-side routing
- All frontend code resides in the `client/` directory

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom theme system supporting dark mode with CSS variables defined in `client/src/index.css`

**Design System**
- Premium masculine aesthetic with primary colors: Black (#000000), Red (#e50914), White (#ffffff)
- Typography using Poppins or Montserrat font families
- Consistent spacing using Tailwind's spacing scale (4, 8, 12, 16, 20, 24)
- Responsive grid system: 3-4 columns desktop, 2 tablet, 1 mobile
- Design specifications documented in `design_guidelines.md`

**State Management**
- TanStack React Query (v5) for server state management and data fetching
- React Hook Form with Zod for form state and validation
- Local component state using React hooks

### Backend Architecture

**Server Framework**
- Express.js server running on Node.js
- TypeScript throughout the backend for type safety
- Server code located in `server/` directory
- HTTP server created using Node's native `http` module

**API Design**
- RESTful API endpoints under `/api` prefix
- Two main endpoints:
  - `POST /api/appointments` - Create new barbershop appointments
  - `GET /api/appointments` - Retrieve all appointments
- Request/response handling with JSON payloads
- Basic error handling with appropriate HTTP status codes

**Build & Deployment**
- Custom build script (`script/build.ts`) using esbuild for server bundling
- Selective dependency bundling to reduce cold start times
- Production build outputs to `dist/` directory
- Separate client and server build processes

### Data Storage

**Database Architecture**
- PostgreSQL as the primary database (configured via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database queries and schema management
- Schema definitions in `shared/schema.ts` using Drizzle's table builders
- Database migrations managed via Drizzle Kit (output to `migrations/` directory)

**Data Models**
- **Users**: Basic authentication with username/password (currently defined but not actively used)
- **Appointments**: Barbershop bookings with name, phone, service type, date, and time
- **Products** & **BarberService**: TypeScript interfaces for frontend data (not persisted to database)

**Fallback Storage**
- In-memory storage implementation (`MemStorage` class) for development/testing
- Uses JavaScript Maps to store users and appointments
- Generates UUIDs for record identifiers

**Schema Validation**
- Zod schemas derived from Drizzle table definitions using `drizzle-zod`
- Type-safe insert schemas for data validation before database operations

### External Dependencies

**UI & Component Libraries**
- Radix UI ecosystem (@radix-ui/*) for accessible component primitives
- embla-carousel-react for carousel/slider functionality
- lucide-react for icon components
- date-fns for date manipulation and formatting

**Form Handling & Validation**
- react-hook-form for form state management
- @hookform/resolvers for Zod integration
- zod for runtime type validation and schema definition

**Styling & Design**
- Tailwind CSS for utility-first CSS framework
- tailwind-merge (via clsx) for conditional class merging
- PostCSS with Autoprefixer for CSS processing

**Database & ORM**
- pg (PostgreSQL client)
- drizzle-orm for database queries
- drizzle-kit for schema migrations
- connect-pg-simple for PostgreSQL session store (configured but not actively used)

**Development Tools**
- tsx for TypeScript execution in development
- @replit/vite-plugin-* for Replit-specific development features
- Replit cartographer and dev banner plugins for enhanced development experience

**Build Tools**
- esbuild for fast server bundling
- Vite for client bundling and development server
- TypeScript compiler for type checking