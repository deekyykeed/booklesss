# Custom Fonts Directory

Place your custom font files (.ttf or .otf) in this folder.

## Supported Font Formats

- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)

## Recommended Font Organization

Organize fonts by family and weight for easy management:

```
assets/fonts/custom/
├── Montserrat/
│   ├── Montserrat-Regular.ttf
│   ├── Montserrat-Medium.ttf
│   ├── Montserrat-SemiBold.ttf
│   ├── Montserrat-Bold.ttf
│   └── Montserrat-Italic.ttf
├── Roboto/
│   ├── Roboto-Regular.ttf
│   ├── Roboto-Medium.ttf
│   └── Roboto-Bold.ttf
├── Inter/
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   └── Inter-Bold.ttf
└── YourCustomFont-Regular.ttf
```

## Font Naming Convention

Use descriptive names that include:
- Font family name
- Weight/style (Regular, Medium, SemiBold, Bold, Italic, etc.)

Examples:
- `Montserrat-Regular.ttf`
- `Roboto-Medium.ttf`
- `Inter-SemiBold.ttf`

## Adding Fonts to Your App

After adding font files to this directory:

1. **Update `app/_layout.tsx`** - Add your fonts to the `useFonts` hook:
   ```typescript
   const [loaded, error] = useFonts({
     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
     'Montserrat-Regular': require('../assets/fonts/custom/Montserrat/Montserrat-Regular.ttf'),
     'Montserrat-Medium': require('../assets/fonts/custom/Montserrat/Montserrat-Medium.ttf'),
     'Montserrat-Bold': require('../assets/fonts/custom/Montserrat/Montserrat-Bold.ttf'),
     // Add more fonts here...
   });
   ```

2. **Use fonts in your styles**:
   ```typescript
   const styles = StyleSheet.create({
     text: {
       fontFamily: 'Montserrat-Regular',
       fontSize: 16,
     },
     boldText: {
       fontFamily: 'Montserrat-Bold',
       fontSize: 18,
     },
   });
   ```

3. **Restart your development server** with cache cleared:
   ```bash
   npm start -- --clear
   ```

## Font Loading Best Practices

- Only load fonts you actually use to reduce bundle size
- Group related font weights together
- Test fonts on both iOS and Android
- Consider font fallbacks for better compatibility

## Current Fonts

- `SpaceMono-Regular.ttf` - Located in parent directory
- Add your custom fonts below this line as you add them
