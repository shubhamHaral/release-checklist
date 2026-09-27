const { STEPS, getStatus } = require("../src/graphql/resolvers/status");

describe("Release status", () => {
  test("new release should be planned", () => {
    expect(getStatus([])).toBe("planned");
  });

  test("partially completed release should be ongoing", () => {
    expect(getStatus([0, 1])).toBe("ongoing");
  });

  test("all steps completed should be done", () => {
    expect(getStatus(STEPS.map((_, index) => index))).toBe("done");
  });
});