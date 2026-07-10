import {
  useSession,
} from "../context/SessionProvider";

export function useCurrentUser() {

  return useSession().session?.user;

}