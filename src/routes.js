const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate"); // para validação
const OngController = require("./controllers/OngController");
const IncidentController = require("./controllers/IncidentController");
const ProfileController = require("./controllers/ProfileController");
const SessionController = require("./controllers/SessionController");

const routes = express.Router();

routes.post(
  "/sessions",
  celebrate({
    // verificar se o id ta sendo enviado
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  SessionController.create
);

routes.get("/ongs", OngController.list);

routes.post(
  "/ongs",
  celebrate({
    // validar parametros de: query params, route params e body/header
    [Segments.BODY]: Joi.object().keys({
      // descrever infos do req.body
      name: Joi.string().required(),
      email: Joi.string()
        .required()
        .email(),
      whatsapp: Joi.string()
        .required()
        .length(15),
      city: Joi.string().required(),
      uf: Joi.string()
        .required()
        .length(2)
    })
  }),
  OngController.create
);

routes.get(
  "/incidents",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number()
    })
  }),
  IncidentController.list
);

routes.post(
  "/incidents",
  celebrate({
    // validando se tem autorização
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown(),
    // validando se os campos foram preenchidos
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      value: Joi.number().required()
    })
  }),
  IncidentController.create
);

routes.delete(
  "/incidents/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number()
        .required()
        .exist()
    })
  }),
  IncidentController.delete
);

routes.get(
  "/profile",
  celebrate({
    // como n conhece todos os headers coloca .unknow p n tentar validar as outras props
    // seta dentro do Joi.object({}) sem precisar do .keys()
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  }),
  ProfileController.list
);
module.exports = routes;
