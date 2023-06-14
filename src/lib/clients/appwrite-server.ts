import { Account, Client, Databases } from "node-appwrite";

import "server-only";

import { appwriteEndpoint, appwriteProject } from "~/lib/envClient";
import { appwriteApiKey } from "~/lib/envServer";

const createAppwriteClient = (jwt?: string) => {
  const client = new Client();

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);

  if (jwt) {
    client.setJWT(jwt);
  } else {
    client.setKey(appwriteApiKey);
  }

  const sdkDatabases = new Databases(client);
  const sdkAccount = new Account(client);
  return { sdkDatabases, sdkAccount };
};

export { createAppwriteClient };
