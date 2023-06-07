import "server-only";

import { Client, Databases } from "node-appwrite";

import { appwriteEndpoint, appwriteProject } from "~/lib/envClient";
import { appwriteApiKey } from "~/lib/envServer";

const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject).setKey(appwriteApiKey);

const sdkDatabases = new Databases(client);

export { sdkDatabases };
