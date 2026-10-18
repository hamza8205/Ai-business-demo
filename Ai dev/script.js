
"use strict";

/*
  BUSINESS FAQ ASSISTANT
  Lightweight keyword-based FAQ bot.
  Customize the BUSINESS object for each client.
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

const businessName = document.getElementById("business-name");
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

if (!businessName || !chat || !form || !input) {
  throw new Error("Chat setup failed. Check the HTML element IDs.");
}

businessName.textContent = BUSINESS.name;
document.title = `${BUSINESS.name} | FAQ Assistant`;

const faqs = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "salam", "assalam", "good morning", "good evening"],
    answer: () =>
      `Hello! Welcome to ${BUSINESS.name}. How can I help you today?`
  },
  {
    id: "kids",
    keywords: [
      "kids haircut", "kid haircut", "children haircut",
      "child haircut", "haircut for kids", "haircut for children",
      "kids", "children", "child"
    ],
    answer: () =>
      `Our kids haircut costs ${BUSINESS.prices.kids}. Please contact us if you have a special request.`
  },
  {
    id: "combo",
    keywords: [
      "haircut and beard", "haircut beard combo",
      "beard and haircut", "combo price", "combo"
    ],
    answer: () =>
      `Our haircut and beard combo costs ${BUSINESS.prices.combo}.`
  },
  {
    id: "beard",
    keywords: [
      "beard trim", "trim beard", "beard price",
      "shave", "moustache", "mustache", "beard"
    ],
    answer: () =>
      `Our beard trim costs ${BUSINESS.prices.beard}. The haircut and beard combo costs ${BUSINESS.prices.combo}.`
  },
  {
    id: "haircut",
    keywords: [
      "regular haircut", "haircut price", "hair cut",
      "haircut", "hair cutting", "cutting hair", "trim hair"
    ],
    answer: () =>
      `Our regular haircut costs ${BUSINESS.prices.haircut}. Would you also like to know about our other services?`
  },
  {
    id: "prices",
    keywords: [
      "price", "prices", "cost", "how much",
      "rate", "rates", "charges", "fee", "price list"
    ],
    answer: () =>
      `Here is our price list:\n• Haircut: ${BUSINESS.prices.haircut}\n• Beard trim: ${BUSINESS.prices.beard}\n• Haircut + beard: ${BUSINESS.prices.combo}\n• Kids haircut: ${BUSINESS.prices.kids}\n\nPlease confirm prices with the shop before visiting.`
  },
  {
    id: "services",
    keywords: [
      "services", "what do you offer", "what do you provide",
      "what can you do", "service", "offer"
    ],
    answer: () =>
      `We offer:\n• ${BUSINESS.services.join("\n• ")}\n\nAsk me about the price of any service.`
  },
  {
    id: "hours",
    keywords: [
      "opening hours", "business hours", "what time",
      "when do you open", "when do you close",
      "open", "opening", "close", "closing", "hours", "timing"
    ],
    answer: () =>
      `Our opening hours are:\n${BUSINESS.hours}\n\nHours may change on holidays, so please confirm before visiting.`
  },
  {
    id: "location",
    keywords: [
      "where are you", "where is your shop", "location",
      "address", "directions", "map", "located"
    ],
    answer: () =>
      `You can find us at ${BUSINESS.address}.\n\nPlease check your maps app for directions.`
  },
  {
    id: "appointment",
    keywords: [
      "appointment", "book an appointment", "booking",
      "reserve", "reservation", "walk in", "walk-in"
    ],
    answer: () => BUSINESS.appointment
  },
  {
    id: "contact",
    keywords: [
      "phone number", "contact number", "telephone",
      "whatsapp", "call you", "phone", "contact", "number"
    ],
    answer: () =>
      `You can contact us at ${BUSINESS.phone}.\n\nPlease verify this number before publishing the website.`
  },
  {
    id: "payment",
    keywords: [
      "payment", "payment methods", "cash", "card",
      "jazzcash", "easypaisa", "pay"
    ],
    answer: () =>
      "Please contact the shop to confirm which payment methods are currently accepted."
  },
  {
    id: "thanks",
    keywords: ["thank you", "thanks", "jazak", "appreciate"],
    answer: () =>
      "You're welcome! Is there anything else you'd like to know?"
  },
  {
    id: "goodbye",
    keywords: ["goodbye", "bye", "see you", "allah hafiz"],
    answer: () =>
      `Thank you for visiting ${BUSINESS.name}. Have a great day!`
  }
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAnswer(question) {
  const normalizedQuestion = normalize(question);

  if (!normalizedQuestion) {
    return "Please type a question and I'll do my best to help.";
  }

  const words = normalizedQuestion.split(" ");

  // Score every FAQ instead of returning the first keyword match.
  const ranked = faqs.map((faq) => {
    let score = 0;

    for (const keyword of faq.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) continue;

      const matches = normalizedKeyword.includes(" ")
        ? normalizedQuestion.includes(normalizedKeyword)
        : normalizedKeyword.length <= 3
          ? words.includes(normalizedKeyword)
          : normalizedQuestion.includes(normalizedKeyword);

      if (matches) {
        // Specific phrases carry more weight than broad words.
        score += normalizedKeyword.includes(" ")
          ? 3 + normalizedKeyword.split(" ").length
          : 1;
      }
    }

    return { faq, score };
  });

  ranked.sort((a, b) => b.score - a.score);

  if (ranked[0].score > 0) {
    return ranked[0].faq.answer();
  }

  return (
    `I'm sorry, I don't have that information yet. ` +
    `You can contact ${BUSINESS.name} at ${BUSINESS.phone}, ` +
    `and the team will be happy to help.`
  );
}

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

  // Keep messages as plain text for safer display.
  bubble.appendChild(document.createTextNode(text));

  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  time.style.display = "block";
  time.style.marginTop = "6px";
  time.style.fontSize = "10px";
  time.style.opacity = "0.7";

  bubble.appendChild(time);
  row.appendChild(bubble);
  chat.appendChild(row);

  chat.scrollTop = chat.scrollHeight;
}

function sendQuestion(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    input.focus();
    return;
  }

  addMessage(cleanQuestion, "user");
  addMessage(getAnswer(cleanQuestion), "bot");

  input.value = "";
  input.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuestion(input.value);
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.question;
    if (question) sendQuestion(question);
  });
});
