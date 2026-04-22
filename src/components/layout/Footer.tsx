import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Share2, Info, Book, BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-foreground py-16 px-6 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center group">
            <div className="flex items-baseline font-serif tracking-tight transition-all duration-500 group-hover:scale-105">
              <span className="text-4xl font-black text-primary transition-colors duration-500 group-hover:text-accent">Buy</span>
              <span className="text-4xl font-light italic text-accent -ml-0.5 transition-all duration-500 group-hover:ml-1">Bookz</span>
              <span className="text-5xl font-black text-accent ml-0.5">.</span>
            </div>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Discover your next favorite story at BuyBookz. Your premium destination for curated literature and worldwide bestsellers.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-accent transition-colors flex items-center space-x-1">
              <Share2 size={18} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Connect</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/shop" className="hover:text-accent transition-colors">Shop All Books</Link></li>
            <li><Link href="/favorites" className="hover:text-accent transition-colors">Favorites</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-6">Information</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Refund & Returns</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-6">Get in Touch</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-accent" />
              <span>support@buybookz.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-accent" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-3">
              <MapPin size={18} className="text-accent" />
              <span>123 Book Lane, Literature City</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        <p>© 2024 BuyBookz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
