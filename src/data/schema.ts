export function getSchemaIds(site: URL) {
  return {
    business: new URL("/#business", site).href,
    person: new URL("/about/#johnny-gregory", site).href,
    website: new URL("/#website", site).href,
  };
}
