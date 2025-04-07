
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface IncomeConfettiProps {
  show: boolean;
  onComplete: () => void;
}

const IncomeConfetti = ({ show, onComplete }: IncomeConfettiProps) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (show) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={["#22c55e", "#4ade80", "#86efac", "#bbf7d0"]}
        tweenDuration={5000}
      />
    </div>
  );
};

export default IncomeConfetti;
