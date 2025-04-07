
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
      }, 3000); // Augmenté pour être sûr que l'animation se termine correctement
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <Confetti
        width={width || window.innerWidth}
        height={height || window.innerHeight}
        recycle={false}
        numberOfPieces={100} // Réduit pour optimiser les performances sur mobile
        gravity={0.25}
        colors={["#22c55e", "#4ade80", "#86efac", "#bbf7d0"]}
        tweenDuration={5000}
        confettiSource={{
          x: width ? width / 2 : window.innerWidth / 2,
          y: height ? height / 2 : window.innerHeight / 2,
          w: 0,
          h: 0
        }}
      />
    </div>
  );
};

export default IncomeConfetti;
