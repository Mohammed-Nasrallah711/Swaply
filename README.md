# Swaply Frontend

This is the frontend for Nabd, a humanitarian platform helping people in the Gaza Strip find essential commodities during the supply crisis. With commercial crossings closed and goods scarce, this interface connects people who need basic necessities with vendors who have them available.

## What Nabd Does

Nabd tracks essential commodity prices in real-time across Gaza. People use it to find flour, sugar, cooking oil, and other critical supplies. They can see which vendors have items in stock, track price changes, and even arrange item-for-item exchanges when cash isn't available. The platform is built to work reliably under low-bandwidth conditions common in Gaza.

## The Four Core Modules

**Admin Dashboard** - Verifies vendors to ensure they're legitimate, manages essential commodity categories, monitors the platform for accuracy, and handles user reports about incorrect prices or suspicious activity.

**Exchange Module** - Lets people propose trades when they need to exchange items instead of buying. Someone with extra rice but needing flour can find others willing to trade. The system includes negotiation tools and direct messaging.

**Notifications System** - Keeps everyone informed through the web interface, email, or SMS/WhatsApp about critical updates like price drops on tracked items, new availability of scarce goods, and vendor verification status.

**Home Page** - The main interface where people browse essential commodities, filter by Gaza cities and neighborhoods, view recent price updates, and search for specific items. Everything is optimized to load quickly even on slow connections.

## Built With

Vue 3 with Composition API handles the interface. Vite builds everything fast during development. Tailwind CSS provides styling that works across devices. Vue Router manages navigation. Pinia stores application state. Axios communicates with the backend. Laravel Echo and Pusher deliver real-time updates. Headless UI gives accessible components. VeeValidate and Yup handle form validation. Additional libraries include Swiper for mobile-friendly browsing, data tables for the admin panel, and optimized asset loading.

## Getting Started

You need Node.js 16 or higher and npm. Make sure the backend API is running.

Go to the Swaply folder:

```bash
cd Swaply
```

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
VITE_BASE_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_KEY=your_api_key_here
VITE_SECRET_KEY=your_secret_key_here

VITE_PUSHER_APP_KEY=your_pusher_key
VITE_PUSHER_APP_CLUSTER=your_cluster
```

Start development:

```bash
npm run dev
```

Access at http://localhost:4000 or the port Vite assigns.

## Project Structure

The src folder contains views (full pages), components (reusable pieces), stores (Pinia state management), router (navigation), services (API functions), utils (helper functions), and assets (images, fonts, styles).

Views split into front (public interface) and dashboard (admin panel). Components follow the same organization. Stores manage authentication, products, vendor stores, categories, notifications, search, locations, theme, and currency settings.

## For Regular Users

Browse essential commodities with filters for city, category, and price range. The interface works like familiar mobile apps with swipeable cards optimized for low bandwidth. Save items to favorites to track their prices. Get notifications when tracked items drop in price or become available after being out of stock. Search for specific commodities and see which vendors have them. View vendor locations on a map. Propose exchanges offering one item for another. Chat with vendors to arrange trades or ask about availability. See recent price updates on the home page.

## For Vendors

Register your store with location and contact information. Admin approval required before your store appears publicly to prevent fraud. List essential commodities you have in stock with current prices. Upload product images optimized for low bandwidth. Update prices and availability as your inventory changes. View and respond to exchange proposals from users. Chat with potential customers about items or trades. See basic analytics about your listings.

## For Admins

The dashboard shows platform statistics including total users, registered vendors, active listings, and pending reports. Review and verify new vendor registrations before they go live. Monitor commodity listings for accurate prices and appropriate content. Manage essential commodity categories as needs change. Handle user reports about incorrect information or suspicious activity. Manage user accounts and roles. View platform-wide analytics to understand what items people need most.

## Real-Time Features

Thanks to Pusher and Laravel Echo, updates happen instantly without refreshing. Price changes appear immediately for people tracking items. Availability notifications arrive right when scarce items come back in stock. Exchange proposals notify instantly. Chat messages deliver in real-time. Admin alerts appear immediately for new vendor registrations or reports. This matters especially under low bandwidth because users don't waste connection refreshing pages.

## State Management

Pinia stores organize the application state. Auth store handles login and user profiles. Product store manages commodity listings and favorites. Store handles vendor information. Category organizes essential commodity types. Notification manages alerts and user preferences. Search maintains filter settings and results. City holds Gaza location data. Theme controls dark mode and right-to-left layout for Arabic. Currency manages display preferences.

## Navigation

**Public Pages** - Home page showing recent updates and featured items. Search page with filters for city, category, and price. Vendor directory showing registered stores by location. Login and registration. Password reset. Product details with vendor information.

**User Pages** (require login) - Personal profile and settings. Exchange offers you proposed or received. Notification center. Price tracking dashboard. Saved favorites. Chat conversations.

**Vendor Pages** (require vendor role) - Store dashboard with your listings. Product management for adding and updating items. Incoming exchange proposals. Store analytics.

**Admin Pages** (require admin role) - Platform overview dashboard. Vendor verification queue. Product moderation. Category management. User report handling. User account management.

## Styling and Accessibility

Tailwind CSS provides responsive layouts that work on phones, tablets, and computers. Full right-to-left support for Arabic. Dark mode option to save battery on phones. Custom colors matching the humanitarian purpose. Readex Pro font optimized for readability. Touch-friendly interface elements. Keyboard navigation support. Screen reader compatibility.

## API Communication

The axiosClient.js file handles all backend communication. It automatically adds authentication tokens, manages errors, and optimizes requests.

Example usage:

```javascript
import axiosClient from '@/axiosClient'

