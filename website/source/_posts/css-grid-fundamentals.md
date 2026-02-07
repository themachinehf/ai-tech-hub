<div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
</div>
```

## Essential Grid Properties

### Fractional Units (fr)

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* 3 columns: 1/4, 2/4, 1/4 */
    gap: 20px;
}
```

### Auto-fill and Auto-fit

```css
/* Responsive without media queries */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}
```

### Grid Template Areas

```css
.layout {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Placing Items

### Line-based Placement

```css
.item {
    grid-column-start: 1;
    grid-column-end: 3;  /* Spans columns 1-2 */
    
    grid-row-start: 1;
    grid-row-end: 3;     /* Spans rows 1-2 */
}

/* Shorthand */
.item {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
 Lines

```css
}
```

### Named.container {
    display: grid;
    grid-template-columns:
        [start] 1fr [middle] 2fr [end];
}

.item {
    grid-column: start / end;
}
```

## Responsive Grid Examples

### Card Grid

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 24px;
}
```

### Holy Grail Layout

```css
.holy-grail {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav main aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

@media (max-width: 768px) {
    .holy-grail {
        grid-template-areas:
            "header"
            "nav"
            "main"
            "aside"
            "footer";
        grid-template-columns: 1fr;
    }
}
```

## Best Practices

1. **Use minmax()** - For flexible, responsive layouts
2. **Name areas** - Makes complex layouts readable
3. **Start simple** - Build up complexity gradually
4. **Combine with Flexbox** - Grid for main layout, Flexbox for components

## Browser Support

CSS Grid is supported in all modern browsers:

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

## Conclusion

CSS Grid transforms how we approach web layouts. Master these fundamentals to build responsive, maintainable designs.

---
*Happy styling! 🎨*
