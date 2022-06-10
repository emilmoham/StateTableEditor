import { useState } from 'react';

const defaultProps = {
  colSpan: 1,
};

function EditableCell(props: { value: string; colSpan?: number }) {
  const { value, colSpan } = props;
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  if (isInEditMode)
    return (
      <td colSpan={colSpan ?? 1}>
        <input
          className="edit"
          type="text"
          value={currentValue}
          onChange={(event) => {
            setCurrentValue(event.target.value);
          }}
          onBlur={() => {
            setIsInEditMode(false);
          }}
        />
      </td>
    );
  return (
    <td
      colSpan={colSpan ?? 1}
      onDoubleClick={() => {
        setIsInEditMode(true);
      }}
    >
      {currentValue}
    </td>
  );
}

EditableCell.defaultProps = defaultProps;

export default EditableCell;
