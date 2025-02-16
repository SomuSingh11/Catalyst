import { BentoTrackProfile } from "@/components/Tracker/bento-tracker";
import { Button } from "@/components/ui/button";
import { ArrowBigDown } from "lucide-react";

export default async function Page() {
  return (
    <div>
      <div className="hidden md:flex flex-col p-2 gap-2">
        <div className="ml-auto min-w-24">
          <Button>
            LeetCode <ArrowBigDown />
          </Button>
        </div>
        <BentoTrackProfile />
      </div>
    </div>
  );
}
