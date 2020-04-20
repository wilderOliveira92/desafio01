const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repo);

  response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexRepo = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (indexRepo === -1) {
    return response.status(400).json({ error: "repositório não existe" });
  }

  const newRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepo].likes,
  };

  repositories[indexRepo] = newRepo;

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepo = repositories.findIndex((repo) => repo.id === id);

  if (indexRepo >= 0) {
    repositories.splice(indexRepo, 1);
  } else {
    return response.status(400).json({ error: "repositório não existe" });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexRepo = repositories.findIndex((repo) => repo.id === id);

  if (indexRepo === -1) {
    return response.status(400).json({ error: "repositório não existe" });
  }

  repositories[indexRepo].likes += 1;

  return response.json(repositories[indexRepo]);
});

module.exports = app;
