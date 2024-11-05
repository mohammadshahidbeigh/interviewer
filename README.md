# AI Interview Practice Platform

An interactive web application that simulates job interviews using AI-powered voice conversations. Built with Next.js, this platform provides a realistic interview experience with real-time voice interaction and feedback.

## Features

- 🎙️ Voice-based interaction with AI interviewer
- 🤖 Natural language processing for dynamic responses
- ⏯️ Pause/Resume interview functionality
- 📊 Progress tracking through interview stages
- 🔄 Real-time feedback on responses
- 🎯 Customized follow-up questions
- 🛡️ Rate limiting protection for API endpoints

## Tech Stack

- **Framework**: Next.js 14
- **Frontend**: React, TailwindCSS
- **AI Services**:
  - OpenAI GPT-3.5 (you can change it to GPT-4) for interview logic
  - Deepgram for Speech-to-Text and Text-to-Speech
- **State Management**: React Context
- **API Protection**: In-memory rate limiting
- **Styling**: TailwindCSS with custom animations

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-interview-platform.git
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following:

   ```env
   OPENAI_API_KEY=your_openai_key
   DEEPGRAM_API_KEY=your_deepgram_key

   # Rate limiting configuration
   RATE_LIMIT_POINTS=10
   RATE_LIMIT_DURATION=1
   RATE_LIMIT_BLOCK_DURATION=60
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Rate Limiting

The application implements rate limiting to protect API endpoints:

- Default limit: 10 requests per second per client
- Block duration: 60 seconds when limit is exceeded
- Tracked by client IP address
- Applies to all API endpoints:
  - Speech-to-Text conversion
  - LLM response generation
  - Text-to-Speech synthesis

## Environment Variables

| Variable                    | Description                                   | Default  |
| --------------------------- | --------------------------------------------- | -------- |
| `OPENAI_API_KEY`            | OpenAI API key for LLM responses              | Required |
| `DEEPGRAM_API_KEY`          | Deepgram API key for voice features           | Required |
| `RATE_LIMIT_POINTS`         | Number of requests allowed per duration       | 10       |
| `RATE_LIMIT_DURATION`       | Time window in seconds                        | 1        |
| `RATE_LIMIT_BLOCK_DURATION` | Block duration in seconds when limit exceeded | 60       |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```
