export abstract class BaseAPI {
  protected async sendRequest<T>(url: string, requestOpions?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, requestOpions);
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
