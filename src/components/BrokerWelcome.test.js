import React, { useState } from "react";
import renderer from "react-test-renderer";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import BrokerWelcome from "./BrokerWelcome";

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

describe("Broker Welcome tests", () => {
  test("test renders as per snapshot", () => {
    const brokerId = "1000002";
    const tree = renderer
      .create(<BrokerWelcome location={brokerId}></BrokerWelcome>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("test page renders as epxected when loading", () => {
    const brokerId = "1000002";
    render(<BrokerWelcome location={brokerId}></BrokerWelcome>, container);
    expect(container.innerHTML).toContain("Loading...");
  });

  test("mock fetch call, empty responce from db should return no data", async () => {
    const fakeResponse = [];
    const brokerId = "1000002";

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<BrokerWelcome location={brokerId} />, container);
    });

    expect(container.innerHTML).toContain("no data");

    window.fetch.mockRestore();
  });

  test("mock fetch call, valid responce from db should return applications", async () => {
    const fakeResponse = [
      {
        brokerId: 1000002,
        brokerForename: "Ranveer",
        brokerSurname: "Burn",
        application: [
          {
            rollNumber: 1000000002,
            customerFullName: "Rachel Brown",
            brokerId: 1000002,
            message_Subject: null,
          },
          {
            rollNumber: 1000000003,
            customerFullName: "Blake Kent",
            brokerId: 1000002,
            message_Subject: null,
          },
        ],
      },
    ];
    const brokerId = "1000002";

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<BrokerWelcome location={brokerId} />, container);
    });

    expect(container.innerHTML).toContain("Click on the roll number to send and view messages relating to the application");

    window.fetch.mockRestore();
  });
});
