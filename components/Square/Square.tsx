import styles from "./Square.module.scss";
import Image from "next/image";
import Balloon from "@/assets/balloon.svg";

type SquareProps = {
  value: number;
  connectionCnt: number;
  onClick: () => void;
};

export default function Square({ value, connectionCnt, onClick }: SquareProps) {
  return (
    <div
      className={styles.Square}
      style={{
        width: "30px",
        height: "30px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "1px solid #000",
      }}
      onClick={onClick}
    >
      {value === 1 ? (
        <Image src={Balloon} alt="Balloon" width={20} height={20} />
      ) : null}
    </div>
  );
}
