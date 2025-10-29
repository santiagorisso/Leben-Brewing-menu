# Infinite Text Slider Component

## Overview

The `InfiniteTextSlider` component displays persistent infinite horizontal scrolling text animations at the top and bottom edges of the menu layout. The content and visibility are controlled through the admin panel.

## Files Created

1. **`components/infinite-text-slider.tsx`** - Main React component
2. **`lib/slider-settings.ts`** - Functions to get/save slider settings from Supabase Storage
3. **`components/admin/slider-settings.tsx`** - Admin panel UI for managing slider settings
4. **CSS animations** - Added to `app/globals.css`

## Integration

### Layout Integration

The component has been integrated into `app/layout.tsx`:

- **Top slider**: Fixed position at the top of the page
- **Bottom slider**: Fixed position at the bottom of the page
- **Spacing**: Added padding-top and padding-bottom to main content to prevent overlap

```tsx
<InfiniteTextSlider position="top" />
<div className="pt-10 md:pt-12">
  {children}
</div>
<InfiniteTextSlider position="bottom" />
<div className="pb-10 md:pb-12" />
```

### Admin Panel Integration

The slider settings are accessible in the admin dashboard under the **"Text Slider"** tab, alongside "Categories" and "Menu Items" tabs.

## Features

### Admin Controls

- **Visibility Toggle**: Show/hide the slider
- **Text Content**: Editable text with HTML support (`<b>`, `<i>`, `<span>`)
- **Animation Duration**: Configure scroll speed (10-60 seconds)
- **Direction**: Choose left-to-right or right-to-left scrolling
- **Live Preview**: See formatted text preview before saving

### Component Features

- Infinite seamless scrolling animation
- Automatic content duplication for smooth loops
- Polls for updates every 30 seconds
- Responsive design (smaller text/height on mobile)
- Uses existing project fonts (Helvetica)
- Black background with white text (matching menu theme)

## Data Storage

Settings are stored in Supabase Storage:

- **Bucket**: `menu-assets`
- **File**: `slider-settings.json`
- **Format**: JSON

```json
{
  "visible": true,
  "text": "Welcome to <b>Leben Brewing</b> - Fresh beer every day!",
  "animationDuration": 25,
  "direction": "left"
}
```

## Styling

- Uses Tailwind CSS for layout and positioning
- Custom CSS keyframe animations in `globals.css`
- Fixed positioning to ensure always visible (unless disabled)
- z-index: 40 (below dropdown menu z-50, above content)

## HTML Formatting Support

The component supports simple HTML tags for text formatting:

- `<b>` or `<strong>` - Bold text
- `<i>` or `<em>` - Italic text
- `<span>` - Inline styling (e.g., `<span style="color: #ff0000">red text</span>`)

Example text:

```html
Welcome to <b>Leben Brewing</b> - <i>Fresh beer every day!</i>
<span style="color: #4ade80">Open 7 days a week</span>
```

## Customization

### Animation Speed

Default is 25 seconds for one complete cycle. Adjust via admin panel (10-60 seconds range).

### Direction

- **Left**: Text scrolls from right to left (default)
- **Right**: Text scrolls from right to left

Note: Top slider always scrolls left-to-right. Bottom slider uses the configured direction.

### Styling Colors

The component uses:

- Background: `bg-black`
- Text: `text-white`
- Border: `border-gray-800`

To change colors, modify the classes in `components/infinite-text-slider.tsx`.

## Troubleshooting

### Slider Not Appearing

1. Check admin panel - ensure "Show slider on menu" is enabled
2. Verify text content is not empty
3. Check browser console for errors
4. Confirm Supabase Storage bucket `menu-assets` exists

### Animation Not Smooth

- Ensure content is duplicated (component does this automatically)
- Check animation duration (very fast durations may appear choppy)
- Verify CSS animations are loaded in `globals.css`

### Text Not Formatting

- Ensure HTML tags are properly closed
- Check for syntax errors in HTML
- Use `<span>` for custom colors, not inline styles directly on text

## Future Enhancements

Potential improvements:

- Multiple text segments (different speeds/styling)
- Pause on hover
- Clickable links in slider text
- Different text for top vs bottom
- Animation pause/resume controls
