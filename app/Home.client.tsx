"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./HomeClient.module.scss";

// components
import Square from "@/components/Square/Square";
import { group } from "console";

type SquareType = {
  id: number;
  value: number;
  connectionCnt: number;
  groupId: number;
};

export default function HomeClient() {
  const [squares, setSquares] = useState<SquareType[]>([]);
  const [updatedSquares, setUpdatedSquares] = useState<SquareType[]>([]);
  const [groupConnectionCount, setGroupConnectionCount] = useState<number[]>(
    []
  );

  const M = 6;

  // 1. 60% 확률로 1이 나오도록 초기화
  useEffect(() => {
    const newSquares = Array.from({ length: M * M }, (_, idx) => {
      return {
        id: idx,
        value: Math.random() > 0.6 ? 1 : 0, // 풍선이 있으면 1, 없으면 0
        connectionCnt: 0, // 연결된 풍선의 개수
        groupId: 0, // 연결된 풍선의 그룹 번호
      };
    });
    setSquares(newSquares);
  }, []);

  // 2. square가 완성되면 검색 실행 코드
  useEffect(() => {
    if (squares.length > 0) {
      const [data, groupConnCnt] = search();
      setUpdatedSquares(data as SquareType[]);

      // 큰값부터 정렬
      const count = groupConnCnt as number[];
      const reversed = count.sort((a, b) => b - a);

      setGroupConnectionCount(reversed);
    }
  }, [squares]);

  // 3. 경로 탐색 후 리턴
  /** 경로 탐색 순서
   * 좌우상하 탐색
   * 이전에 이동한 위치인지 검색한다 (막다른 길일경우 queue에서 제거)
   * 이동한다
   * 이동한 현재 위치를 저장한다
   * @return {copiedSquare: SquareType[]}
   */
  const search = () => {
    let copiedSquares = [...squares];
    // 일반적인 경로 탐색이 아닌 전체 탐색을 해야함
    // 갔던 경로를 모두 큐에 넣어 막혔을 경우 다음 경로로 넘어감
    let groupConnCnt = [];
    let groupId = 1;
    let hasAlreadyBeen = [-1]; // global 이동 경로

    for (const square of copiedSquares) {
      // 풍선이 있을 경우에만 탐색
      if (square.value === 1 && !hasAlreadyBeen.includes(square.id)) {
        hasAlreadyBeen.push(square.id);
        let movingPath = [square.id]; // queue
        const startPos = movingPath[0];
        const column = Math.floor(startPos / M);
        const scaledPos = startPos - column * M;

        let localPath = [square.id];

        while (movingPath.length > 0) {
          // 다음 위치를 찾는다 (좌->우->상->하)
          const left =
            scaledPos === 0 ? null : copiedSquares[movingPath[0] - 1];
          const right =
            scaledPos === M - 1 ? null : copiedSquares[movingPath[0] + 1];
          const top = copiedSquares[movingPath[0] - M];
          const bottom = copiedSquares[movingPath[0] + M];

          // 풍선이 있고 이전에 이동한 위치가 아니라면 이동하고 현재 위치 업데이트
          if (left && left.value === 1 && !hasAlreadyBeen.includes(left.id)) {
            movingPath.push(left.id);
            hasAlreadyBeen.push(left.id);
            localPath.push(left.id);
          } else if (
            right &&
            right.value === 1 &&
            !hasAlreadyBeen.includes(right.id)
          ) {
            movingPath.push(right.id);
            hasAlreadyBeen.push(right.id);
            localPath.push(right.id);
          } else if (
            top &&
            top.value === 1 &&
            !hasAlreadyBeen.includes(top.id)
          ) {
            movingPath.push(top.id);
            hasAlreadyBeen.push(top.id);
            localPath.push(top.id);
          } else if (
            bottom &&
            bottom.value === 1 &&
            !hasAlreadyBeen.includes(bottom.id)
          ) {
            movingPath.push(bottom.id);
            hasAlreadyBeen.push(bottom.id);
            localPath.push(bottom.id);
          } else {
            // queue에서 제거
            movingPath.shift();
          }
        }

        // 경로에서 이어졌던 풍선들을 그룹화
        for (const pos of localPath) {
          copiedSquares[pos].groupId = groupId;
        }
        const counts = copiedSquares.filter((square) => {
          return square.groupId === groupId;
        }).length;
        groupConnCnt.push(counts);
        groupId++;
      }
    }

    // 그룹화된 풍선들의 개수 세기
    return [copiedSquares, groupConnCnt];
  };

  const handleClick = (square: SquareType) => {
    const groupIdx = square.groupId;
    const filteredGroup = updatedSquares.filter((square) => {
      return square.groupId === groupIdx;
    });

    if (filteredGroup.length === groupConnectionCount[0]) {
      // setUpdatedSquares(restSquares);
      // setGroupConnectionCount(groupConnectionCount.slice(1));
    } else {
      // 패배 로직 해당 구역에 넣기
    }
  };

  return (
    <div className={styles.HomeClient}>
      <button onClick={() => console.log(updatedSquares)}>test</button>
      <div
        className={styles.squareBox}
        style={{
          gridTemplateColumns: `repeat(${M}, 1fr)`,
          gridTemplateRows: `repeat(${M}, 1fr)`,
        }}
      >
        {updatedSquares.length > 0
          ? updatedSquares.map((square, idx) => {
              return (
                <Square
                  key={square.id}
                  value={square.value}
                  connectionCnt={square.connectionCnt}
                  onClick={() => handleClick(square)}
                />
              );
            })
          : squares.map((square, idx) => {
              return (
                <Square
                  key={square.id}
                  value={square.value}
                  connectionCnt={square.connectionCnt}
                  onClick={() => {}}
                />
              );
            })}
      </div>
    </div>
  );
}
