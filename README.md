# Manobodha 🧠

### Explore Psychology. Understand the Mind.

**Manobodha** is an interactive educational platform designed to make psychological theories easier to understand through exploration, experimentation, visualization, and interactive learning.

Instead of simply reading about psychology, users can explore how psychological concepts work, experiment with variables, observe outcomes, and develop a deeper understanding of the human mind.

🌐 **Live Website:** https://manobodha.vercel.app/

---

## About the Project

Psychology is often taught through definitions, concepts, and theoretical explanations. While these provide a foundation, they can sometimes make abstract psychological processes difficult to visualize or understand.

Manobodha aims to bridge this gap by transforming psychological theories into interactive experiences.

Users can explore theories, interact with simulations, compare psychological concepts, test their understanding, and visualize connections between ideas.

The platform is designed to encourage **active learning, curiosity, experimentation, and conceptual understanding**.

---

## Features

### Interactive Psychology Sandbox

Explore psychological theories through interactive simulations that allow users to manipulate variables and observe how different factors influence outcomes.

Currently featured theories include:

- **Operant Conditioning** — Explore how reinforcement, punishment, and behavioral consequences influence behavior.
- **Forgetting Curve** — Understand how memory retention changes over time and how learning and review influence retention.

### Explore Psychology

Discover psychological theories and concepts through an organized exploration interface designed to make psychology accessible and engaging.

### Theory Comparison

Compare psychological theories side by side to understand their similarities, differences, key concepts, and applications.

### Interactive Mind Map

Explore connections between psychological theories and concepts through an interconnected visual mind map.

### Learning and Knowledge Checks

Engage with quizzes and knowledge checks designed to reinforce understanding of psychological concepts.

### User Accounts

Manobodha includes user authentication and account functionality to support personalized experiences.

---

## Technology Stack

### Frontend

- **SvelteKit**
- **Svelte 5**
- **TypeScript**
- **Tailwind CSS**
- **shadcn-svelte**
- **Lucide Icons**

### Visualization & Simulation

- **Chart.js**
- Custom TypeScript simulation logic
- Interactive data visualization

### Backend

- SvelteKit server-side functionality
- Node.js
- MySQL-compatible database
- `mysql2`

### Database

- **TiDB Cloud**
- MySQL-compatible relational database

### Deployment

- **Vercel**
- GitHub for version control and source code management

---

## Project Structure

```text
Manobodha/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── server/
│   │   └── ...
│   ├── routes/
│   │   ├── sandbox/
│   │   ├── explore/
│   │   ├── compare/
│   │   ├── map/
│   │   ├── quiz/
│   │   ├── login/
│   │   ├── register/
│   │   ├── profile/
│   │   └── ...
│   └── ...
├── static/
├── package.json
├── vite.config.ts
├── svelte.config.js
└── README.md
```

*The structure above is simplified to highlight the major areas of the application.*

---

## Getting Started

Follow these instructions to run Manobodha locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/srj-145/Manobodha.git
```

### 2. Navigate into the project

```bash
cd Manobodha
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory of the project.

Add the following variables:

```env
MYSQL_HOST=your-database-host
MYSQL_PORT=4000
MYSQL_USER=your-database-username
MYSQL_PASSWORD=your-database-password
MYSQL_DATABASE=manobodha_db
MYSQL_SSL=true
```

Replace the placeholder values with your database credentials.

**Important:** Never commit your `.env` file or expose database credentials publicly.

### 5. Run the development server

```bash
npm run dev
```

Open the local development URL provided in your terminal, usually:

```text
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the project for production |
| `npm run check` | Runs Svelte and TypeScript diagnostics |
| `npm run preview` | Previews the production build locally |

---

## Database

Manobodha uses a MySQL-compatible database hosted on TiDB Cloud.

The database supports application functionality such as:

- User accounts
- User profiles
- Sessions
- Theory interaction sessions
- Concept check results
- Confidence ratings
- Interaction events

Database credentials are configured through environment variables.

---

## Deployment

Manobodha is deployed using **Vercel** and connected to GitHub for automated deployments.

### Deployment workflow

```text
Local Development
       ↓
   Git Commit
       ↓
   GitHub Push
       ↓
 Vercel Deployment
       ↓
  Live Application
```

Changes pushed to the connected GitHub repository can trigger automatic deployments through Vercel.

### Production

🌐 **Visit Manobodha:** https://manobodha.vercel.app/

---

## Project Goals

Manobodha aims to:

- Make psychological theories easier to understand.
- Encourage active rather than passive learning.
- Make abstract psychological concepts more visual and interactive.
- Encourage experimentation and curiosity.
- Help learners connect psychological theories.
- Support conceptual understanding through simulations and knowledge checks.

---

## Future Scope

Potential future improvements include:

- Expanding the collection of interactive psychological theories.
- Adding more simulations.
- Enhancing theory comparison.
- Expanding the interactive mind map.
- Improving personalization and learning experiences.
- Adding more knowledge checks and learning activities.
- Further improving accessibility and responsive design.

---

## Contributing

Manobodha is an educational project developed as part of a student capstone project.

Suggestions, feedback, bug reports, and ideas for improvement are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

---

## Acknowledgements

Developed as a student capstone project exploring the intersection of **psychology, interactive learning, and technology**.

---

## License

This project is currently developed for educational and academic purposes.

---

**Manobodha — Explore Psychology Beyond the Textbook.** 🧠
