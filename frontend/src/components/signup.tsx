import { API, fetcher } from "@/fetcher";
import { useAuth } from "@/hooks/use-auth";
import { createNewUserReqSchema } from "@/types";
import { useState } from "react";

export function SignUpForm() {
  const [name, setName] = useState("gulabo");
  const [email, setEmail] = useState("gulabo@gmail.com");
  const [password, setPassword] = useState("gulagula");
  const { signIn } = useAuth();

  const signup = async () => {
    const parseData = createNewUserReqSchema.safeParse({
      email,
      password,
      name,
    });

    if (!parseData.success) {
      return;
    }

    const res = await fetcher(API.user.createUser, {
      method: "POST",
      body: JSON.stringify(parseData.data),
    });

    if (res.status === "failed") {
      const code = res.statusCode;
      console.log("code", code);
      return;
    }
    if (res.status === "success") {
      signIn();
    }
  };

  return (
    <div className=" w-screen h-screen text-black">
      <div className=" flex flex-col gap-4 p-10 w-fit">
        <div>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          onClick={signup}
          className=" w-full bg-white text-black p-2 font-semibold"
        >
          login
        </button>
      </div>
    </div>
  );
}
