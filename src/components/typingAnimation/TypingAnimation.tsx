import { useEffect, useState } from 'react';

const TypingAnimation = () => {
  const messages = [
    "WELCOME TO CLASSERLY!",
    "SIGN IN TO CONTINUE..."
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true); // State for cursor visibility

  useEffect(() => {
    if (index < messages.length) {
      if (charIndex < messages[index].length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev + messages[index][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 100); // Adjust typing speed here
        return () => clearTimeout(timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          setDisplayedText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % messages.length); // Loop through messages
        }, 2000); // Time before starting next message
        return () => clearTimeout(timeoutId);
      }
    }

    // Cursor blinking effect
    const cursorBlinkId = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Adjust blink speed here

    return () => clearInterval(cursorBlinkId);
  }, [index, charIndex, messages]);

  return (
    <div style={{
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#697ac6',
      textAlign: 'center',
      fontSize: '2rem',
      zIndex: 10,
      fontWeight: 'normal'
    }}>
      {displayedText}
      {showCursor && <span style={{ fontWeight: 'normal' }}>|</span>} {/* Cursor */}
    </div>
  );
};

export default TypingAnimation;
