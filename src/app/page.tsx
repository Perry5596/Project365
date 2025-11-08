import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        {/* First time loading screen */}
        {/* TODO: Welcome screen, credits to myself for open sourcing, and a button to get started */}
        {/*       After pressing the button, it tells them about the app, and then it takes the user */}
        {/*       through a series of steps. The first step is to input their name, and their API key */}
        {/*       from open ai. After that, it loads the main screen of the app. */}

        {/* Main screen of the app */}
        {/* TODO: Main screen will look like a dashboard, with a sidebar on the left, and a main content */}
        {/*       area on the right, with an additional banner on the top that says Project 365, along with */}
        {/*       the user's name, amount of projects they have, amount of projects completed, and then there */}
        {/*       will be a button to create a new project. This will be in the middle of the right side of */}
        {/*       the screen. The user will be able to click on the button to create a new project, and then it */}
        {/*       will take them to the project creation screen. The project creation screen will look like a */}
        {/*       form, with a text input for the project name, a text input for the project description, and a */}
        {/*       button to continue. Then it will take them to the AI screen, where After creating the project, it will take them to the project */}
        {/*       screen. The project screen will look like a dashboard, with a sidebar on the left, and a main */}
        {/*       content area on the right, with an additional banner on the top that says Project 365, along with */}
        {/*       the project name, amount of tasks they have, amount of tasks completed, and then there will be a */}
        {/*       button to create a new task. This will be in the middle of the right side of the screen. The user */}
      </main>
    </HydrateClient>
  );
}
