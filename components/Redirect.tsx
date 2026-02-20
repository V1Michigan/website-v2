import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RedirectProps {
  route: string;
}

const Redirect = ({ route }: RedirectProps) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(route);
  }, [route, router]);
  return null;
};

export default Redirect;