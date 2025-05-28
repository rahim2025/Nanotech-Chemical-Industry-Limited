# CSS Organization Guidelines

This project follows a structured approach to organizing CSS files for better maintainability and scalability.

## Folder Structure

```
src/
├── styles/
│   ├── ProductDetailPage.css    # Page-specific styles
│   ├── components/              # Component-specific styles (future)
│   └── globals/                 # Global utility styles (future)
├── index.css                    # Global application styles
└── ...
```

## Guidelines

### 1. **Page-Specific Styles**
- Location: `src/styles/[PageName].css`
- Purpose: Styles specific to individual pages
- Example: `ProductDetailPage.css`
- Import: `import "../styles/ProductDetailPage.css"`

### 2. **Component-Specific Styles**
- Location: `src/styles/components/[ComponentName].css`
- Purpose: Styles specific to reusable components
- Example: `CommentItem.css`, `ProductCard.css`
- Import: `import "../../styles/components/ComponentName.css"`

### 3. **Global Styles**
- Location: `src/index.css`
- Purpose: Application-wide styles, theme variables, reset styles
- Import: Automatically imported in `main.jsx`

### 4. **Utility Styles**
- Location: `src/styles/globals/utilities.css`
- Purpose: Reusable utility classes, animations, common patterns
- Import: `import "../styles/globals/utilities.css"`

## Best Practices

1. **Co-location Principle**: Keep related styles close to their components
2. **Naming Convention**: Use descriptive, component-based naming
3. **Modular Approach**: Split large CSS files into smaller, focused modules
4. **Avoid Inline Styles**: Use CSS classes for styling
5. **Use CSS Custom Properties**: Leverage CSS variables for theming

## Migration Status

✅ **Completed:**
- Moved `ProductDetailPage.css` from `pages/` to `styles/`
- Updated imports in `ProductDetailPage.jsx`

🔄 **Future Improvements:**
- Create `styles/components/` for component-specific styles
- Create `styles/globals/` for utility classes
- Extract common animations to separate files
