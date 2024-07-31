const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

export const API = {
  user: {
    createUser: "/api/user/create",
    checkSession: "/api/user/checkSession",
    login: "/api/user/login",
    logout: "/api/user/logout",
    getTasks: "/api/user/tasks",
  },
  task: {
    create: "/api/task/create",
    edit: "/api/task/edit",
    delete: "/api/task/delete",
  },
} as const;

type FetcherRes<T> =
  | {
      status: "failed";
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
      status: "failed",
      statusCode: 404,
    };
  }
};
