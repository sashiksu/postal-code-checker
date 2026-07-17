// Temporary probe: asserts something false to confirm CI blocks merges.
describe("ci gate probe", () => {
  it("deliberately fails", () => {
    expect(1).toBe(2);
  });
});
