import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 50, className = "" }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(""); // limpiar al iniciar
    let index = 0;

    const timer = setInterval(() => {
      setDisplayText(prev => prev + text[index]);
      index++;
      if (index >= (text.length -1)) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer); // cleanup
  }, [text, speed]);

  return (
    <div style={{ whiteSpace: "pre-line" }}  // respeta saltos de línea
    >

    {displayText}

    </div>
  );
}
