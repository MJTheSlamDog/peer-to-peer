// src/components/ThemeSwitcher.jsx
import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore'; // Adjust path if needed

const ThemeSwitcher = () => {
    const { theme, setTheme } = useThemeStore();

    // Define the theme names that correspond to your light and dark modes
    const LIGHT_THEME = 'corporate';
    const DARK_THEME = 'business';

    // This useEffect is vital: it updates the 'data-theme' attribute on the <html> tag.
    // DaisyUI then reads this attribute to apply the correct theme's CSS variables.
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]); // Dependency array: runs whenever 'theme' changes

    const toggleTheme = () => {
        // If current theme is business (dark), switch to corporate (light). Otherwise, switch to business (dark).
        const nextTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        setTheme(nextTheme); // Update the theme in your Zustand store
    };

    return (
        <div className="flex items-center space-x-2">
        <label className="swap swap-rotate">
            <input
            type="checkbox"
            className="theme-controller hidden"
            onChange={toggleTheme}
            // Checkbox is "checked" when the current theme is the DARK_THEME ('business')
            checked={theme === DARK_THEME}
            />

            {/* Sun icon for the 'corporate' (light) theme */}
            <svg className="swap-on fill-current w-6 h-6 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM18.36,6.36a1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41L17.64,4.36a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.41ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM12,19a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM7.05,18.95a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41l-.71-.71a1,1,0,0,0-1.41,0A1,1,0,0,0,7.05,18.95ZM17,12a1,1,0,0,0-1-1H15a1,1,0,0,0,0,2h1A1,1,0,0,0,17,12ZM14.36,6.36L13.64,7.07a1,1,0,0,0,1.41,1.41l.71-.71A1,1,0,0,0,14.36,6.36Z"/>
            </svg>

            {/* Moon icon for the 'business' (dark) theme */}
            <svg className="swap-off fill-current w-6 h-6 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-9.5,3.16A10.54,10.54,0,0,1,5.16,6.46,10.08,10.08,0,0,0,12,2.36a1,1,0,0,0,0-2C5.18,2.86,2.36,9.2,3.64,16.22A12.79,12.79,0,0,0,11.64,21.64a1,1,0,0,0,9.5-8.64Z"/>
            </svg>
        </label>
        </div>
    );
    };

export default ThemeSwitcher;