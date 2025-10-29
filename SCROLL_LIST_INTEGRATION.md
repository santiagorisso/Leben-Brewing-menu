# ScrollList Component - Integration Guide

## Overview

The `ScrollList` component provides a smooth-scrolling menu list with focus animations. Items scale and fade based on scroll position, creating an engaging visual effect.

## Status

⚠️ **Note**: The ScrollList component implementation was started but requires the `smooth-scrollbar` package to be installed. Due to dependency conflicts, installation may require `--legacy-peer-deps` flag.

## Installation

```bash
npm install smooth-scrollbar --legacy-peer-deps
npm install @types/smooth-scrollbar --save-dev --legacy-peer-deps
```

## Usage Example

Wrap your menu items with the `ScrollList` component:

```tsx
import { ScrollList } from "@/components/scroll-list";

<ScrollList height="700px" className="my-custom-class">
  {menuItems.map((item) => (
    <div key={item.id} className="scroll-list-item">
      {/* Your item content */}
    </div>
  ))}
</ScrollList>;
```

## CSS Classes

- `.scroll-list-wrapper` - Outer container
- `.scroll-list-container` - Scrollable container (smooth-scrollbar target)
- `.scroll-list-content` - Content wrapper
- `.scroll-list-item` - Individual items (required class name)
- `.item-focus` - Applied to focused item (full opacity, scale 1)
- `.item-next` - Applied to next item after focused
- `.item-hide` - Applied to items before focused (faded out)

## Important Notes

- Items **must** have the class `scroll-list-item` for the animation logic to work
- The component is self-contained and won't affect other parts of the site
- Uses `smooth-scrollbar` library for custom scrollbar with overscroll plugin
- CSS styles are isolated in `globals.css` under "ScrollList Component Styles"
