export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "Shipping" | "Products" | "Orders" | "Care";
}

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    category: "Products",
    question: "Are all items on Shreyank Creations truly handmade?",
    answer: "Yes, every product in our shop is individually made with care by skilled Indian artisans. Because of the handmade process, minor variations in tone and texture are natural characteristics that make each piece unique.",
  },
  {
    id: "faq-2",
    category: "Shipping",
    question: "How long does shipping take across India?",
    answer: "Orders are dispatched within 2 to 3 business days. Delivery typically takes 4 to 7 business days depending on your pin code location. Express delivery options can be arranged upon request.",
  },
  {
    id: "faq-3",
    category: "Shipping",
    question: "How are fragile items like pottery and brass packed?",
    answer: "Fragile pottery, marble, and artwork are secured in multi-layered protective foam, bubble wrapping, and reinforced corrugated boxes to ensure safe arrival.",
  },
  {
    id: "faq-4",
    category: "Care",
    question: "How should I clean brass and ceramic items?",
    answer: "For blue pottery and ceramics, dust with a soft microfiber cloth. For brass items, you may polish them using traditional brass cleaner or enjoy their natural warm patina over time.",
  },
  {
    id: "faq-5",
    category: "Orders",
    question: "What is your return policy for handmade goods?",
    answer: "We accept returns for items damaged during transit or incorrect shipments within 7 days of delivery. Please inspect your package upon receipt and reach out through our contact form.",
  },
];
