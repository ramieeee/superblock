import react, { useEffect } from "react";
import styles from "./Square.module.scss";
import Image from "next/image";
import Balloon from "@/assets/balloon.svg";

type SquareProps = {
  value: number;
  onClick: () => void;
  isError: boolean;
};

function Square({ value, onClick, isError }: SquareProps) {
  return (
    <div
      className={!isError ? styles.Square : styles.ErrorSquare}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "0.5px solid #000",
      }}
      onClick={onClick}
    >
      {value === 1 && (
        <Image src={Balloon} alt="Balloon" width={30} height={30} />
      )}
      {isError && <span>ouch!</span>}
    </div>
  );
}

// export default Square;
export default react.memo(Square);
