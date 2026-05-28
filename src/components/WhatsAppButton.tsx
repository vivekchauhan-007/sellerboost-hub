import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%20SellerBoost%2C%20I%20want%20a%20free%20Flipkart%20account%20audit."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-[oklch(0.7_0.18_150)] text-white grid place-items-center shadow-elegant hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle className="size-7" />
      <span className="absolute inset-0 rounded-full bg-[oklch(0.7_0.18_150)] animate-ping opacity-20" />
    </a>
  );
}
