import { API, fetcher } from "@/fetcher";
import { loginUserRequestSchema, User } from "@/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createNewUserReqSchema } from "@/types";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";

export function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  const showSignUp = () => setTab("signup");
  const showLogIn = () => setTab("login");

  return (
    <div className=" w-screen h-screen p-4 flex justify-center items-start pt-20 bg-gradient-to-b from-white to-blueBackground">
      {tab === "login" ? (
        <LoginForm showSignUp={showSignUp} />
      ) : (
        <SignUpForm showLogIn={showLogIn} />
      )}
    </div>
  );
}

export function LoginForm({ showSignUp }: { showSignUp: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const { signIn } = useAuth();

  useEffect(() => {
    if (errors) {
      const parseData = loginUserRequestSchema.safeParse({ email, password });

      if (parseData.success) {
        setErrors(null);
      } else {
        const errors = parseData.error.errors.reduce(
          (prev, curr) => ({ ...prev, [curr.path[0]]: curr.message }),
          {} as Record<string, string>
        );

        setErrors(errors);
      }
    }
  }, [email, password]);

  const login = async () => {
    const parseData = loginUserRequestSchema.safeParse({ email, password });

    if (!parseData.success) {
      const errors = parseData.error.errors.reduce(
        (prev, curr) => ({ ...prev, [curr.path[0]]: curr.message }),
        {} as Record<string, string>
      );
      setErrors(errors);
      return;
    }
    setLoading(true);
    const res = await fetcher<User>(API.user.login, {
      method: "POST",
      body: JSON.stringify(parseData.data),
    });
    setLoading(false);
    if (res.status === "success") {
      signIn({ id: res.data.id, name: res.data.name });
      return;
    }
    if (res.statusCode == 403) {
      setErrors({
        res: "Invalid email or password",
      });
      return;
    }
    if (res.statusCode == 500) {
      setErrors({
        res: "Internal server error. Please try again later.",
      });
    }
  };

  return (
    <div className=" flex flex-col gap-4  py-6 px-8  rounded-lg border border-border bg-whiteBackground items-center">
      <h1 className=" text-3xl font-semibold px-6 py-2">
        Welcome to <span className=" text-bluePrimary">Workflo!</span>
      </h1>
      <div className="w-full">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors && errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </div>
      <div className=" w-full">
        <Input
          placeholder="Password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors && errors.password && (
          <ErrorMessage>{errors.password}</ErrorMessage>
        )}
      </div>
      <div className=" w-full">
        <button
          disabled={!email.length || !password.length}
          onClick={login}
          className=" w-full py-2 font-semibold text-white bg-bluePrimary disabled:opacity-70 rounded-md disabled:cursor-not-allowed"
        >
          login
          {loading && (
            <span className=" px-2">
              <Loader2 className=" w-4 h-4 inline-block animate-spin" />
            </span>
          )}
        </button>
        {errors && errors.res && <ErrorMessage>{errors.res}</ErrorMessage>}
      </div>
      <p className=" text-blackMuted font-medium text-sm">
        Dont have an account? Create a
        <button className=" text-blue-600 px-1" onClick={showSignUp}>
          new account
        </button>
      </p>
    </div>
  );
}

export function SignUpForm({ showLogIn }: { showLogIn: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const res = await fetcher<User>(API.user.createUser, {
      method: "POST",
      body: JSON.stringify(parseData.data),
    });
    setLoading(false);

    if (res.status === "failed") {
      const code = res.statusCode;
      if (code == 403) setErrors({ res: "Email already exists" });
      if (code == 500)
        setErrors({ res: "Internal server error. Try again later" });
      return;
    }
    if (res.status === "success") {
      signIn({ id: res.data.id, name: res.data.name });
    }
  };

  return (
    <div className=" flex flex-col gap-4  py-6 px-8  rounded-lg border border-border bg-whiteBackground items-center">
      <h1 className=" text-3xl font-semibold px-6 py-2">
        Welcome to <span className=" text-bluePrimary">Workflo!</span>
      </h1>
      <div className=" w-full">
        <Input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className=" w-full">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className=" w-full">
        <Input
          placeholder="Password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className=" w-full">
        <button
          disabled={!email.length || !password.length}
          onClick={signup}
          className=" w-full py-2 font-semibold text-white bg-bluePrimary disabled:opacity-70 rounded-md disabled:cursor-not-allowed"
        >
          Sign up
          {loading && (
            <span className=" px-2">
              <Loader2 className=" w-4 h-4 inline-block animate-spin" />
            </span>
          )}
        </button>
        {errors && errors.res && <ErrorMessage>{errors.res}</ErrorMessage>}
      </div>

      <p className=" text-blackMuted font-medium text-sm">
        Already have an account?
        <button className=" text-blue-600 px-1" onClick={showLogIn}>
          Log in
        </button>
      </p>
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className=" text-red-400 text-xs font-medium px-2">{children}</p>;
}
