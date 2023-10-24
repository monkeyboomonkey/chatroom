import {subtract} from '../subtract';

describe("subtract functions", () => {
    it("should subtract two numbers correctly", () => {
      expect(subtract(5, 2)).toEqual(3);
    });
  });