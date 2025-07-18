import { getPlaygroundById } from "@/entities/playground/api/playgrounds";
import { getPlaygroundCondition } from "@/entities/playground/api/condition";
import PlaygroundDetailsPage from "@/views/playground-details";
import { notFound } from "next/navigation";
import type { PlaygroundConditionReport } from "@/entities/playground/api/condition";

export default async function PlaygroundDetailsRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const [playground, conditionReport] = await Promise.all([
    getPlaygroundById(params.id),
    getPlaygroundCondition(params.id),
  ]);

  if (!playground) {
    notFound();
  }
  return (
    <PlaygroundDetailsPage
      playground={playground}
      initialConditionReport={
        conditionReport as PlaygroundConditionReport | null
      }
    />
  );
}
