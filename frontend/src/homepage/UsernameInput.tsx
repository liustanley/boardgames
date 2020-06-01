import React from "react";

interface UsernameInputProps {
  onEnter: Function;
}

interface UsernameInputState {
  username: string;
}

export class UsernameInput extends React.Component<
  UsernameInputProps,
  UsernameInputState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
    };
  }

  onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  onUsernameKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.props.onEnter(this.state.username);
    }
  }

  render() {
    return (
      <input
        className="input"
        value={this.state.username}
        placeholder="Enter your name"
        onChange={this.onUsernameChange.bind(this)}
        onKeyPress={this.onUsernameKeyPress.bind(this)}
      />
    );
  }
}
