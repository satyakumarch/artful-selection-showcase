# Art Institute of Chicago - Artwork Browser

A React + TypeScript application that displays artwork data from the Art Institute of Chicago API using PrimeReact DataTable with server-side pagination and persistent multi-page selection.

## 🌐 Live Demo

- **Deployed Site**: [Your deployed URL will go here]
- **GitHub Repository**: [Your GitHub repo URL will go here]

## ✨ Features

- **Server-side Pagination**: Fetches data on-demand from the API (no caching)
- **Multi-page Selection**: Select artworks across different pages with persistent selection
- **Custom Selection Panel**: View and manage all selected items from any page
- **Responsive DataTable**: Professional table interface powered by PrimeReact
- **TypeScript Models**: Full type safety for API responses and UI components
- **Loading States**: Visual feedback during data fetching

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📋 Acceptance Criteria Verification

✅ **Page 1 auto-loads on initial render**
- The application automatically fetches and displays page 1 data when loaded

✅ **Pagination always triggers network requests**
- Every page change makes a fresh API call to `https://api.artic.edu/api/v1/artworks?page={page}`
- No caching mechanism is implemented - verified in browser DevTools Network tab

✅ **Selection persists across pages**
- Selected artwork IDs and minimal metadata are stored in component state
- Selections are maintained when navigating between pages
- Only selected IDs + minimal metadata (title, artist) are stored - no full-page data caching

✅ **Select all on page affects only visible page**
- The checkbox in the header selects/deselects only the current page's rows
- Does not affect selections from other pages

✅ **Custom selection panel**
- Displays all selected items across all pages
- Allows individual deselection via remove button
- "Clear All" button removes all selections at once

✅ **Required columns displayed**
- title
- place_of_origin
- artist_display
- inscriptions
- date_start
- date_end

✅ **Loading state and total records**
- Loading spinner shown during API requests
- Total records count displayed below the table

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: PrimeReact DataTable
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: Art Institute of Chicago Public API

## 📦 Deployment

This project is configured for deployment to Netlify or Cloudflare Pages.

### Netlify

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
```

Deploy the `dist` folder to Netlify via:
- Netlify CLI: `netlify deploy --prod`
- Netlify UI: Drag and drop the `dist` folder
- GitHub integration: Connect your repo and auto-deploy on push

### Cloudflare Pages

```bash
# Build the project
npm run build
```

Deploy via Cloudflare Pages:
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`

## 📝 Project Structure

```
src/
├── components/
│   ├── ArtworkTable.tsx       # Main table component with pagination
│   ├── SelectionPanel.tsx     # Selected items panel
│   └── ui/                    # shadcn/ui components
├── services/
│   └── artworkService.ts      # API service layer
├── types/
│   └── artwork.ts             # TypeScript interfaces
└── pages/
    └── Index.tsx              # Main page
```

## 🔍 API Details

**Base URL**: `https://api.artic.edu/api/v1/artworks`

**Query Parameters**:
- `page`: Page number (starts at 1)
- `limit`: Items per page (default: 10)

**Response Structure**:
```typescript
{
  pagination: {
    total: number,
    limit: number,
    offset: number,
    total_pages: number,
    current_page: number
  },
  data: Artwork[]
}
```

## 📄 License

This project was built with [Lovable](https://lovable.dev) and is open source.
