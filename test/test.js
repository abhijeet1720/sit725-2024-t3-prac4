const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Task = require('../models/task');

// Configure Chai
chai.use(chaiHttp);
const { expect } = chai;

describe('Task API Endpoints', () => {
  // Clear the database before running the tests
  before(async () => {
    await Task.deleteMany({});
  });

  // Test: Get all tasks (initially empty)
  it('should fetch all tasks (empty array)', (done) => {
    chai.request(app)
      .get('/tasks')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.is.empty;
        done();
      });
  });

  // Test: Add a new task
  it('should add a new task', (done) => {
    const newTask = { title: 'Test Task', description: 'This is a test task' };
    chai.request(app)
      .post('/tasks')
      .send(newTask)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.include({ title: 'Test Task', description: 'This is a test task' });
        done();
      });
  });

  // Test: Fetch all tasks after adding one
  it('should fetch all tasks (1 task)', (done) => {
    chai.request(app)
      .get('/tasks')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').with.lengthOf(1);
        done();
      });
  });

  // Test: Delete a task
  it('should delete a task', (done) => {
    Task.findOne({ title: 'Test Task' }, (err, task) => {
      chai.request(app)
        .delete(`/tasks/${task._id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Task deleted successfully');
          done();
        });
    });
  });
});
