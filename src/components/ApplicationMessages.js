import React from "react";
import "./ApplicationMessages.css";
import { ReactComponent as DownIcon } from "../images/down-chevron.svg";
import { ReactComponent as UpIcon } from "../images/up-chevron.svg";
import { ReactComponent as ChatIcon } from "../images/chat.svg";
import { ReactComponent as QuestionIcon } from "../images/question.svg";
import Moment from "moment";
import { Form, Button, Table } from "react-bootstrap";

class ApplicationMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      checkboxes: [],
      selectedId: [],
      formLableSelected: "new",
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "http://securedmessaging.azurewebsites.net/api/ApplicationMessages/" +
      this.props.location.state.rollNumber;
    fetch(proxyurl + url)
      .then((res) => res.json())
      .then((data) => this.setState({ data: data, isLoading: false }));
  }

  handleClick = (id) => {
    if (this.state.selectedId !== id) {
      this.setState({ selectedId: id });
    } else {
      this.setState({ selectedId: null });
    }
  };

  render() {
    const { data, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    if (data.length === 0) {
      return <p> no data found</p>;
    }

    console.log("mess: ", data);

    return (
      <div>
        <div className="detailsBanner">
          <div className="rollNumber">
            {" "}
            <strong>
              Application roll number: {this.props.location.state.rollNumber}
            </strong>
          </div>
          <div className="returnToApps">
            <button onClick={this.props.history.goBack}>
              return to all applications button
            </button>
          </div>
        </div>
        <div className="sendMessageContent">
          <div className="sentMessageText">
            <QuestionIcon className="questionIcon" />
            <h1>Need to ask us a question about this application?</h1>
            <p>
              Send us a direct message using the form on the right and we will
              get get back to you as soon as possible.
            </p>
            <p>
              All message chats for this application can be found in the{" "}
              <strong>"Application Chat History"</strong> section on this page.
            </p>
            <p>
              We are open Monday to Friday 8am to 6pm and Saturday 9am to 4pm.
              We’re closed Sundays and Bank Holidays.
            </p>
          </div>

          <Form className="sendMessageForm">
            <div>
              <ChatIcon className="chatIcon" />
              <h1>Start a new chat or reply to an existing chat</h1>
            </div>
            <Form.Group>
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                placeholder={this.props.location.state.rollNumber}
                disabled
              />
            </Form.Group>
            <Form.Group className="formRadio">
              <Form.Check
                className="formRadiob"
                type="radio"
                label="New chat"
                value="new"
                name="neworexisitng"
                id="New Message"
                onChange={this.onFormMessageChanged}
                defaultChecked
              />
              <Form.Check
                className="formRadiob"
                type="radio"
                label="Reply to exisiting chat"
                value="reply"
                name="neworexisitng"
                id="exisiting Message"
                onChange={this.onFormMessageChanged}
              />
            </Form.Group>
            {this.returnCorrectFormFields(data)}
            <Form.Group>
              <Form.Label>Message Body</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </div>
        <div className="appMessageMainContent">
          <div className="messageHistoryText">
            <h3>Application Chat History</h3>
            <p>
              Here you can find all sent and recieved message chats for this
              Application.
            </p>
            <p>
              To expand a set of messages to see more detail including, the
              message content, message date and time and who sent the message,
              press the down icon that looks like this:{" "}
              <DownIcon className="innerMSDownIcon" />.
            </p>
            <p>
              If you have another question about any of the same topics found
              below, please use the above form and check the 'reply to exisiting
              chat' button to select the message subject you would like to
              respond too.
            </p>
          </div>

      {/* <Table>
      <thead className="thead-light">
        <tr className="thead-light">
          <th>Chat Subject</th>
          <th>Nu of mess</th>
          <th>date time</th>
          <th>view history</th>
        </tr>        
      </thead>
        <tbody>
        {data.message_Subjects.map((ms) => (
          <tr>
            <td>{ms.subject}</td>
            <td>{ms.message_Chain.length}</td>
            <td>{this.getLatestMessageDateTime(ms.message_Chain)}</td>
            <td><button onClick={() => this.handleClick(ms.messageSubjectId)}>
                    {this.state.selectedId === ms.messageSubjectId ? (
                      <UpIcon className="showHideIcons" />
                    ) : (
                      <DownIcon className="showHideIcons" />
                    )}
                  </button></td>
          </tr>
        ))}
        </tbody>
      </Table> */}
          <div className="messageSubjectHeader">
            <div className="innerMS">Chat Subject</div>
            <div className="innerMS">Number of messages in chat</div>
            <div className="innerMS">Latest message Date and Time</div>
            <div className="innerMS">View chat history</div>
          </div>
          {data.message_Subjects.map((ms) => (
            <>
              <div className="messageSubject">
                <div className="innerMS">{ms.subject}</div>
                <div className="innerMS">{ms.message_Chain.length}</div>
                <div className="innerMS">
                  {this.getLatestMessageDateTime(ms.message_Chain)}
                </div>
                <div className="innerMS">
                  <button onClick={() => this.handleClick(ms.messageSubjectId)}>
                    {this.state.selectedId === ms.messageSubjectId ? (
                      <UpIcon className="showHideIcons" />
                    ) : (
                      <DownIcon className="showHideIcons" />
                    )}
                  </button>
                </div>
              </div>
              {this.state.selectedId === ms.messageSubjectId && (
                <div className="messageHistory">
                  {this.getAllMessageInChain(ms.message_Chain)}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    );
  }

  returnToApp() {
    this.props.history.goBack();
  }

  returnCorrectFormFields(data) {
    if (this.state.formLableSelected === "new") {
      return this.newMessageSubject(data);
    } else {
      return this.choseMessageSubject(data);
    }
  }

  choseMessageSubject(data) {
    return (
      <Form.Group>
        <Form.Label>Select the message subject</Form.Label>
        <Form.Control as="select" name="isNew">
          <option value="0">Choose...</option>
          {data.message_Subjects.map((ms) => (
            <option value={ms.subject}>{ms.subject}</option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  }

  newMessageSubject(data) {
    return (
      <Form.Group>
        <Form.Label>Enter Message Subject</Form.Label>
        <Form.Control type="text" placeholder="Enter message subject" />
      </Form.Group>
    );
  }

  onFormMessageChanged = (event) => {
    this.setState({
      formLableSelected: event.target.value,
    });
  };

  getAllMessageInChain(messageChain) {
    return (
      <div className="messageHistory">
        <div className="messageHistoryHeader">
          <div className="innerMS-history-body">Message</div>
          <div className="innerMS">Date and Time</div>
          <div className="innerMS">Message sent by</div>
        </div>
        {messageChain.map((ms) => (
          <div className="messageHistoryBody">
            <div className="innerMS-history-body">{ms.messageBody}</div>
            <div className="innerMS">
              {Moment(ms.dateTime).format("ddd DD MMM YYYY hh:mm:ss")}
            </div>
            <div className="innerMS">{ms.sentFromId}</div>
          </div>
        ))}
      </div>
    );
  }

  getLatestMessageDateTime(messageChain) {
    const lastmessage = messageChain.length - 1;

    Moment.locale("en");
    var dt = messageChain[lastmessage].dateTime;
    return Moment(dt).format("ddd DD MMM YYYY hh:mm:ss");
  }
}

export default ApplicationMessages;
