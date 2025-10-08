import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Variables CSS personnalisées
        'primary-dark': 'var(--primary-dark)',
        'primary-light': 'var(--primary-light)',
        'secondary-dark': 'var(--secondary-dark)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-dark': 'var(--text-dark)',
        'text-medium': 'var(--text-medium)',
        'text-light': 'var(--text-light)',
        'accent-blue': 'var(--accent-blue)',
        'accent-blue-hover': 'var(--accent-blue-hover)',
        'warning-bg': 'var(--warning-bg)',
        'warning-border': 'var(--warning-border)',
        'card-bg': 'var(--card-bg)',
        
        // Garder les couleurs Tailwind existantes
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          400: "#F0E68C",
          300: "#F5E8A3",
          500: "#DAA520",
        },
        blue: {
          900: "#1E3A8A",
          800: "#1E40AF",
          600: "var(--accent-blue)",
          700: "var(--accent-blue-hover)",
        },
        gray: {
          900: "var(--primary-dark)",
          800: "var(--secondary-dark)",
          50: "var(--primary-light)",
          400: "var(--text-secondary)",
          500: "var(--text-medium)",
          300: "var(--text-light)",
        },
        purple: {
          900: "#581C87",
        },
        white: "var(--text-primary)",
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
      }
    },
  },
  plugins: [],
} satisfies Config;
