import React from "react";
import renderer from "react-test-renderer";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ApplicationMessages from "./ApplicationMessages";
import { createMemoryHistory } from "history";

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

describe("ApplicationMessages tests", () => {
  test("test renders as per snapshot", () => {
    const state = {
      rollNumber: 1000000001,
      brokerID: 1234567,
    };
    const tree = renderer
      .create(
        <ApplicationMessages location={{ state: state }}></ApplicationMessages>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("test page renders as epxected when loading", () => {
    const state = {
      rollNumber: 1000000001,
      brokerID: 1234567,
    };
    render(
      <ApplicationMessages location={{ state: state }}></ApplicationMessages>,
      container
    );
    expect(container.innerHTML).toContain("Loading...");
  });

  test("mock fetch call, empty responce from db should return no data", async () => {
    const fakeResponse = [];
    const state = {
      rollNumber: 1000000001,
      brokerID: 1234567,
    };

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<ApplicationMessages location={{ state: state }} />, container);
    });

    expect(container.innerHTML).toContain("no data");

    window.fetch.mockRestore();
  });

  test("mock fetch call, valid responce from db should return applications", async () => {
    const fakeResponse = [
      {
        message_Subjects: [
          {
            messageSubjectId: "1",
            brokerId: "1000001",
            subject: "Verify Documents",
            rollNumber: "1000000001",
            dateTime: "2020-09-29T15:16:00",
          },
          {
            messageSubjectId: "2",
            brokerId: "1000002",
            subject: "Valuation Delayed",
            rollNumber: "1000000002",
            dateTime: "2020-09-29T16:00:00",
          },
        ],
      },
    ];

    const state = {
      rollNumber: 1000000001,
      brokerID: 1234567,
    };
    const history = createMemoryHistory();

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(fakeResponse),
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(
        <ApplicationMessages history={history} location={{ state: state }} />,
        container
      );
    });

    expect(container.innerHTML).toContain(
      "Need to ask us a question about this application?", "Application Chat History"
    );

    window.fetch.mockRestore();
  });
});
