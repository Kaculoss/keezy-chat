import React, { useState } from "react";

export const CheckListModal = ({
  title,
  checkList,
  emptyListText,
  handleConfirm,
  handleReject,
  handleCancel,
  confirmText,
  rejectText,
}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(checkList?.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    let modalList = [];
    updatedCheckedState.forEach((item, index) => {
      if (item) {
        modalList.push({
          name: checkList[index].name,
          id: checkList[index].id,
          photoURL: checkList[index].photoURL,
        });
      }
    });
    setCheckedItems(modalList);
  };

  const handleOk = () => {
    if (checkedItems.length !== 0) {
      handleConfirm(checkedItems);
    } else {
      handleConfirm(null);
    }
  };

  const handleClickAnywhereElse = (e) => {
    if (e.target.id === "modal") {
      handleCancel();
    }
  };

  let count = 0;
  return (
    <div
      id="modal"
      className="modalBackground"
      onClick={handleClickAnywhereElse}
    >
      <div className="modalContainer checkListContainer">
        <div className="modal-titleCloseBtn">
          <button onClick={handleCancel}>X</button>
        </div>
        <div className="modal-title">
          <p>{title}</p>
        </div>
        <div className="modal-body">
          <div className="modal-body-checklist">
            {checkList?.length !== 0 ? (
              <div className="modal-checklist">
                {checkList?.map((item, index) => {
                  const { name, id, photoURL } = item;
                  const modalShade =
                    count % 2 !== 0 ? "no-modal-shade" : "modal-shade";
                  count += 1;
                  return (
                    <div key={id} className={`modal-item ${modalShade}`}>
                      <label htmlFor={`modal-checkbox-${index}`}>
                        <div className="modal-name-pic-div">
                          <img src={photoURL} alt="friend-face" />
                          <p>{name}</p>
                        </div>
                      </label>
                      <input
                        type="checkbox"
                        name={name}
                        id={`modal-checkbox-${index}`}
                        value={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-modal-results">
                <p>{emptyListText || "Empty List"}</p>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleReject || handleCancel} id="modal-cancelBtn">
            {rejectText || "Cancel"}
          </button>
          <button onClick={handleOk} disabled={checkList.length === 0}>
            {confirmText || "Ok"}
          </button>
        </div>
      </div>
    </div>
  );
};
