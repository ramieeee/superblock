"use client";

import { useState, useEffect } from "react";
import styles from "./HomeClient.module.scss";

export default function HomeClient() {
  const M = 6;

  const [squares, setSquares] = useState(
    Array.from({ length: M * M }, () => "")
  );

  return (
    <div className={styles.HomeClient}>
      <h1>Home</h1>
      <p>Welcome to the home page.</p>
    </div>
  );
}
