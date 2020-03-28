// categoria do teste
const generateUniqueId = require("../../src/utils/gerenateUniqueId");

describe("ID único", () => {
  // cada test tem um it('')
  it("Gerando um ID único", () => {
    const id = generateUniqueId();
    expect(id).toHaveLength(8);
  });
});
