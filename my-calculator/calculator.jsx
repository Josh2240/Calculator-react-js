import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const compute = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = compute(prevValue, inputValue, operator);
      setDisplay(String(Number.isNaN(result) ? "Error" : trimResult(result)));
      setPrevValue(Number.isNaN(result) ? null : result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const trimResult = (num) => {
    const rounded = Math.round(num * 1e10) / 1e10;
    return rounded;
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator === null || prevValue === null) return;
    const result = compute(prevValue, inputValue, operator);
    setDisplay(String(Number.isNaN(result) ? "Error" : trimResult(result)));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const fontSize = display.length > 8 ? "36px" : display.length > 6 ? "48px" : "64px";

  const keyBase = {
    border: "none",
    fontSize: "26px",
    fontWeight: 500,
    borderRadius: "999px",
    height: "70px",
    cursor: "pointer",
    transition: "filter 0.1s ease, transform 0.05s ease",
    fontFamily: "'Söhne', 'Helvetica Neue', Arial, sans-serif",
  };

  const numKey = {
    ...keyBase,
    backgroundColor: "#3a3a3c",
    color: "#f5f5f0",
  };

  const funcKey = {
    ...keyBase,
    backgroundColor: "#a5a29a",
    color: "#1c1c1a",
  };

  const opKey = (active) => ({
    ...keyBase,
    backgroundColor: active ? "#f5f5f0" : "#c96f42",
    color: active ? "#c96f42" : "#f5f5f0",
  });

  const press = (e) => (e.currentTarget.style.filter = "brightness(1.2)");
  const unpress = (e) => (e.currentTarget.style.filter = "none");

  const Button = ({ label, style, onClick, wide }) => (
    <button
      onMouseDown={press}
      onMouseUp={unpress}
      onMouseLeave={unpress}
      onClick={onClick}
      style={{
        ...style,
        gridColumn: wide ? "span 2" : "span 1",
        textAlign: wide ? "left" : "center",
        paddingLeft: wide ? "28px" : 0,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        width: "320px",
        margin: "0 auto",
        backgroundColor: "#1c1c1a",
        borderRadius: "36px",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "'Söhne', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          minHeight: "110px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "0 12px 12px",
          color: "#f5f5f0",
          fontSize,
          fontWeight: 300,
          wordBreak: "break-all",
          textAlign: "right",
          lineHeight: 1,
        }}
      >
        {display}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Button label="AC" style={funcKey} onClick={clearAll} />
        <Button label="+/−" style={funcKey} onClick={toggleSign} />
        <Button label="%" style={funcKey} onClick={inputPercent} />
        <Button label="÷" style={opKey(operator === "÷")} onClick={() => performOperation("÷")} />

        <Button label="7" style={numKey} onClick={() => inputDigit(7)} />
        <Button label="8" style={numKey} onClick={() => inputDigit(8)} />
        <Button label="9" style={numKey} onClick={() => inputDigit(9)} />
        <Button label="×" style={opKey(operator === "×")} onClick={() => performOperation("×")} />

        <Button label="4" style={numKey} onClick={() => inputDigit(4)} />
        <Button label="5" style={numKey} onClick={() => inputDigit(5)} />
        <Button label="6" style={numKey} onClick={() => inputDigit(6)} />
        <Button label="−" style={opKey(operator === "−")} onClick={() => performOperation("−")} />

        <Button label="1" style={numKey} onClick={() => inputDigit(1)} />
        <Button label="2" style={numKey} onClick={() => inputDigit(2)} />
        <Button label="3" style={numKey} onClick={() => inputDigit(3)} />
        <Button label="+" style={opKey(operator === "+")} onClick={() => performOperation("+")} />

        <Button label="0" style={numKey} onClick={() => inputDigit(0)} wide />
        <Button label="." style={numKey} onClick={inputDecimal} />
        <Button label="=" style={opKey(false)} onClick={handleEquals} />
      </div>
    </div>
  );
}
