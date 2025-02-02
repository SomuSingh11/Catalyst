import BentoTrackProfile from "@/components/Tracker/bento-tracker";

export default async function Page() {
  return (
    <div>
      <div className="hidden md:flex">
        <BentoTrackProfile />
      </div>
    </div>
  );
}
