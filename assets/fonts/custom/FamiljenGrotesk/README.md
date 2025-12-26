# FamiljenGrotesk Font Family

This directory contains the FamiljenGrotesk font family for use in the React Native app.

## Available Fonts

- `FamiljenGrotesk-Regular.otf` - Regular weight
- `FamiljenGrotesk-Medium.otf` - Medium weight
- `FamiljenGrotesk-SemiBold.otf` - SemiBold weight
- `FamiljenGrotesk-Bold.otf` - Bold weight

## Usage

These fonts are loaded in `app/_layout.tsx` and can be used in your styles:

```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'FamiljenGrotesk-Regular',
    fontSize: 14,
  },
  mediumText: {
    fontFamily: 'FamiljenGrotesk-Medium',
    fontSize: 16,
  },
});
```

## Current Usage

- Meta text (smaller text) in CourseCard uses `FamiljenGrotesk-Regular`

## License

See `OFL.txt` for the Open Font License.
