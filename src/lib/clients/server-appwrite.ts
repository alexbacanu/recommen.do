import "server-only";

import { Account, Client, Databases, Users } from "node-appwrite";

import { appwriteEndpoint, appwriteProject } from "@/lib/envClient";
import { appwriteApiKey } from "@/lib/envServer";

const appwriteImpersonate = (jwt: string) => {
  const client = new Client();

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);
  client.setJWT(jwt);

  const impersonateDatabases = new Databases(client);
  const impersonateAccount = new Account(client);
  const impersonateUsers = new Users(client);

  return { impersonateDatabases, impersonateAccount, impersonateUsers };
};

const appwriteServer = () => {
  const client = new Client();

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);
  client.setKey(appwriteApiKey);

  const serverDatabases = new Databases(client);
  const serverAccount = new Account(client);
  const serverUsers = new Users(client);

  return { serverDatabases, serverAccount, serverUsers };
};

export { appwriteImpersonate, appwriteServer };
