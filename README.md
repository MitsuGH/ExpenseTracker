# Expense Tracker Application

A modern expense tracking application built with React, TypeScript, and PostgreSQL. Track your expenses with category-based organization, comprehensive financial management, and interactive visualizations.

## Features

- 📊 Category-based expense tracking
- 💰 Full CRUD expense management
- 📈 Visual expense summaries and charts
- 📱 Responsive design for all devices
- 🗄️ PostgreSQL database for persistent storage

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Styling: Tailwind CSS + shadcn/ui
- State Management: TanStack Query
- Charts: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
DATABASE_URL=your_postgresql_connection_string
```

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

- Add new expenses using the form at the top
- View all expenses in the table below
- Filter expenses by category
- Edit or delete expenses using the action buttons
- View expense summaries and charts in the right panel

## Color Scheme

- Primary Color: #4CAF50 (Green) - For buttons and headers
- Secondary Color: #2196F3 (Blue) - For links and actions
- Background: #F5F5F5 (Light Gray) - For main background
- Text: #333333 (Dark Gray) - For primary text
- Accent: #FFC107 (Amber) - For warnings and highlights

## Category Colors

- Food: #FF5722 (Orange)
- Transportation: #3F51B5 (Indigo)
- Entertainment: #E91E63 (Pink)
- Utilities: #9C27B0 (Purple)
- Education: #2196F3 (Blue)
- Health: #4CAF50 (Green)
- Shopping: #FF9800 (Orange)
- Saving & Investments: #009688 (Teal)
- Other: #607D8B (Blue Gray)

## License

MIT
