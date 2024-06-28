type ModalProps = {
  title: string;
  isOver: boolean;
  onClick: () => void;
};

export default function Modal({ title, isOver, onClick }: ModalProps) {
  return (
    <>
      {isOver && (
        <div
          style={{
            position: "absolute",
            width: "190px",
            height: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 0 0 130vw rgba(0, 0, 0, 0.5)",
          }}
        >
          <span>{title}</span>
          <div
            style={{
              cursor: "pointer",
              backgroundColor: "#000",
              width: "100px",
              height: "30px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
            }}
            onClick={onClick}
          >
            <span>Try again?</span>
          </div>
        </div>
      )}
    </>
  );
}