// Find available flour in Khan Younis
const products = await axiosClient.get('/products', {
  params: { category: 'flour', city: 'khan-younis' }
})

// Propose exchange
const offer = await axiosClient.post('/customer/barters', {
  offer_item: 'Rice 5kg',
  request_item: 'Flour 5kg',
  description: 'Have extra rice, need flour urgently'
})
```

## WebSocket Configuration

The echo.js file sets up real-time connections using Pusher. It pulls credentials from your .env file and configures Laravel Echo.

Listen for events:

```javascript
window.Echo.private(`user.${userId}`)
  .listen('PriceUpdated', (e) => {
    // Show price update notification
  })
  .listen('ProductAvailable', (e) => {
    // Alert user that tracked item is back in stock
  })
```

## Building for Production

Create optimized production build:

```bash
npm run build
```

This generates files in the dist folder. Deploy to any static hosting service, web server, or CDN. Ensure your .env has production API URLs before building. Consider hosting on infrastructure with good connectivity to Gaza for best performance.

## Low-Bandwidth Optimizations

Images lazy load only when scrolled into view. Asset sizes minimized during build. Critical CSS inlined. Route-based code splitting reduces initial load. Data requests paginated to load small chunks. Caching enabled for frequently accessed data. Offline mode considered for future enhancement.

## Development Guidelines

Use Composition API and script setup syntax consistently. Keep components focused and small. Optimize images before adding to assets. Test on slower connections to simulate Gaza conditions. Use v-show for frequently toggled elements. Implement proper loading states for all async operations. Handle errors gracefully with user-friendly messages.

## Troubleshooting

**API calls failing** - Check VITE_API_BASE_URL in .env points correctly and backend is running. Open browser console for error details.

**Real-time not working** - Verify Pusher credentials match between frontend and backend. Check console for WebSocket connection errors.

**Build failing** - Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Slow loading** - Check network tab to identify large assets. Ensure images are optimized. Verify code splitting is working.

**Styling broken** - Restart dev server to rebuild Tailwind.

## Browser Support

Works on modern versions of Chrome, Firefox, Safari, and Edge. Optimized for mobile browsers common in Gaza. Degrades gracefully on older browsers while maintaining core functionality.

## Environment Variables

**VITE_BASE_URL** - Where this app runs, usually http://localhost:4000 in development

**VITE_API_BASE_URL** - Backend API endpoint at http://localhost:8000/api locally

**VITE_API_KEY** and **VITE_SECRET_KEY** - Authenticate API requests

**VITE_PUSHER_APP_KEY** and **VITE_PUSHER_APP_CLUSTER** - Configure real-time updates

## Platform Mission

This platform exists to help people in Gaza find essential commodities during an unprecedented humanitarian crisis. Every design decision prioritizes reliability under difficult conditions, minimal bandwidth usage, and connecting people with the basic necessities they need to survive. The exchange system helps when money is scarce or unavailable. The verification system prevents exploitation when people are desperate. The notification system ensures no one misses critical updates about food availability.

## Need Help

Check browser console for errors. Verify .env configuration matches backend settings. Look at network tab to see failed requests. Test on actual mobile devices to catch mobile-specific issues. Consider bandwidth limitations when debugging slow loads.
