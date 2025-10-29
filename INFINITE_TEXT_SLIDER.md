# Infinite Text Slider Component

## Overview

The `InfiniteTextSlider` component displays **seamless infinite horizontal scrolling text animations** at the top and bottom edges of the menu layout. The animation uses a **duplicated-track technique** for truly infinite, seamless scrolling without visible restarts. The content and visibility are controlled through the admin panel.

## Key Features

✅ **Seamless Infinite Scrolling** - Uses duplicated-track technique (width: 200%, translate -50%)  
✅ **Fixed Position** - Always visible at top and bottom edges  
✅ **Accessibility** - Respects `prefers-reduced-motion`  
✅ **Admin Controlled** - Toggle visibility and edit content via admin panel  
✅ **HTML Support** - Safe rendering of formatted text (`<b>`, `<i>`, `<span>`)  
✅ **Responsive** - Adapts to mobile and desktop viewports  
✅ **Non-intrusive** - Uses `pointer-events: none` to allow clicks through

## Files Created

1. **`components/infinite-text-slider.tsx`** - Main React component
2. **`lib/slider-settings.ts`** - Functions to get/save slider settings from Supabase Storage
3. **`components/admin/slider-settings.tsx`** - Admin panel UI for managing slider settings
4. **CSS animations** - Added to `app/globals.css`

## Integration

### Layout Integration

The component has been integrated into `app/layout.tsx`:

- **Top slider**: Fixed position at the top of the page (`position: fixed; top: 0`)
- **Bottom slider**: Fixed position at the bottom of the page (`position: fixed; bottom: 0`)
- **Spacing**: Padding automatically matches slider height using CSS variable `--marquee-height`

```tsx
<InfiniteTextSlider position="top" />
<div className="pt-[2.5rem] md:pt-12">
  {children}
</div>
<InfiniteTextSlider position="bottom" />
<div className="pb-[2.5rem] md:pb-12" />
```

**Important**: The padding values (`pt-[2.5rem] md:pt-12`) match the CSS variable `--marquee-height` to prevent content overlap.

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

## Styling & Animation

### Seamless Marquee Technique

The slider uses a **duplicated-track technique** for seamless infinite scrolling:

1. **Track Width**: `200%` (contains two copies)
2. **Each Copy**: `50%` width (first and second identical content)
3. **Animation**: Translates from `translateX(0)` to `translateX(-50%)`
4. **Result**: When first copy scrolls out, second copy seamlessly continues

### CSS Variables

```css
:root {
  --marquee-height: 2.5rem; /* 40px mobile */
}

@media (min-width: 768px) {
  :root {
    --marquee-height: 3rem; /* 48px desktop */
  }
}
```

### Keyframe Animations

```css
@keyframes marquee-scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

- Uses Tailwind CSS for layout and positioning
- Custom CSS keyframe animations in `globals.css`
- Fixed positioning to ensure always visible (unless disabled)
- z-index: 40 (below dropdown menu z-50, above content)
- `pointer-events: none` - Allows clicks through the slider

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

## Accessibility

- **`aria-hidden="true"`**: Marked as decorative since content is duplicated
- **`prefers-reduced-motion`**: Animation automatically disabled for users who prefer reduced motion
- **Keyboard navigation**: Not affected (slider is non-interactive)
- **Screen readers**: Content is accessible but marked decorative to avoid repetition

## Troubleshooting

### Slider Not Appearing

1. Check admin panel - ensure "Show slider on menu" is enabled
2. Verify text content is not empty
3. Check browser console for errors
4. Confirm Supabase Storage bucket `menu-assets` exists
5. Verify CSS variable `--marquee-height` is defined in `globals.css`

### Animation Not Smooth or Visible Restart

- ✅ **Fixed**: Component now uses duplicated-track technique (width: 200%, translate -50%)
- Ensure animation duration is reasonable (10-60 seconds recommended)
- Check that `will-change: transform` is applied (handled by CSS)
- Verify no conflicting CSS is overriding the animation

### Text Not Formatting

- Ensure HTML tags are properly closed
- Check for syntax errors in HTML
- Use `<span>` for custom colors, not inline styles directly on text

### Content Overlapping

- Verify padding in `app/layout.tsx` matches `--marquee-height`
- On mobile: `pt-[2.5rem] pb-[2.5rem]` (matches 2.5rem height)
- On desktop: `pt-12 pb-12` (matches 3rem height)

## Future Enhancements

Potential improvements:

- Multiple text segments (different speeds/styling)
- Pause on hover
- Clickable links in slider text
- Different text for top vs bottom
- Animation pause/resume controls
