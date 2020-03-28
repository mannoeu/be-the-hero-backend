const req = require("supertest"); // para requisições http de test
const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("ONG", () => {
  // criando as tabelas do bd
  beforeEach(async () => {
    // zerar o banco de test
    await connection.migrate.rollback();
    // criar as tabelas
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  // testando
  it("Criando nova ONG e realizando Login", async () => {
    const newOng = await req(app)
      .post("/ongs")
      .send({
        name: "TestaOngs",
        email: "testaongs@gmail.com",
        whatsapp: "(00) 12345-6789",
        city: "TestaCity",
        uf: "TC"
      });

    expect(newOng.body).toHaveProperty("id");
    expect(newOng.body.id).toHaveLength(8);

    const session = await req(app)
      .post("/sessions")
      .send({
        id: `${newOng.body.id}`
      });

    expect(session.body.name);

    const newIncident = await req(app)
      .post("/incidents")
      .set("Authorization", newOng.body.id)
      .send({
        title: "Incident Test",
        description: "Detalhes teste",
        value: 900.0
      });

    expect(newIncident.body).toHaveProperty("id");
    expect(newIncident.body.id);

    const deleteIncident = await req(app)
      .delete(`/incidents/${newIncident.body.id}`)
      .set("Authorization", `${newOng.body.id}`);

    console.log(deleteIncident.body);
    expect(deleteIncident.body);
  });
});
