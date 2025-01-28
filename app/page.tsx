import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Hello World</Button>
      <p className="font-sans">
        {" "}
        GET /sign-in/SignIn_clerk_catchall_check_1738084806312 200 in 68ms GET
        /sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200 in 30ms GET
        /sign-up 200 in 26ms GET
        /sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200 in 69ms GET
        /sign-up/SignUp_clerk_catchall_check_1738084808059 200 in 67ms GET
        /sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200 in 19ms GET
        /sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200 in 72ms GET
        /favicon.ico 200 in 34ms GET /favicon.ico 200 in 11ms GET
        /sign-up/SignUp_clerk_catchall_check_1738084880547 200 in 77ms GET
        /sign-up/sso-callback?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200
        in 57ms GET /favicon.ico 200 in 58ms GET
        /sign-up/sso-callback/SignUp_clerk_catchall_check_1738084906543 200 in
        82ms GET /sign-up/continue?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F
        200 in 17ms GET
        /sign-up/continue/SignUp_clerk_catchall_check_1738084906849 200 in 78ms
        POST /sign-up/continue?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F 200
        in 74ms GET / 200 in 146ms GET / 200 in 39ms
      </p>
    </div>
  );
}
