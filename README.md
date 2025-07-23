# StateSet Zone App

> **Modern DeFi Platform for Business Operations**

StateSet Zone is a comprehensive decentralized finance (DeFi) application built on the Cosmos SDK that streamlines business operations through blockchain technology. From invoice management to smart contracts, StateSet Zone provides all the tools you need to run efficient, transparent business operations.

## 🚀 Features

### Core Business Operations
- **📄 Invoice Management** - Create, track, and manage invoices with automated workflows
- **🛒 Purchase Orders** - Streamline procurement with intelligent purchase order management
- **💰 DeFi Loans** - Access decentralized lending and borrowing with competitive rates
- **📋 Smart Contracts** - Deploy and manage smart contracts for automated business processes
- **🏪 Commerce Platform** - Build and scale e-commerce operations with integrated payments
- **📊 Analytics Dashboard** - Gain insights with comprehensive reporting and analytics

### Technical Features
- **🌙 Dark/Light Mode** - Full theme support with system preference detection
- **📱 Responsive Design** - Mobile-first design with modern UI components
- **⚡ Performance Optimized** - Fast loading with optimized assets and code splitting
- **🔐 Secure Authentication** - Powered by Clerk with social login support
- **🌐 Blockchain Integration** - Native Cosmos SDK and Keplr wallet support
- **🎨 Modern UI/UX** - Beautiful interface with smooth animations and transitions

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS 3 with custom design system
- **Authentication**: Clerk
- **State Management**: Apollo Client, React Query
- **Blockchain**: Cosmos SDK, CosmJS, Keplr
- **Animation**: Framer Motion
- **UI Components**: Headless UI, Heroicons

## 🏗 Architecture

```
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with navigation
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useTheme.js     # Theme management hook
│   └── ...
├── pages/              # Next.js pages/routes
│   ├── _app.js         # App wrapper with providers
│   ├── index.js        # Landing page
│   ├── home.js         # Dashboard
│   └── ...
├── styles/             # CSS and styling
│   └── global.css      # Global styles with Tailwind
├── public/             # Static assets
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Keplr wallet (for blockchain features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stateset/stateset-zone-app.git
   cd stateset-zone-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=your_graphql_endpoint
   NEXT_PUBLIC_ADMIN_SECRET=your_admin_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue variants for main actions and highlights
- **Secondary**: Yellow/Orange for accent elements
- **Accent**: Gray variants for text and neutral elements
- **Success**: Green for positive states
- **Warning**: Yellow for caution states
- **Error**: Red for error states

### Typography
- **Font Family**: Inter (with fallbacks)
- **Sizes**: Responsive scale from 2xs to 9xl
- **Weights**: 100-900 range support

### Components
- **Buttons**: Primary, secondary, outline, ghost, danger, success variants
- **Cards**: Header, body, footer sections with consistent spacing
- **Forms**: Styled inputs with focus states and validation
- **Badges**: Status indicators with color variants

## 🔧 Configuration

### Tailwind CSS
The design system is built on Tailwind CSS with custom configuration:
- Extended color palette
- Custom animations and transitions
- Responsive design utilities
- Dark mode support

### Apollo Client
GraphQL client configured with:
- HTTP link for queries/mutations
- Authentication headers
- Error handling
- Cache management

### Clerk Authentication
Pre-configured authentication with:
- Social login providers
- User management
- Route protection
- Session handling

## 📱 Features in Detail

### Dashboard
- **Metrics Overview** - Key business metrics with trend indicators
- **Quick Actions** - Fast access to common tasks
- **Recent Activity** - Timeline of recent operations
- **Network Status** - Blockchain network information
- **Wallet Integration** - Balance and transaction history

### Responsive Design
- **Mobile-first** approach
- **Tablet optimized** layouts
- **Desktop enhanced** experience
- **Touch-friendly** interactions

### Performance
- **Code splitting** for optimal loading
- **Image optimization** with Next.js
- **CSS optimization** with Tailwind purging
- **Bundle analysis** tools included

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [docs.stateset.io](https://docs.stateset.io)
- **RPC Endpoint**: [rpc.stateset.zone](https://rpc.stateset.zone)
- **GitHub**: [github.com/stateset](https://github.com/stateset)
- **Website**: [stateset.io](https://stateset.io)

## 🆘 Support

- **Discord**: [Join our community](https://discord.gg/YYF2ACHshf)
- **Twitter**: [@stateset](https://twitter.com/stateset)
- **Email**: support@stateset.io

---

**Built with ❤️ by the StateSet team**
