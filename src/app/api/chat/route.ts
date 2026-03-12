import { NextRequest, NextResponse } from "next/server";

// Rule-based chatbot engine (replaces Python chatbotAI which can't run serverless)
// Mirrors the logic from ahmadfaizalbh/Chatbot templates
const RESPONSES: Record<string, string[]> = {
  greet: [
    "Hello! How can I assist you today?",
    "Hi there! What's on your mind?",
    "Hey! Great to see you. How can I help?",
  ],
  fine: [
    "Nice to know that you are fine!",
    "That's wonderful to hear!",
    "Great! I'm doing well too.",
  ],
  name: [
    "I'm ChatBot AI, your intelligent conversation partner!",
    "You can call me ChatBot. I'm here to help!",
  ],
  thanks: [
    "You're welcome! Is there anything else I can help with?",
    "Happy to help! Anything else on your mind?",
    "My pleasure! Let me know if you need more assistance.",
  ],
  help: [
    "I can answer questions, have conversations, and assist you with information. What would you like to know?",
    "I'm here to chat and help! Ask me anything.",
  ],
  time: [
    `The current time is ${new Date().toLocaleTimeString()}.`,
    `It's ${new Date().toLocaleTimeString()} right now.`,
  ],
  date: [
    `Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
  ],
  joke: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the chatbot go to school? To improve its language model!",
    "What do you call a fake noodle? An impasta!",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
  ],
  weather: [
    "I don't have access to live weather data, but you can check weather.com or your local forecast!",
  ],
  bye: [
    "Goodbye! It was great talking to you. Come back anytime!",
    "See you later! Take care!",
    "Bye! Have a wonderful day!",
  ],
  default: [
    "That's interesting! Tell me more.",
    "I understand. Could you elaborate on that?",
    "Hmm, let me think about that. Can you rephrase or give me more context?",
    "I'm still learning! That's a great question. Could you be more specific?",
    "Interesting perspective! What else is on your mind?",
  ],
};

function getResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  if (/\b(hi|hello|hey|howdy|greetings|good morning|good evening|good afternoon)\b/.test(lower)) {
    return pick(RESPONSES.greet);
  }
  if (/\b(fine|good|great|awesome|wonderful|well|not bad|doing well)\b/.test(lower) && /\b(i('?m| am)|doing|feeling)\b/.test(lower)) {
    return pick(RESPONSES.fine);
  }
  if (/\b(your name|who are you|what are you|what('s| is) your name)\b/.test(lower)) {
    return pick(RESPONSES.name);
  }
  if (/\b(thank|thanks|thank you|thx|ty)\b/.test(lower)) {
    return pick(RESPONSES.thanks);
  }
  if (/\b(help|assist|support|what can you do)\b/.test(lower)) {
    return pick(RESPONSES.help);
  }
  if (/\b(time|what time|current time)\b/.test(lower)) {
    return pick(RESPONSES.time);
  }
  if (/\b(date|today|what day|day is it)\b/.test(lower)) {
    return pick(RESPONSES.date);
  }
  if (/\b(joke|funny|laugh|humor|make me laugh)\b/.test(lower)) {
    return pick(RESPONSES.joke);
  }
  if (/\b(weather|temperature|forecast|rain|sunny|cloudy)\b/.test(lower)) {
    return pick(RESPONSES.weather);
  }
  if (/\b(bye|goodbye|see you|later|farewell|quit|exit)\b/.test(lower)) {
    return pick(RESPONSES.bye);
  }

  return pick(RESPONSES.default);
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body as { message?: string };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "invalid_input", message: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "message_too_long", message: "Message must be under 1000 characters." },
        { status: 400 }
      );
    }

    // Simulate a slight processing delay for realism
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

    const reply = getResponse(message);

    return NextResponse.json({ reply }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
