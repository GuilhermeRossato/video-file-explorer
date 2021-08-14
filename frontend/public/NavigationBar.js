var NavigationBar = function NavigationBar(props) {
  return React.createElement(
    "div",
    { className: "navigation-bar" },
    React.createElement(
      "button",
      { disabled: !props.canGoBack },
      React.createElement(
        "svg",
        { fill: "none", viewBox: "0 0 24 24", height: "24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", d: "M11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H7.41421L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z", fill: "#282828" })
      )
    ),
    React.createElement(
      "button",
      { disabled: !props.canGoForward, onClick: function onClick() {
          return console.log("cliquei");
        } },
      React.createElement(
        "svg",
        { fill: "none", viewBox: "0 0 24 24", height: "24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", d: "M12.2929 5.29289C12.6834 4.90237 13.3166 4.90237 13.7071 5.29289L19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071L13.7071 18.7071C13.3166 19.0976 12.6834 19.0976 12.2929 18.7071C11.9024 18.3166 11.9024 17.6834 12.2929 17.2929L16.5858 13L5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11L16.5858 11L12.2929 6.70711C11.9024 6.31658 11.9024 5.68342 12.2929 5.29289Z", fill: "#282828" })
      )
    ),
    React.createElement(
      "button",
      null,
      React.createElement(
        "svg",
        { fill: "none", viewBox: "0 0 24 24", height: "24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", d: "M12 4C12.2652 4 12.5196 4.10536 12.7071 4.29289L18.7071 10.2929C19.0976 10.6834 19.0976 11.3166 18.7071 11.7071C18.3166 12.0976 17.6834 12.0976 17.2929 11.7071L13 7.41421L13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19L11 7.41421L6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071C4.90237 11.3166 4.90237 10.6834 5.29289 10.2929L11.2929 4.29289C11.4804 4.10536 11.7348 4 12 4Z", fill: "#282828" })
      )
    ),
    React.createElement("input", {
      type: "text",
      value: props.inputPath,
      onChange: function handleChange(event) {
        props.setInputPath(event.target.value);
      }
    }),
    React.createElement(
      "button",
      { onClick: function onClick() {
          return props.pushToHistory(props.inputPath);
        } },
      React.createElement(
        "svg",
        { fill: "none", viewBox: "0 0 24 24", height: "24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", d: "M6 6.74105C6 5.19747 7.67443 4.23573 9.00774 5.01349L18.0231 10.2725C19.3461 11.0442 19.3461 12.9558 18.0231 13.7276L9.00774 18.9865C7.67443 19.7643 6 18.8026 6 17.259V6.74105ZM17.0154 12L8 6.74105V17.259L17.0154 12Z", fill: "#282828" })
      )
    )
  );
};

export default NavigationBar;