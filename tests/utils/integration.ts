import { HttpClient } from '@/tests/utils/http';
import { OasisTestContext } from '@/tests/utils/setup';

export class IntegrationHarness {
  private readonly ctx?: OasisTestContext;
  public http: HttpClient;

  constructor(ctx?: OasisTestContext) {
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
