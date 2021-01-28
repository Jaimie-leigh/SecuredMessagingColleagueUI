import React from "react";
import "./ColleagueWelcome.css";
import "./loading.css";
import FadeLoader from "react-spinners/FadeLoader";
import Moment from "moment";
import { ReactComponent as DownIcon } from "../images/down-chevron.svg";
import { ReactComponent as UpIcon } from "../images/up-chevron.svg";
import { Form, Button } from "react-bootstrap";

class ColleagueWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      messageData: [],
      newMessages: [],
      isLoading: false,
      selectedSubjectId: "",
      selectedChainId: "",
      formMessageBody: "",
      messageSent: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const serachByColleagueId = this.props.location.state;
    const jaisProxyUrl = "https://nameless-hamlet-06819.herokuapp.com/";
    const url =
      "http://securedmessaging.azurewebsites.net/api/Colleague/" +
      serachByColleagueId;

    fetch(jaisProxyUrl + url)
      .then((res) => res.json())
      .then((data) => this.setState({ data: data }))
      .then(
        fetch(
          jaisProxyUrl +
            "http://securedmessaging.azurewebsites.net/api/ApplicationMessages"
        )
          .then((res) => res.json())
          .then((messageData) =>
            this.setState(
              { messageData: messageData, isLoading: false },
              () => {}
            )
          )
      );
  }

  routeChange() {
    window.location.href = "/";
  }

  //saves the message body to state on change 
  handleBodyChange = (event) => {
    this.setState({ formMessageBody: event.target.value });
  };

  // sets the subject and chain id for the messgae the colleague is replying too 
  handleClick(message) {

    if(this.state.selectedSubjectId !== message.message_Subject.subjectId)
    {
    this.setState(
      { selectedSubjectId: message.message_Subject.subjectId } , () => {
        });
      } else {
        this.setState(
          { selectedSubjectId: null } , () => {
            });
      }

      if(this.state.selectedChainId !== message.message_Subject.message_Chain.messageChainId) {
    this.setState(
          { selectedChainId: message.message_Subject.message_Chain.messageChainId },
          () => {
            //callback to set state instantly
          }
        );
      } else {
        this.setState(
          { selectedChainId: null },
          () => {
            //callback to set state instantly
          })
      };
  }

  // handles user submiting the message from and sends post request to API
  // shows loading screen when message submit. sends message to API and reloads page
  handleFormSubmit(e) {
    this.setState({ isLoading: true });
    e.preventDefault();

    // set next chainID from string +1 with need int
    let chainID = parseInt(this.state.selectedChainId) +1;
    chainID = chainID.toString();
    // get current time to add to post body 'date and time'
    const submit_time = Moment().format("ddd DD MMM YYYY HH:mm:ss");

    const jaisProxyUrl = "https://nameless-hamlet-06819.herokuapp.com/";
    try {
      fetch(
        jaisProxyUrl +
          "http://securedmessaging.azurewebsites.net/api/Message_Chain",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // convert the React state to JSON and send it as the POST body
          body: JSON.stringify({
            messageChainId: chainID,
            messageSubjectId: this.state.selectedSubjectId,
            messageBody: this.state.formMessageBody,
            sentFromId: this.props.location.state,
            dateTime: submit_time,
          }),
        }
      )
        .then((data) =>
          this.setState(
            { messageSent: true, isLoading: false},
            this.componentDidMount()
          )
        );
     } catch (error) {};
  };

  // renders to display on page
  render() {
    const { data, isLoading, messageData } = this.state;
    // if page is loading displays loading text and spinner to make user awear 
    if (isLoading) {
      return (
        <div className="pageLoading">
          <p>Loading...</p>
          <FadeLoader size={150} color={"#2d8259"} loading={isLoading} />
        </div>
      );
    }

    // If colleague has not been found returns user not found text
    if (!data.colleagueForename) {
      return <p>User not found</p>;
      // needs a retun button and a bit more info
    }

    // else return as valid colleague and display, if any, message data
    return (
      <div className="colleagueWelcome">
        <div className="colleagueDetails">
          <p className="colleagueID">
            <strong>
              Welcome {data.colleagueForename} {data.colleagueSurname}
            </strong>
          </p>
          <p className="appName">
            <strong>Secured Messaging</strong>
          </p>
          <button className="signOut" onClick={() => this.routeChange()}>
            Sign Out
          </button>
        </div>
        {this.state.messageSent === true && (
          <div className="messageSent">{this.displaySentText()}</div>
        )}
        <div className="infoBox">
          <p>
            <strong>Message Backlog</strong>
          </p>
          <p className="helpText">
            The below application have open chats awaiting a response. Click on
            the roll number to send and view messages relation to the
            application.
          </p>
        </div>
        <div className="brokerMessages">
          <div className="brokerMessageHeaders">
            <div className="innerMessage">Roll Number</div>
            <div className="innerMessage">Subject</div>
            <div className="innerMessage">Data and Time</div>
            <div className="innerMessage-2">Message</div>
            <div className="innerMessage">Reply to Message</div>
          </div>
          <div>{this.getMessages(messageData)}</div>
        </div>
      </div>
    );
  }


  // gets all application messages and checks which messages are from a broker which have not yet been replied too,
  // saves the new messages into an array 
  getMessages(messageData) {
    var newMessagesArray = [];
    var latestMessageIndex;
    var latestMessage;

    if(messageData.message_Subjects){
    messageData.message_Subjects.forEach(saveNewBrokerMessage)
    }

    // saves the new messages into an array with the rquired details 
    function saveNewBrokerMessage(sub) {
      latestMessageIndex = sub.message_Chain.length - 1;
      latestMessage = sub.message_Chain[latestMessageIndex];
      if (latestMessage.sentFromId.toString().length === 7) {
        var message_Chain = {
          dateTime: latestMessage.dateTime,
          sentFromId: latestMessage.sentFromId,
          messageBody: latestMessage.messageBody,
          messageChainId: latestMessage.messageChainId,
        };
        var message_subject = {
          brokerId: sub.brokerId,
          subjectId: sub.messageSubjectId,
          subject: sub.subject,
          message_Chain: message_Chain,
          rollNumber: sub.rollNumber,
        };
        newMessagesArray.push({ message_Subject: message_subject });
      } else {
        // do nothing as latest message was not from a broker
      }
    }

    // if there are messages in the array, display the broker message
    if (newMessagesArray.length > 0) {
      return (newMessagesArray = newMessagesArray.map((item) => (
        <div>
          <div className="brokerMessageDetails"  key={item}>
            <div className="innerMessage" key={item.message_Subject.rollNumber}>
              {item.message_Subject.rollNumber}
            </div>
            <div className="innerMessage" key={item.message_Subject.subject}>
              {item.message_Subject.subject}
            </div>
            <div className="innerMessage" key={item.message_Subject.message_Chain.dateTime}>
              {Moment(item.message_Subject.message_Chain.dateTime).format(
                "DD MMM YY HH:mm"
              )}
            </div>
            <div className="innerMessage-2" key={item.message_Subject.message_Chain.messageBody}>
              {item.message_Subject.message_Chain.messageBody}
            </div>
            <div className="innerMessage">
              <button onClick={() => this.handleClick(item)}>
                {this.state.selectedSubjectId ===
                item.message_Subject.subjectId ? (
                  <UpIcon className="showHideIcons" />
                ) : (
                  <DownIcon className="showHideIcons" />
                )}
              </button>
            </div>
          </div>
          <div>
            {this.state.selectedSubjectId ===
              item.message_Subject.subjectId && (
              <Form
                className="sendMessageForm"
                onSubmit={this.handleFormSubmit}
              >
                <Form.Group>
                  <Form.Label>
                    Enter message to reply
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={this.state.value}
                      onChange={this.handleBodyChange}
                      required
                      maxLength="250"
                      minLength="10"
                    />
                  </Form.Label>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Send Message
                </Button>
              </Form>
            )}
          </div>
        </div>
      )));
    } else {
      return <p>No New messages.</p>;
    }
  }

  // once the usr has responded to a message a text bar appears to let them know their message has been sent
  displaySentText() {
    return (
      <div>
        <p>Your message has been sent!</p>
      </div>
    );
  }

}

export default ColleagueWelcome;
