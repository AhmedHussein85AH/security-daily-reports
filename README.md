# Security Daily Reports

A comprehensive Security Incident Management System designed for the  Security Department. This application provides a modern, user-friendly interface for creating, managing, and analyzing security incident reports.
<img width="1158" height="822" alt="image" src="https://github.com/user-attachments/assets/8633c274-13d7-44cb-80a7-10b45bb75e1d" />

## 🚀 Features

### Core Functionality
- **Incident Report Creation**: Comprehensive form for logging security incidents with detailed information
- **Multi-View Dashboard**: Switch between different views (New Report, View Reports, Analytics)
- **Data Management**: Create, view, edit, and delete incident reports
- **Print-Ready Reports**: Generate professional printable incident reports
- **Analytics Dashboard**: Visual insights and statistics on incident data

### Report Categories
- Security incidents and violations
- Priority classification (High/Low)
- CMD options (CMD/CMD-FMD-Call)
- Location-based tracking
- Department responsibility assignment

### Data Views
- **Daily Reports**: Current day incidents
- **Weekly Reports**: Last 7 days overview
- **Monthly Reports**: Monthly incident summary
- **Yearly Reports**: Annual incident tracking
- **Database View**: Complete incident history
- **Low Priority**: Filtered low-priority incidents

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradient designs
- **Build Tool**: Vite
- **Development**: Hot reload and fast refresh
- **Code Quality**: ESLint with TypeScript support

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/security-daily-reports.git
   cd security-daily-reports
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Alternative Setup (Windows)
For Windows users, you can also double-click the `start-dev.bat` file for quick startup.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code analysis

## 📁 Project Structure

```
security-daily-reports/
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx    # Analytics and statistics view
│   │   ├── IncidentReportForm.tsx    # Main incident reporting form
│   │   ├── ReportPrintView.tsx       # Print-ready report layout
│   │   └── TableViews.tsx            # Data tables and management
│   ├── types/
│   │   └── incident.ts               # TypeScript type definitions
│   ├── pages/                        # Additional pages (if any)
│   ├── App.tsx                       # Main application component
│   ├── main.tsx                      # Application entry point
│   └── index.css                     # Global styles and Tailwind
├── public/                           # Static assets
├── .gitignore                        # Git ignore rules
├── start-dev.bat                     # Windows batch file for easy startup
├── package.json                      # Project dependencies and scripts
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
└── README.md                         # This file
```

## 💼 Usage

### Creating a New Incident Report
1. Click "New Report" in the header navigation
2. Fill out the comprehensive incident form:
   - Report details (number, CRR number, date/time)
   - Incident information (subject, category, location)
   - Description and action taken
   - Priority and CMD options
   - Responsibility assignments
3. Submit the report to add it to the system

### Viewing and Managing Reports
1. Click "View Reports" to access the data tables
2. Switch between different time periods (Daily, Weekly, Monthly, etc.)
3. Edit, delete, or print individual reports
4. Use bulk selection for multiple report operations

### Analytics Dashboard
1. Click "Analytics" to view incident statistics
2. Review trends, patterns, and summary data
3. Export or analyze incident patterns over time

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use header navigation with visual feedback
- **Print Optimization**: Professional print layouts for official reports
- **Visual Feedback**: Smooth transitions and hover effects

## 🌐 Live Demo

[View Live Demo](https://ahmedhussein85ah.github.io/security-daily-reports/) - *Try it free*

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Build the project: `npm run build`
2. Deploy to GitHub Pages using GitHub Actions or manual upload
3. Your app will be available at `https://your-username.github.io/security-daily-reports/`

### Other Hosting Options
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Firebase Hosting**: Use `firebase deploy` after building

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer Information

**Developed by**: Ahmed Hussein, Security Coordinator  
**Department**: Marassi Security Department  
**Version**: 1.0.0  
**Year**: 2025

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/security-daily-reports/issues)
- **Email**: [Contact Developer](mailto:your-email@example.com)
- **Documentation**: Check the [Wiki](https://github.com/your-username/security-daily-reports/wiki) for detailed guides

---

**Happy Use!** 🚀

*Made with ❤️ by Ahmed Hussein*


