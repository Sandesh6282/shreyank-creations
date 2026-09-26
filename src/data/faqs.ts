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
    question: "Are all items on SHREYANK CREATION truly handmade?",
    answer: "Yes! All our bags, pouches, organizers, bookmarks, and accessories are handcrafted by hand with authentic care and attention to detail.",
  },
  {
    id: "faq-2",
    category: "Orders",
    question: "How do I place an order or enquire about products?",
    answer: "Click 'Buy on WhatsApp' on any product page or 'Enquire on WhatsApp' from your cart. This opens a direct WhatsApp conversation with us where we confirm product availability, delivery details, and final pricing.",
  },
  {
    id: "faq-3",
    category: "Products",
    question: "Can I discuss a custom order or personalized design?",
    answer: "Yes! Custom creations are available. You can click 'Discuss a Custom Order on WhatsApp' or message us directly with your specific preferences.",
  },
  {
    id: "faq-4",
    category: "Shipping",
    question: "Do you deliver across India?",
    answer: "Yes, delivery is available across India. Shipping fees and delivery address details are confirmed directly during your WhatsApp order conversation.",
  },
  {
    id: "faq-5",
    category: "Care",
    question: "How should I care for handmade fabric products?",
    answer: "We recommend gentle spot cleaning or mild hand washing for fabric pouches and bags to preserve their colors and stitching.",
  },
];
