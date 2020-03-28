const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [id] = await connection("incidents").insert({
      title,
      description,
      value,
      ong_id
    });
    return res.json({ id });
  },

  async list(req, res) {
    const { page = 1 } = req.query;
    const [count] = await connection("incidents").count(); //primeira posição do array do retorno
    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5) // ?page=1 (1 - 1 = 0; 0 * 5 = 0) pega primeiros 5 registros, proxima página pula 5
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    res.header("X-Total-Incidents", count["count(*)"]);
    return res.json(incidents);
  },

  async delete(req, res) {
    const { id } = req.params;
    const ong_id = req.headers.authorization; //verificar se o incidente pertece a ong
    const incident = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first();

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({ error: "não autorizado" });
    }
    await connection("incidents")
      .where("id", id)
      .delete();
    return res.status(204).send();
  }
};

// 1:16:13 no video
