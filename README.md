# Anushka Isuranga - Portfolio

Welcome to the source code of my personal portfolio website. This website showcases my journey as a software developer, highlighting my skills, projects, and experience in web and mobile development.

## 🌐 Live Website

Check out my portfolio here: [anushkaisuranga.github.io](https://anushkaisuranga.github.io)

## 📄 What's Inside

The portfolio is designed to give an overview of:

- **Projects**: A detailed showcase of my projects, with descriptions, technologies used, and links to the source code.
- **Skills**: A breakdown of the technologies I work with, covering front-end, back-end, and full-stack development.
- **Contact**: Easy access to my social media profiles and contact details.

## 🛠 Tools & Technologies Used

- **React**: For building dynamic and interactive user interfaces.
- **Tailwind CSS**: For styling the website with utility-first CSS.
- **HTML5 & CSS3**: The backbone of web development, ensuring structure and style.
- **JavaScript**: For adding interactivity and client-side functionality.

### Deployment:

- **Vite**: For building and bundling the project.
- **GitHub Pages**: Hosting the portfolio directly from my GitHub repository.

## 📂 File Structure

```
├── public
│   ├── assets          # Images, favicon, and other static assets
├── src
│   ├── components      # Reusable React components
│   ├── pages           # Pages for different sections of the portfolio
│   └── App.jsx         # Main app entry point
├── index.html          # HTML entry point
└── package.json        # Project configuration and dependencies
```

## 🔗 Connect With Me

- [Portfolio](https://anushkaisuranga.github.io)
- [LinkedIn](https://www.linkedin.com/in/anushka-isuranga/)
- [GitHub](https://github.com/AnushkaIsuranga)

## AI Chatbot (Groq - Frontend Only)

This portfolio includes an AI assistant widget powered by Groq and called directly from the frontend.

### Setup

1. Create a free Groq API key from [Groq Console](https://console.groq.com).
2. Add the key to `.env`:

	```
	VITE_GROQ_API_KEY=your_key_here
	```

3. Restart the dev server.

### Production Safety

- Keep your Groq API key private and rotate it if exposed.
- Allow only your domains (for example: `anushkaisuranga.github.io`).
- Keep response usage within Groq free-tier limits.
