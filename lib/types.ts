export interface User {
  id: string;
  firstName: string;
  latName: string;
  email: string;
  // add other fields as needed
}

export type Transaction = {
  id: string;
  userId: string;
  plaidItemId: string;
  accountDbId: string;
  plaidId: string;
  name: string;
  amount: number;
  category?: string | null;
  date: Date;
};
