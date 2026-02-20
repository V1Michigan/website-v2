import { redirect } from "next/navigation";

export const metadata = {
  title: "Welcome | V1 at Michigan",
  description: "V1 at Michigan - Building the next generation of founders and innovators.",
}

export default function WelcomePage() {
  redirect("/");
}
