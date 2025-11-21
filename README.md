# Personal Website Portfolio

A modern, responsive personal website to showcase projects, coursework, and professional links.

## Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Project Showcase**: Display your projects with descriptions and technology tags
- **Coursework Section**: Highlight relevant academic coursework and topics
- **Social Links**: Quick access to GitHub and LinkedIn profiles
- **Smooth Navigation**: Fixed navbar with smooth scrolling between sections

## Getting Started

### Prerequisites

No build tools or dependencies required! This is a pure HTML/CSS/JavaScript website.

### Setup

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Customize the content with your information

### Customization

#### Personal Information

1. **Name and Title**: 
   - Update "Your Name" in the navigation logo and hero section
   - Modify the subtitle in the hero section

2. **About Section**:
   - Edit the about text in `index.html` (lines 40-50)

3. **Projects**:
   - Replace the placeholder project cards with your actual projects
   - Update project names, descriptions, technologies, and links
   - Add or remove project cards as needed

4. **Coursework**:
   - Replace placeholder courses with your relevant coursework
   - Update course names, institutions, descriptions, and topics

5. **Social Links**:
   - Update GitHub link: Replace `https://github.com/yourusername` with your GitHub profile
   - Update LinkedIn link: Replace `https://linkedin.com/in/yourusername` with your LinkedIn profile

6. **Footer**:
   - Update the copyright year and name in the footer

### Color Scheme

The website uses a modern color palette defined in CSS variables. To customize colors, edit the `:root` variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #8b5cf6;
    /* ... other colors */
}
```

### Deployment

#### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your main branch as the source
4. Your site will be available at `https://yourusername.github.io/repository-name`

#### Other Hosting Options

- **Netlify**: Drag and drop the folder or connect your Git repository
- **Vercel**: Import your Git repository
- **Any static hosting service**: Upload the files to your hosting provider

## File Structure

```
personal_website/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Interactive features and animations
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

See LICENSE file for details.