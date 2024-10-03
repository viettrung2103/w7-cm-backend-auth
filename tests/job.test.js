const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Job = require("../models/jobModel");

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "john@example.com",
    password: "MoiMoi123!~!@",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
    address: "Espoo",
    profile_picture: "local/picture",
  });
  console.log("token", result.body.token);
  token = result.body.token;
});

//test GET
describe("GET /api/jobs for all jobs", () => {
  it("must returns all jobs saved", async () => {
    const allJobs = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

//test POST
describe("POST /api/jobs", () => {
  describe("Create a job", () => {
    it("must save a new job to the system with code 201", async () => {
      console.log("token", token);
      const newJob = await api
        .post("/api/jobs")
        .set("Authorization", "bearer " + token)
        .send({
            title: "Front-End Engineer (React & Redux)",
            type: "Full-Time",
            description: "Join our team as a Front-End Developer in sunny Miami, FL. We are looking for a motivated individual with a passion for crafting beautiful and responsive web applications. Experience with UI/UX design principles and a strong attention to detail are highly desirable.",
            company: {
                name: "Veneer Solutions",
                contactEmail: "contact@loremipsum.com",
                contactPhone: "555-555-5555"
                },
                location: "Espoo",
            salary: 70000,
            postedDate: "1990-01-01",
            status: "open"
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);
    });

    it("Unauthorized access returns code 401", async () => {
      const newJob = await api
        .post("/api/jobs")
        .send({
          title: "Job title 1",
          type: "Job type 1",
          description: "Job description 1",
        })
        .expect(401);
    });
    it("Type all files otherwise return 500", async () => {
      const newJob = await api
        .post("/api/jobs")
        .set("Authorization", "bearer " + token)
        .send({
          title: "Job title 1",
          type: "Job type 1",
          description: "Job description 1",
        })
        .expect(500);
    });
  });
});

//test GET BY ID
describe("GET /api/jobs/:id", () => {
  describe("Get a specific job by id", () => {
    it("must return that specific job with code 200", async () => {
      const job = await Job.findOne();

      const jobToFind = await api
        .get(`/api/jobs/${job.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    it("must return error 400 if job id is invalid MongoDB id", async () => {
      const id = "123";
      const jobToFind = await api.get(`/api/jobs/${id}`).expect(404);
    });

    it("must return error 404 if valid MongoDB job id but not found", async () => {
      const id = "66fa5dff5da0804da2c91d5a";
      const jobToFind = await api.get(`/api/jobs/${id}`).expect(404);
    });
  });
});


//test PUT BY ID
describe("PUT /api/jobs/:id", () => {
  describe("Edit a specific job", () => {
    it("must return the job with edited information with status 200", async () => {
      const job = await Job.findOne();
      const newJob = { title: "Changed Titled" };
      const jobUpdate = await api
        .put(`/api/jobs/${job.id}`)
        .set("Authorization", "bearer " + token)
        .send(newJob)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updateJobCheck = await Job.findById(job.id);

      expect(updateJobCheck.title).toBe(newJob.title);
    });
  });
});

//test DELETE
describe("DELETE /api/jobs/:id", () => {
  describe("Delete a job", () => {
    it("must delete a job from the system with code 204", async () => {
      const job = await Job.findOne();
      const jobDeleted = await api
        .delete(`/api/jobs/${job.id}`)
        .set("Authorization", "bearer " + token)
        .expect(204);
    });
  });
});
