import { promises as fs } from "fs";
import path from "path";
import ProjectReadmeClient from "./client";

export default async function ProjectReadmePage() {
  const docPath = path.join(process.cwd(), "README.md");
  const markdown = await fs.readFile(docPath, "utf-8");

  return <ProjectReadmeClient markdown={markdown} />;
}
