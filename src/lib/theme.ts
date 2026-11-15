export const THEME_KEY = 'theme'

// Runs inline at the top of <head> before first paint (see layout.tsx), so the page never
// flashes the wrong theme. A saved choice wins; otherwise follow the operating system.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`
