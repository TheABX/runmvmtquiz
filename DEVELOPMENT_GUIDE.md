# Development Guide - Preventing Common Issues

## 🚨 Two Main Problems & Solutions

### Problem 1: Internal Server Errors & Site Not Loading Locally

#### Common Causes:
1. **Build cache corruption** - `.next` folder has stale/corrupted files
2. **Port conflicts** - Port 3000 already in use
3. **Module resolution issues** - Dependencies not properly installed
4. **TypeScript errors** - Type errors causing runtime failures
5. **Environment variables** - Missing or incorrect env vars

#### Solutions:

**Always use the safe dev script:**
```bash
npm run dev:safe
```

**Or manually reset everything:**
```bash
npm run dev:reset
```

**Before making big changes, validate:**
```bash
npm run build:check
```

**If site won't load:**
1. Kill all processes: `pkill -f 'next dev'`
2. Clean cache: `rm -rf .next node_modules/.cache`
3. Restart: `npm run dev:safe`

---

### Problem 2: Site Getting Destroyed When Updating Other Pages

#### Common Causes:
1. **CSS conflicts** - Global styles affecting other pages
2. **Shared component changes** - Modifying shared components breaks other pages
3. **Build cache issues** - Stale cache showing wrong styles
4. **TypeScript compilation errors** - Breaking changes in shared code
5. **Missing error boundaries** - One page error crashes the whole app

#### Solutions:

**1. Always validate before committing:**
```bash
npm run pre-commit
```

**2. Check formatting before big changes:**
```bash
npm run format:check
```

**3. Use CSS isolation:**
- Use Tailwind's scoped classes
- Avoid global CSS changes in `globals.css`
- Use component-specific styles when possible

**4. Test affected pages after changes:**
- If you change a shared component, test ALL pages that use it
- If you change `globals.css`, test ALL pages
- If you change `layout.tsx`, test ALL pages

**5. Use Git branches for big changes:**
```bash
git checkout -b feature/new-page
# Make changes
npm run build:check
# Test thoroughly
git commit
```

---

## 📋 Pre-Commit Checklist

Before committing any changes:

- [ ] Run `npm run build:check` - ensures build succeeds
- [ ] Run `npm run format:check` - checks for CSS conflicts
- [ ] Test the page you changed locally
- [ ] Test at least 2-3 other pages to ensure nothing broke
- [ ] Check browser console for errors (F12)
- [ ] Verify the dev server starts without errors

---

## 🔧 Quick Fixes

### Site won't load:
```bash
npm run dev:reset
```

### Internal server error:
```bash
# 1. Stop server
pkill -f 'next dev'

# 2. Clean everything
rm -rf .next node_modules/.cache

# 3. Restart
npm run dev:safe
```

### Formatting looks wrong:
```bash
# 1. Check for CSS conflicts
npm run format:check

# 2. Clean cache
rm -rf .next

# 3. Hard refresh browser (Cmd+Shift+R)
```

### Type errors:
```bash
# Check types
npx tsc --noEmit

# Fix and rebuild
npm run build:check
```

---

## 🎯 Best Practices

1. **Always use `npm run dev:safe`** instead of `npm run dev`
2. **Run `npm run build:check`** before committing
3. **Test multiple pages** after making changes to shared code
4. **Use Git branches** for experimental changes
5. **Check browser console** regularly for errors
6. **Keep `globals.css` minimal** - only truly global styles
7. **Isolate page-specific styles** in component files

---

## 🆘 Emergency Recovery

If everything breaks:

```bash
# 1. Stop everything
pkill -f 'next dev'
pkill -f 'node'

# 2. Restore from Git
git restore .
git clean -fd

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Clean and restart
rm -rf .next
npm run dev:safe
```

---

## 📝 Notes

- The `dev:safe` script handles port conflicts and cache clearing automatically
- The `build:check` script catches TypeScript errors before they cause runtime issues
- Always test locally before pushing to GitHub
- If in doubt, revert to GitHub version: `git restore .`


