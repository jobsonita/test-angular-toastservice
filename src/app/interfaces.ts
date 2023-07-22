export interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
}

export class User implements IUser {

  constructor(
    public id?: number,
    public firstname: string = "",
    public lastname: string = "",
  ) { }
}
