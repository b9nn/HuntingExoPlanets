# ExoAI Frontend

A modern, production-ready Next.js 14 frontend for **ExoAI: Exoplanet Discovery & Classification**. This application provides an intuitive interface for AI-powered exoplanet analysis with interactive visualizations, real-time classification, and comprehensive data exploration.

## 🚀 Features

- **🤖 AI-Powered Classification**: Ensemble machine learning models with >85% accuracy
- **📊 Interactive Dashboard**: Real-time KPIs, model performance, and system status
- **🔬 Classification Interface**: User-friendly form for exoplanet parameter input
- **🌌 3D Visualization**: Interactive Three.js planet and star system visualization
- **🧠 SHAP Explanations**: Explainable AI with feature importance and local explanations
- **📋 Dataset Explorer**: Comprehensive data tables with filtering and export
- **🎨 Modern UI**: Beautiful, responsive design with dark mode support
- **⚡ Real-time Updates**: Live backend integration with offline fallback

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: React Three Fiber + Three.js
- **Charts**: Recharts for data visualization
- **Tables**: TanStack Table for advanced data grids
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query for server state
- **Animations**: Framer Motion for smooth transitions

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/b9nn/HuntingExoPlanets.git
   cd HuntingExoPlanets/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Mock Mode
The application runs in **mock mode** by default, providing realistic data even when the Python backend is offline. This ensures you can explore all features immediately.

### Key Pages

- **🏠 Landing Page** (`/`): Project overview and feature highlights
- **📊 Dashboard** (`/dashboard`): Model performance, KPIs, and system status
- **🧪 Classify** (`/classify`): Interactive exoplanet classification interface
- **🌌 Visualize** (`/visualize`): 3D exoplanet system visualization
- **🧠 Explanations** (`/explanations`): SHAP-based AI explanations
- **📋 Datasets** (`/datasets`): Explore Kepler, K2, and TESS mission data
- **ℹ️ About** (`/about`): Project information and technology details

### Classification Workflow

1. **Navigate to Classify** (`/classify`)
2. **Enter Parameters**: Input orbital period, transit duration, planetary radius, etc.
3. **Select Model**: Choose from ensemble algorithms (Stacking recommended)
4. **Get Results**: View prediction, confidence scores, and SHAP explanations
5. **Explore Further**: Use "View Explanations" or "3D Visualize" for deeper analysis

### 3D Visualization

- **Interactive Controls**: Drag to rotate, scroll to zoom
- **Parameter Adjustment**: Real-time sliders for orbital parameters
- **Classification Integration**: Planet color reflects AI prediction
- **Physical Accuracy**: Based on Kepler's laws and orbital mechanics

## 🔧 Configuration

### Backend Integration

The frontend automatically connects to the Python backend when available. Configure the backend URL in `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Mock Data

When the backend is unavailable, the app uses comprehensive mock data located in `lib/mocks.ts`. This includes:

- Realistic model metrics (Stacking: 87% accuracy)
- Sample exoplanet datasets
- SHAP explanations
- Health status information

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard with KPIs and charts
│   ├── classify/          # Classification interface
│   ├── visualize/         # 3D visualization
│   ├── explanations/      # SHAP explanations
│   ├── datasets/          # Data exploration
│   └── about/            # Project information
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── nav/              # Navigation components
│   ├── cards/            # KPI and model cards
│   ├── charts/           # Data visualization components
│   ├── classify/         # Classification-specific components
│   ├── tables/           # Data table components
│   └── viz/              # 3D visualization components
├── lib/                   # Utilities and configurations
│   ├── api.ts            # Backend API client
│   ├── mocks.ts          # Mock data for offline mode
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   ├── constants.ts      # Application constants
│   └── validation.ts     # Zod validation schemas
└── providers/            # React context providers
```

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible design:

- **Cards**: KPI displays, model performance, feature importance
- **Tables**: Advanced data grids with sorting, filtering, pagination
- **Charts**: Interactive visualizations using Recharts
- **Forms**: Validated input forms with real-time feedback
- **3D Canvas**: Three.js integration for planet visualization
- **Navigation**: Responsive sidebar and top navigation

## 🔄 API Integration

The frontend integrates with the Python backend through a typed API client (`lib/api.ts`) that:

- **Automatically falls back to mock data** when backend is offline
- **Provides TypeScript types** for all API responses
- **Handles errors gracefully** with user-friendly notifications
- **Supports real-time updates** with TanStack Query

### API Endpoints

- `GET /health` - System health and last update
- `GET /models` - Available ML models and performance
- `GET /metrics` - Overall model metrics and confusion matrix
- `GET /features` - Feature importance rankings
- `POST /predict` - Exoplanet classification
- `GET /dataset` - Mission data with filtering
- `GET /shap/sample` - Sample SHAP explanations

## 🧪 Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Consistent code formatting (recommended)
- **Husky**: Git hooks for pre-commit checks (optional)

### Testing

The application includes basic smoke tests and is designed for:

- **Manual Testing**: Comprehensive UI testing across all pages
- **API Testing**: Backend integration and mock fallback testing
- **Responsive Testing**: Mobile and desktop compatibility
- **Accessibility**: WCAG compliance with semantic HTML

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npx vercel
   ```

2. **Configure Environment Variables**:
   Set `NEXT_PUBLIC_BACKEND_URL` in Vercel dashboard

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**: Static export with `npm run build`
- **AWS Amplify**: Direct GitHub integration
- **Docker**: Use the included Dockerfile
- **Traditional Hosting**: Build and serve static files

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design compatibility
- Test with both backend online and offline modes
- Maintain accessibility standards

## 📄 License

This project is part of the NASA Space Apps Challenge 2025. See the main repository for license details.

## 🙏 Acknowledgments

- **NASA Space Apps Challenge** for the inspiration and platform
- **Kepler, K2, and TESS missions** for the exoplanet data
- **Open source community** for the amazing tools and libraries
- **shadcn/ui** for the beautiful component library
- **React Three Fiber** for 3D visualization capabilities

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/b9nn/HuntingExoPlanets/issues)
- **Discussions**: [Join the discussion](https://github.com/b9nn/HuntingExoPlanets/discussions)
- **NASA Space Apps**: [Space Apps Challenge](https://spaceappschallenge.org/)

---

**Built with ❤️ for NASA Space Apps Challenge 2025**

*Exploring the cosmos, one exoplanet at a time.*
