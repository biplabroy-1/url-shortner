import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/stats", "/api/shorten", "/u(.*)"],
  clockSkewInMs: 30000,
  // authorizedParties: ["https://url.globaltfn.tech"],
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|svg|woff2?|ttf|eot|ico|json|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
