import { CreateTaskReqObj } from "@/types";
import { useState } from "react";

export function CreateNewTaskBtn({
  data,
  onSuccess,
  onError,
}: {
  data: CreateTaskReqObj;
  onSuccess: () => void;
  onError?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return <button>create</button>;
}

export function EditTaskBtn({
  data,
  onSuccess,
  onError,
}: {
  data: CreateTaskReqObj;
  onSuccess: () => void;
  onError?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return <button>create</button>;
}
