import "./FadeInTest.css";
export function FadeInText({ children }: { children: string }) {
  return (
    <div className="fade-in-text font-bold">
      {children.split("").map((char, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.005}s` }}>
          {char}
        </span>
      ))}
    </div>
  );
}
