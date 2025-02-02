import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Github, GraduationCap, Linkedin, MapPin, Twitter } from "lucide-react";
import { Separator } from "../ui/separator";

interface Profile {
  id: string;
  name: string;
  userId: string;
  username: string;
  imageUrl: string;
  email: string;
  createAt: Date;
  updatedAt: Date;
}

export default function TrackerCard({ profile }: { profile: Profile }) {
  return (
    <Card className="w-[300px] p-4 text-sm dark:bg-sidebar ">
      <div className="flex flex-col gap-y-3.5 text-muted-foreground">
        <div className="flex gap-x-5">
          <div>
            <Image
              src={profile.imageUrl}
              alt="imag"
              height={84}
              width={83}
              className="rounded-lg"
            ></Image>
          </div>
          <div className="flex-1 mr-5 flex flex-col">
            <div>
              <div className="font-semibold text-foreground text-lg leading-tight">
                {profile.username}
              </div>
            </div>
            <div className="text-[14px] leading-tight">Somu Singh</div>
            <div className="flex text-lg gap-x-2 flex-1">
              <div className="flex gap-x-2 mt-4">
                <div>Rank</div>
                <div>654001</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center ">
          <div className="mr-2">
            <MapPin size={16} />
          </div>
          <div>{profile.username}</div>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <GraduationCap size={16} />
          </div>
          <div>Institute of Engineerng & Technology</div>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <Linkedin size={16} />
          </div>
          <div>{profile.username}</div>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <Github size={16} />
          </div>
          <div>{profile.username}</div>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <Twitter size={16} />
          </div>
          <div>{profile.username}</div>
        </div>
      </div>
      <Separator className="mt-5" />
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
