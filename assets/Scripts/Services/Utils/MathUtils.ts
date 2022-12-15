export function roundToOneDecimal(num: number): number {
    return Math.round(num * 10) / 10;
}

export function randomPositiveOrNegative(): number {
    return Math.random() < 0.5 ? 1 : -1;
}

export function getDegreeAngleFromDirection(x: number, y: number): number {
    const radianAngle = Math.atan2(y, x);
    return (radianAngle / Math.PI) * 180;
}
