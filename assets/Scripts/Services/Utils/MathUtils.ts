export function roundToOneDecimal(num: number): number {
    return Math.round(num * 10) / 10;
}

export function randomPositiveOrNegative(): number {
    return Math.random() < 0.5 ? 1 : -1;
}
