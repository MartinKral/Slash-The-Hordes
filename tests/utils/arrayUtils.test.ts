import { shuffle } from "../../assets/Scripts/Services/Utils/ArrayUtils";

test("shuffle shuffles the array", () => {
    const array: number[] = [0, 1, 2, 3, 4, 5, 6];
    const shuffledArray: number[] = shuffle(array);

    let positionsShuffled = 0;
    for (let i = 0; i < shuffledArray.length; i++) {
        if (shuffledArray[i] != i) positionsShuffled++;
    }

    expect(positionsShuffled).toBeGreaterThan(3);
});
