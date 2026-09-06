"use client";

import { createContext, useContext } from "react";
import type { PageBlock } from "@/types/company";

type EditorContextValue = {
  isEditing: boolean;
  onBlockChange: (block: PageBlock) => void;
};

export const EditorContext = createContext<EditorContextValue>({
  isEditing: false,
  onBlockChange: () => {},
});

export function useEditorContext() {
  return useContext(EditorContext);
}
