import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { currentPath } from "@/utils";

import "./index.scss";

class MainHeader extends React.Component {
  componentDidMount() {}

  render() {
    const {
      currentTeamMembers,
      currentChannel,
      match: { path }
    } = this.props;
    return (
      <div className="main-header">
        {currentPath(path) === "channel" && (
          <h1 className="main-header__title">
            # {currentChannel.name}
            <span className="main-header__title__span">
              <i className="users icon main-header__title__span__icon" />{" "}
              <span className="main-header__title__span__number">
                {currentTeamMembers.length}
              </span>
            </span>
          </h1>
        )}
        {currentPath(path) === "direct-message" && (
          <h1 className="main-header__title"># target User</h1>
        )}
      </div>
    );
  }
}

MainHeader.propTypes = {};

const stateToProps = state => ({
  currentTeamMembers: state.teamReducer.currentTeamMembers,
  currentChannel: state.channelReducer.currentChannel
});

const dispatchToProps = dispatch => ({});

export default withRouter(
  connect(
    stateToProps,
    dispatchToProps
  )(MainHeader)
);