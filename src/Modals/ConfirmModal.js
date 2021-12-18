import React from "react";

export const ConfirmModal = ({
  handleConfirm,
  handleCancel,
  handleReject,
  title,
  confirmText,
  rejectText,
}) => {
  const handleClickAnywhereElse = (e) => {
    if (e.target.id === "modal") {
      handleCancel();
    }
  };

  return (
    <div
      id="modal"
      className="modalBackground"
      onClick={handleClickAnywhereElse}
    >
      <div className="modalContainer confirmContainer">
        <div className="modal-titleCloseBtn">
          <button onClick={handleCancel}>X</button>
        </div>
        <div className="modal-title">
          <p>{title || "Are You Sure You Want To Continue?"}</p>
        </div>
        <div className="modal-footer">
          <button onClick={handleReject || handleCancel} id="modal-cancelBtn">
            {rejectText || "No, cancel"}
          </button>
          <button onClick={handleConfirm}>
            {confirmText || "Yes, continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
