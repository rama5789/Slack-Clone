import React from "react";
import { Comment } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./index.scss";
import Message from "./Message";
import { messageAction } from "@/actions";

class MessagesContainer extends React.Component {
  state = {
    isMessageFetched: false,
    currentTeamParams: 0,
    currentChannelParams: 0
  };

  componentDidMount() {
    const { receiveChannelMessage } = this.props;
    receiveChannelMessage();
  }

  componentDidUpdate() {
    const { getChannelMessageList, currentChannel, currentTeam } = this.props;

    /* fetch channel message list if currentchannel and currentTeam exist, set isMessageFetched to true */
    if (this.isCurrentDataFetched() && !this.state.isMessageFetched) {
      getChannelMessageList(currentChannel.id);
      this.setState({ isMessageFetched: true });
    }

    /* refetch channel message again if channel has changed */
    if (this.isCurrentDataFetched()) {
      const { currentChannelParams, currentTeamParams } = this.state;
      if (
        currentChannelParams !== currentChannel.id ||
        currentTeamParams !== currentTeam.id
      ) {
        this.setState({
          currentChannelParams: currentChannel.id,
          currentTeamParams: currentTeam.id,
          isMessageFetched: false
        });
      }
    }
  }

  componentWillUnmount() {
    const { clearSocketConnection } = this.props;
    clearSocketConnection();
  }

  isCurrentDataFetched = () => {
    const { currentChannel, currentTeam } = this.props;
    if (
      Object.keys(currentChannel).length > 0 &&
      Object.keys(currentTeam).length > 0
    ) {
      return true;
    }
    return false;
  };

  render() {
    const { messageList } = this.props;
    return (
      <div className="messages-container">
        <Comment.Group>
          {messageList.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </Comment.Group>
      </div>
    );
  }
}
MessagesContainer.propTypes = {};

const stateToProps = state => ({
  messageList: state.messageReducer.messageList,
  currentTeam: state.teamReducer.currentTeam,
  currentChannel: state.channelReducer.currentChannel
});
const dispatchToProps = dispatch => ({
  getChannelMessageList: channelId => {
    dispatch(messageAction.getChannelMessageList(channelId));
  },
  clearSocketConnection: () => {
    dispatch(messageAction.clearSocketConnection());
  },
  receiveChannelMessage: () => {
    dispatch(messageAction.receiveChannelMessage());
  }
});

export default connect(
  stateToProps,
  dispatchToProps
)(MessagesContainer);