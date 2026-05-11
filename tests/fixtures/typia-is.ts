import typia from "typia";

interface User {
  age: number;
  name: string;
}

export const check = (input: unknown) => typia.is<User>(input);
