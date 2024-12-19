import type { Config } from 'tailwindcss';
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'grid-flow': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-32px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'border-flow': {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3' },
        },
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'background-shine': {
          '0%': {
            'backgroundPosition': '200% 0'
          },
          '100%': {
            'backgroundPosition': '-200% 0'
          }
        },
        'glow-line-horizontal': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'meteor': {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' }
        },
        'aurora': {
          '0%, 100%': {
            transform: 'scale(1.0) translateX(0) rotate(0)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(1.2) translateX(20px) rotate(5deg)',
            opacity: '0.6'
          }
        },
        'aurora-optimized': {
          '0%, 100%': {
            transform: 'translateX(0) rotate(0)',
            opacity: '0.6'
          },
          '50%': {
            transform: 'translateX(10px) rotate(3deg)',
            opacity: '0.4'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "fade-up": "fade-up 1s ease-out forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "fade-left": "fade-left 1s ease-out forwards",
        "fade-right": "fade-right 1s ease-out forwards",
        "grid-flow": "grid-flow 40s linear infinite",
        "bounce-subtle": "bounce-subtle 4s ease-in-out infinite",
        "border-flow": "border-flow 4s ease-in-out infinite",
        "background-pan": "background-pan 3s linear infinite",
        "text-gradient": "text-gradient 8s linear infinite",
        "background-shine": "background-shine 3s linear infinite",
        "glow-line-horizontal": "glow-line-horizontal 3s ease-in-out infinite",
        "gradient-flow": "gradient-flow 15s ease infinite",
        "meteor": "meteor 10s linear infinite",
        "aurora": "aurora 20s ease infinite",
        "aurora-optimized": "aurora-optimized 15s ease infinite"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(var(--primary-rgb), 0.1) 50%, transparent 75%)',
        'soft-gradient': 'linear-gradient(130deg, #a8edea 0%, #fed6e3 50%, #c2ebff 100%)',
      },
      colors: {
        'aurora-1-start': '#4facfe',
        'aurora-1-end': '#00f2fe',
        'soft-blue': '#a8edea',
        'soft-pink': '#fed6e3',
        'soft-sky': '#c2ebff',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      transform: {
        'perspective-1000': 'perspective(1000px)',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;