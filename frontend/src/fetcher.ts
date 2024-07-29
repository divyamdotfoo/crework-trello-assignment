const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

export const API = {
  user: {
    createUser: "/user/create",
    checkSession: "/user/checkSession",
    login: "/user/login",
    logout: "/user/logout",
    getBoardData: "/user/board",
  },
} as const;

type FetcherRes<T> =
  | {
      status: "failed";
      message: string;
      statusCode: number;
    }
  | { status: "success"; data: T };

export const fetcher = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<FetcherRes<T>> => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...options,
    });
    if (!res.ok) {
      return {
        message: "",
        status: "failed",
        statusCode: res.status,
      };
    }
    let data: T;
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      data = (await res.json()) as T;
      return { data, status: "success" };
    }
    data = (await res.text()) as T;
    return { data, status: "success" };
  } catch (e) {
    console.log(e);
    return {
      message: "",
      status: "failed",
      statusCode: 404,
    };
  }
};
