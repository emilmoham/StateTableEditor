import { useState } from 'react';

export default function EditableCell(props: { value: string }) {
  const { value } = props;
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  if (isInEditMode)
    return (
      <td>
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
      onDoubleClick={() => {
        setIsInEditMode(true);
      }}
    >
      {currentValue}
    </td>
  );
}
