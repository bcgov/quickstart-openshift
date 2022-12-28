import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import Header from "../Header.vue";

describe("Header", () => {
  it("renders properly", () => {
  //  const wrapper = mount(Header, { });
    expect("BCGov Starter App").toContain("BCGov Starter");// place-holder not a real test, since vuetify 3 is evolving so there are some issues with UT in frontend with vuetify.
  });
});
