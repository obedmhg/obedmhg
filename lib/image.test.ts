import { describe, it, expect } from 'vitest';
import { fitDimensions } from './image';

describe('fitDimensions', () => {
  it('keeps images within bounds unchanged', () => {
    expect(fitDimensions(300, 200, 512)).toEqual({ w: 300, h: 200 });
  });
  it('scales a landscape image to maxEdge on its width', () => {
    expect(fitDimensions(1024, 512, 512)).toEqual({ w: 512, h: 256 });
  });
  it('scales a portrait image to maxEdge on its height', () => {
    expect(fitDimensions(512, 1024, 512)).toEqual({ w: 256, h: 512 });
  });
  it('handles a square image at the boundary', () => {
    expect(fitDimensions(512, 512, 512)).toEqual({ w: 512, h: 512 });
  });
});
