# Lumina - Premium Video Gallery

Lumina is a high-end video gallery application designed for managing and viewing personal video memories. Built with a premium, Apple-inspired design philosophy, it offers a clean and intuitive interface for your most precious video content.

## Features

- **Premium Video Player**: Optimized for 4K video playback with elegant, minimal controls
- **Organized Gallery**: Beautiful grid layout with responsive design
- **Smart Categorization**: Easily organize videos into categories
- **Favorites System**: Mark and filter videos you love
- **Apple-Inspired Design**: Clean, minimal interface with perfect typography and spacing
- **Responsive**: Works beautifully on all devices

## Technical Details

- Built with React 18+ and Next.js 14+
- TypeScript for type safety throughout
- Component-based architecture with clean separation of concerns
- Context API for state management
- Optimized for performance, especially with 4K videos

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lumina.git
   cd lumina
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/          # Button component
│   ├── VideoPlayer/     # Video player component
│   └── Thumbnail/       # Video thumbnail component
├── features/            # Feature-specific components
│   ├── videoGallery/    # Video gallery grid feature
│   ├── videoPlayer/     # Featured video player feature
│   └── categoryNavigation/ # Category navigation feature
├── hooks/               # Custom React hooks
├── context/             # Context providers
├── utils/               # Helper functions
├── services/            # API and service integrations
└── app/                 # Next.js pages and layouts
```

## Deployment

This application is optimized for deployment on Vercel. Simply connect your GitHub repository to Vercel for continuous deployment.

## License

This project is licensed under the ISC License.

---

Lumina - Where your memories shine brightest 