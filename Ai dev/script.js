"use strict";

/*
  BUSINESS FAQ ASSISTANT
  Customize the business details and answers below.
  This starter version uses keyword matching, not generative AI.
*/

const BUSINESS = {
  name: "City Barber Shop",
  phone: "+92 300 1234567",
  address: "Main Market, Lahore, Pakistan",
  hours: "Monday to Saturday, 10 AM to 9 PM. Sunday: 12 PM to 6 PM.",
  services: [
    "Regular haircut",
    "Beard trim",
    "Haircut and beard combo",
    "Kids haircut"
  ],
  prices: {
    haircut: "Rs. 500",
    beard: "Rs. 300",
    combo: "Rs. 700",
    kids: "Rs. 400"
  },
  appointment:
    "Please call us to arrange an appointment. Walk-ins are welcome, subject to availability."
};

// Update the visible business name from the settings above.
document.getElementById("business-name").textContent = BUSINESS.name;
document.title = BUSINESS.name + " | FAQ Assistant";

const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

const faqs = [
  {
    keywords: ["hello", "hi", "hey", "salam", "assalam"],
    answer: () =>
      `Hello! 👋 Welcome to ${BUSINESS.name}. How can I help you today?`
  },
  {
    keywords: ["service", "services", "offer", "provide", "do you do"],
    answer: () =>
      `We offer:\n• ${BUSINESS.services.join("\n• ")}\n\nAsk me about prices for any service.`
  },
  {
    keywords: ["price", "prices", "cost", "rate", "charge", "how much", "fee"],
    answer: () =>
      `Here is our price list:\n• Haircut: ${BUSINESS.prices.haircut}\n• Beard trim: ${BUSINESS.prices.beard}\n• Haircut + beard: ${BUSINESS.prices.combo}\n• Kids haircut: ${BUSINESS.prices.kids}\n\nPlease confirm prices with the shop before visiting.`
  },
  {
    keywords: ["haircut", "hair cut", "cutting", "trim hair"],
    answer: () =>
      `Our regular haircut costs ${BUSINESS.prices.haircut}. Would you also like to know about our other services?`
  },
  {
    keywords: ["beard", "shave", "moustache", "mustache"],
    answer: () =>
      `Our beard trim costs ${BUSINESS.prices.beard}. The haircut and beard combo costs ${BUSINESS.prices.combo}.`
  },
  {
    keywords: ["kids", "kid", "child", "children"],
    answer: () =>
      `Our kids haircut costs ${BUSINESS.prices.kids}. Please contact us if you have a special request.`
  },
  {
    keywords: ["hour", "hours", "open", "opening", "close", "closing", "time", "when"],
    answer: () =>
      `Our opening hours are:\n${BUSINESS.hours}\n\nHours may change on holidays, so please confirm before visiting.`
  },
  {
    keywords: ["where", "location", "address", "located", "directions", "map"],
    answer: () =>
      `You can find us at ${BUSINESS.address}.\n\nPlease check your maps app for directions.`
  },
  {
    keywords: ["appointment", "book", "booking", "reserve", "reservation"],
    answer: () => BUSINESS.appointment
  },
  {
    keywords: ["phone", "number", "contact", "call", "whatsapp"],
    answer: () =>
      `You can contact us at ${BUSINESS.phone}.\n\nPlease verify this number before publishing the website.`
  },
  {
    keywords: ["payment", "pay", "cash", "card", "jazzcash", "easypaisa"],
    answer: () =>
      "Please contact the shop to confirm which payment methods are currently accepted."
  },
  {
    keywords: ["thank", "thanks", "jazak"],
    answer: () =>
      "You're welcome! 😊 Is there anything else you'd like to know?"
  }
];

// Convert text into a consistent format for matching.
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Match a question to the most relevant FAQ.
function getAnswer(question) {
  const normalizedQuestion = normalize(question);

  if (!normalizedQuestion) {
    return "Please type a question and I'll do my best to help.";
  }

  for (const faq of faqs) {
    const matched = faq.keywords.some((keyword) => {
      const normalizedKeyword = normalize(keyword);

      // Short keywords must match whole words, not word fragments.
      if (normalizedKeyword.length <= 3) {
        return normalizedQuestion
          .split(" ")
          .includes(normalizedKeyword);
      }

      return normalizedQuestion.includes(normalizedKeyword);
    });

    if (matched) {
      return faq.answer();
    }
  }

  return (
    "Sorry, I don't have an answer for that question yet. " +
    "Please contact the business directly at " +
    BUSINESS.phone +
    " so the team can help you."
  );
}

// Add a message safely as text, rather than inserting HTML.
function addMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}-row`;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "✦";
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = `message ${sender}-message`;
  bubble.appendChild(document.createTextNode(text));

  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  bubble.appendChild(document.createElement("br"));
  bubble.appendChild(time);
  row.appendChild(bubble);
  chat.appendChild(row);

  chat.scrollTop = chat.scrollHeight;
}

// Handle submitted questions.
function sendQuestion(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) return;

  addMessage(cleanQuestion, "user");
  addMessage(getAnswer(cleanQuestion), "bot");

  input.value = "";
  input.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuestion(input.value);
});

// Make the suggested-question buttons work.
document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    sendQuestion(button.dataset.question);
  });
});