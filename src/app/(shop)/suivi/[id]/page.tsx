import type { Metadata } from "next";
import { TrackView } from "./TrackView";

export const metadata: Metadata = { title: "Suivi de commande" };

export default async function TrackPage(props: PageProps<"/suivi/[id]">) {
  const { id } = await props.params;
  return <TrackView id={id} />;
}
