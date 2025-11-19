import { useEffect } from 'react';

const SEO = ({ 
  title = "VynceAI - AI-Powered Browser Assistant | Voice Control & Smart Automation",
  description = "VynceAI is an intelligent Chrome extension with voice-activated control, lightning-fast automation, and AI-powered web assistance. Browse smarter with privacy-first design.",
  keywords = "VynceAI, vynce ai, AI browser assistant, voice control chrome extension, browser automation",
  image = "https://vynceai.imnitz.tech/og-image.png",
  url = "https://vynceai.imnitz.tech/"
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };
    
    // Update standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }, [title, description, keywords, image, url]);
  
  return null;
};

export default SEO;
