// import { add } from "../math";
import {add } from "../math";
import {subtract} from '../subtract';
// import {add } from '../math.ts';
// // const add = require('../math.js');
// test('math function', () => {
//     const a = 4;
//     const b = 4;
//     expect(add(a,b)).toEqual(8);
// })
// const add = require('../math');
// import type  { add }  from "../math.js/";

describe("Math functions", () => {
  it("should add two numbers correctly", () => {
    expect(add(1, 2)).toEqual(3);
  }),
  it("should subtract two numbers correctly", () => {
    expect(subtract(3, 2)).toEqual(1);
  });
});

//server
//routes
//
