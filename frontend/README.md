# SkillSphere Frontend

A modern, responsive web application for tracking learning progress, managing course certificates, and visualizing analytics.

## Features

- **Landing Page**: Beautiful hero section with feature highlights and statistics
- **Authentication**: Login and registration with Google OAuth support
- **Dashboard**: Course management with progress tracking and summary widgets
- **Add/Edit Courses**: Form with certificate upload functionality
- **Certificate Viewer**: Modal for viewing and downloading certificates (PDF/images)
- **Analytics**: Interactive charts showing learning progress and category distribution
- **Profile**: User profile management with achievements
- **Dark Mode**: Full light/dark theme support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── analytics/         # Analytics page
│   ├── profile/           # Profile page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── Navbar.tsx        # Navigation bar
│   ├── AddCourseDialog.tsx
│   └── CertificateViewer.tsx
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── ThemeContext.tsx  # Theme context
├── lib/                  # Utilities and API
│   ├── api/             # API client and endpoints
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend REST API at `/api/v1/...`. All API calls are made using Axios with automatic token injection for authenticated requests.

### API Endpoints Used

- **Auth**: `/auth/login`, `/auth/register`, `/auth/google`
- **Courses**: `/courses` (CRUD operations)
- **Analytics**: `/analytics`, `/analytics/dashboard`
- **User**: `/user/profile`

## Features in Detail

### Dashboard
- View all enrolled courses in a table
- Add, edit, and delete courses
- Mark courses as completed
- View summary statistics (total, active, completed, hours)
- Progress bars for each course

### Analytics
- Line chart: Learning hours per month
- Bar chart: Courses completed per month
- Pie chart: Category distribution
- Summary statistics cards

### Profile
- View and edit user information
- Upload profile picture
- View achievements and certificates count
- Display join date

### Authentication
- Email/password login and registration
- Google OAuth integration (placeholder)
- Secure token storage
- Automatic redirect on auth failure

## Styling

The application uses:
- Tailwind CSS for utility-first styling
- Shadcn UI for pre-built accessible components
- Rounded corners (2xl) for modern look
- Responsive design for all screen sizes
- Dark mode support with theme toggle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
