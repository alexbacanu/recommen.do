import { Account, Client, Databases, Users } from "node-appwrite";

import "server-only";

import { appwriteEndpoint, appwriteProject } from "~/lib/envClient";
import { appwriteApiKey } from "~/lib/envServer";

const appwriteClientService = (jwt: string) => {
  const client = new Client();

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);
  client.setJWT(jwt);

  const sdkDatabases = new Databases(client);
  const sdkAccount = new Account(client);
  const sdkUsers = new Users(client);

  return { sdkDatabases, sdkAccount, sdkUsers };
};

const appwriteServerService = () => {
  const client = new Client();

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);
  client.setKey(appwriteApiKey);

  const sdkServerDatabases = new Databases(client);
  const sdkServerAccount = new Account(client);
  const sdkServerUsers = new Users(client);

  return { sdkServerDatabases, sdkServerAccount, sdkServerUsers };
};

export { appwriteClientService, appwriteServerService };
