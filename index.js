const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const schema = {
  name: Joi.string()
    .min(4)
    .required(),
  id: Joi.number().default(0)
};

let clients = [{ id: 1, name: "Jan Kowalski" }, { id: 2, name: "John Doe" }];

app.get("/api/clients", (req, res) => {
  res.send(clients);
});

app.get("/api/clients/:id", (req, res) => {
  let client = clients.find(c => c.id === parseInt(req.params.id));

  if (!client) {
    res.status(404).send("Client with that id is not exists.");
    return;
  }

  res.send(client);
});

app.post("/api/clients", (req, res) => {
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send("Name should be minimum 4 characters.");
    return;
  }

  const client = {
    id: clients.length + 1,
    name: req.body.name
  };

  clients.push(client);
  res.status(201).send(client);
});

app.put("/api/clients", (req, res) => {
  let client = clients.find(c => c.id === parseInt(req.body.id));

  if (!client) {
    res.status(404).send("Client with that id is not exists.");
    return;
  }

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send("Name should be minimum 4 characters.");
    return;
  }

  client.name = req.body.name;
  res.status(201).send(client);
});

app.delete("/api/clients/:id", (req, res) => {
  let client = clients.find(c => c.id === parseInt(req.params.id));

  if (!client) {
    res.status(404).send("Client with that id is not exists.");
    return;
  }

  clients = clients.filter(c => c.id !== parseInt(req.params.id));

  res.status(200).send("Client deleted.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
