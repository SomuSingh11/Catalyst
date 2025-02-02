import TrackerCard from "@/components/Tracker/tracker-card";
import { currentProfile } from "@/lib/current-profile";

const TrackerLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await currentProfile();

  return (
    <div className="relative flex h-full w-full pt-10 items-center justify-center">
      {" "}
      <div className="h-full max-w-2xl pr-10 pl-5">
        <TrackerCard profile={profile} />
      </div>
      {children}
    </div>
  );
};

export default TrackerLayout;
