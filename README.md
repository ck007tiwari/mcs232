# E-Learning Dashboard

A personalized e-learning dashboard with PDF progress tracking and AI-powered Q&A functionality.

## Features

- **User Authentication**: Secure login and registration
- **PDF Management**: Upload and organize PDFs by subject
- **Progress Tracking**: Monitor reading progress with visual analytics
- **AI-Powered Q&A**: Ask questions about PDF content and get intelligent answers
- **Interactive Dashboard**: Charts and statistics for learning insights
- **Role-based Access Control**: Admin and student user roles with different permissions
- **Admin Panel**: PDF management and system administration for admin users
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18+ with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React for consistent iconography
- **PDF Handling**: React-PDF for document viewing
- **Routing**: React Router for navigation

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-learning-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

### Demo Credentials

For testing purposes, use these credentials:
- **Student Account**: ck@tiwari.com / ck12345
- **Admin Account**: ck@tiwari.com / ck123456

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Authentication components
│   ├── Dashboard/     # Main dashboard and charts
│   ├── Layout/        # Header, sidebar, and layout
│   ├── PDF/           # PDF viewer and related components
│   ├── Profile/       # User profile management
│   ├── QA/           # Q&A history and management
│   └── Subject/      # Subject view and management
├── context/          # React context for state management
├── data/            # Dummy data for development
├── App.js           # Main application component
└── index.js         # Application entry point
```

## Key Components

### Authentication
- Login and registration forms with validation
- Protected routes and authentication guards
- User session management

### Dashboard
- Overview of learning progress
- Interactive charts showing weekly progress and subject distribution
- Recent activity feed
- Quick action buttons

### PDF Viewer
- Full-featured PDF viewing experience
- Page navigation and zoom controls
- Progress tracking as users read
- Integrated Q&A sidebar

### Subject Management
- Organized view of PDFs by subject
- Progress tracking per subject
- Color-coded organization

### AI Q&A System
- Context-aware question asking
- AI-powered answer generation (simulated)
- Question history and management
- Confidence scoring

## Features in Detail

### Progress Tracking
- Real-time page tracking
- Time spent monitoring
- Completion percentage calculation
- Visual progress indicators

### Data Visualization
- Weekly reading progress charts
- Subject-wise progress distribution
- Reading time analytics
- Interactive chart components

### User Experience
- Responsive design for all devices
- Intuitive navigation
- Modern UI with Tailwind CSS
- Smooth animations and transitions

## Development Notes

This is a frontend-only implementation using dummy data. In a production environment, you would need:

- Backend API for user authentication
- Database for storing user data and progress
- AI service for generating answers
- File storage for PDF documents
- Real PDF processing capabilities

## Available Scripts

- `npm start` - Runs the development server
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (irreversible)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.