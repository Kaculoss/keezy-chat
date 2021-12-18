import React from "react";

export const PromptModal = ({
  setStateText,
  stateText,
  handleConfirm,
  handleReject,
  handleCancel,
  confirmText,
  rejectText,
  title,
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
      <div className="modalContainer promptContainer">
        <div className="modal-titleCloseBtn">
          <button onClick={handleCancel}>X</button>
        </div>
        <div className="modal-title">
          <p>{title}</p>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="type the space name here"
            value={stateText?.text}
            onChange={(e) => {
              setStateText({ ...stateText, text: e.target.value });
            }}
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleReject || handleCancel} id="modal-cancelBtn">
            {rejectText || "Cancel"}
          </button>
          <button onClick={handleConfirm}>{confirmText || "Ok"}</button>
        </div>
      </div>
    </div>
  );
};
