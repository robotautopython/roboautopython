import { Instagram, MessageCircle } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="footer-credits">
      <div className="footer-content">
        <span className="footer-text">Criado por Israel Souza</span>
        <div className="footer-actions">
          <a 
            href="https://instagram.com/israelcmadf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://wa.me/5561996593376" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link whatsapp"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
