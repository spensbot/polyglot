import { Err, Ok, Result } from "./Result";

export async function fetchResult(url: string): Promise<Result<string>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return Err(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return Ok(await response.text());
  } catch (error) {
    return Err(`Error fetching ${url}: ${error}`);
  }
}