import { promises as fs } from "fs";
import path from "path";
import AuthImplementationClient from "./client";

export default async function AuthImplementationPage() {
  const docPath = path.join(process.cwd(), "AUTH_IMPLEMENTATION.md");
  const markdown = await fs.readFile(docPath, "utf-8");

  return <AuthImplementationClient markdown={markdown} />;
}
