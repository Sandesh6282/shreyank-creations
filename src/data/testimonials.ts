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
    role: "Interior Decor Enthusiast",
    rating: 5,
    comment: "The Jharokha frame surpassed my expectations. The wood texture and carving feel so genuine and earthy.",
    productName: "Rajasthani Wooden Jharokha Mirror Frame",
  },
  {
    id: "test-2",
    name: "Vikram Sengupta",
    city: "Kolkata",
    role: "Art Collector",
    rating: 5,
    comment: "Shreyank Creations delivers handcrafted pieces with great packing care. The Dhokra musician set is a true focal point in our living room.",
    productName: "Dhokra Tribal Brass Musician Figures",
  },
  {
    id: "test-3",
    name: "Dr. Radhika Iyer",
    city: "Bengaluru",
    role: "Homeowner",
    rating: 5,
    comment: "Thoughtfully packaged and prompt customer support. The Jaipur Blue Pottery vase has such delightful color saturation!",
    productName: "Jaipur Blue Pottery Floral Vase",
  },
];
