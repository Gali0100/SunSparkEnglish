/**
 * PayPal Checkout helper.
 * When PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are empty, runs in MOCK mode:
 * payments are treated as successful instantly (for local demos).
 *
 * TODO: Wire real PayPal Orders API when credentials are available.
 */

export function isPayPalMock() {
  const mode = (process.env.PAYPAL_MODE || "mock").toLowerCase();
  if (mode === "mock") return true;
  return !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET;
}

export async function createPayPalOrder(amountGtq: number, bookingId: string) {
  if (isPayPalMock()) {
    return {
      mock: true as const,
      orderId: `MOCK-${bookingId}`,
      approveUrl: null as string | null,
      amountGtq,
    };
  }

  // TODO: Implement PayPal Orders v2 create
  // const token = await getPayPalAccessToken();
  // POST https://api-m.paypal.com/v2/checkout/orders
  throw new Error(
    "PayPal live mode configured but Orders API not implemented yet. Set PAYPAL_MODE=mock or add API integration."
  );
}

export async function capturePayPalOrder(orderId: string) {
  if (isPayPalMock() || orderId.startsWith("MOCK-")) {
    return { mock: true as const, status: "COMPLETED" as const, orderId };
  }

  // TODO: Implement PayPal Orders v2 capture
  throw new Error("PayPal capture not implemented. Use MOCK mode for demo.");
}
