/** Eine Position im Warenkorb. Es werden nur IDs und Mengen gespeichert – nie Preise. */
export interface CartLine {
  productId: string;
  /** optionId → valueId */
  options: Record<string, string>;
  quantity: number;
}

export type CartIssueCode =
  | "unknown_product"
  | "unknown_option"
  | "unknown_option_value"
  | "option_unavailable"
  | "invalid_quantity"
  | "quantity_reduced";

export interface CartIssue {
  code: CartIssueCode;
  productId: string;
  message: string;
}
