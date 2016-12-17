import { Position } from './position';
import { Inventory } from './inventory';

export class People {
  constructor(
    public name: string,
    public age: number,
    public gender: string,
    public inventory: Inventory,
    public lastPosition: Position
  ) { }
}
