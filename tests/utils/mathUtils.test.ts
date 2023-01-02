import { getDegreeAngleFromDirection } from "../../assets/Scripts/Services/Utils/MathUtils";

const testCases: { x: number; y: number; expectedAngle: number }[] = [
    { x: 0.5, y: 0.5, expectedAngle: 45 },
    { x: 0, y: 1, expectedAngle: 90 },
    { x: -0.5, y: -0.5, expectedAngle: 225 }
];

for (const testCase of testCases) {
    test(`returns correct degree angle for direction [X: ${testCase.x} , Y: ${testCase.y}] (${testCase.expectedAngle} degrees)`, () => {
        const angle = getDegreeAngleFromDirection(testCase.x, testCase.y);

        expect(angle).toBe(testCase.expectedAngle);
    });
}
