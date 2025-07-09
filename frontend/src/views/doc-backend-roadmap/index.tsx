import { promises as fs } from "fs";
import path from "path";
import BackendRoadmapClient from "./client";

export async function BackendRoadmapPage() {
  const docPath = path.join(process.cwd(), "BACKEND_ROADMAP.md");
  const markdown = await fs.readFile(docPath, "utf-8");

  return <BackendRoadmapClient markdown={markdown} />;
}
