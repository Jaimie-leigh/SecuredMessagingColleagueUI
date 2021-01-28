import React, { useState } from "react";
import renderer from "react-test-renderer";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ColleagueWelcome from "./ColleagueWelcome";

let container = null;

beforeEach(() => {
  // set a DOM elemant as render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // clean up on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Colleague Welcome tests", () => {
  test("test renders as per snapshot", () => {
    const colleagueId = "912345";
    const tree = renderer
      .create(<ColleagueWelcome location={colleagueId}></ColleagueWelcome>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("test page renders as epxected when loading", () => {
    const colleagueId = "912345";
    render(
      <ColleagueWelcome location={colleagueId}></ColleagueWelcome>,
      container
    );
    expect(container.innerHTML).toContain("Loading...");
  });

  test("mock fetch call, user not valid", async () => {
    const fakeResponse = [];
    const colleagueId = "91234555";

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<ColleagueWelcome location={colleagueId} />, container);
    });

    expect(container.innerHTML).toContain("User not found");

    window.fetch.mockRestore();
  });

  test("mock fetch call, valid responce from db should return applications", async () => {
    const fakeResponse = 
      {
        colleagueId: 912345,
        colleagueForename: "Rebecca",
        colleagueSurname: "Jones",
      }
    ;
    const colleagueId = "912345";

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<ColleagueWelcome location={colleagueId} />, container);
    });

    expect(container.innerHTML).toContain(
      "Welcome Rebecca Jones"
    );

    window.fetch.mockRestore();
  });
});
