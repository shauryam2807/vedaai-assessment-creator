import { Minus, Plus } from "lucide-react";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function CounterInput({ value, onChange, min = 1, max = 100 }: CounterInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="counter-wrapper">
      <button 
        type="button" 
        className="counter-btn" 
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Minus size={14} />
      </button>
      
      <span className="counter-value">{value}</span>
      
      <button 
        type="button" 
        className="counter-btn" 
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Plus size={14} />
      </button>

      <style jsx>{`
        .counter-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-white);
          border: 1px solid var(--border-input);
          border-radius: var(--radius-full);
          padding: 0.25rem;
          width: 100px;
        }

        .counter-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background-color: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        .counter-btn:hover:not(:disabled) {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .counter-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .counter-value {
          font-weight: 600;
          font-size: 0.9rem;
          min-width: 20px;
          text-align: center;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
