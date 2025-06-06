export class Player {
  private id!: string;
  private name!: string;
  private assets = new Map();

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  addAsset(name: string, asset: string) {
    this.assets.set(name, asset);
  }

  getAsset(name: string) {
    return this.assets.get(name);
  }
}
