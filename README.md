# Sky Scrapper - Flight Search Engine

A modern, responsive Flight Search Engine built with React, TypeScript, and Tailwind CSS. Inspired by Google Flights with a focus on functionality and user experience.

## Features

- ✈️ **Flight Search**: Search flights by origin, destination, and dates
- 📊 **Live Price Graph**: Real-time price trends visualization using Recharts
- 🔍 **Advanced Filtering**: Filter by stops, price range, and airlines
- 📱 **Responsive Design**: Mobile-first design with bottom sheet filters on mobile
- ⚡ **Performance**: Optimized with memoization and debounced inputs
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **API**: Amadeus Self-Service API (Test environment)
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Amadeus API credentials (get them from [Amadeus Developers](https://developers.amadeus.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Sky-Scrapper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Amadeus API credentials:
```
REACT_APP_AMADEUS_API_KEY=your_api_key_here
REACT_APP_AMADEUS_API_SECRET=your_api_secret_here
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/          # React components
│   ├── FlightSearch.tsx  # Search form with airport autocomplete
│   ├── FlightCard.tsx   # Individual flight result card
│   ├── FlightResults.tsx # Results list with loading/error states
│   ├── FlightFilters.tsx # Filter sidebar/modal
│   ├── PriceGraph.tsx   # Price trends chart
│   └── Layout.tsx       # Main layout component
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts   # Debounce hook for search inputs
│   └── useAirportSearch.ts # Airport search with autocomplete
├── services/            # API services
│   └── amadeus.ts       # Amadeus API client
├── store/               # State management
│   └── flightStore.ts   # Zustand store for flight data
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
└── utils/               # Utility functions
    └── flightUtils.ts   # Flight data processing utilities
```

## Usage

1. **Search Flights**:
   - Enter origin and destination (city name or IATA code)
   - Select departure date (and return date for round trips)
   - Click "Search Flights"

2. **Filter Results**:
   - Use the filters sidebar (desktop) or filter button (mobile)
   - Filter by stops, price range, or airlines
   - Filters update results and price graph in real-time

3. **Sort Results**:
   - Sort by price, duration, or departure time
   - Sorting updates both the list and graph instantly

4. **View Price Trends**:
   - The price graph automatically updates when filters or sorting changes
   - Hover over data points to see detailed information

## API Configuration

This app uses the Amadeus Self-Service API test environment. To get API credentials:

1. Sign up at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a new app
3. Copy your API Key and API Secret
4. Add them to your `.env` file

**Note**: The test environment has rate limits. For production use, you'll need to upgrade to a paid plan.

## Performance Optimizations

- Debounced search inputs to reduce API calls
- Memoized chart data calculations
- Efficient filtering and sorting with single source of truth
- Optimized re-renders using React hooks and Zustand selectors

## Future Enhancements

- [ ] Skeleton loaders for better loading UX
- [ ] Save recent searches (localStorage)
- [ ] Currency toggle
- [ ] Dark mode
- [ ] Empty-state illustrations
- [ ] Flight details modal
- [ ] Price alerts

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# sky-scrapper
