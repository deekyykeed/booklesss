# How to Use Custom Fonts in Booklesss

This guide explains how to add and use your own custom fonts in the app.

## 📁 Step 1: Add Your Font Files

1. Place your font files (`.ttf` or `.otf`) in the `assets/fonts/custom/` folder

```
assets/fonts/custom/
├── YourFont-Regular.ttf
├── YourFont-Bold.ttf
├── YourFont-Italic.ttf
└── YourFont-BoldItalic.ttf
```

## ⚙️ Step 2: Load Fonts in Your App

The app already uses `expo-font` and has font loading set up. You just need to add your fonts to the loading configuration.

### Update `app/_layout.tsx`

Find the `useFonts` hook and add your custom fonts:

```typescript
const [loaded, error] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  ...FontAwesome.font,
  // Add your custom fonts here:
  'YourFont-Regular': require('../assets/fonts/custom/YourFont-Regular.ttf'),
  'YourFont-Bold': require('../assets/fonts/custom/YourFont-Bold.ttf'),
  'YourFont-Italic': require('../assets/fonts/custom/YourFont-Italic.ttf'),
  'YourFont-BoldItalic': require('../assets/fonts/custom/YourFont-BoldItalic.ttf'),
});
```

## 🎨 Step 3: Use Your Fonts in Styles

Once loaded, you can use your fonts in any StyleSheet:

```typescript
import { StyleSheet, Text, View } from 'react-native';

export default function MyComponent() {
  return (
    <View>
      <Text style={styles.title}>This uses your custom font</Text>
      <Text style={styles.boldText}>This is bold</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'YourFont-Regular',
    fontSize: 24,
  },
  boldText: {
    fontFamily: 'YourFont-Bold',
    fontSize: 18,
  },
});
```

## 🔤 Font Weight vs. Font Family

In React Native, you don't use `fontWeight` with custom fonts. Instead, you use different font family names:

### ❌ Don't do this:
```typescript
{
  fontFamily: 'YourFont',
  fontWeight: 'bold', // This won't work with custom fonts
}
```

### ✅ Do this instead:
```typescript
{
  fontFamily: 'YourFont-Bold', // Use the specific font file
}
```

## 🌐 Complete Example

Here's a complete example showing how to use multiple font weights:

```typescript
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Booklesss</Text>
      <Text style={styles.subheading}>Your School Social Network</Text>
      <Text style={styles.body}>
        This is regular text that uses your custom font.
      </Text>
      <Text style={styles.emphasis}>
        This is emphasized text in italic.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontFamily: 'YourFont-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  subheading: {
    fontFamily: 'YourFont-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  body: {
    fontFamily: 'YourFont-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  emphasis: {
    fontFamily: 'YourFont-Italic',
    fontSize: 16,
  },
});
```

## 🔄 After Adding Fonts

Always restart your development server with cache cleared after adding new fonts:

```bash
# Stop the current server (Ctrl+C)
npm start -- --clear
```

## 📱 Platform-Specific Notes

### iOS
- Fonts work out of the box with Expo
- No additional configuration needed

### Android
- Fonts work out of the box with Expo
- No additional configuration needed

### Web
- Custom fonts will be embedded in your web build automatically
- May increase initial load time slightly

## 🎯 Best Practices

1. **Font File Naming**: Use descriptive names that include the weight/style
   - `Montserrat-Regular.ttf`
   - `Montserrat-Bold.ttf`
   - `Montserrat-SemiBold.ttf`

2. **Font Loading Key**: The key in `useFonts` is what you'll use in `fontFamily`
   ```typescript
   useFonts({
     'MyFont': require('./MyFont.ttf'), // Use as fontFamily: 'MyFont'
   })
   ```

3. **Organize by Family**: Keep all weights/styles of the same font family together
   ```
   assets/fonts/custom/
   ├── Montserrat-Regular.ttf
   ├── Montserrat-Bold.ttf
   ├── Montserrat-Italic.ttf
   └── Roboto-Regular.ttf
   ```

4. **Test on All Platforms**: Always test your fonts on iOS, Android, and Web

## 🐛 Troubleshooting

### Font not showing up?

1. **Check the file path** - Make sure the path in `require()` is correct
2. **Clear cache** - Run `npm start -- --clear`
3. **Check the font name** - The key in `useFonts` must match what you use in styles
4. **Verify file format** - Only `.ttf` and `.otf` are supported

### App crashes when loading?

1. **Check for errors** - Look at the error message in the console
2. **Verify font file** - Make sure the font file isn't corrupted
3. **Check the require path** - Ensure all paths are correct

## 💡 Example Font Sources

Free fonts you can download:
- [Google Fonts](https://fonts.google.com/) - Huge collection of free fonts
- [Font Squirrel](https://www.fontsquirrel.com/) - Free fonts for commercial use
- [DaFont](https://www.dafont.com/) - Large collection (check licenses)
- [1001 Fonts](https://www.1001fonts.com/) - Free fonts (check licenses)

Always check the font license before using in your app!
