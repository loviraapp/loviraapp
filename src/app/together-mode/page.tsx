import { redirect } from "next/navigation";

export const metadata = {
  title: "Together Mode",
};

export default function TogetherModePage() {
  redirect("/connection-moment");
}

