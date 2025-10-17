import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Security theme colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Security specific colors
        security: {
          blue: 'hsl(220, 100%, 50%)',
          red: 'hsl(0, 84%, 60%)',
          green: 'hsl(142, 76%, 36%)',
          yellow: 'hsl(45, 93%, 58%)',
          purple: 'hsl(262, 83%, 58%)',
        },
        priority: {
          high: 'hsl(0, 84%, 60%)',
          low: 'hsl(142, 76%, 36%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'hover-lift': 'hoverLift 0.2s ease-out',
        'hover-glow': 'hoverGlow 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        hoverGlow: {
          '0%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0.3)' },
          '100%': { boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.3)' },
        },
      },
      backgroundImage: {
        'gradient-security': 'linear-gradient(135deg, hsl(220, 100%, 50%) 0%, hsl(262, 83%, 58%) 100%)',
        'gradient-priority-high': 'linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 40%) 100%)',
        'gradient-priority-low': 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 20%) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
