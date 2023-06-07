import { Account, Avatars, Client, Databases } from "appwrite";

import { appwriteEndpoint, appwriteProject } from "~/lib/envClient";

const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export { account, avatars, client, databases };
