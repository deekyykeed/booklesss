# Fonts Directory Structure

This directory contains all fonts used in the Bookless app.

## Directory Structure

```
assets/fonts/
├── SpaceMono-Regular.ttf    # Default monospace font
├── custom/                  # Custom fonts directory
│   ├── README.md           # Instructions for adding custom fonts
│   └── [Your fonts here]   # Place custom fonts in this folder
└── FONTS_README.md         # This file
```

## Current Fonts

### SpaceMono
- **File**: `SpaceMono-Regular.ttf`
- **Usage**: `fontFamily: 'SpaceMono'`
- **Type**: Monospace
- **Status**: ✅ Loaded in app

### Custom Fonts
- Add your custom fonts to the `custom/` directory
- See `custom/README.md` for detailed instructions

## Font Loading

Fonts are loaded in `app/_layout.tsx` using Expo's `useFonts` hook. To add new fonts:

1. Place font files in `assets/fonts/custom/`
2. Update the `useFonts` hook in `app/_layout.tsx`
3. Restart the development server with `npm start -- --clear`

## Font Usage Examples

```typescript
// Using SpaceMono
const styles = StyleSheet.create({
  monoText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
});

// Using custom fonts (after adding them)
const styles = StyleSheet.create({
  customText: {
    fontFamily: 'YourFont-Regular',
    fontSize: 16,
  },
});
```


