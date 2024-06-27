"use client";

import { useState, useEffect } from "react";
import styles from "./HomeClient.module.scss";

// components
import Square from "@/components/Square/Square";

type SquareType = {
  value: number;
  connectionCnt: number;
};

export default function HomeClient() {
  const M = 6;

  // 60% 확률로 1이 나오도록 초기화
  const [squares, setSquares] = useState<SquareType[]>([]);

  useEffect(() => {
    const newSquares = Array.from({ length: M * M }, () => {
      return {
        value: Math.random() > 0.6 ? 1 : 0, // 풍선이 있으면 1, 없으면 0
        connectionCnt: 0, // 연결된 풍선의 개수
      };
    });
    setSquares(newSquares);
    // const ones = squares.filter((x) => x === 1).length;
    // const zeros = squares.filter((x) => x === 0).length;
    // console.log(ones, zeros);
  }, []);

  useEffect(() => {
    if (squares.length > 0) {
      console.log(squares);
    }
  }, [squares]);

  return (
    <div className={styles.HomeClient}>
      <div
        className={styles.squareBox}
        style={{
          gridTemplateColumns: `repeat(${M}, 1fr)`,
          gridTemplateRows: `repeat(${M}, 1fr)`,
        }}
      >
        {squares.map((square, idx) => {
          return (
            <Square
              key={idx}
              value={square.value}
              connectionCnt={square.connectionCnt}
              onClick={() => console.log("click")}
            />
          );
        })}
      </div>
    </div>
  );
}
