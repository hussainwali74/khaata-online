/**
 * Calculates the status of an invoice based on the total amount, payment received, and due date.
 * 
 * @param totalAmount - The total amount of the invoice.
 * @param paymentReceived - The amount of payment received for the invoice.
 * @param dueDate - The due date of the invoice.
 * @returns The status of the invoice: 'paid', 'overdue', or 'pending'.
 * 
 * @description
 * This function determines the status of an invoice using the following logic:
 * - If the payment received is greater than or equal to the total amount, the status is 'paid'.
 * - If the current date is past the due date and the invoice is not fully paid, the status is 'overdue'.
 * - Otherwise, the status is 'pending'.
 * 
 * Note: The function compares dates at midnight to ensure accurate day-level comparison.
 */
export function calculateInvoiceStatus(totalAmount: number, paymentReceived: number, dueDate: Date): 'paid' | 'overdue' | 'pending' {
  if (paymentReceived >= totalAmount) {
    return 'paid';
  }

  // Ensure both dates are set to midnight for accurate comparison
  const dueDateMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  if (todayMidnight > dueDateMidnight) {
    return 'overdue';
  }
  return 'pending';
}