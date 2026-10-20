// Who is signed in. The demo has no real authentication: everyone is the same
// demo user. Replace this function to plug in your own (Auth.js or similar);
// the header only reads the user's name and email from it.

export interface User {
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<User> {
  return { name: "Alex Morgan", email: "alex@acme-robotics.example" };
}
