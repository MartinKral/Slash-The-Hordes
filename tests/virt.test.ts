test("try ", () => {
    const x = 200;
    const y = -100;

    const atan = Math.atan(Math.abs(y) / Math.abs(x));

    console.log(Math.sin(atan) * y);
    console.log(Math.cos(atan) * x);

    expect(true).toBeTruthy();
});

export {};
