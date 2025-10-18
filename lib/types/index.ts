// Service types
export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
}

// Article types
export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorUsername?: string | null;
}

// Contact form types
export interface ContactFormData {
  name: string;
  phone?: string;
  email?: string;
  message: string;
}

// Telegram message types
export interface TelegramContactMessage {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  source: "website" | "callback";
  timestamp: string;
}
