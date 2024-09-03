export type OasisResponse<T = undefined> = T extends undefined
  ? { success: boolean; message: string }
  : { success: boolean; message: string; data: T };
