export function calculateInvoiceStatus(totalAmount: number, paymentReceived: number): 'paid' | 'amount due' {
  return paymentReceived >= totalAmount ? 'paid' : 'amount due';
}