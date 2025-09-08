# LockScreenr Pro 📱✨

**The Ultimate Customizable Lock Screen Simulator for UX Testing & Branding**

LockScreenr Pro is a powerful, web-based tool designed for UX designers, developers, and marketers to create hyper-realistic, interactive lock screen simulations. Test your app's notification appearance, experiment with branding on different devices, and validate user experience flows with advanced AI-powered tools.

![LockScreenr Pro Screenshot](https://picsum.photos/1200/600?data-ai-hint=interface%20screenshot)

---

## 🚀 About The Project

This application provides a "what you see is what you get" editor to build and customize lock screen appearances for various mobile operating systems and devices. From changing the wallpaper to adding dynamic notifications with AI-generated icons, LockScreenr Pro is your all-in-one solution for mobile UI/UX prototyping.

### Key Features:

*   📱 **Multi-Device Simulation**: Preview your designs on `iPhone`, `Pixel`, `Tablet`, and `Smartwatch` frames.
*   🎨 **Rich Customization**: Change wallpapers (image or color), fonts, and OS styles (`iOS`, `Android`, `WearOS`).
*   🔔 **Dynamic Notifications**: Add, remove, and customize notifications to simulate real-world scenarios.
*   🤖 **AI-Powered Features**:
    *   **App Icon Generation**: Describe an icon, and let AI create it for you on the fly.
    *   **Simulated Eye-Tracking**: Generate heatmaps to predict where users will focus on your lock screen.
*   🧪 **UX Testing Tools**: Place and visualize hotspots to map user interaction points.
*   🔒 **Security Simulation**: Test privacy with features like passcode locks and content blurring.
*   💾 **Import & Export**: Save your configurations as JSON files and load them back in later, making it easy to share and manage different setups.

### Built With

*   [Next.js](https://nextjs.org/) - React Framework
*   [React](https://reactjs.org/) - UI Library
*   [TypeScript](https://www.typescriptlang.org/) - Language
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
*   [ShadCN UI](https://ui.shadcn.com/) - Component Library
*   [Genkit (Firebase)](https://firebase.google.com/docs/genkit) - AI Integration Toolkit

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or newer recommended)
*   `npm` or `yarn` package manager

### Installation & Execution

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM Packages**
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**

    Create a `.env` file in the root of your project by making a copy of the existing `.env.example` file (if it exists) or creating a new one.

    ```sh
    cp .env.example .env
    ```
    
    Inside the `.env` file, you need to add your Generative AI API key.

    > ⚠️ **Important!**
    > The AI features of this application will **not** work without a valid API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```.env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the Development Server**

    The application requires two processes to run concurrently: the Next.js frontend and the Genkit AI backend.

    *   **Terminal 1: Run the Next.js App**
        ```sh
        npm run dev
        ```
        Your application will be available at `http://localhost:9002`.

    *   **Terminal 2: Run the Genkit AI Flows**
        ```sh
        npm run genkit:dev
        ```
        This starts the local Genkit development server, which the Next.js app communicates with for all AI-related tasks.

---

## ✍️ Author

*   **Name**: [YOUR_NAME_HERE]
*   **Portfolio/Link**: [YOUR_LINK_HERE]

---
