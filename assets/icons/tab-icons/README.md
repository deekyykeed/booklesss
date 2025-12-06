# Tab Icons

This folder contains SVG icons for the bottom tab navigation.

## Folder Structure

Each tab has its own folder with two SVG files:
- `filled.svg` - Used when the tab is active
- `line.svg` - Used when the tab is inactive

```
tab-icons/
├── Home/
│   ├── filled.svg
│   └── line.svg
├── Highlights/
│   ├── filled.svg
│   └── line.svg
├── Chat/
│   ├── filled.svg
│   └── line.svg
├── Search/
│   ├── filled.svg
│   └── line.svg
└── Profile/
    ├── filled.svg
    └── line.svg
```

## SVG Color Requirements

**IMPORTANT**: For the colors to be changeable dynamically in the app:

1. Remove any `fill` or `stroke` attributes with specific colors from your SVG files
2. Use `fill="currentColor"` or `stroke="currentColor"` in your SVG paths
3. Alternatively, leave the fill/stroke attributes empty or remove them entirely

### Example of a properly formatted SVG:

**Good** ✅
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="currentColor"/>
</svg>
```

**Also Good** ✅
```xml
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
</svg>
```

**Bad** ❌
```xml
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#000000"/>
</svg>
```

The app will automatically apply the correct colors based on the active/inactive state and light/dark theme.
