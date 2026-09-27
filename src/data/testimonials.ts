export interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  rating: number;
  comment: string;
  productName: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Sunita Deshmukh",
    city: "Pune",
    role: "Handcrafted Product Customer",
    rating: 5,
    comment: "The Big Size Shopping Bag surpassed my expectations. The stitching quality and sturdy handles make it so practical for daily use.",
    productName: "Big Size Shopping Bag",
  },
  {
    id: "test-2",
    name: "Vikram Sengupta",
    city: "Kolkata",
    role: "Gifting Customer",
    rating: 5,
    comment: "Shreyank Creations delivered the makeup box set with prompt care. The 6 pouches inside are so useful for organizing travel kits!",
    productName: "Makeup Box with 6 Pouches",
  },
  {
    id: "test-3",
    name: "Dr. Radhika Iyer",
    city: "Bengaluru",
    role: "Custom Order Customer",
    rating: 5,
    comment: "Prompt WhatsApp support and custom creation options. The fabric bookmark and pouch combo had delightful colors and handmade charm.",
    productName: "Bookmarker & Pouch Combo",
  },
];
