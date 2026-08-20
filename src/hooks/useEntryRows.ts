import { useReducer } from 'react';
import { EditableEntry } from '@/lib/schemas/session';

enum RowActionType {
  SET,
  UPDATE,
  DELETE,
  ADD,
}

type RowAction =
  | { type: RowActionType.SET; rows: EditableEntry[] }
  | { type: RowActionType.UPDATE; id: string; patch: Partial<EditableEntry> }
  | { type: RowActionType.DELETE; id: string }
  | { type: RowActionType.ADD };

const getEmptyRow = (): EditableEntry => ({
  id: crypto.randomUUID(),
  instrument: null,
  focus: [],
  selfRating: null,
  durationMin: null,
});

const rowReducer = (
  state: EditableEntry[],
  action: RowAction
): EditableEntry[] => {
  switch (action.type) {
    case RowActionType.SET:
      return action.rows.length ? action.rows : [];
    case RowActionType.UPDATE:
      return state.map(r =>
        r.id === action.id ? { ...r, ...action.patch } : r
      );
    case RowActionType.DELETE:
      return state.length <= 1 ? state : state.filter(r => r.id !== action.id);
    case RowActionType.ADD:
      return [...state, getEmptyRow()];
  }
};

export function useEntryRows(initial: EditableEntry[] = []) {
  const [rows, dispatch] = useReducer(rowReducer, initial);

  return {
    rows,
    setRows: (rows: EditableEntry[]) =>
      dispatch({ type: RowActionType.SET, rows }),
    updateRow: (id: string, patch: Partial<EditableEntry>) =>
      dispatch({ type: RowActionType.UPDATE, id, patch }),
    removeRow: (id: string) => dispatch({ type: RowActionType.DELETE, id }),
    addRow: () => dispatch({ type: RowActionType.ADD }),
  };
}
