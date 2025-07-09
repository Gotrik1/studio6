import { promises as fs } from "fs";
import path from "path";
import UserGuideClient from "@/app/(app)/documents/user-guide/client";

export async function UserGuidePage() {
  const docPath = path.join(process.cwd(), "USER_GUIDE.md");
  const markdown = await fs.readFile(docPath, "utf-8");

  return <UserGuideClient markdown={markdown} />;
}
