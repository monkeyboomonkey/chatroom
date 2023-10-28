const request = require("supertest");
const path = require("path");
const express = require('express');

const app = express();

app.use(express.json());

// import app from  "../server/server.ts";
// const app = require("../server/server.ts");
// import {router} from "../server/routes/api.ts";


describe('GET /, /api, test routes', () => {
  beforeEach( () => {
    // Insert test data into the database before each test
  app.use(express.static(path.join(__dirname, '../../dist/client')));
    
  // app.use('/api', router);
  });

  describe ('/', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/');
  
      // const result = await app.get('/api');
   
      expect(response.status).toEqual(200);
      // expect(result.status).toBe(200);
  
     // expect(response.body).toHaveLength(3); // Assuming 3 test items were inserted
    });
  })

  // describe ('/api', () => {
  //   it('should return status 200', async () => {
  //     const response = await request(app).get('/api');
  
  //     // const result = await app.get('/api');
  //     // Assuming your route/controller returns JSON data
  //     expect(response.status).toEqual(200);
  //     // expect(result.status).toBe(200);
  
  //    // expect(response.body).toHaveLength(3); // Assuming 3 test items were inserted
  //   });
  // })
  
});


