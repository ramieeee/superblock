"use client";

import { useState, useEffect } from "react";
import styles from "./HomeClient.module.scss";

// components
import Square from "@/components/Square/Square";
import Modal from "@/components/Modal/Modal";

type SquareType = {
  id: number;
  value: number;
  groupId: number;
};

export default function HomeClient() {
  const [updatedSquares, setUpdatedSquares] = useState<SquareType[]>([]);
  const [groupConnectionCount, setGroupConnectionCount] = useState<number[]>([
    0,
  ]);

  const [isOver, setIsOver] = useState(false);
  const [message, setMessage] = useState("Game Over");
  const [errorSquare, setErrorSquare] = useState<number>();

  const M = 6;

  useEffect(() => {
    generateSquares();
  }, []);

  const generateSquares = () => {
    // 1. 초기 실행
    // 60% 확률로 1이 나오도록 박스 초기화
    const squares: SquareType[] = Array.from({ length: M * M }, (_, idx) => {
      return {
        id: idx,
        value: Math.random() > 0.6 ? 1 : 0, // 풍선이 있으면 1, 없으면 0
        groupId: 0, // 연결된 풍선의 그룹 번호
      };
    });

    // 2. square가 완성되면 검색 실행 코드
    const [data, groupConnCnt] = search(squares);
    setUpdatedSquares(data as SquareType[]);

    // 큰값부터 정렬
    const count = groupConnCnt as number[];
    const reversed = count.sort((a, b) => b - a);

    setGroupConnectionCount(reversed);
  };

  /** 경로 탐색 순서 (BFS)
   * 좌우상하 탐색
   * 이전에 이동한 위치인지 검색한다 (막다른 길일경우 queue에서 제거)
   * 이동할 수 있는 위치 검색 후 queue에 저장
   * @param squares: SquareType[]
   * @return copiedSquares, connCnt: SquareType[], number[]]
   */
  const search = (squares: SquareType[]) => {
    let copiedSquares = [...squares];
    // 일반적인 경로 탐색이 아닌 전체 탐색을 해야함
    // 갔던 경로를 모두 큐에 넣어 막혔을 경우 다음 경로로 넘어감
    let connCnt = [];
    let groupId = 1;
    let hasAlreadyBeen = [-1]; // global 이동 경로

    for (const square of copiedSquares) {
      // 풍선이 있고 해당 경로를 처음으로 온 경우에만 실행
      if (square.value === 1 && !hasAlreadyBeen.includes(square.id)) {
        hasAlreadyBeen.push(square.id);
        let movingPath = [square.id]; // queue
        let localPath = [square.id]; // 그룹화를 위해 따로 선언.queue는 사라지고 hasAlreadyBeen은 global하기 때문

        // queue가 모두 없어질때까지 전체 탐색
        while (movingPath.length > 0) {
          // 현재 위치에서 좌표를 찾는다. 좌우가 막다른 길인것을 계산하기 위해
          // scale을 column 수 만큼 줄여준다(scaledPos)
          const startPos = movingPath[0];
          const column = Math.floor(startPos / M);
          const scaledPos = startPos - column * M;

          // 다음 위치를 찾는다 (좌->우->상->하)
          const left = scaledPos === 0 ? null : copiedSquares[startPos - 1];
          const right =
            scaledPos === M - 1 ? null : copiedSquares[startPos + 1];
          const top = copiedSquares[startPos - M];
          const bottom = copiedSquares[startPos + M];

          // 풍선이 있고 막혀있지 않은 경로 필터링
          const validDirection = [left, right, top, bottom].filter((square) => {
            return square && square.value === 1;
          });

          // 막혀있지 않고 이미 지나온 경로가 아니면 queue에 추가
          validDirection.forEach((square) => {
            if (square && !hasAlreadyBeen.includes(square.id)) {
              movingPath.push(square.id);
              hasAlreadyBeen.push(square.id);
              localPath.push(square.id);
            }
          });

          // queue에서 하나씩 제거하며 queue가 없어질때가지 위의 로직을 반복
          movingPath.shift();
        }

        // 경로에서 이어졌던 풍선들을 그룹화
        for (const pos of localPath) {
          copiedSquares[pos].groupId = groupId;
        }

        // 그룹화된 풍선들의 개수 파악
        const counts = copiedSquares.filter((square) => {
          return square.groupId === groupId;
        }).length;
        connCnt.push(counts);
        groupId++;
      }
    }

    return [copiedSquares, connCnt];
  };

  /** square를 클릭 시 실행 로직
   * @param square: SquareType
   * @returns void
   */
  const handleClick = (square: SquareType) => {
    // 게임 끝난 경우 무효화
    if (isOver) return;
    // 풍선이 없는 경우 0.5초 동안 에러 표시만 하고 리턴
    else if (square.value === 0) {
      setErrorSquare(square.id);
      setTimeout(() => {
        setErrorSquare(undefined);
      }, 500);
      return;
    }

    // 클릭한 square의 그룹 번호를 찾고
    const groupIdx = square.groupId;
    const filteredGroup = updatedSquares.filter((square) => {
      return square.groupId === groupIdx;
    });
    // 그룹 번호의 수와 가장 많은 숫자가 같으면 해당 그룹 square의 value를 0으로 변경(풍선 제거)
    if (filteredGroup.length === groupConnectionCount[0]) {
      const copiedSquares = [...updatedSquares];
      for (const square of copiedSquares) {
        if (square.groupId === groupIdx) {
          square.value = 0;
        }
      }
      setUpdatedSquares(copiedSquares);
      setGroupConnectionCount(groupConnectionCount.slice(1));
    }
    // 순서가 맞지 않을 경우 패배
    else {
      setIsOver(true);
      setMessage("Game Over");
    }
  };

  const handleTryAgain = () => {
    setIsOver(false);
    generateSquares();
  };

  // 게임을 성공적으로 끝낸 경우 실행 로직
  useEffect(() => {
    if (groupConnectionCount.length === 0) {
      setMessage("Winner!");
      setIsOver(true);
    }
  }, [groupConnectionCount]);

  return (
    <div className={styles.HomeClient}>
      <div
        className={styles.squareBox}
        style={{
          gridTemplateColumns: `repeat(${M}, 1fr)`,
          gridTemplateRows: `repeat(${M}, 1fr)`,
        }}
      >
        {updatedSquares.map((square) => {
          return (
            <Square
              key={square.id}
              value={square.value}
              onClick={() => handleClick(square)}
              isError={errorSquare === square.id}
            />
          );
        })}
      </div>
      <Modal title={message} isOver={isOver} onClick={handleTryAgain} />
    </div>
  );
}
