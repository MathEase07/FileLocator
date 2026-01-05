# File Storage Tracker

A lightweight, browser-based file tracking application with secure authentication and local storage. Manage, search, organize, and export your file inventory with ease.

## Features

✨ **Core Features:**
- 🔐 **Secure Login System** — Username/password authentication with editable credentials
- 📝 **Add Files** — Track file titles, storage locations, and additional information
- 🔍 **Search Functionality** — Quick search through stored files
- ✏️ **Edit Files** — Modify file details with password verification
- 🗑️ **Delete Files** — Remove files with double security (password + confirmation)
- 💾 **Local Storage** — All data persists in browser localStorage
- 📤 **Export/Import** — Backup and restore your file inventory as JSON

## Security

- Password-protected account management
- Password verification required for sensitive operations (edit, delete)
- Change username and password anytime
- No backend required — all data stays on your device

## Getting Started

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation needed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/file-storage-tracker.git
cd file-storage-tracker
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### Default Credentials

- **Username:** `MPDC`
- **Password:** `MPDC2026`

⚠️ **Important:** Change these credentials immediately after first login!

## How to Use

### Sign In
1. Click the **"Sign in"** button
2. Enter your username and password
3. Click **"Sign in"** to access the dashboard

### Add a File
1. Enter file title, storage location, and optional information
2. Click **"ADD"** to save
3. Use **"CLEAR"** to reset the form

### Search Files
- Use the search bar to filter files by title, location, or info
- Results update in real-time

### Edit a File
1. Click the **"Edit"** button on any file
2. Enter your account password for verification
3. Update the file details in the prompts
4. Click confirm to save changes

### Delete a File
1. Click the **"Delete"** button on any file
2. Enter your account password for verification
3. Confirm the deletion in the popup
4. File is permanently removed

### Change Account
1. Click **"Change Account"** in the header (while signed in)
2. Enter new username and password
3. Confirm the new password
4. Click **"Update"** to apply changes

### Export/Import
- **Export:** Click **"EXPORT FILES"** to download your data as JSON
- **Import:** Click **"IMPORT FILES"** to restore a backup

## Project Structure

```
file-storage-tracker/
├── index.html          # Main HTML file with modals and structure
├── styles.css          # Complete styling for the application
├── script.js           # JavaScript logic and functionality
├── README.md           # Project documentation
├── .gitignore          # Git ignore file
└── LICENSE             # MIT License
```

## Technologies Used

- **HTML5** — Semantic markup and form handling
- **CSS3** — Responsive design with gradients and animations
- **JavaScript (Vanilla)** — No frameworks, pure ES6+ logic
- **LocalStorage API** — Browser-based data persistence

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |

## Tips & Best Practices

- 🔒 Use a strong, unique password
- 💾 Regularly export your data for backup
- 🔄 Keep credentials secure and don't share them
- 📱 Works on mobile browsers for on-the-go access

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Known Limitations

- Data is stored locally in the browser only (no cloud sync)
- Clearing browser storage or cache will delete all data
- Only works in browsers with localStorage support

## Future Enhancements

- [ ] Cloud storage integration
- [ ] Multi-user support
- [ ] File categorization and tagging
- [ ] Advanced filtering and sorting
- [ ] Dark/Light theme toggle
- [ ] Mobile app version

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Include browser console errors (F12) when reporting bugs

## Changelog

### v1.0.0 (Current)
- Initial release
- Core file tracking functionality
- Secure authentication with password verification
- Export/Import capabilities
- Edit and Delete with password protection

---

**Made with ❤️ by your development team**
