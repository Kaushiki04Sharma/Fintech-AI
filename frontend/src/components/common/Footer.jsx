import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark p-4 text-center">
    <p className="flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
      Made with <Heart size={16} className="text-red-500 mx-1" /> by FinWise Team
    </p>
  </footer>
);

export default Footer;
