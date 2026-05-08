import Dexie, { type Table } from "dexie";

export interface CachedUser {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
}

class NubrineDB extends Dexie {
  user!: Table<CachedUser>;

  constructor() {
    super("NubrineDB");
    this.version(1).stores({
      user: "email", // only primary key here, other fields are just stored not indexed
    });
  }
}

export const db = new NubrineDB();

export async function cacheUser(user: CachedUser) {
  await db.user.put(user); // put = insert or update
}

export async function getCachedUser(): Promise<CachedUser | undefined> {
  return db.user.toCollection().first();
}

export async function clearCachedUser() {
  await db.user.clear();
}