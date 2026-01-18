import { GetServerSideProps } from "next";
import supabase from "../utils/supabaseClient";

export const getServerSideProps: GetServerSideProps = async ({
  params,
}) => {
  const slug = params?.slug as string[];
  const slugRoute = slug.join("/");

  const { data } = await supabase
    .from("dynamic_links")
    .select()
    .eq("name", slugRoute)
    .single();

  const initialRoute = data?.link || "404";

  if (initialRoute !== "404") {
    return {
      redirect: {
        destination: initialRoute,
        permanent: true,
      },
    };
  }

  // For invalid slugs, return not found
  return {
    notFound: true,
  };
};

// This page now only handles server-side redirects
export default function DynamicLink() {
  return null;
}
