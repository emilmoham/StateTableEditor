import { useState } from 'react';

export default function EditableCell(props: { value: string }) {
  // const [isInEditMode, setIsInEditMode] = useState(false);
  const { value } = props;

  return <td>{value}</td>;
}
