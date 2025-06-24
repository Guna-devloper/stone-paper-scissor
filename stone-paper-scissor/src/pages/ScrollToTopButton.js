import React, { useEffect, useState } from 'react';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="btn btn-dark position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 999 }}
      >
        ↑ Top
      </button>
    )
  );
}

export default ScrollToTopButton;
