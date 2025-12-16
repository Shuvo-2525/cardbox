export function generateWarrantyCode(): string {
    // Generates a code in format: CB-XXXX-XXXX (4-char segments for higher entropy)
    // Removed confusing characters: I, L, 1, O, 0
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    const segment = (length: number) =>
        Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");

    return `CB-${segment(4)}-${segment(4)}`;
}
