# DClinPsy App Deployment Guide

## Live Application
🌐 **Live URL**: [https://jmckernan95.github.io/dclinpsy-app](https://jmckernan95.github.io/dclinpsy-app)

📁 **Repository**: [https://github.com/jmckernan95/dclinpsy-app](https://github.com/jmckernan95/dclinpsy-app)

---

## Quick Commands

### Deploy Updates
```bash
npm run deploy
```

### Local Development
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

---

## Deployment Process

### Initial Setup (Already Complete)
1. ✅ Configured `package.json` with homepage URL
2. ✅ Installed `gh-pages` package
3. ✅ Created GitHub repository: `dclinpsy-app`
4. ✅ Deployed to GitHub Pages

### Making Updates and Redeploying
```bash
# 1. Make your code changes
# 2. Test locally
npm start

# 3. Deploy to GitHub Pages (builds and deploys automatically)
npm run deploy

# 4. Optional: Commit and push source code changes
git add .
git commit -m "Your commit message"
git push origin main
```

---

## GitHub Pages Configuration

The app is automatically configured for GitHub Pages:
- **Source**: Deploy from `gh-pages` branch
- **Custom Domain**: None (using github.io subdomain)
- **HTTPS**: Enabled by default

### Manual GitHub Pages Settings (if needed)
1. Go to [Repository Settings](https://github.com/jmckernan95/dclinpsy-app/settings)
2. Scroll to "Pages" in the left sidebar
3. **Source**: Deploy from a branch
4. **Branch**: `gh-pages` → `/ (root)`
5. **Custom domain**: Leave blank
6. Save settings

---

## Important Notes

### Data Storage
- **Local Storage**: All user data is stored in browser localStorage
- **No Cloud Sync**: Each device/browser has independent data
- **Privacy**: No personal data is transmitted to servers
- **GDPR Compliant**: Users can export/delete their data anytime

### Browser Compatibility
- Modern browsers with localStorage support
- JavaScript enabled required
- Mobile responsive design included

### React Router Configuration
- Uses `BrowserRouter` for clean URLs
- GitHub Pages compatible with current setup
- All routes work correctly with the configured homepage

---

## Testing Checklist

After each deployment, verify:

### Core Functionality
- [ ] App loads at https://jmckernan95.github.io/dclinpsy-app
- [ ] Navigation works (Home, Login, Register, Practice)
- [ ] User registration with age verification
- [ ] User login/logout functionality
- [ ] Practice tests load and function correctly
- [ ] Scoring system works
- [ ] Progress tracking saves data
- [ ] Research questionnaire accessible

### Responsive Design
- [ ] Desktop layout (1200px+)
- [ ] Tablet layout (768px-1199px)
- [ ] Mobile layout (<768px)
- [ ] Touch interactions work on mobile

### Performance
- [ ] Initial page load under 3 seconds
- [ ] No console errors
- [ ] Images load properly
- [ ] Smooth navigation between pages

---

## Troubleshooting

### Common Issues

**404 Error on Refresh**
- This is normal for GitHub Pages with BrowserRouter
- Users should navigate using the app's internal links
- Direct URL access works for the homepage

**Deployment Not Updating**
```bash
# Force rebuild and deploy
rm -rf build
npm run deploy
```

**Build Warnings**
- ESLint warnings don't affect functionality
- Address them for cleaner code but not required for deployment

### Build Cache Issues
```bash
# Clear npm cache
npm start -- --reset-cache

# Clear build directory
rm -rf build node_modules
npm install
npm run deploy
```

### Checking Deployment Status
- Visit [GitHub Repository](https://github.com/jmckernan95/dclinpsy-app)
- Check "Actions" tab for deployment history
- "Pages build and deployment" workflow shows status

---

## Security Considerations

### Data Protection
- No sensitive data in repository
- User passwords encrypted with PBKDF2
- Age verification data encrypted locally
- All data stays on user's device

### Public Repository
- Repository is public (required for GitHub Pages)
- No API keys or secrets in code
- No user data transmitted externally
- Safe for public hosting

---

## Future Enhancements

### Potential Improvements
- **Cloud Sync**: Add user account synchronization across devices
- **Analytics**: Track usage patterns (anonymously)
- **Content Management**: Admin interface for adding questions
- **Export Features**: PDF reports of progress
- **Mobile App**: React Native version

### Development Setup
```bash
# Clone repository
git clone https://github.com/jmckernan95/dclinpsy-app.git
cd dclinpsy-app

# Install dependencies
npm install

# Start development server
npm start
```

---

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing browser cache
- Test in incognito/private mode

**Last Updated**: August 2024  
**Version**: 2.0.0  
**React Version**: 18.2.0  
**Node.js Required**: 16+