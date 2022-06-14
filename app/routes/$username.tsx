// app/routes/$username.tsx
import type { GraphQLError } from "graphql";
import type { LoaderFunction } from "remix";
import { sendGraphQLRequest } from "remix-graphql/index.server";

const LOAD_USER_QUERY = /* GraphQL */ `
  query LoadUser($username: String!) {
    user(login: $username) {
      name
    }
  }
`;

export const loader: LoaderFunction = (args) =>
  sendGraphQLRequest({
    // Pass on the arguments that Remix passes to a loader function.
    args,
    // Provide the endpoint of the remote GraphQL API.
    endpoint: "https://api.github.com/graphql",
    // Optionally add headers to the request.
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    // Provide the GraphQL operation to send to the remote API.
    query: LOAD_USER_QUERY,
    // Optionally provide variables that should be used for executing the
    // operation. If this is not passed, `remix-graphql` will derive variables
    // from...
    // - ...the route params.
    // - ...the submitted `formData` (if it exists).
    // That means the following is the default and could also be ommited.
    variables: args.params,
  });

export default function UserRoute() {
  const { data } = useLoaderData<LoaderData>();
  if (!data) {
    return "Ooops, something went wrong :(";
  }
  if (!data.user) {
    return "User not found :(";
  }
  return <h1>{data.user.name}</h1>;
}

type LoaderData = {
  data?: {
    user: {
      name: string | null;
    } | null;
  };
  errors?: GraphQLError[];
};