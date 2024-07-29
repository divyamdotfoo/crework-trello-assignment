import { API, fetcher } from "@/fetcher";
import { loginUserRequestSchema } from "@/types";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const parseData = loginUserRequestSchema.safeParse({ email, password });
    if (!parseData.success) {
      return;
    }
    const res = await fetcher(
      API.user.login,
      {},
      { method: "POST", body: JSON.stringify(parseData.data) }
    );
  };
  return (
    <div className=" w-screen h-screen">
      <div className=" flex flex-col gap-4 p-10 w-fit">
        <div>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={console.log}
          className=" w-full bg-white text-black p-2 font-semibold"
        >
          login
        </button>
      </div>
    </div>
  );
}

function signup() {}
