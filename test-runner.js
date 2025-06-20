self.onmessage = function (event) {
  const { userCode, levelTestString } = event.data;

  try {
    const testFunction = new Function(
      "userCode",
      `return (${levelTestString})(userCode);`
    );

    const success = testFunction(userCode);

    if (success) {
      self.postMessage({ success: true });
    } else {
      self.postMessage({
        success: false,
        error: "Test failed. Incorrect result.",
      });
    }
  } catch (e) {
    self.postMessage({ success: false, error: e.message });
  }
};
