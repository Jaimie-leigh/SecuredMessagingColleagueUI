import React from "react";
import "./ApplicationMessages.css";
import "./loading.css";
import FadeLoader from "react-spinners/FadeLoader";
import { ReactComponent as DownIcon } from "../images/down-chevron.svg";
import { ReactComponent as UpIcon } from "../images/up-chevron.svg";
import { ReactComponent as ChatIcon } from "../images/chat.svg";
import { ReactComponent as QuestionIcon } from "../images/question.svg";
import Moment from "moment";
import { Form, Button } from "react-bootstrap";

class ApplicationMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      messageChainData: [],
      messageSubjectData: [],
      isLoading: false,
      checkboxes: [],
      selectedId: [],
      formLableSelected: "new",
      formSelectedSubject: "",
      formSelectedSubjectId: "",
      formNewSubject: "",
      formChainID: "",
      formMessageBody: "",
      messageSent: false,
      brokerID: props.location.state.brokerID,
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    // gets all data for spesific application based on roll number
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "http://securedmessaging.azurewebsites.net/api/ApplicationMessages/" +
      this.props.location.state.rollNumber;
    fetch(proxyurl + url)
      .then((res) => res.json())
      .then((data) => this.setState({ data: data }))
      .then(
        fetch(
          proxyurl +
            "http://securedmessaging.azurewebsites.net/api/Message_Chain"
        )
          .then((res) => res.json())
          .then((messageChainData) =>
            this.setState({ messageChainData: messageChainData }, () => {})
          )
      )
      .then(
        // gets all message_subject to determin the next subject ID when user is sending new message
        fetch(
          proxyurl +
            "http://securedmessaging.azurewebsites.net/api/Message_Subject"
        )
          .then((res) => res.json())
          .then((messageSubjectData) =>
            this.setState({
              messageSubjectData: messageSubjectData,
              isLoading: false,
            })
          )
      );
  }

  handleClick = (id) => {
    if (this.state.selectedId !== id) {
      this.setState({ selectedId: id });
    } else {
      this.setState({ selectedId: null });
    }
  };

  //handle change subject sets the state of formSelectedSubject and formSelectedSubjectId
  // these will be needed in the POST to api
  handleChangeSubject = (event) => {
    this.setState({ formSelectedSubject: event.target.value }, () => {
      //callback
      this.state.data.message_Subjects.map((ms) => {
        if (ms.subject === this.state.formSelectedSubject) {
          this.setState({ formSelectedSubjectId: ms.messageSubjectId }, () => {
            //callback to set state instantly
          });
          return null
        } else {
          return null
        }
      });
    });
  };

  handleBodyChange = (event) => {
    this.setState({ formMessageBody: event.target.value });
  };

  handleNewSubject = (event) => {
    this.setState({ formNewSubject: event.target.value });
  };

  // handles user submiting the message from and sends post request to API
  // show loading screen when message submit. sends message to API and reloads page to display message in message history
  handleFormSubmit(e) {
    this.setState({ isLoading: true });
    e.preventDefault();

    // set next chainID
    const count = this.state.messageChainData.length - 1;
    // get last message in chain and its ID, then +1 for next new chain id
    const chainID = this.state.messageChainData[count].messageChainId + 1;
    this.setState({ formChainID: chainID }, () => {
      //callback to set state instantly
    });
    // get current time to add to post body 'date and time'
    let submit_time = Moment().format("ddd DD MMM YYYY HH:mm:ss");
    // set message subject from state, will change in if statement if new message
    let messageSubjectId = this.state.formSelectedSubjectId;

    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    // IF replying to exisiting message NEW subject DOES NOT need creating first
    // If NEW suject two fetch methods one for subject then one for chain
    if (this.state.formLableSelected === "new") {
      messageSubjectId = this.state.messageSubjectData.length + 1;

      try {
        fetch(
          proxyurl +
            "http://securedmessaging.azurewebsites.net/api/Message_Subject",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify({
              messageSubjectId: messageSubjectId,
              subject: this.state.formNewSubject,
              rollNumber: this.props.location.state.rollNumber,
              BrokerID: this.state.brokerID,
              dateTime: submit_time,
            }),
          }
        )
          .then((data) =>
            this.setState({ messageSent: true }, this.componentDidMount())
          )
          .then((messageSent) => this.setState({ messageSent: true }));
      } catch (error) {}
    }
    try {
      fetch(
        proxyurl +
          "http://securedmessaging.azurewebsites.net/api/Message_Chain",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // We convert the React state to JSON and send it as the POST body
          body: JSON.stringify({
            messageChainId: chainID,
            messageSubjectId: messageSubjectId,
            messageBody: this.state.formMessageBody,
            sentFromId: this.state.brokerID,
            dateTime: submit_time,
          }),
        }
      )
        .then((data) =>
          this.setState(
            { messageSent: true, isLoading: false },
            this.componentDidMount()
          )
        )
        .then((messageSent) => this.setState({ messageSent: true }));
    } catch (error) {}
  }

  render() {
    const { data, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="pageLoading">
          <p>Loading...</p>
          <FadeLoader size={150} color={"#005EB8"} loading={isLoading} />
        </div>
      );
    }

    if (data.length === 0) {
      return <p> no data found</p>;
    }

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
              Return to All Applications
            </button>
          </div>
        </div>
        {this.state.messageSent === true && (
          <div className="messageSent">{this.displaySentText()}</div>
        )}
        <div className="sendMessageContent">
          <div className="sentMessageText">
            <QuestionIcon className="questionIcon" />
            <h1>Need to ask us a question about this application?</h1>
            <p>
              Send us a direct message using the form on the right and we will
              get back to you as soon as possible.
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
          <Form className="sendMessageForm" onSubmit={this.handleFormSubmit}>
            <div>
              <ChatIcon className="chatIcon" />
              <h1 className="formHeading">
                Start a new chat or reply to an existing chat
              </h1>
            </div>
            <Form.Group>
              <Form.Label>
                Roll Number
                <Form.Control
                  type="text"
                  placeholder={this.props.location.state.rollNumber}
                  disabled
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formRadio">
              <Form.Check
                className="formRadiob"
                type="radio"
                label="New chat"
                value="new"
                name="neworexisting"
                id="New Message"
                onChange={this.onFormMessageChanged}
                defaultChecked
              />
              <Form.Check
                className="formRadiob"
                type="radio"
                label="Reply to existing  chat"
                value="reply"
                name="neworexisting"
                id="existing Message"
                onChange={this.onFormMessageChanged}
              />
            </Form.Group>
            {this.returnCorrectFormFields(data)}
            <Form.Group>
              <Form.Label>
                Message Body
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={this.state.value}
                  onChange={this.handleBodyChange}
                />
              </Form.Label>
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
              Here you can find all sent and received message chats for this
              Application.
            </p>
            {/* <p>
              To expand a set of messages to see more detail including, the
              message content, message date and time and who sent the message,
              press the down icon that looks like this:{" "}
              <DownIcon className="innerMSDownIcon" />.
            </p> */}
            <p>
              If you have another question about any of the same topics found
              below, please use the above form and check the 'reply to existing
              chat' button to select the message subject you would like to
              respond too.
            </p>
          </div>
          <div className="messageSubjectHeader">
            <div className="innerMS">Chat Subject</div>
            <div className="innerMS">Number of messages in chat</div>
            <div className="innerMS">Latest message Date and Time</div>
            <div className="innerMS">View chat history</div>
          </div>
          {data.message_Subjects.map((ms, index) => (
            <div key={index + ms.toString()}>
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
            </div>
          ))}
        </div>
      </div>
    );
  }

  displaySentText() {
    return (
      <div>
        <p>Your message has been sent!</p>
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
        <Form.Label>
          Select the message subject
          <Form.Control as="select" onChange={this.handleChangeSubject}>
            <option value="0">Choose...</option>
            {data.message_Subjects.map((ms, index) => (
              <option value={ms.subject} key={ms.toString() + index}>
                {ms.subject}
              </option>
            ))}
          </Form.Control>
        </Form.Label>
      </Form.Group>
    );
  }

  newMessageSubject(data) {
    return (
      <Form.Group>
        <Form.Label>Enter Message Subject</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter message subject"
          value={this.state.value}
          onChange={this.handleNewSubject}
        />
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
        {messageChain.map((ms, index) => (
          <div className="messageHistoryBody" key={ms.toString() + index}>
            <div className="innerMS-history-body">{ms.messageBody}</div>
            <div className="innerMS">
              {Moment(ms.dateTime).format("ddd DD MMM YYYY HH:mm")}
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
    try {
      var dt = messageChain[lastmessage].dateTime;
      return Moment(dt).format("ddd DD MMM YYYY HH:mm");
    } catch (error) {
      return "Information not avalible";
    }
  }
}

export default ApplicationMessages;
