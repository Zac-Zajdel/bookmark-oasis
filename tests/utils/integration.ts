import { HttpClient } from '@/tests/utils/http';
import { CustomTestContext } from '@/tests/utils/setup';

export class IntegrationHarness {
  private readonly ctx?: CustomTestContext;
  public http: HttpClient;

  constructor(ctx?: CustomTestContext) {
    this.ctx = ctx;
    this.http = new HttpClient({
      baseUrl: `http://localhost:3000/api`,
      headers: {
        Authorization: `Bearer ${this.ctx?.apiToken}`,
      },
    });
  }

  async init() {
    return { http: this.http };
  }
}
