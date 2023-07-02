import request from "supertest";
import app from "./app.mjs";
import db from "./db.mjs";

describe("User APIS Testing", () => {
  afterEach(() => {
    // Reset the mock data after each test
    db.users = [];
  });

  test("/users GET API, it should return all users", async () => {
    // Set up the initial state
    db.users = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];

    // Make the request to the API
    const response = await request(app).get("/users");

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: db.users });
  });

  test("/users GET API, it should return an empty array if no users", async () => {
    // Make the request to the API
    const response = await request(app).get("/users");

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });

  test("/user POST API, it should create a new user", async () => {
    // Set up the request body
    const user = { name: "John", email: "john@example.com" };

    // Make the request to the API
    const response = await request(app).post("/user").send(user);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");

    // Assert that the user is added to the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual({ ...user, id: response.body.id });
  });

  test("/user POST API, it should return an error if email is not present", async () => {
    // Set up the request body without email
    const user = { name: "John" };

    // Make the request to the API
    const response = await request(app).post("/user").send(user);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email is not present" });

    // Assert that the user is not added to the database
    expect(db.users).toHaveLength(0);
  });

  test("/user POST API, it should return an error if user is already registered", async () => {
    // Set up the initial state with a user already registered
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];

    // Set up the request body with the same email
    const user = { name: "Jane", email: "john@example.com" };

    // Make the request to the API
    const response = await request(app).post("/user").send(user);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User already registered" });

    // Assert that the user is not added to the database
    expect(db.users).toHaveLength(1);
  });

  test("/user PUT API, it should update user information", async () => {
    // pre enter an entry for updation later
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];

    // Set up the request body with the user ID and updated information
    const updatedUser = {
      id: 1,
      name: "Jane",
      email: "jane@example.com",
    };

    // Make the request to the API
    const response = await request(app).put("/user").send(updatedUser);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User info saved",
      user: updatedUser,
    });

    // Assert that the user information is updated in the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual(updatedUser);
  });

  test("/user PUT API, it should return an error if user ID is not present", async () => {
    // pre enter an entry for updation later
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];

    // Set up the request body without user ID

    const updatedUser = {
      name: "Jane",
      email: "jane@example.com",
    };

    // Make the request to the API
    const response = await request(app).put("/user").send(updatedUser);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User id is not present" });

    // Assert that the user information is not updated in the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
  });

  test("/user PUT API, it should return an error if user is not registered", async () => {
    // pre enter an entry for updation later
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];

    // Set up the request body with a non-existing user ID
    const updatedUser = {
      id: 999,
      name: "Jane",
      email: "jane@example.com",
    };

    // Make the request to the API
    const response = await request(app).put("/user").send(updatedUser);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User not registered" });

    // Assert that the user information is not updated in the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
  });

  test("/user/:id GET API, it should return user information", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];
    // Set up the request parameters with the existing user ID
    const userId = 1;

    // Make the request to the API
    const response = await request(app).get(`/user/${userId}`);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
  });

  test("/user/:id GET API, it should return an error if user ID is missing", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];
    // Make the request to the API without specifying a user ID
    const response = await request(app).get("/user");

    // Assert the response
    expect(response.status).toBe(404);
  });

  test("/user/:id GET API, it should return an error if user is not present", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];

    // Set up the request parameters with a non-existing user ID
    const userId = 999;

    // Make the request to the API
    const response = await request(app).get(`/user/${userId}`);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "user is not present" });
  });

  test("/user/:id DELETE API, it should delete the user", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];
    // Set up the request parameters with the existing user ID
    const userId = 1;

    // Make the request to the API
    const response = await request(app).delete(`/user/${userId}`);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: "User deleted" });

    // Assert that the user is deleted from the database
    expect(db.users).toHaveLength(0);
  });

  test("/user/:id DELETE API, it should return an error if user ID is missing", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];
    // Make the request to the API without specifying a user ID
    const response = await request(app).delete("/user");

    // Assert the response
    expect(response.status).toBe(404);
   
    // Assert that the user is not deleted from the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
  });

  test("/user/:id DELETE API, it should return an error if user is not present", async () => {
    db.users = [{ id: 1, name: "John", email: "john@example.com" }];
    // Set up the request parameters with a non-existing user ID
    const userId = 999;

    // Make the request to the API
    const response = await request(app).delete(`/user/${userId}`);

    // Assert the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "user is not present" });

    // Assert that the user is not deleted from the database
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toEqual({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
  });
});
