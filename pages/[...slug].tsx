import { GetServerSideProps } from "next";
import { PostHog } from "posthog-node";
import supabase from "../utils/supabaseClient";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const slug = params?.slug as string[];
  const slugRoute = slug.join("/");

  const { data } = await supabase
    .from("dynamic_links")
    .select()
    .eq("name", slugRoute)
    .single();

  const initialRoute = data?.link || "404";

  // Capture event server-side
  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
  posthog.capture({
    distinctId: req.headers['x-forwarded-for'] || (req as any).connection?.remoteAddress || 'anonymous',
    event: 'slug_visited',
    properties: {
      slug: slugRoute,
      valid: initialRoute !== "404",
    },
  });
  posthog.shutdown();

  if (initialRoute !== "404") {
    return {
      redirect: {
        destination: initialRoute,
        permanent: true,
      },
    };
  }

  return {
    notFound: true,
  };
};

// No component needed for server-side redirects
export default function DynamicLink() {
  return null;
}
