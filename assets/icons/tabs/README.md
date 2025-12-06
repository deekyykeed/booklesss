# Tab Icons

Place your SVG icon files here. Each tab needs one icon file.

## Required Icons

Create these SVG files:
- `home.svg` - Home tab icon
- `highlights.svg` - Highlights tab icon
- `chat.svg` - Chat tab icon
- `search.svg` - Search tab icon
- `profile.svg` - Profile tab icon

## Icon Format

Each SVG should:
- Be 24x24 in size (or use viewBox for scaling)
- Use `fill="currentColor"` or `stroke="currentColor"` for dynamic coloring
- Be a single icon (no filled/line variants needed)

### Example SVG Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path fill="currentColor" d="..." />
</svg>
```

## How It Works

The app uses **opacity** to indicate active/inactive states:
- **Active tab**: 100% opacity (fully visible)
- **Inactive tab**: 50% opacity (semi-transparent)

No need for separate filled and line versions!

## After Adding Your Icons

The icons are imported in `app/(tabs)/_layout.tsx` like this:

```typescript
import HomeIcon from '@/assets/icons/tabs/home.svg';
import HighlightsIcon from '@/assets/icons/tabs/highlights.svg';
// ... etc
```

Then used with the TabIcon component:

```typescript
<TabIcon
  IconComponent={HomeIcon}
  focused={focused}
  color="#000000"
/>
```
