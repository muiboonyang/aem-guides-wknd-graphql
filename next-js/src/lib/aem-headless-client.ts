import AEMHeadless from "@adobe/aem-headless-client-js";

type AemHeadlessClientConfig = {
  serviceURL: string;
};

////////////////////////////////////////
/**
 * Helper function to generate a valid auth object based on environment variables.
 */
////////////////////////////////////////

const getAuth = (): string | [string, string] | undefined => {
  const authMethod = process.env.AEM_AUTH_METHOD;

  if (authMethod === "basic") {
    return [
      process.env.AEM_AUTH_USER as string,
      process.env.AEM_AUTH_PASSWORD as string,
    ];
  } else if (authMethod === "dev-token") {
    return process.env.AEM_AUTH_DEV_TOKEN as string;
  }

  return undefined;
};

////////////////////////////////////////
/**
 * Initialize the AEM Headless client.
 */
////////////////////////////////////////

const createAemHeadlessClient = ({
  serviceURL,
}: AemHeadlessClientConfig): AEMHeadless => {
  return new AEMHeadless({
    serviceURL,
    endpoint:
      "The endpoint is not used as it only applies to client-side GraphQL queries which are not Adobe best practices.",
    auth: getAuth(),
    fetch: fetch,
  });
};

////////////////////////////////////////
// Exported singleton instance of the AEM Headless client.
////////////////////////////////////////

const aemHost = process.env.NEXT_PUBLIC_AEM_HOST as string;
const aemHeadlessClient = createAemHeadlessClient({ serviceURL: aemHost });

////////////////////////////////////////
/**
 * Generates an absolute URL resolvable to AEM. This is typically used for images.
 */
////////////////////////////////////////

const serveFromAem = (url: string): string => {
  if (url.startsWith("/")) {
    return new URL(url, aemHost).toString();
  }
  return url;
};

////////////////////////////////////////
/**
 * Fetch all adventures using the 'adventures-all' persisted query.
 */
////////////////////////////////////////

const getAllAdventures = async (
  aemHeadlessClient: AEMHeadless,
  queryVariables: Record<string, any> = {},
): Promise<any> => {
  const queryAdventuresAll = `${process.env.NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT}/adventures-all`;

  try {
    return await aemHeadlessClient.runPersistedQuery(
      queryAdventuresAll,
      queryVariables,
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

////////////////////////////////////////
/**
 * Fetch all adventure slugs for use in SSG.
 */
////////////////////////////////////////

const getAdventureSlugs = async (
  aemHeadlessClient: AEMHeadless,
): Promise<{ params: { slug: string[] } }[]> => {
  try {
    const response = await getAllAdventures(aemHeadlessClient);
    const adventures = response?.data?.adventureList?.items || [];

    return adventures.map((item: { slug: string }) => ({
      params: {
        slug: [item.slug],
      },
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

////////////////////////////////////////
/**
 * Fetch adventure details by slug using the 'adventure-by-slug' persisted query.
 */
////////////////////////////////////////

const getAdventuresBySlug = async (
  aemHeadlessClient: AEMHeadless,
  slug: string,
  queryVariables: Record<string, any> = {},
): Promise<any> => {
  const variables = { ...queryVariables, slug };
  const queryAdventuresBySlug = `${process.env.NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT}/adventure-by-slug`;

  try {
    return await aemHeadlessClient.runPersistedQuery(
      queryAdventuresBySlug,
      variables,
    );
  } catch (error) {
    console.log("error", error);

    console.error(error);
    return null;
  }
};

export {
  aemHeadlessClient,
  serveFromAem,
  getAllAdventures,
  getAdventureSlugs,
  getAdventuresBySlug,
};
