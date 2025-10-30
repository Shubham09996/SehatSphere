/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem', // Adjusted for slightly more spacing
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Global Gradient for HealthSphere Logo Text
        'hs-gradient-start': '#0096C7',
        'hs-gradient-middle': '#2A9D8F',
        'hs-gradient-end': '#7E57C2',
        // Core Application Blue (from screenshot)
        'app-blue': '#3B82F6',
        'app-blue-hover': '#2563EB',
        // Login Page Specific Colors (refined to match screenshot)
        'app-light-blue-bg': '#F8FAFC',
        'login-card-dark-bg': '#1A202C',
        'login-input-bg': '#FFFFFF',
        'login-input-dark-bg': '#2D3748',
        'login-text-muted': '#6B7280',
        'login-demo-free-bg': '#FFFFFF',
        'login-demo-free-text': '#4B5563',
        'login-demo-premium-bg': '#FCD34D',
        'login-demo-premium-text': '#92400E',
        'login-demo-dark-bg': '#2D3748',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'role-patient-border': '#20C997',
        'role-doctor-border': '#3B82F6',
        'role-medicine-border': '#A366FF',
        'role-donor-border': '#FA5252',
        'role-admin-border': '#FD7E14',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        success: 'hsl(var(--success))',
        // Premium Section Colors
        'premium-bg': '#FDF8F0',
        'premium-tag-bg': '#FBBF24',
        'premium-tag-text': '#92400E',
        'premium-button-free-trial-bg': '#FBBF24',
        'premium-button-free-trial-text': '#92400E',
        'premium-button-compare-bg': '#E5E7EB',
        'premium-button-compare-text': '#4B5563',
        // Dark theme premium colors (assuming these are needed if dark mode is active)
        'dark-premium-bg': '#1B1B1B',
        'dark-premium-card-bg': '#2C2C2C',
        'dark-premium-button-compare-bg': '#444444',
        'dark-premium-button-compare-text': '#E0E0E0',
      },
      borderRadius: {
        lg: '0.75rem', // Slightly larger border radius for cards
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};