export class Product {
  public id: number;
  public name: string;
  public price: number;
  public enabled?: boolean;
}

export class ProductDB extends Product {
  updatedAt: Date;
  createdAt: Date;
}
