import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://appbuild.store/v1')
  .setProject('69411b7e002b57e2fc1e');

export const account = new Account(client);
export const databases = new Databases(client);
export { client };
