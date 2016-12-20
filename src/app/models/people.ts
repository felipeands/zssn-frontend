import { Position } from './position';
import { Inventory } from './inventory';

export class People {
  constructor(
    public id: number,
    public name: string,
    public age: number,
    public gender: string,
    public lastPosition?: Position,
    public infected?: boolean,
    public inventory?: Inventory
  ) { }
}
