import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
@customElement("showcase-app")
export class ShowcaseApp extends LitElement {
  constructor() {
    super();
    this.registerServiceWorker();
  }

  @state()
  hasWorker: boolean = false;

  render() {
    if (!this.hasWorker) {
      return nothing;
    }
    return html`<div><audio controls src="/local/test.mp3"></audio></div>`;
  }

  private async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "./service-worker.js",
          {
            scope: "/local",
          }
        );
        registration.update();
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
        this.hasWorker = true;
        const bc = new BroadcastChannel("test_channel");
        bc.addEventListener("message", (evt) => {
          console.info("we`ve got mail", evt.data);
        });
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  }
}
